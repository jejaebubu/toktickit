import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { RequesterDashboard } from "../../src/components/RequesterDashboard.js";

function okRes(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  });
}

const requesterUser = {
  id: 1,
  name: "Jennifer Anderson",
  email: "jennifer@toktickit.com",
  role: "REQUESTER",
  mustChangePassword: false,
  isActive: true,
};

const sampleRequesterDashboard = {
  metrics: {
    myOpen: 3,
    inProgress: 2,
    resolved: 5,
    closed: 8,
  },
  recentTickets: [
    {
      id: 301,
      ticketNumber: "TKT-2026-000301",
      title: "Laptop battery drains quickly",
      summary: "Laptop battery drains quickly",
      status: "In Progress",
      requestedPriority: "HIGH",
      itPriority: "HIGH",
      category: { id: 2, name: "Hardware" },
      updatedAt: "2026-10-30T09:14:00.000Z",
    },
    {
      id: 302,
      ticketNumber: "TKT-2026-000302",
      title: "New employee setup request",
      summary: "New employee setup request",
      status: "Resolved",
      requestedPriority: "LOW",
      itPriority: "LOW",
      category: { id: 1, name: "Account and Access" },
      updatedAt: "2026-10-29T14:00:00.000Z",
    },
  ],
  quickActions: [
    { id: "create-ticket", label: "Create Ticket", url: "/tickets/new" },
    { id: "view-tickets", label: "View My Tickets", url: "/tickets" },
  ],
};

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

