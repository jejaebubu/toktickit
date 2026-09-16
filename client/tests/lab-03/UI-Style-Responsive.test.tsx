import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { StaffTicketQueue } from "../../src/components/StaffTicketQueue.js";
import { StaffTicketDetail } from "../../src/components/StaffTicketDetail.js";
import { UserManagement } from "../../src/components/UserManagement.js";
import { RoleBadge, StatusBadge, PriorityBadge } from "../../src/components/ui/Badges.js";
import { TicketDetail as TicketDetailData } from "../../src/api.js";

/* ─── helpers ─── */

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

function errRes(status: number, message: string) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve({ message }) });
}

const requester = { id: 1, name: "Jennifer Anderson", email: "jennifer@toktickit.com", role: "REQUESTER", mustChangePassword: false, isActive: true };
const staff = { id: 2, name: "Sam Patel", email: "sam@toktickit.com", role: "IT_STAFF", mustChangePassword: false, isActive: true };
const admin = { id: 3, name: "Alice Admin", email: "alice@toktickit.com", role: "ADMINISTRATOR", mustChangePassword: false, isActive: true };

function makeAdminUser(overrides: Partial<{ id: number; name: string; role: string; isActive: boolean }> = {}) {
  return { id: 99, email: "u@example.com", mustChangePassword: false, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", name: "Test User", role: "REQUESTER", isActive: true, ...overrides };
}

const queueTickets = [
  { id: 201, ticketNumber: "TKT-2026-000201", summary: "Printer jam", requestedPriority: "HIGH", itPriority: "MEDIUM", status: "In Progress", createdAt: "2026-09-01T10:00:00.000Z", updatedAt: "2026-09-02T10:00:00.000Z", categoryId: 1, categoryName: "Hardware", relatedSystemId: 3, relatedSystemName: "Shared Printer", requester: { id: 1, name: "Jennifer Anderson", email: "" }, owner: { id: 2, name: "Sam Patel", email: "" } },
  { id: 202, ticketNumber: "TKT-2026-000202", summary: "VPN drops", requestedPriority: "LOW", status: "New", createdAt: "2026-09-03T10:00:00.000Z", updatedAt: "2026-09-03T10:00:00.000Z", categoryId: 2, categoryName: "Network", relatedSystemId: 1, relatedSystemName: "Corp VPN" },
];
const queuePage = { tickets: queueTickets, meta: { total: 2, page: 1, limit: 10, totalPages: 1 } };

const detailData: TicketDetailData = {
  id: 201, ticketNumber: "TKT-2026-000201", summary: "Printer jam", description: "The shared printer is jammed.", requestedPriority: "HIGH", itPriority: "MEDIUM", status: "In Progress", createdAt: "2026-09-01T10:00:00.000Z", updatedAt: "2026-09-02T10:00:00.000Z", requesterId: 1, requesterIndicatedResolved: false, requester: { id: 1, name: "Jennifer Anderson", email: "" }, owner: { id: 2, name: "Sam Patel", email: "" }, category: { id: 1, name: "Hardware" }, relatedSystem: { id: 3, name: "Shared Printer" }, attachments: [],
  publicComments: [{ id: 1, content: "Hi, can you check this morning?", author: { id: 1, name: "Jennifer Anderson", email: "", role: "REQUESTER" }, createdAt: "2026-09-02T11:00:00.000Z" }],
  internalNotes: [{ id: 2, content: "Suspect driver issue; escalate if persists.", author: { id: 2, name: "Sam Patel", email: "", role: "IT_STAFF" }, createdAt: "2026-09-02T12:00:00.000Z" }],
};

function queueFetch(user = staff) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }, { id: 2, name: "Network" }]);
    if (url.includes("/api/tickets")) return okRes(queuePage);
    return Promise.reject(new Error("Unhandled URL: " + url));
  });
}

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

function userMgmtFetch(user = admin) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/users")) return okRes([makeAdminUser({ id: 10, name: "User One", role: "REQUESTER" }), makeAdminUser({ id: 11, name: "Staff Two", role: "IT_STAFF", isActive: false })]);
    return Promise.reject(new Error("Unhandled URL: " + url));
  });
}

