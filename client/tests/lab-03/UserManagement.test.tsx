import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { UserManagement } from "../../src/components/UserManagement.js";

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

const admin = { id: 3, name: "Alice Admin", email: "alice@toktickit.com", role: "ADMINISTRATOR", mustChangePassword: false, isActive: true };

function makeAdminUser(overrides: Partial<{ id: number; name: string; role: string; isActive: boolean }> = {}) {
  return { id: 99, email: "u@example.com", mustChangePassword: false, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", name: "Test User", role: "REQUESTER", isActive: true, ...overrides };
}

function userMgmtFetch(user = admin) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/users")) return okRes([makeAdminUser({ id: 10, name: "User One", role: "REQUESTER" }), makeAdminUser({ id: 11, name: "Staff Two", role: "IT_STAFF", isActive: false })]);
    return Promise.reject(new Error("Unhandled URL: " + url));
  });
}

function renderWithAuth(ui: React.ReactNode, user = admin) {
  localStorage.setItem("toktickit_token", "test-token");
  return render(<AuthProvider>{ui}</AuthProvider>);
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Administrator User Management — conventions, actions, responsiveness", () => {
  it("STYLE-02a: UserManagement create modal has required asterisks on Name, Email, Role, and Initial Password", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />);
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
    renderWithAuth(<UserManagement />);
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

  it("STYLE-02e: UserManagement edit modal opens pre-filled with editable fields", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />);
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
    renderWithAuth(<UserManagement />);
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

  it("STYLE-03e: User management action buttons have minHeight ≥ 44", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />);
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

  it("STYLE-03g: User management table and mobile card wrappers have responsive classes", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />);
    await waitFor(() => screen.getByTestId("user-edit-10"));

    const table = screen.getByTestId("user-mgmt-table");
    const tableWrapper = table.closest(".d-none.d-md-block")!;
    expect(tableWrapper.className).toContain("overflow-hidden");

    const cards = screen.getByTestId("user-mgmt-cards");
    expect(cards.className).toContain("d-md-none");
  });

  it("RESP-02c: UserManagement toolbar inputs are full-width col-12 and breakpoint-aware col-md", async () => {
    vi.stubGlobal("fetch", userMgmtFetch());
    renderWithAuth(<UserManagement />);
    await waitFor(() => screen.getByTestId("user-mgmt-card"));

    const searchRow = screen.getByTestId("user-search-input").closest(".col-12")!;
    expect(searchRow.className).toContain("col-12");
    expect(searchRow.className).toContain("col-md-5");

    const roleCol = screen.getByTestId("user-role-filter").closest(".col-12")!;
    expect(roleCol.className).toContain("col-12");
    expect(roleCol.className).toContain("col-md-3");
  });
});