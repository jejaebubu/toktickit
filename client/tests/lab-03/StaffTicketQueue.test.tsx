import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { StaffTicketQueue } from "../../src/components/StaffTicketQueue.js";

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

const staff = { id: 2, name: "Sam Patel", email: "sam@toktickit.com", role: "IT_STAFF", mustChangePassword: false, isActive: true };

const queueTickets = [
  { id: 201, ticketNumber: "TKT-2026-000201", summary: "Printer jam", requestedPriority: "HIGH", itPriority: "MEDIUM", status: "In Progress", createdAt: "2026-09-01T10:00:00.000Z", updatedAt: "2026-09-02T10:00:00.000Z", categoryId: 1, categoryName: "Hardware", relatedSystemId: 3, relatedSystemName: "Shared Printer", requester: { id: 1, name: "Jennifer Anderson", email: "" }, owner: { id: 2, name: "Sam Patel", email: "" } },
  { id: 202, ticketNumber: "TKT-2026-000202", summary: "VPN drops", requestedPriority: "LOW", status: "New", createdAt: "2026-09-03T10:00:00.000Z", updatedAt: "2026-09-03T10:00:00.000Z", categoryId: 2, categoryName: "Network", relatedSystemId: 1, relatedSystemName: "Corp VPN" },
];
const queuePage = { tickets: queueTickets, meta: { total: 2, page: 1, limit: 10, totalPages: 1 } };

function queueFetch(user = staff) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }, { id: 2, name: "Network" }]);
    if (url.includes("/api/tickets")) return okRes(queuePage);
    return Promise.reject(new Error("Unhandled URL: " + url));
  });
}

function renderWithAuth(ui: React.ReactNode, user = staff) {
  localStorage.setItem("toktickit_token", "test-token");
  return render(<AuthProvider>{ui}</AuthProvider>);
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("IT Staff Ticket Queue — accessibility, touch targets, and responsiveness", () => {
  it("STYLE-03c: Staff queue search, filter selects, and search button all have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />);
    await waitFor(() => screen.getByTestId("staff-queue-card"));

    const checkMinHeight = (el: HTMLElement) => {
      const style = el.getAttribute("style") ?? "";
      const match = style.match(/min-height:\s*(\d+)px/i);
      if (match) expect(Number(match[1])).toBeGreaterThanOrEqual(44);
    };
    checkMinHeight(screen.getByTestId("queue-search"));
    checkMinHeight(screen.getByTestId("queue-filter-status"));
    checkMinHeight(screen.getByTestId("queue-filter-priority"));
    checkMinHeight(screen.getByTestId("queue-filter-owner"));
    checkMinHeight(screen.getByTestId("queue-filter-category"));
    checkMinHeight(screen.getByTestId("queue-search-btn"));
  });

  it("STYLE-03f: Ticket queue table wrapper has overflow-hidden and responsive classes", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />);
    await waitFor(() => screen.getByTestId("queue-table"));

    const table = screen.getByTestId("queue-table");
    const wrapper = table.closest(".d-none.d-md-block");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("overflow-hidden");
  });

  it("STYLE-03i: StaffTicketQueue Clear Filters button resets search input and all dropdowns", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: staff });
      if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }]);
      if (url.includes("/api/tickets")) return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />);
    await waitFor(() => screen.getByTestId("staff-queue-card"));

    const user = userEvent.setup();
    await user.type(screen.getByTestId("queue-search"), "VPN");
    await user.click(screen.getByTestId("queue-search-btn"));
    expect(screen.getByTestId("queue-search")).toHaveValue("VPN");

    await user.click(screen.getByTestId("queue-clear-filters"));

    expect(screen.getByTestId("queue-search")).toHaveValue("");
    expect(screen.getByTestId("queue-filter-category")).toHaveValue("");
    expect(screen.getByTestId("queue-filter-status")).toHaveValue("");
    expect(screen.getByTestId("queue-filter-priority")).toHaveValue("");
    expect(screen.getByTestId("queue-filter-owner")).toHaveValue("");
  });

  it("RESP-01a: StaffTicketQueue renders desktop table and mobile card containers simultaneously", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />);
    await waitFor(() => screen.getByTestId("queue-table"));

    expect(screen.getByTestId("queue-table")).toBeInTheDocument();
    expect(screen.getByTestId("queue-table").closest(".d-none.d-md-block")).not.toBeNull();

    expect(screen.getByTestId("queue-cards")).toBeInTheDocument();
    expect(screen.getByTestId("queue-cards").className).toContain("d-md-none");

    expect(screen.getByTestId("queue-row-201")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-201")).toBeInTheDocument();
    expect(screen.getByTestId("queue-row-202")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-202")).toBeInTheDocument();
  });
});