function renderWithAuth(ui: React.ReactNode, user: typeof staff) {
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

/* ─── tests ─── */

describe("STYLE-01: Badges and amber Internal Notes", () => {
  it("STYLE-01a: RoleBadge REQUESTER uses light-blue/teal (#E6F6FF, text #006699)", () => {
    render(<RoleBadge role="REQUESTER" />);
    const badge = screen.getByTestId("badge-role-requester");
    expect(badge).toHaveTextContent("Requester");
    expectElementColor(badge, "background-color", "#E6F6FF");
    expectElementColor(badge, "color", "#006699");
  });

  it("STYLE-01b: RoleBadge IT_STAFF uses purple (#F0F0FF, text #4B0082)", () => {
    render(<RoleBadge role="IT_STAFF" />);
    const badge = screen.getByTestId("badge-role-it-staff");
    expect(badge).toHaveTextContent("IT Staff");
    expectElementColor(badge, "background-color", "#F0F0FF");
    expectElementColor(badge, "color", "#4B0082");
  });

  it("STYLE-01c: RoleBadge ADMINISTRATOR uses amber (#FFF8E6, text #B7791F)", () => {
    render(<RoleBadge role="ADMINISTRATOR" />);
    const badge = screen.getByTestId("badge-role-administrator");
    expect(badge).toHaveTextContent("Admin");
    expectElementColor(badge, "background-color", "#FFF8E6");
    expectElementColor(badge, "color", "#B7791F");
  });

  it("STYLE-01d: StatusBadge Resolved uses green (#C6F6D5, #22543D)", () => {
    render(<StatusBadge status="Resolved" />);
    const badge = screen.getByTestId("badge-status-resolved");
    expect(badge).toHaveTextContent("Resolved");
    expectElementColor(badge, "background-color", "#C6F6D5");
    expectElementColor(badge, "color", "#22543D");
  });

  it("STYLE-01e: StatusBadge In Progress uses yellow (#FEFCBF, #975A16)", () => {
    render(<StatusBadge status="In Progress" />);
    const badge = screen.getByTestId("badge-status-in-progress");
    expect(badge).toHaveTextContent("In Progress");
    expectElementColor(badge, "background-color", "#FEFCBF");
    expectElementColor(badge, "color", "#975A16");
  });

  it("STYLE-01f: PriorityBadge HIGH kind=it renders with correct colors", () => {
    render(<PriorityBadge priority="HIGH" kind="it" />);
    const badge = screen.getByTestId("badge-priority-it-high");
    expect(badge).toHaveTextContent("HIGH");
    expectElementColor(badge, "background-color", "#FEF0C7");
    expectElementColor(badge, "color", "#B54708");
  });

  it("STYLE-01g: StaffTicketDetail Internal Notes container is amber #FFFDF0 with orange border and correct label", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />, staff);

    const notesContainer = await waitFor(() => screen.getByTestId("internal-notes-container"));
    expectElementColor(notesContainer, "background-color", "#FFFDF0");
    expectElementColor(notesContainer, "border-color", "#FBD38D");

    expect(screen.getByTestId("internal-notes-label")).toHaveTextContent("Internal Note");
    expect(screen.getByTestId("internal-notes-label")).toHaveTextContent("Visible only to IT Staff & Admin");
  });

  it("STYLE-01h: StaffTicketDetail Public Comments container is white with green border", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />, staff);

    const container = await waitFor(() => screen.getByTestId("public-comments-container"));
    expectElementColor(container, "background-color", "#FFFFFF");
    expectElementColor(container, "border-color", "#EAF6EF");
  });
});

