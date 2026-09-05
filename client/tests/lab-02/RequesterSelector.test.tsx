import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App.js";

// Mock fetch API for requesters and categories
const mockRequesters = [
  { id: 1, name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true },
  { id: 2, name: "Michael Brown", email: "michael@example.com", isActive: true },
];

describe("UI-01: Development Requester Selector (AC-02)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/requesters")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockRequesters),
          });
        }
        if (url.includes("/api/health")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "ok" }),
          });
        }
        if (url.includes("/api/categories")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: "Hardware" }]),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      })
    );
  });

  it("shows Requester Selector modal when no requester is selected (AC-02)", async () => {
    render(<App />);

    // Modal should be visible since localStorage has no selected requester
    await waitFor(() => {
      expect(screen.getByTestId("requester-selector-modal")).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Development Requester Selector/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Jennifer Anderson/i)
    ).toBeInTheDocument();
  });

  it("allows selecting a requester and updates the active context", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("requester-selector-modal")).toBeInTheDocument();
    });

    // Click Jennifer Anderson card
    const card = screen.getByTestId("requester-card-1");
    await userEvent.click(card);

    // Modal should close and active requester badge in header should show name
    await waitFor(() => {
      expect(screen.getByTestId("active-requester-name")).toHaveTextContent(
        "Jennifer Anderson"
      );
    });

    // Verify localStorage saved the selection
    expect(localStorage.getItem("toktickit_requester")).toContain("Jennifer Anderson");
  });
});
