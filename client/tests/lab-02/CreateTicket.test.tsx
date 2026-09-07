import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
      const alert = screen.getByTestId("success-alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("TKT-2026-000101");
    });
  });

  it("UI-18: Create form loads Category & Related System options and Requested Priority dropdown (FR-01, FR-02)", async () => {
    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Hardware Category" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Campus Wi-Fi" })).toBeInTheDocument();
    });

    // Requested Priority is a dropdown per ui-spec 3.2
    const prioritySelect = screen.getByLabelText(/Requested Priority/i);
    expect(prioritySelect.tagName).toBe("SELECT");
    for (const p of ["LOW", "MEDIUM", "HIGH", "URGENT"]) {
      expect(screen.getByRole("option", { name: p })).toBeInTheDocument();
    }
  });

  it("UI-19: Attachments selected at create time are uploaded after ticket creation (FR-04)", async () => {
    const file = new File(["%PDF-1.4 test evidence"], "evidence.pdf", { type: "application/pdf" });

    vi.spyOn(api, "createTicket").mockResolvedValue({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    } as any);
    const uploadSpy = vi.spyOn(api, "uploadAttachment").mockResolvedValue({
      id: 1,
      originalName: "evidence.pdf",
      mimeType: "application/pdf",
      isRemoved: false,
    } as any);

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");
    await user.upload(screen.getByLabelText(/Attachments/i), file);

    // Show selected file info
    expect(screen.getByText(/Selected 1 file/)).toBeInTheDocument();

    await user.click(screen.getByTestId("submit-ticket-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("uploaded-count")).toBeInTheDocument();
      expect(screen.getByTestId("uploaded-count")).toHaveTextContent("1");
    });

    expect(uploadSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(101, file, 1);
  });

  it("UI-20: API failure on create shows red error alert with message (AC-01)", async () => {
    vi.spyOn(api, "createTicket").mockRejectedValue(new Error("Internal server error"));

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");
    await user.click(screen.getByTestId("submit-ticket-btn"));

    await waitFor(() => {
      const alert = screen.getByTestId("api-error");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Internal server error");
    });
  });

  it("UI-21: Invalid attachment type shows local error and blocks submission (AC-04)", async () => {
    const createSpy = vi.spyOn(api, "createTicket").mockResolvedValue({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    } as any);

    const badFile = new File(["not an image"], "notes.txt", { type: "text/plain" });

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");

    // fireEvent.change bypasses the accept filter to simulate a wrongly-typed file
    fireEvent.change(screen.getByLabelText(/Attachments/i), {
      target: { files: [badFile] },
    });

    expect(screen.getByText(/Invalid file type for "notes.txt"/)).toBeInTheDocument();

    await user.click(screen.getByTestId("submit-ticket-btn"));

    // Submission is blocked: no create request should be sent
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("UI-23: More than 5 selected files are rejected locally and block submission (BR-07)", async () => {
    const createSpy = vi.spyOn(api, "createTicket").mockResolvedValue({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    } as any);

    const sixFiles = Array.from(
      { length: 6 },
      (_, i) => new File(["%PDF-1.4 test"], `f${i}.pdf`, { type: "application/pdf" })
    );

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");

    fireEvent.change(screen.getByLabelText(/Attachments/i), { target: { files: sixFiles } });

    expect(screen.getByText(/Maximum 5 attachments allowed per ticket\./)).toBeInTheDocument();

    await user.click(screen.getByTestId("submit-ticket-btn"));
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("UI-24: Failed attachment uploads surface a warning inside the success card (FR-04)", async () => {
    const badFile = new File(["%PDF-1.4 bad"], "bad.pdf", { type: "application/pdf" });
    const okFile = new File(["%PDF-1.4 ok"], "ok.pdf", { type: "application/pdf" });

    vi.spyOn(api, "createTicket").mockResolvedValue({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    } as any);
    const uploadSpy = vi
      .spyOn(api, "uploadAttachment")
      .mockRejectedValueOnce(new Error("Server rejected oversized file"))
      .mockResolvedValueOnce({
        id: 1,
        originalName: "ok.pdf",
        mimeType: "application/pdf",
        isRemoved: false,
      } as any);

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");
    fireEvent.change(screen.getByLabelText(/Attachments/i), { target: { files: [badFile, okFile] } });

    await user.click(screen.getByTestId("submit-ticket-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("success-alert")).toBeInTheDocument();
    });

    const warning = screen.getByTestId("upload-api-error");
    expect(warning).toHaveTextContent(/could not be uploaded/);
    expect(warning).toHaveTextContent("TKT-2026-000101");
    expect(screen.getByTestId("uploaded-count")).toHaveTextContent("1");
    expect(screen.queryByTestId("api-error")).not.toBeInTheDocument();
    expect(uploadSpy).toHaveBeenCalledTimes(2);
  });

  it("UI-25: Native file input value is cleared after a successful submit (UX)", async () => {
    const file = new File(["%PDF-1.4 test evidence"], "evidence.pdf", { type: "application/pdf" });

    vi.spyOn(api, "createTicket").mockResolvedValue({
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Test Summary",
      status: "New",
      createdAt: new Date().toISOString(),
    } as any);
    vi.spyOn(api, "uploadAttachment").mockResolvedValue({
      id: 1,
      originalName: "evidence.pdf",
      mimeType: "application/pdf",
      isRemoved: false,
    } as any);

    render(
      <RequesterProvider>
        <CreateTicketForm />
      </RequesterProvider>
    );

    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Summary/i), "Test Summary");
    await user.type(screen.getByLabelText(/Description/i), "Test Description");
    await user.upload(screen.getByLabelText(/Attachments/i), file);

    await user.click(screen.getByTestId("submit-ticket-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("success-alert")).toBeInTheDocument();
    });

    expect(screen.getByTestId("create-attachment-input")).toHaveValue("");
  });
});
