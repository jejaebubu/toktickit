import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";

const forcedUser = {
  id: 1,
  name: "Jennifer Anderson",
  email: "jennifer@toktickit.com",
  role: "REQUESTER",
  mustChangePassword: true,
  isActive: true,
};

const normalUser = {
  ...forcedUser,
  mustChangePassword: false,
};

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

function shellFetch(userOverride?: { mustChangePassword: boolean }) {
  const user = userOverride ? { ...forcedUser, ...userOverride } : forcedUser;
  return vi.fn().mockImplementation((url: string, init?: RequestInit) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/tickets"))
      return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
    if (url.includes("/api/categories")) return okRes([]);
    return Promise.reject(new Error("Unknown URL: " + url));
  });
}

describe("Auth-02: Mandatory Change Password Screen", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("toktickit_token", "forced-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Auth-02a: user with mustChangePassword=true sees the mandatory change screen", async () => {
    vi.stubGlobal("fetch", shellFetch());
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });

    expect(screen.getByText(/mandatory password change/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you must change your password to continue/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("change-password-current")).toBeInTheDocument();
    expect(screen.getByTestId("change-password-new")).toBeInTheDocument();
    expect(screen.getByTestId("change-password-confirm")).toBeInTheDocument();
  });

  it("Auth-02b: checklist reflects password criteria as user types", async () => {
    vi.stubGlobal("fetch", shellFetch());
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const newInput = screen.getByTestId("change-password-new");
    const checklist = screen.getByTestId("change-password-checklist");

    // initially no met items
    expect(within(checklist).queryAllByTestId("checklist-met")).toHaveLength(0);

    // 8 uppercase chars only: min length met, uppercase met, lower/symbol unmet
    await user.type(newInput, "PASSWORD");
    expect(within(checklist).queryAllByTestId("checklist-met")).toHaveLength(2);
    expect(within(checklist).getAllByTestId("checklist-unmet")).toHaveLength(2);

    // add lowercase
    await user.type(newInput, "word");
    expect(within(checklist).queryAllByTestId("checklist-met")).toHaveLength(3);
    expect(within(checklist).queryAllByTestId("checklist-unmet")).toHaveLength(1);

    // add number
    await user.type(newInput, "1");
    expect(within(checklist).queryAllByTestId("checklist-met")).toHaveLength(4);
    expect(within(checklist).queryAllByTestId("checklist-unmet")).toHaveLength(0);
  });

  it("Auth-02c: mismatched confirmation shows error and keeps submit disabled", async () => {
    vi.stubGlobal("fetch", shellFetch());
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId("change-password-current"), "OldPassword1!");
    await user.type(screen.getByTestId("change-password-new"), "NewSecure123!");
    await user.type(screen.getByTestId("change-password-confirm"), "Mismatch123!");

    expect(screen.getByText("New password and confirmation do not match.")).toBeInTheDocument();
    expect(screen.getByTestId("change-password-submit")).toBeDisabled();
  });

  it("Auth-02d: successful change renders the authenticated shell and mustChangePassword clears", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: forcedUser });
      if (url.includes("/api/auth/change-password")) {
        return okRes({ message: "Password changed successfully.", user: { ...forcedUser, mustChangePassword: false } });
      }
      if (url.includes("/api/tickets"))
        return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      if (url.includes("/api/categories")) return okRes([]);
      return Promise.reject(new Error("Unknown URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });

    await user.type(screen.getByTestId("change-password-current"), "OldPassword1!");
    await user.type(screen.getByTestId("change-password-new"), "NewSecure123!");
    await user.type(screen.getByTestId("change-password-confirm"), "NewSecure123!");
    await user.click(screen.getByTestId("change-password-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toHaveTextContent("Jennifer Anderson");
    });
    expect(screen.queryByTestId("change-password-card")).not.toBeInTheDocument();
  });

  it("Auth-02e: 'Sign out instead' clears session and shows login screen", async () => {
    vi.stubGlobal("fetch", shellFetch());
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("change-password-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId("change-password-logout"));

    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });
    expect(localStorage.getItem("toktickit_token")).toBeNull();
  });
});