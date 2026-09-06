import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyTicketsList } from "../../src/components/MyTicketsList.js";
import { RequesterProvider } from "../../src/context/RequesterContext.js";
import { TicketsPage } from "../../src/api.js";

const mockRequester = { id: 1, name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true };

const makeTicket = (i: number, overrides: Partial<any> = {}) => ({
  id: i,
  ticketNumber: `TKT-2026-0000${String(i).padStart(2, "0")}`,
  summary: `Ticket #${i} summary description`,
  requestedPriority: "MEDIUM",
  status: "New",
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-02T10:00:00.000Z",
  categoryId: 1,
  categoryName: "Network",
  relatedSystemId: 2,
  relatedSystemName: "Campus Wi-Fi",
  ...overrides,
});

let ticketsPage: TicketsPage;
let fetchMock: ReturnType<typeof vi.fn>;

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

describe("UI-05..UI-09: My Tickets List Screen (FR-05..FR-08)", () => {
  beforeEach(() => {
    localStorage.setItem("toktickit_requester", JSON.stringify(mockRequester));

    ticketsPage = {
      tickets: [makeTicket(1), makeTicket(2), makeTicket(3)],
      meta: { total: 3, page: 1, limit: 10, totalPages: 1 },
    };

    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/categories")) {
        return okRes([
          { id: 1, name: "Network" },
          { id: 2, name: "Hardware" },
        ]);
      }
      if (url.includes("/api/tickets")) return okRes(ticketsPage);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  function ticketUrls(): string[] {
    return fetchMock.mock.calls
      .map((c) => String(c[0]))
      .filter((u: string) => u.includes("/api/tickets"));
  }

  it("UI-05: Renders My Tickets table with ticket rows, badges, and total count", async () => {
    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    const table = await screen.findByTestId("my-tickets-table");
    expect(table).toBeInTheDocument();

    await waitFor(() => {
      expect(within(table).getByText("TKT-2026-000001")).toBeInTheDocument();
      expect(within(table).getByText("TKT-2026-000002")).toBeInTheDocument();
      expect(within(table).getByText("Ticket #1 summary description")).toBeInTheDocument();
      expect(within(table).getAllByText("Network").length).toBeGreaterThan(0);
    });

    expect(screen.getByTestId("my-tickets-total")).toHaveTextContent("Showing 1–3 of 3 tickets");
    expect(within(table).getAllByText("MEDIUM").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("New").length).toBeGreaterThan(0);
  });

  it("UI-06: Search and filter dropdowns send correct query params to the API", async () => {
    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    // Wait for initial load
    await screen.findByTestId("my-tickets-table");

    const user = userEvent.setup();

    // Search
    await user.type(screen.getByTestId("my-tickets-search"), "vpn");
    await user.click(screen.getByTestId("my-tickets-search-btn"));

    await waitFor(() => {
      const urls = ticketUrls();
      const last = urls[urls.length - 1];
      expect(last).toContain("search=vpn");
    });

    // Category filter
    await user.selectOptions(screen.getByTestId("my-tickets-filter-category"), "2");
    await waitFor(() => {
      const urls = ticketUrls();
      const last = urls[urls.length - 1];
      expect(last).toContain("category=2");
    });

    // Priority filter
    await user.selectOptions(screen.getByTestId("my-tickets-filter-priority"), "HIGH");
    await waitFor(() => {
      const urls = ticketUrls();
      const last = urls[urls.length - 1];
      expect(last).toContain("priority=HIGH");
    });

    // Status filter
    await user.selectOptions(screen.getByTestId("my-tickets-filter-status"), "New");
    await waitFor(() => {
      const urls = ticketUrls();
      const last = urls[urls.length - 1];
      expect(last).toContain("status=New");
    });
  });

  it("UI-07: Pagination Prev/Next and page numbers trigger page changes", async () => {
    ticketsPage = {
      tickets: [makeTicket(1), makeTicket(2), makeTicket(3)],
      meta: { total: 25, page: 1, limit: 10, totalPages: 3 },
    };

    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    await screen.findByTestId("my-tickets-table");

    const user = userEvent.setup();
    const prev = screen.getByTestId("my-tickets-prev");
    const next = screen.getByTestId("my-tickets-next");

    expect(prev).toBeDisabled();

    await user.click(next);
    await waitFor(() => {
      const urls = ticketUrls();
      expect(urls[urls.length - 1]).toContain("page=2");
    });

    // Click page number 3
    await user.click(screen.getByTestId("my-tickets-page-3"));
    await waitFor(() => {
      const urls = ticketUrls();
      expect(urls[urls.length - 1]).toContain("page=3");
    });
  });

  it("UI-08: Shows Empty state when no tickets exist, No-Results state when filters active", async () => {
    ticketsPage = {
      tickets: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("my-tickets-empty")).toBeInTheDocument();
      expect(screen.getByText("No Tickets Yet")).toBeInTheDocument();
    });

    // Apply a filter -> No Results state
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("my-tickets-filter-priority"), "URGENT");

    await waitFor(() => {
      expect(screen.getByTestId("my-tickets-no-results")).toBeInTheDocument();
      expect(screen.getByText("No Tickets Match")).toBeInTheDocument();
    });
  });

  it("UI-09: Sort select and Ascending/Descending toggle send sort & order params", async () => {
    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    await screen.findByTestId("my-tickets-table");

    const user = userEvent.setup();

    await user.selectOptions(screen.getByTestId("my-tickets-sort"), "requestedPriority");
    await waitFor(() => {
      const urls = ticketUrls();
      expect(urls[urls.length - 1]).toContain("sort=requestedPriority");
    });

    await user.click(screen.getByTestId("my-tickets-order-toggle"));
    await waitFor(() => {
      const urls = ticketUrls();
      expect(urls[urls.length - 1]).toContain("order=asc");
    });

    expect(screen.getByTestId("my-tickets-order-toggle")).toHaveTextContent("↑ Ascending");
  });

  it("UI-10: Shows red error alert when the API fails (e.g. 500)", async () => {
    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/categories")) {
        return okRes([
          { id: 1, name: "Network" },
          { id: 2, name: "Hardware" },
        ]);
      }
      if (url.includes("/api/tickets")) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () =>
            Promise.resolve({
              error: "Internal Server Error",
              message: "Failed to retrieve tickets.",
            }),
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    await waitFor(() => {
      const errorBox = screen.getByTestId("my-tickets-error");
      expect(errorBox).toBeInTheDocument();
      expect(errorBox).toHaveTextContent("Failed to retrieve tickets.");
      expect(errorBox).toHaveClass("alert-danger");
    });
  });

  it("UI-11: New search from page 2 resets to page 1 (regression)", async () => {
    ticketsPage = {
      tickets: [makeTicket(1), makeTicket(2), makeTicket(3)],
      meta: { total: 25, page: 1, limit: 10, totalPages: 3 },
    };

    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    await screen.findByTestId("my-tickets-table");

    const user = userEvent.setup();

    // Move to page 2
    await user.click(screen.getByTestId("my-tickets-next"));
    await waitFor(() => {
      expect(ticketUrls()[ticketUrls().length - 1]).toContain("page=2");
    });

    // New search must reset to page 1
    await user.type(screen.getByTestId("my-tickets-search"), "printer");
    await user.click(screen.getByTestId("my-tickets-search-btn"));

    await waitFor(() => {
      const last = ticketUrls()[ticketUrls().length - 1];
      expect(last).toContain("search=printer");
      expect(last).toContain("page=1");
      expect(last).not.toContain("page=2");
    });
  });

  it("UI-22: Shows loading state while tickets are being fetched", async () => {
    let resolveTickets: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveTickets = resolve;
    });

    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Network" }]);
      if (url.includes("/api/tickets")) return pending;
      return Promise.reject(new Error("Unhandled URL: " + url));
    });

    render(
      <RequesterProvider>
        <MyTicketsList />
      </RequesterProvider>
    );

    const loading = screen.getByTestId("my-tickets-loading");
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveTextContent("Loading your tickets...");

    await act(async () => {
      resolveTickets({ ok: true, json: () => Promise.resolve(ticketsPage) });
    });

    await waitFor(() => {
      expect(screen.getByTestId("my-tickets-table")).toBeInTheDocument();
    });
  });
});