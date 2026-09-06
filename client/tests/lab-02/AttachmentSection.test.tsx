import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AttachmentSection } from "../../src/components/AttachmentSection.js";
import { Attachment } from "../../src/api.js";

const baseAttachment = (id: number, overrides: Partial<Attachment> = {}) => ({
  id,
  originalName: `screenshot_${id}.png`,
  filename: `stored_${id}.png`,
  mimeType: "image/png",
  size: 2048,
  isRemoved: false,
  removeReason: null,
  removedAt: null,
  createdAt: "2026-09-01T10:00:00.000Z",
  ...overrides,
});

function renderSection(
  attachments: Attachment[],
  overrides: {
    onAttachmentsChange?: (a: Attachment[]) => void;
    onError?: (m: string | null) => void;
    onSuccess?: (m: string | null) => void;
  } = {}
) {
  return render(
    <AttachmentSection
      ticketId={1}
      requesterId={1}
      attachments={attachments}
      onAttachmentsChange={overrides.onAttachmentsChange || vi.fn()}
      onError={overrides.onError || vi.fn()}
      onSuccess={overrides.onSuccess}
    />
  );
}

describe("Attachment Section (Issue 9 - Upload/Download/Soft-Remove)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "URL",
      { createObjectURL: () => "" } as any
    );
  });

  it("UI-04a: Soft-removed attachment shows [Removed] badge with reason and hides download/remove buttons", () => {
    const att = baseAttachment(1, {
      isRemoved: true,
      removeReason: "Uploaded incorrect evidence document",
    });

    renderSection([att]);

    const badge = screen.getByTestId(`attachment-removed-${att.id}`);
    expect(badge).toHaveTextContent("[Removed]");
    expect(badge).toHaveTextContent("Uploaded incorrect evidence document");
    expect(screen.queryByTestId(`attachment-download-${att.id}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`attachment-remove-${att.id}`)).not.toBeInTheDocument();
  });

  it("UI-04b: Active attachment shows Download + Remove buttons", () => {
    const att = baseAttachment(2);
    renderSection([att]);

    expect(screen.getByTestId(`attachment-download-${att.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`attachment-remove-${att.id}`)).toBeInTheDocument();
    expect(screen.getByText("screenshot_2.png")).toBeInTheDocument();
  });

  it("UI-15: Uploading a file calls uploadAttachment and refreshes the list with success notice", async () => {
    const uploaded = baseAttachment(9, { originalName: "proof.pdf", mimeType: "application/pdf" });
    const onAttachChange = vi.fn();
    const onSuccess = vi.fn();
    const file = new File(["some pdf"], "proof.pdf", { type: "application/pdf" });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(uploaded),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderSection([], { onAttachmentsChange: onAttachChange, onSuccess });

    const input = screen.getByTestId("attachment-upload-input");
    await userEvent.setup().upload(input, file);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/api/tickets/1/attachments");
      expect((init as RequestInit).method).toBe("POST");
      expect(onAttachChange).toHaveBeenCalledWith([uploaded]);
      expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining("proof.pdf"));
    });
  });

  it("UI-16: Invalid file type shows error message and does not call upload API", async () => {
    const onError = vi.fn();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const badFile = new File(["hello"], "notes.png", { type: "text/plain" });

    renderSection([], { onError });

    const input = screen.getByTestId("attachment-upload-input");
    await userEvent.setup().upload(input, badFile);

    expect(onError).toHaveBeenCalledWith(expect.stringContaining("Invalid file type"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("UI-17: Soft removal requires a reason and updates state on confirm (200)", async () => {
    const att = baseAttachment(3);
    const onAttachChange = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ...att,
          isRemoved: true,
          removeReason: "Uploaded wrong file",
          removedAt: "2026-09-02T10:00:00.000Z",
        }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderSection([att], { onAttachmentsChange: onAttachChange, onError, onSuccess });
    const user = userEvent.setup();

    // Open remove prompt
    await user.click(screen.getByTestId(`attachment-remove-${att.id}`));
    expect(screen.getByTestId("remove-reason-prompt")).toBeInTheDocument();

    // Confirm without reason -> error via onError
    await user.click(screen.getByTestId("remove-confirm-btn"));
    expect(onError).toHaveBeenCalledWith("Please provide a reason for removing the attachment.");
    expect(fetchMock).not.toHaveBeenCalled();

    // Provide reason and confirm
    await user.type(screen.getByTestId("remove-reason-input"), "Uploaded wrong file");
    await user.click(screen.getByTestId("remove-confirm-btn"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/api/attachments/3");
      expect((init as RequestInit).method).toBe("DELETE");
      expect(JSON.parse((init as RequestInit).body as string).reason).toBe("Uploaded wrong file");
      expect(onAttachChange).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(expect.stringContaining("removed"));
    });
  });
});