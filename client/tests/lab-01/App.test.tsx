import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";
import * as api from "../../src/api.js";

const mockUser = {
  id: 1,
  name: "Jennifer Anderson",
  email: "jennifer@example.com",
  role: "REQUESTER",
  mustChangePassword: false,
  isActive: true,
};

describe("App", () => {
  beforeEach(() => {
    localStorage.setItem("toktickit_token", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes("/api/auth/me")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ user: mockUser }) });
        }
        if (url.includes("/api/tickets")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ tickets: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }),
          });
        }
        if (url.includes("/api/categories")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        if (url.includes("/api/health")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ status: "ok" }) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("renders the TokTickIT heading and app shell after authentication", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toBeInTheDocument();
    });
    expect(screen.getAllByText(/TokTickIT/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("header-user-name")).toHaveTextContent("Jennifer Anderson");
    expect(screen.getByTestId("header-role-badge")).toHaveTextContent("Requester");
  });

  it("shows Online and the seeded categories on success", async () => {
    vi.spyOn(api, "checkSystem").mockResolvedValue({
      online: true,
      categories: [
        { id: 1, name: "Account and Access" },
        { id: 2, name: "Hardware" },
        { id: 3, name: "Software" },
        { id: 4, name: "Network" },
      ],
    });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /check system/i }));
    expect(await screen.findByText(/^System Status: Online$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Supported Request Categories:/i)).toBeInTheDocument();
    expect(screen.getByText("Account and Access")).toBeInTheDocument();
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
  });

  it("shows an Offline error message when the API is unavailable", async () => {
    vi.spyOn(api, "checkSystem").mockRejectedValue(new Error("network down"));
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("header-user-name")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /check system/i }));
    expect(await screen.findByText(/^System Offline/i)).toBeInTheDocument();
  });
});