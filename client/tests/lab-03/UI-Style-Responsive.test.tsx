import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { RoleBadge, StatusBadge, PriorityBadge } from "../../src/components/ui/Badges.js";

/* ─── helpers ─── */

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

const requester = { id: 1, name: "Jennifer Anderson", email: "jennifer@toktickit.com", role: "REQUESTER", mustChangePassword: false, isActive: true };
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

describe("STYLE-01: Badges and shared design tokens", () => {
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
});

describe("STYLE-02: Form conventions on shared screens", () => {
  it("STYLE-02d: Login screen labels have required asterisks and inputs are editable", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("login-card"));

    expect(screen.getByText(/Email/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(screen.getByText(/Password/).querySelector("span.text-danger")).toBeInTheDocument();
    expect(screen.getByTestId("login-email").tagName).toBe("INPUT");
    expect(screen.getByTestId("login-email")).not.toBeDisabled();
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

  it("STYLE-03h: Login form inputs do not explicitly set outline:none (browser focus ring preserved)", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("login-card"));

    const emailInput = screen.getByTestId("login-email");
    const pwInput = screen.getByTestId("login-password");
    expect(emailInput.style.outline).toBe("");
    expect(pwInput.style.outline).toBe("");
  });
});

describe("RESP-02: Login and ChangePassword responsive layout", () => {
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
});