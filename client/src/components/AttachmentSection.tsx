import React, { useState } from "react";
import {
  Attachment,
  getAttachmentDownloadUrl,
  removeAttachment,
  uploadAttachment,
} from "../api.js";

interface AttachmentSectionProps {
  ticketId: number;
  requesterId: number;
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  onError: (message: string | null) => void;
  onSuccess?: (message: string | null) => void;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  ticketId,
  requesterId,
  attachments,
  onAttachmentsChange,
  onError,
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeReason, setRemoveReason] = useState<string>("");
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

  const activeCount = attachments.filter((a) => !a.isRemoved).length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      onError(`Invalid file type for "${file.name}". Only JPG, PNG, WEBP, and PDF are allowed.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      onError(`File "${file.name}" exceeds the maximum limit of 5MB.`);
      return;
    }
    if (activeCount >= 5) {
      onError("Maximum 5 active attachments allowed per ticket.");
      return;
    }

    setIsUploading(true);
    try {
      const created = await uploadAttachment(ticketId, file, requesterId);
      onAttachmentsChange([...attachments, created]);
      onSuccess?.(`"${created.originalName}" uploaded successfully.`);
    } catch (err: any) {
      onError(err?.message || "Failed to upload attachment.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const confirmRemove = async () => {
    if (pendingRemoveId === null) return;
    onError(null);
    if (!removeReason.trim()) {
      onError("Please provide a reason for removing the attachment.");
      return;
    }
    setRemovingId(pendingRemoveId);
    try {
      const updated = await removeAttachment(pendingRemoveId, removeReason.trim(), requesterId);
      onAttachmentsChange(
        attachments.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
      setPendingRemoveId(null);
      setRemoveReason("");
      onSuccess?.(`"${updated.originalName}" has been removed.`);
    } catch (err: any) {
      onError(err?.message || "Failed to remove attachment.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="mb-4" data-testid="attachment-section">
      <label htmlFor="attachment-upload" className="form-label fw-semibold text-dark">
        Attachments <small className="text-muted fw-normal">(Max 5 files, 5MB each. JPG, PNG, WEBP, PDF)</small>
      </label>

      {/* Upload control */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <input
          type="file"
          id="attachment-upload"
          className="form-control"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          disabled={isUploading || activeCount >= 5}
          data-testid="attachment-upload-input"
        />
        {isUploading && (
          <span className="text-success small fw-semibold">
            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
            Uploading...
          </span>
        )}
      </div>

      {attachments.length === 0 ? (
        <p className="text-muted small mb-0" data-testid="attachment-empty">
          No attachments yet.
        </p>
      ) : (
        <ul className="list-group" data-testid="attachment-list">
          {attachments.map((att) => (
            <li
              key={att.id}
              className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2"
              data-testid={`attachment-${att.id}`}
            >
              <div className="d-flex align-items-center gap-2 min-w-0">
                <span>📎</span>
                <span className="text-truncate fw-semibold">{att.originalName}</span>
                <span className="text-muted small">({formatSize(att.size)})</span>
              </div>

              {att.isRemoved ? (
                <span
                  className="badge text-bg-secondary fw-semibold"
                  title={att.removeReason || undefined}
                  data-testid={`attachment-removed-${att.id}`}
                >
                  [Removed] {att.removeReason ? `— ${att.removeReason}` : ""}
                </span>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <a
                    className="btn btn-sm btn-outline-success fw-semibold"
                    href={getAttachmentDownloadUrl(att.id, requesterId)}
                    download
                    data-testid={`attachment-download-${att.id}`}
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger fw-semibold"
                    onClick={() => {
                      setPendingRemoveId(att.id);
                      setRemoveReason("");
                    }}
                    data-testid={`attachment-remove-${att.id}`}
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Soft-remove reason prompt */}
      {pendingRemoveId !== null && (
        <div
          className="border rounded-3 p-3 mt-3"
          style={{ backgroundColor: "#F5F7F6" }}
          data-testid="remove-reason-prompt"
        >
          <div className="fw-semibold text-dark mb-2">
            Reason for removing this attachment:
          </div>
          <textarea
            rows={2}
            className="form-control mb-2"
            placeholder="e.g. Uploaded incorrect evidence document"
            value={removeReason}
            onChange={(e) => setRemoveReason(e.target.value)}
            data-testid="remove-reason-input"
          />
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger btn-sm fw-semibold"
              onClick={confirmRemove}
              disabled={removingId !== null}
              data-testid="remove-confirm-btn"
            >
              {removingId !== null ? "Removing..." : "Confirm Remove"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm fw-semibold"
              onClick={() => setPendingRemoveId(null)}
              disabled={removingId !== null}
              data-testid="remove-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};