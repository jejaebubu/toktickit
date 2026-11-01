import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { StaffDashboard } from "../../src/components/StaffDashboard.js";

function okRes(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

const staffUser = {
  id: 2,
  name: "Alex Thompson",
  email: "alex.it@toktickit.com",
  role: "IT_STAFF",
  mustChangePassword: false,
  isActive: true,
};

const sampleDashboardData = {
  metrics: {
    new: 4,
    open: 7,
    inProgress: 5,
    waitingForRequester: 2,
    myAssigned: 6,
  },
  recentTickets: [
    {
      id: 105,
      ticketNumber: "TKT-2026-000105",
      title: "Laptop battery drains quickly",
      summary: "Laptop battery drains quickly",
      status: "In Progress",
      itPriority: "HIGH",
      requestedPriority: "MEDIUM",
      category: { id: 2, name: "Hardware" },
      requester: { id: 1, name: "Jennifer Anderson" },
      owner: { id: 2, name: "Alex Thompson" },
      updatedAt: "2026-10-30T09:14:00.000Z",
    },
    {
      id: 106,
      ticketNumber: "TKT-2026-000106",
      title: "Cannot connect to VPN",
      summary: "Cannot connect to VPN",
      status: "Open",
      itPriority: "URGENT",
      requestedPriority: "HIGH",
      category: { id: 4, name: "Network" },
      requester: { id: 3, name: "Sarah Jenkins" },
      owner: { id: 2, name: "Alex Thompson" },
      updatedAt: "2026-10-30T08:00:00.000Z",
    },
  ],
  quickActions: [
    { id: "create-ticket", label: "Create Ticket", url: "/tickets/new" },
    { id: "search-tickets", label: "Search Tickets", url: "/staff/queue" },
    { id: "my-queue", label: "My Queue", url: "/staff/queue?owner=me" },
  ],
};

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

describe("Lab 4 IT Staff Dashboard UI Suite (StaffDashboard.test.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("toktickit_token", "test-staff-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("UI-04a: renders greeting, 5 metric cards, recent tickets, and quick actions (AC-04)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/auth/me")) return okRes({ user: staffUser });
        if (url.includes("/api/dashboard/staff")) return okRes(sampleDashboardData);
        return Promise.reject(new Error("Unhandled URL: " + url));
      }),
    );

    render(
      <AuthProvider>
        <StaffDashboard />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("staff-metric-value-new")).toHaveTextContent("4");
    });

    expect(screen.getByTestId("staff-dashboard-greeting")).toHaveTextContent("Welcome back, Alex Thompson!");
    expect(screen.getByTestId("staff-metric-value-new")).toHaveTextContent("4");
    expect(screen.getByTestId("staff-metric-value-open")).toHaveTextContent("7");
    expect(screen.getByTestId("staff-metric-value-in-progress")).toHaveTextContent("5");
    expect(screen.getByTestId("staff-metric-value-waiting-for-requester")).toHaveTextContent("2");
    expect(screen.getByTestId("staff-metric-value-my-assigned")).toHaveTextContent("6");

    // Recent tickets rendered in both desktop table and mobile cards
    expect(screen.getByTestId("staff-recent-row-105")).toHaveTextContent("TKT-2026-000105");
    expect(screen.getByTestId("staff-recent-row-105")).toHaveTextContent("Laptop battery drains quickly");
    expect(screen.getByTestId("staff-recent-card-106")).toHaveTextContent("TKT-2026-000106");

    // Quick actions rendered
    expect(screen.getByTestId("staff-quick-action-create-ticket")).toBeInTheDocument();
    expect(screen.getByTestId("staff-quick-action-search-tickets")).toBeInTheDocument();
    expect(screen.getByTestId("staff-quick-action-my-queue")).toBeInTheDocument();
  });

  it("UI-04b: clicking metric cards, quick actions, and recent tickets triggers drill-down and navigation (FR-10)", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: staffUser });
      if (url.includes("/api/dashboard/staff")) return okRes(sampleDashboardData);
      if (url.includes("/api/categories")) return okRes([{ id: 2, name: "Hardware" }]);
      if (url.includes("/api/tickets")) {
        return okRes({
          tickets: sampleDashboardData.recentTickets,
          meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    const onDrillDown = vi.fn();
    const onOpenTicket = vi.fn();
    const onCreateTicket = vi.fn();

    const user = userEvent.setup();
    const { unmount } = render(
      <AuthProvider>
        <StaffDashboard
          onDrillDown={onDrillDown}
          onOpenTicket={onOpenTicket}
          onCreateTicket={onCreateTicket}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("staff-metric-card-new")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("staff-metric-card-new"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "New" });

    await user.click(screen.getByTestId("staff-metric-card-open"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "Open" });

    await user.click(screen.getByTestId("staff-metric-card-in-progress"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "In Progress" });

    await user.click(screen.getByTestId("staff-metric-card-waiting-for-requester"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "Waiting for Requester" });

    await user.click(screen.getByTestId("staff-metric-card-my-assigned"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ ownerId: "me" });

    await user.click(screen.getByTestId("staff-quick-action-my-queue"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ ownerId: "me" });

    await user.click(screen.getByTestId("staff-quick-action-create-ticket"));
    expect(onCreateTicket).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("staff-recent-open-105"));
    expect(onOpenTicket).toHaveBeenCalledWith(105);

    unmount();

    // Also verify end-to-end shell drill-down from Header -> Dashboard -> Ticket Queue with status filter applied
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-nav-dashboard")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("header-nav-dashboard"));
    await waitFor(() => {
      expect(screen.getByTestId("staff-metric-card-in-progress")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("staff-metric-card-in-progress"));
    await waitFor(() => {
      expect(screen.getByTestId("staff-queue-card")).toBeInTheDocument();
    });
    expect(screen.getByTestId("queue-filter-status")).toHaveValue("In Progress");
  });

  it("UI-04c: renders empty state when recentTickets is empty and supports refresh", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: staffUser });
      if (url.includes("/api/dashboard/staff")) {
        return okRes({
          metrics: { new: 0, open: 0, inProgress: 0, waitingForRequester: 0, myAssigned: 0 },
          recentTickets: [],
          quickActions: [],
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <StaffDashboard />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("staff-dashboard-empty")).toBeInTheDocument();
    });
    expect(screen.getByTestId("staff-dashboard-empty")).toHaveTextContent(
      "No active tickets in your queue.",
    );

    await user.click(screen.getByTestId("staff-dashboard-refresh"));
    const dashboardCalls = (fetchMock.mock.calls as [string][]).filter((c) =>
      c[0].includes("/api/dashboard/staff"),
    );
    expect(dashboardCalls.length).toBeGreaterThanOrEqual(2);
  });

  it("STYLE-01 & RESP-01: enforces Zen Green design tokens, responsive layout, overflow-x hidden, and >=44px touch targets", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/auth/me")) return okRes({ user: staffUser });
        if (url.includes("/api/dashboard/staff")) return okRes(sampleDashboardData);
        return Promise.reject(new Error("Unhandled URL: " + url));
      }),
    );

    render(
      <AuthProvider>
        <StaffDashboard />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("staff-dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("staff-recent-tickets-table")).toBeInTheDocument();
    });

    // RESP-01: zero horizontal overflow and responsive grid/table/card containers
    const dashboardSection = screen.getByTestId("staff-dashboard");
    expect(dashboardSection.style.overflowX).toBe("hidden");

    const metricsGrid = screen.getByTestId("staff-metrics-grid");
    expect(metricsGrid.className).toContain("row-cols-1");
    expect(metricsGrid.className).toContain("row-cols-sm-2");
    expect(metricsGrid.className).toContain("row-cols-lg-5");

    const tableWrapper = screen.getByTestId("staff-recent-tickets-table-wrapper");
    expect(tableWrapper.className).toContain("d-none");
    expect(tableWrapper.className).toContain("d-md-block");
    expect(tableWrapper.className).toContain("overflow-hidden");

    const mobileCards = screen.getByTestId("staff-recent-tickets-cards");
    expect(mobileCards.className).toContain("d-md-none");

    // STYLE-01: Zen Green primary (#006B3C) and light tint (#EAF6EF)
    const createBtn = screen.getByTestId("staff-quick-action-create-ticket");
    expect(createBtn.getAttribute("style") ?? "").toContain(`background-color: ${hexToRgb("#006B3C")}`);

    const myQueueBtn = screen.getByTestId("staff-quick-action-my-queue");
    expect(myQueueBtn.getAttribute("style") ?? "").toContain(`background-color: ${hexToRgb("#EAF6EF")}`);

    // Touch targets >= 44px
    for (const testId of [
      "staff-dashboard-refresh",
      "staff-metric-card-new",
      "staff-metric-card-my-assigned",
      "staff-dashboard-view-all",
      "staff-quick-action-create-ticket",
      "staff-quick-action-search-tickets",
      "staff-quick-action-my-queue",
    ]) {
      const el = screen.getByTestId(testId);
      const style = el.getAttribute("style") ?? "";
      const match = style.match(/min-height:\s*(\d+)px/i);
      expect(match).not.toBeNull();
      expect(Number(match![1])).toBeGreaterThanOrEqual(44);
    }
  });
});