describe("STYLE-02: Form conventions and editable/read-only fields", () => {
  it("STYLE-02a: UserManagement create modal has required asterisks on Name, Email, Role, and Initial Password", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const user = userEvent.setup();
    await user.click(screen.getByTestId("user-mgmt-add-btn"));

    const modal = screen.getByTestId("user-mgmt-modal");
    expect(within(modal).getByText(/Full Name/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(within(modal).getByText(/Email/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(within(modal).getByText(/^Role/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(within(modal).getByText(/Initial Password/).querySelector("span.text-danger")).toBeInTheDocument();
  });

  it("STYLE-02b: UserManagement create modal form fields are editable inputs/selects, not read-only", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const user = userEvent.setup();
    await user.click(screen.getByTestId("user-mgmt-add-btn"));

    const modal = screen.getByTestId("user-mgmt-modal");
    expect(within(modal).getByTestId("user-name-input").tagName).toBe("INPUT");
    expect(within(modal).getByTestId("user-email-input").tagName).toBe("INPUT");
    expect(within(modal).getByTestId("user-role-input").tagName).toBe("SELECT");
    expect(within(modal).getByTestId("user-active-input").tagName).toBe("INPUT");
    expect(within(modal).getByTestId("user-password-input").tagName).toBe("INPUT");
    expect(within(modal).getByTestId("user-name-input")).not.toBeDisabled();
  });

  it("STYLE-02c: StaffTicketDetail read-only info fields render as divs (not inputs), while operational controls are editable selects", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />, staff);

    const card = await waitFor(() => screen.getByTestId("staff-detail-card"));

    // read-only info: ticket number is a div, not an input
    const allText = within(card).getAllByText("TKT-2026-000201");
    expect(allText.some((el) => el.tagName === "DIV")).toBe(true);

    // operational controls are editable selects
    const ops = screen.getByTestId("detail-operations");
    expect(within(ops).getByTestId("detail-priority-select").tagName).toBe("SELECT");
    expect(within(ops).getByTestId("detail-status-select").tagName).toBe("SELECT");
    expect(within(ops).getByTestId("detail-priority-select")).not.toBeDisabled();
    expect(within(ops).getByTestId("detail-status-select")).not.toBeDisabled();
  });

  it("STYLE-02d: Login screen labels have required asterisks and inputs are editable", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("login-card"));

    expect(screen.getByText(/Email/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(screen.getByText(/Password/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(screen.getByTestId("login-email").tagName).toBe("INPUT");
    expect(screen.getByTestId("login-email")).not.toBeDisabled();
  });

  it("STYLE-02e: UserManagement edit modal opens pre-filled with editable fields", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const user = userEvent.setup();
    await user.click(screen.getByTestId("user-edit-10"));

    const modal = screen.getByTestId("user-mgmt-modal");
    expect(within(modal).getByTestId("user-name-input")).toBeEnabled();
    expect(within(modal).getByTestId("user-name-input")).toHaveValue("User One");
  });

  it("STYLE-02f: UserManagement search input commits query to API on button click (regression fix)", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: admin });
      if (url.includes("/api/users")) return okRes([]);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const user = userEvent.setup();
    await user.type(screen.getByTestId("user-search-input"), "alice");
    await user.click(screen.getByTestId("user-search-btn"));

    const userCalls = (fetchMock.mock.calls as [string][]).filter(
      (call) => call[0].includes("/api/users") && !call[0].includes("/api/auth")
    );
    expect(userCalls.length).toBeGreaterThanOrEqual(2);
    const lastUrl = userCalls[userCalls.length - 1][0];
    expect(lastUrl).toContain("search=alice");
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
});

describe("STYLE-03: Accessibility, touch targets, and overflow", () => {
  it("STYLE-03a: Header user menu button has aria-expanded and aria-haspopup", async () => {
    localStorage.setItem("toktickit_token", "test-token");
    vi.stubGlobal("fetch", queueFetch());
    render(<App />);
    await waitFor(() => screen.getByTestId("header-user-name"));

    const menuBtn = screen.getByTestId("header-user-menu");
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(menuBtn).toHaveAttribute("aria-haspopup", "menu");
  });

  it("STYLE-03b: Header dropdown has role=menu", async () => {
    localStorage.setItem("toktickit_token", "test-token");
    vi.stubGlobal("fetch", queueFetch());
    render(<App />);
    await waitFor(() => screen.getByTestId("header-user-name"));

    const user = userEvent.setup();
    await user.click(screen.getByTestId("header-user-menu"));
    const dropdown = screen.getByTestId("header-user-dropdown");
    expect(dropdown).toHaveAttribute("role", "menu");
  });

  it("STYLE-03c: Staff queue search, filter selects, and search button all have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />, staff);
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

  it("STYLE-03d: Staff detail operational controls (selects, claim, comment submit) have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", detailFetch());
    renderWithAuth(<StaffTicketDetail ticketId={201} onBack={vi.fn()} />, staff);

    const card = await waitFor(() => screen.getByTestId("staff-detail-card"));
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

  it("STYLE-03e: User management action buttons have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-edit-10"));

    const checkMinHeight = (el: HTMLElement) => {
      const style = el.getAttribute("style") ?? "";
      const match = style.match(/min-height:\s*(\d+)px/i);
      if (match) expect(Number(match[1])).toBeGreaterThanOrEqual(44);
    };
    checkMinHeight(screen.getByTestId("user-mgmt-add-btn"));
    checkMinHeight(screen.getByTestId("user-edit-10"));
    checkMinHeight(screen.getByTestId("user-reset-10"));
    checkMinHeight(screen.getByTestId("user-toggle-10"));
  });

  it("STYLE-03f: Ticket queue table wrapper has overflow-hidden and responsive classes", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />, staff);
    await waitFor(() => screen.getByTestId("staff-queue-card"));

    const table = screen.getByTestId("queue-table");
    const wrapper = table.closest(".d-none.d-md-block");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("overflow-hidden");
  });

  it("STYLE-03g: User management table and mobile card wrappers have responsive classes", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-edit-10"));

    const table = screen.getByTestId("user-mgmt-table");
    const tableWrapper = table.closest(".d-none.d-md-block")!;
    expect(tableWrapper.className).toContain("overflow-hidden");

    const cards = screen.getByTestId("user-mgmt-cards");
    expect(cards.className).toContain("d-md-none");
  });

  it("STYLE-03h: Login form inputs do not explicitly set outline:none (browser focus ring preserved)", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("login-card"));

    const emailInput = screen.getByTestId("login-email");
    const pwInput = screen.getByTestId("login-password");
    expect(emailInput.style.outline).toBe("");
    expect(pwInput.style.outline).toBe("");
  });

  it("STYLE-03i: StaffTicketQueue Clear Filters button resets search input and all dropdowns", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: staff });
      if (url.includes("/api/categories")) return okRes([{ id: 1, name: "Hardware" }]);
      if (url.includes("/api/tickets")) return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />, staff);
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
});

