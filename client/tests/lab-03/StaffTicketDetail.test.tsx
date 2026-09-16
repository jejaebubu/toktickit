import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { StaffTicketDetail } from "../../src/components/StaffTicketDetail.js";
import { TicketDetail as TicketDetailData } from "../../src/api.js";

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

function errRes(status: number, message: string) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve({ message }) });
}

const staff = { id: 2, name: "Sam Patel", email: "sam@toktickit.com", role: "IT_STAFF", mustChangePassword: false, isActive: true };
const admin = { id: 3, name: "Alice Admin", email: "alice@toktickit.com", role: "ADMINISTRATOR", mustChangePassword: false, isActive: true };

function makeAdminUser(overrides: Partial<{ id: number; name: string; role: string; isActive: boolean }> = {}) {
  return { id: 99, email: "u@example.com", mustChangePassword: false, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", name: "Test User", role: "REQUESTER", isActive: true, ...overrides };
}

const detailData: TicketDetailData = {
  id: 201, ticketNumber: "TKT-2026-000201", summary: "Printer jam", description: "The shared printer is jammed.", requestedPriority: "HIGH", itPriority: "MEDIUM", status: "In Progress", createdAt: "2026-09-01T10:00:00.000Z", updatedAt: "2026-09-02T10:00:00.000Z", requesterId: 1, requesterIndicatedResolved: false, requester: { id: 1, name: "Jennifer Anderson", email: "" }, owner: { id: 2, name: "Sam Patel", email: "" }, category: { id: 1, name: "Hardware" }, relatedSystem: { id: 3, name: "Shared Printer" }, attachments: [],
  publicComments: [{ id: 1, content: "Hi, can you check this morning?", author: { id: 1, name: "Jennifer Anderson", email: "", role: "REQUESTER" }, createdAt: "2026-09-02T11:00:00.000Z" }],
  internalNotes: [{ id: 2, content: "Suspect driver issue; escalate if persists.", author: { id: 2, name: "Sam Patel", email: "", role: "IT_STAFF" }, createdAt: "2026-09-02T12:00:00.000Z" }],
};

function detailFetch(user = staff) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }]);
    if (url.includes("/api/tickets/201/comments")) return okRes(detailData.publicComments ?? []);
    if (url.includes("/api/tickets/201/internal-notes")) return okRes(detailData.internalNotes ?? []);
    if (url.includes("/api/tickets/201")) return okRes(detailData);
    if (url.includes("/api/users")) return okRes([makeAdminUser({ id: 2, name: "Sam Patel", role: "IT_STAFF" })]);
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

/** jsdom renders hex colors as rgb(); convert a hex code to the rgb() form for assertions. */
function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function expectElementColor(el: HTMLElement, prop: string, hex: string) {
  const style = el.getAttribute("style") ?? "";
  expect(style).toContain(`${prop}: ${hexToRgb(hex)}`);
}

describe("IT Staff Ticket Detail — comments/notes styling, formats, accessibility", () => {
  it("STYLE-01g: StaffTicketDetail Internal Notes container is amber #FFFDF0 with orange border and correct label", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />);

    const notesContainer = await waitFor(() => screen.getByTestId("internal-notes-container"));
    expectElementColor(notesContainer, "background-color", "#FFFDF0");
    expectElementColor(notesContainer, "border-color", "#FBD38D");

    expect(screen.getByTestId("internal-notes-label")).toHaveTextContent("Internal Note");
    expect(screen.getByTestId("internal-notes-label")).toHaveTextContent("Visible only to IT Staff & Admin");
  });

  it("STYLE-01h: StaffTicketDetail Public Comments container is white with green border", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />);

    const container = await waitFor(() => screen.getByTestId("public-comments-container"));
    expectElementColor(container, "background-color", "#FFFFFF");
    expectElementColor(container, "border-color", "#EAF6EF");
  });

  it("STYLE-02c: StaffTicketDetail read-only info fields render as divs (not inputs), while operational controls are editable selects", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />);

    const card = await waitFor(() => screen.getByTestId("staff-detail-card"));

    const allText = within(card).getAllByText("TKT-2026-000201");
    expect(allText.some((el) => el.tagName === "DIV")).toBe(true);

    const ops = screen.getByTestId("detail-operations");
    expect(within(ops).getByTestId("detail-priority-select").tagName).toBe("SELECT");
    expect(within(ops).getByTestId("detail-status-select").tagName).toBe("SELECT");
    expect(within(ops).getByTestId("detail-priority-select")).not.toBeDisabled();
    expect(within(ops).getByTestId("detail-status-select")).not.toBeDisabled();
  });

  it("STYLE-02g: StaffTicketDetail shows warning when assignable staff list fails to load (admin)", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: admin });
      if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }]);
      if (url.includes("/api/tickets/201/comments")) return okRes(detailData.publicComments ?? []);
      if (url.includes("/api/tickets/201/internal-notes")) return okRes(detailData.internalNotes ?? []);
      if (url.includes("/api/tickets/201")) return okRes(detailData);
      if (url.includes("/api/users")) return errRes(500, "Server error");
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />, admin);

    const alert = await waitFor(() => screen.getByTestId("detail-staff-users-error"));
    expect(alert).toHaveTextContent(/owner dropdown shows only/i);
  });

  it("STYLE-03d: Staff detail operational controls (selects, claim, comment submit) have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />);

    await waitFor(() => screen.getByTestId("staff-detail-card"));
    const checkMinHeight = (el: HTMLElement) => {
      const style = el.getAttribute("style") ?? "";
      const match = style.match(/min-height:\s*(\d+)px/i);
      if (match) expect(Number(match[1])).toBeGreaterThanOrEqual(44);
    };
    checkMinHeight(screen.getByTestId("back-to-queue"));
    checkMinHeight(screen.getByTestId("detail-claim"));
    checkMinHeight(screen.getByTestId("detail-priority-select"));
    checkMinHeight(screen.getByTestId("detail-status-select"));
    checkMinHeight(screen.getByTestId("comment-submit"));
    checkMinHeight(screen.getByTestId("note-submit"));
  });
});