import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicketDetail } from "../../src/components/TicketDetail.js";
import { RequesterProvider } from "../../src/context/RequesterContext.js";
import { TicketDetail as TicketDetailData } from "../../src/api.js";

const mockRequester = { id: 1, name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true };

const detailData: TicketDetailData = {
  id: 101,
  ticketNumber: "TKT-2026-000101",
  summary: "Cannot connect to Wi-Fi",
  description: "Auth error since this morning.",
  requestedPriority: "HIGH",
  itPriority: "MEDIUM",
  status: "New",
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-02T10:00:00.000Z",
  requester: { id: 1, name: "Jennifer Anderson", email: "jennifer@example.com" },
  category: { id: 1, name: "Network" },
  relatedSystem: { id: 2, name: "Campus Wi-Fi" },
  attachments: [
    {
      id: 1,
      originalName: "proof.png",
      filename: "x.png",
      mimeType: "image/png",
      size: 2048,
      isRemoved: false,
      removeReason: null,
      removedAt: null,
      createdAt: "2026-09-01T11:00:00.000Z",
    },
  ],
};

let fetchMock: ReturnType<typeof vi.fn>;

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

function renderDetail(onBack = vi.fn()) {
  return render(
    <RequesterProvider>
      <TicketDetail ticketId={101} onBack={onBack} />
    </RequesterProvider>
  );
}

describe("UIClass-09: Ticket Detail Screen (Read-only + Ownership)", () => {
  beforeEach(() => {
    localStorage.setItem("toktickit_requester", JSON.stringify(mockRequester));
    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/tickets/101")) return okRes(detailData);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("UI-12: Renders full ticket detail read-only with ticket number and status badge", async () => {
    renderDetail();

    await waitFor(() => {
      expect(screen.getByTestId("detail-status")).toHaveTextContent("New");
    });

    expect(screen.getByText("TKT-2026-000101")).toBeInTheDocument();
    expect(screen.getByText("Cannot connect to Wi-Fi")).toBeInTheDocument();
    expect(screen.getByText("Auth error since this morning.")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("Campus Wi-Fi")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText(/Jennifer Anderson/)).toBeInTheDocument();

    // Attachment section is present with the downloaded attachment
    expect(screen.getByTestId("attachment-section")).toBeInTheDocument();
  });

  it("UI-12b: Back to My Tickets button navigates back", async () => {
    const onBack = vi.fn();
    renderDetail(onBack);

    await waitFor(() => {
      expect(screen.getByTestId("detail-status")).toHaveTextContent("New");
    });

    await userEvent.setup().click(screen.getByTestId("back-to-my-tickets"));
    expect(onBack).toHaveBeenCalled();
  });

  it("UI-13: Shows 403 unauthorized error box when a different requester's ticket is accessed", async () => {
    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/tickets/101")) {
        return Promise.resolve({
          ok: false,
          status: 403,
          json: () =>
            Promise.resolve({
              error: "Forbidden",
              message: "Access denied. You do not have permission to view this ticket.",
            }),
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();

    await waitFor(() => {
      const err = screen.getByTestId("detail-error");
      expect(err).toHaveTextContent("permission");
      expect(err).toHaveClass("alert-danger");
    });
    expect(screen.getByTestId("detail-unauthorized-back")).toBeInTheDocument();
  });

  it("UI-14: Shows error box when the detail API fails (500)", async () => {
    fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/requesters")) return okRes([mockRequester]);
      if (url.includes("/api/tickets/101")) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () =>
            Promise.resolve({
              error: "Internal Server Error",
              message: "Failed to retrieve ticket details.",
            }),
        });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    renderDetail();

    await waitFor(() => {
      expect(screen.getByTestId("detail-error")).toHaveTextContent("Failed to retrieve ticket details.");
    });
  });
});