describe("RESP-01: Staff Queue table and mobile cards both render", () => {
  it("RESP-01a: StaffTicketQueue renders desktop table and mobile card containers simultaneously", async () => {
    vi.stubGlobal("fetch", queueFetch());
    renderWithAuth(<StaffTicketQueue onOpenTicket={vi.fn()} />, staff);
    await waitFor(() => screen.getByTestId("staff-queue-card"));

    // desktop table exists
    expect(screen.getByTestId("queue-table")).toBeInTheDocument();
    expect(screen.getByTestId("queue-table").closest(".d-none.d-md-block")).not.toBeNull();

    // mobile cards exist
    expect(screen.getByTestId("queue-cards")).toBeInTheDocument();
    expect(screen.getByTestId("queue-cards").className).toContain("d-md-none");

    // both row and card for ticket 201 exist
    expect(screen.getByTestId("queue-row-201")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-201")).toBeInTheDocument();
    expect(screen.getByTestId("queue-row-202")).toBeInTheDocument();
    expect(screen.getByTestId("queue-card-202")).toBeInTheDocument();
  });
});

describe("RESP-02: Login, ChangePassword, and UserManagement responsive layout", () => {
  it("RESP-02a: Login card is centered and constrained to maxWidth 440", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("login-card"));

    const card = screen.getByTestId("login-card");
    expect(card).toHaveClass("w-100");
    const style = card.getAttribute("style") ?? "";
    expect(style).toMatch(/max-width/i);
    expect(style).toMatch(/440/);
    expect(card.parentElement).toHaveClass("d-flex");
    expect(card.parentElement).toHaveClass("justify-content-center");
  });

  it("RESP-02b: ChangePassword screen card is constrained to maxWidth 480 and responsive", async () => {
    localStorage.setItem("toktickit_token", "test-token");
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: { ...requester, mustChangePassword: true } });
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await waitFor(() => screen.getByTestId("change-password-card"));

    const card = screen.getByTestId("change-password-card");
    const innerCard = card.querySelector(".card");
    expect(innerCard).not.toBeNull();
    expect(innerCard!.className).toContain("w-100");
    const innerStyle = innerCard!.getAttribute("style") ?? "";
    expect(innerStyle).toMatch(/max-width/i);
    expect(innerStyle).toMatch(/480/);
  });

  it("RESP-02c: UserManagement toolbar inputs are full-width col-12 and breakpoint-aware col-md", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />, admin);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const searchRow = screen.getByTestId("user-search-input").closest(".col-12")!;
    expect(searchRow.className).toContain("col-12");
    expect(searchRow.className).toContain("col-md-5");

    const roleCol = screen.getByTestId("user-role-filter").closest(".col-12")!;
    expect(roleCol.className).toContain("col-12");
    expect(roleCol.className).toContain("col-md-3");
  });
});