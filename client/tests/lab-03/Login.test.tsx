import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";

const mockUser = {
  id: 1,
  name: "Jennifer Anderson",
  email: "jennifer@toktickit.com",
  role: "REQUESTER",
  mustChangePassword: false,
  isActive: true,
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

describe("Auth-01: Login Screen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderApp(fetchImpl?: (url: string, init?: RequestInit) => Promise<any>) {
    const defaultFetch = (url: string) => {
      if (url.includes("/api/tickets")) {
        return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      }
      if (url.includes("/api/categories")) return okRes([]);
      if (url.includes("/api/related-systems")) return okRes([]);
      if (url.includes("/api/auth/me")) return errRes(401, "Unauthorized");
      return Promise.reject(new Error("Unknown URL: " + url));
    };

    const mock = fetchImpl || defaultFetch;
    vi.stubGlobal("fetch", vi.fn().mockImplementation(mock));
    return render(<App />);
  }

  it("Auth-01a: renders login card with TokTickIT branding and form fields", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });
    expect(screen.getByText(/TokTickIT/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to continue/i)).toBeInTheDocument();
    expect(screen.getByTestId("login-email")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("Auth-01b: submitting with empty fields shows validation errors", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  it("Auth-01c: invalid email format shows email validation error", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId("login-email"), "not-an-email");
    await user.type(screen.getByTestId("login-password"), "Password123!");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    });
  });

  it("Auth-01d: password toggle shows and hides the password input", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const input = screen.getByTestId("login-password");
    const toggle = screen.getByTestId("login-password-toggle");

    expect(input).toHaveAttribute("type", "password");
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "password");
  });

  it("Auth-01e: busy state disables form while login is pending", async () => {
    let resolveLogin: (value: any) => void;
    const loginPending = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    renderApp((url: string) => {
      if (url.includes("/api/auth/login")) return loginPending;
      if (url.includes("/api/auth/me")) return errRes(401, "Unauthorized");
      return Promise.reject(new Error("Unknown"));
    });

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    await user.type(screen.getByTestId("login-email"), "jennifer@toktickit.com");
    await user.type(screen.getByTestId("login-password"), "Password123!");
    await user.click(screen.getByTestId("login-submit"));

    const btn = screen.getByTestId("login-submit");
    expect(btn).toBeDisabled();
    expect(screen.getByText(/Signing in\.\.\./i)).toBeInTheDocument();
    expect(screen.getByTestId("login-email")).toBeDisabled();
    expect(screen.getByTestId("login-password")).toBeDisabled();

    await waitFor(() => {
      resolveLogin!(errRes(401, "Invalid email or password."));
    });

    await waitFor(() => {
      expect(btn).not.toBeDisabled();
    });
  });

  it("Auth-01f: invalid credentials shows safe error alert", async () => {
    renderApp((url: string) => {
      if (url.includes("/api/auth/login")) return errRes(401, "Invalid email or password.");
      if (url.includes("/api/auth/me")) return errRes(401, "Unauthorized");
      return Promise.reject(new Error("Unknown"));
    });

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    await user.type(screen.getByTestId("login-email"), "jennifer@toktickit.com");
    await user.type(screen.getByTestId("login-password"), "WrongPassword1!");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      const alert = screen.getByTestId("login-error");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Invalid email or password.");
    });
  });

  it("Auth-01g: inactive account shows safe error alert without leaking details", async () => {
    renderApp((url: string) => {
      if (url.includes("/api/auth/login"))
        return errRes(401, "Account is inactive. Please contact system administrator.");
      if (url.includes("/api/auth/me")) return errRes(401, "Unauthorized");
      return Promise.reject(new Error("Unknown"));
    });

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    await user.type(screen.getByTestId("login-email"), "disabled@toktickit.com");
    await user.type(screen.getByTestId("login-password"), "Password123!");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      const alert = screen.getByTestId("login-error");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/inactive/i);
      expect(alert).toHaveTextContent(/contact system administrator/i);
    });
  });

  it("Auth-01h: successful login stores token and renders the authenticated app shell", async () => {
    const fetchImpl = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/login"))
        return okRes({ token: "jwt-token-123", user: mockUser });
      if (url.includes("/api/auth/me"))
        return okRes({ user: mockUser });
      if (url.includes("/api/tickets"))
        return okRes({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      if (url.includes("/api/categories")) return okRes([]);
      return Promise.reject(new Error("Unknown URL: " + url));
    });
    vi.stubGlobal("fetch", fetchImpl);

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });

    await user.type(screen.getByTestId("login-email"), "jennifer@toktickit.com");
    await user.type(screen.getByTestId("login-password"), "Password123!");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toHaveTextContent("Jennifer Anderson");
    });

    expect(screen.getByTestId("header-role-badge")).toHaveTextContent("Requester");
    expect(localStorage.getItem("toktickit_token")).toBe("jwt-token-123");
  });
});