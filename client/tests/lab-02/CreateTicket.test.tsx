import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTicketForm } from "../../src/components/CreateTicketForm.js";
import { RequesterProvider } from "../../src/context/RequesterContext.js";
import * as api from "../../src/api.js";

const mockRequester = { id: 1, name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true };

describe("UI-02 & UI-03: Create Ticket Form (AC-01)", () => {
  beforeEach(() => {
    localStorage.setItem("toktickit_requester", JSON.stringify(mockRequester));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/categories")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: "Hardware" }]),
          });
        }
        if (url.includes("/api/related-systems")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: "Campus Wi-Fi" }]),
          });
        }
        if (url.includes("/api/requesters")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([mockRequester]),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      })
    );
  });

  it("UI-02: Form shows red asterisks and validation error messages when required fields are missing", async () => {
    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    // Verify red asterisks exist on required fields
    const asterisks = screen.getAllByText("*");
    expect(asterisks.length).toBeGreaterThan(0);

    const user = userEvent.setup();
    const submitBtn = screen.getByTestId("submit-ticket-btn");

    // Click submit with empty summary and description
    await user.click(submitBtn);

    // Validation messages should be displayed
    await waitFor(() => {
      expect(screen.getByText("Summary is required.")).toBeInTheDocument();
      expect(screen.getByText("Description is required.")).toBeInTheDocument();
    });
  });

  it("UI-03: Submit button shows busy state (disabled & loading text) while submitting", async () => {
    // Mock createTicket to delay response so we can test busy state
    let resolveTicketPromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolveTicketPromise = resolve;
    });

    vi.spyOn(api, "createTicket").mockImplementation(() => delayedPromise as any);

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Fill form
    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");

    const submitBtn = screen.getByTestId("submit-ticket-btn");
    await user.click(submitBtn);

    // Verify submit button enters busy state (disabled + Submitting text)
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/Submitting Ticket\.\.\./i)).toBeInTheDocument();

    // Resolve promise to complete submission
    resolveTicketPromise!({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    });

    // Success alert should be shown with Ticket Number
    await waitFor(() => {
      expect(screen.getByTestId("success-alert")).toBeInTheDocument();
      expect(screen.getByText("TKT-2026-000101")).toBeInTheDocument();
    });
  });
});
