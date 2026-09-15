import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

function errRes(status: number, message: string) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  });
}

function makeUser(overrides: Partial<{ role: string; mustChangePassword: boolean }> = {}) {
  return {
    id: 1,
    name: "Jennifer Anderson",
    email: "jennifer@toktickit.com",
    role: "REQUESTER",
    mustChangePassword: false,
    isActive: true,
    ...overrides,
  };
}

describe("Auth-03: Header, Navigation & Logout", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("toktickit_token", "valid-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function stubFetch(userOverrides?: Partial<{ role: string; mustChangePassword: boolean }>) {
    const user = makeUser(userOverrides);
    return vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/login")) return okRes({ token: "valid-token", user });
      if (url.includes("/api/auth/me")) return okRes({ user });
      if (url.includes("/api/auth/change-password"))
        return okRes({ message: "Password changed successfully.", user: { ...user, mustChangePassword: false } });
      if (url.includes("/api/tickets"))
        return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      if (url.includes("/api/categories")) return okRes([]);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
  }

  async function waitForShell(userOverrides?: Partial<{ role: string; mustChangePassword: boolean }>) {
    const fetchMock = stubFetch(userOverrides);
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toBeInTheDocument();
    });
  }

  it("Auth-03a: Requester shell shows My Tickets and Create Ticket nav, hides queue/users", async () => {
    await waitForShell();

    expect(screen.getByTestId("header-user-name")).toHaveTextContent("Jennifer Anderson");
    expect(screen.getByTestId("header-role-badge")).toHaveTextContent("Requester");
    expect(screen.getByTestId("header-nav-my-tickets")).toBeInTheDocument();
    expect(screen.getByTestId("header-nav-create-ticket")).toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-ticket-queue")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-user-management")).not.toBeInTheDocument();
  });

  it("Auth-03b: clicking Create Ticket shows the ticket form", async () => {
    await waitForShell();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("header-nav-create-ticket"));
    expect(screen.getByText(/Create New/i)).toBeInTheDocument();
  });

  it("Auth-03c: IT Staff shell shows Ticket Queue nav only and queue spotlight", async () => {
    await waitForShell({ role: "IT_STAFF" });

    expect(screen.getByTestId("header-role-badge")).toHaveTextContent("IT Staff");
    expect(screen.getByTestId("header-nav-ticket-queue")).toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-my-tickets")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-create-ticket")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-user-management")).not.toBeInTheDocument();
    expect(screen.getByTestId("ticket-queue-coming-soon")).toBeInTheDocument();
  });

  it("Auth-03d: Admin shell shows User Management nav only and admin spotlight", async () => {
    await waitForShell({ role: "ADMINISTRATOR" });

    expect(screen.getByTestId("header-role-badge")).toHaveTextContent("Admin");
    expect(screen.getByTestId("header-nav-user-management")).toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-my-tickets")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-create-ticket")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-nav-ticket-queue")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-management-coming-soon")).toBeInTheDocument();
  });

  it("Auth-03e: Change Password from user menu opens the embedded change password form", async () => {
    await waitForShell();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("header-user-menu"));
    await user.click(screen.getByTestId("header-change-password-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });
    expect(screen.getByText(/current password/i)).toBeInTheDocument();
    expect(screen.getByTestId("change-password-submit")).toBeDisabled();
  });

  it("Auth-03f: logout clears token and returns to login screen", async () => {
    await waitForShell();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("header-user-menu"));
    await user.click(screen.getByTestId("header-logout"));

    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });
    expect(localStorage.getItem("toktickit_token")).toBeNull();
  });
});