describe("Lab 4 Requester Dashboard UI Suite (RequesterDashboard.test.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("toktickit_token", "test-requester-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("UI-05a: renders greeting, 4 metric cards, My Recent Tickets, and quick actions (AC-05)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/auth/me")) return okRes({ user: requesterUser });
        if (url.includes("/api/dashboard/requester")) return okRes(sampleRequesterDashboard);
        return Promise.reject(new Error("Unhandled URL: " + url));
      }),
    );

    render(
      <AuthProvider>
        <RequesterDashboard />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("requester-metric-value-my-open")).toHaveTextContent("3");
    });

    expect(screen.getByTestId("requester-dashboard-greeting")).toHaveTextContent(
      "Welcome, Jennifer Anderson!",
    );
    expect(screen.getByTestId("requester-metric-value-my-open")).toHaveTextContent("3");
    expect(screen.getByTestId("requester-metric-value-in-progress")).toHaveTextContent("2");
    expect(screen.getByTestId("requester-metric-value-resolved")).toHaveTextContent("5");
    expect(screen.getByTestId("requester-metric-value-closed")).toHaveTextContent("8");

    expect(screen.getByTestId("requester-recent-tickets-panel")).toHaveTextContent("My Recent Tickets");
    expect(screen.getByTestId("requester-recent-row-301")).toHaveTextContent("TKT-2026-000301");
    expect(screen.getByTestId("requester-recent-row-301")).toHaveTextContent(
      "Laptop battery drains quickly",
    );
    expect(screen.getByTestId("requester-recent-card-302")).toHaveTextContent("TKT-2026-000302");

    expect(screen.getByTestId("requester-quick-action-create-ticket")).toBeInTheDocument();
    expect(screen.getByTestId("requester-quick-action-view-tickets")).toBeInTheDocument();
  });

  it("UI-05b: clicking metric cards, quick actions, and recent tickets triggers drill-down into My Tickets (FR-10)", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: requesterUser });
      if (url.includes("/api/dashboard/requester")) return okRes(sampleRequesterDashboard);
      if (url.includes("/api/categories")) return okRes([{ id: 2, name: "Hardware" }]);
      if (url.includes("/api/tickets")) {
        return okRes({
          tickets: sampleRequesterDashboard.recentTickets,
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
        <RequesterDashboard
          onDrillDown={onDrillDown}
          onOpenTicket={onOpenTicket}
          onCreateTicket={onCreateTicket}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("requester-metric-card-my-open")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("requester-metric-card-my-open"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "Open" });

    await user.click(screen.getByTestId("requester-metric-card-in-progress"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "In Progress" });

    await user.click(screen.getByTestId("requester-metric-card-resolved"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "Resolved" });

    await user.click(screen.getByTestId("requester-metric-card-closed"));
    expect(onDrillDown).toHaveBeenLastCalledWith({ status: "Closed" });

    await user.click(screen.getByTestId("requester-quick-action-view-tickets"));
    expect(onDrillDown).toHaveBeenLastCalledWith({});

    await user.click(screen.getByTestId("requester-quick-action-create-ticket"));
    expect(onCreateTicket).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("requester-recent-open-301"));
    expect(onOpenTicket).toHaveBeenCalledWith(301);

    unmount();

    // Verify end-to-end shell navigation from Header -> Dashboard -> Drill-down into My Tickets
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-nav-dashboard")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("header-nav-dashboard"));
    await waitFor(() => {
      expect(screen.getByTestId("requester-metric-card-resolved")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("requester-metric-card-resolved"));
    await waitFor(() => {
      expect(screen.getByTestId("my-tickets-filter-status")).toHaveValue("Resolved");
    });
  });

  it("UI-05c: renders empty state with 'Submit a new request' CTA when recentTickets is empty", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: requesterUser });
      if (url.includes("/api/dashboard/requester")) {
        return okRes({
          metrics: { myOpen: 0, inProgress: 0, resolved: 0, closed: 0 },
          recentTickets: [],
          quickActions: [],
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    const onCreateTicket = vi.fn();
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RequesterDashboard onCreateTicket={onCreateTicket} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("requester-dashboard-empty")).toBeInTheDocument();
    });

    const emptyCreateBtn = screen.getByTestId("requester-empty-create-btn");
    expect(emptyCreateBtn).toHaveTextContent("Submit a new request");
    await user.click(emptyCreateBtn);
    expect(onCreateTicket).toHaveBeenCalledTimes(1);
  });

  it("UI-05d: enforces Zen Green design tokens, responsive layout, overflow-x hidden, and >=44px touch targets", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/auth/me")) return okRes({ user: requesterUser });
        if (url.includes("/api/dashboard/requester")) return okRes(sampleRequesterDashboard);
        return Promise.reject(new Error("Unhandled URL: " + url));
      }),
    );

    render(
      <AuthProvider>
        <RequesterDashboard />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("requester-dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("requester-recent-tickets-table")).toBeInTheDocument();
    });

    const dashboardSection = screen.getByTestId("requester-dashboard");
    expect(dashboardSection.style.overflowX).toBe("hidden");

    const metricsGrid = screen.getByTestId("requester-metrics-grid");
    expect(metricsGrid.className).toContain("row-cols-1");
    expect(metricsGrid.className).toContain("row-cols-sm-2");
    expect(metricsGrid.className).toContain("row-cols-lg-4");

    const tableWrapper = screen.getByTestId("requester-recent-tickets-table-wrapper");
    expect(tableWrapper.className).toContain("d-none");
    expect(tableWrapper.className).toContain("d-md-block");
    expect(tableWrapper.className).toContain("overflow-hidden");

    const mobileCards = screen.getByTestId("requester-recent-tickets-cards");
    expect(mobileCards.className).toContain("d-md-none");

    const createBtn = screen.getByTestId("requester-quick-action-create-ticket");
    expect(createBtn.getAttribute("style") ?? "").toContain(`background-color: ${hexToRgb("#006B3C")}`);

    const viewBtn = screen.getByTestId("requester-quick-action-view-tickets");
    expect(viewBtn.getAttribute("style") ?? "").toContain(`background-color: ${hexToRgb("#EAF6EF")}`);

    for (const testId of [
      "requester-dashboard-refresh",
      "requester-metric-card-my-open",
      "requester-metric-card-in-progress",
      "requester-metric-card-resolved",
      "requester-metric-card-closed",
      "requester-dashboard-view-all",
      "requester-quick-action-create-ticket",
      "requester-quick-action-view-tickets",
    ]) {
      const el = screen.getByTestId(testId);
      const style = el.getAttribute("style") ?? "";
      const match = style.match(/min-height:\s*(\d+)px/i);
      expect(match).not.toBeNull();
      expect(Number(match![1])).toBeGreaterThanOrEqual(44);
    }
  });
});
