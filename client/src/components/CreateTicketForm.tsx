import React, { useState, useEffect, useRef } from "react";
import {
  Category,
  RelatedSystem,
  fetchCategories,
  fetchRelatedSystems,
  createTicket,
  uploadAttachment,
  CreateTicketPayload,
  TicketResponse,
} from "../api.js";
import { useRequester } from "../context/RequesterContext.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const CreateTicketForm: React.FC = () => {
  const { selectedRequester } = useRequester();

  const [categories, setCategories] = useState<Category[]>([]);
  const [systems, setSystems] = useState<RelatedSystem[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");
  const [relatedSystemId, setRelatedSystemId] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [requestedPriority, setRequestedPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null);
  const [uploadedCount, setUploadedCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [cats, syss] = await Promise.all([
          fetchCategories(),
          fetchRelatedSystems(),
        ]);
        setCategories(cats);
        setSystems(syss);
        if (cats.length > 0) setCategoryId(String(cats[0].id));
        if (syss.length > 0) setRelatedSystemId(String(syss[0].id));
      } catch (err: any) {
        setApiError(err.message || "Failed to load categories/systems");
      }
    }
    loadFormData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      setFileError("Maximum 5 attachments allowed per ticket.");
      return;
    }

    for (const file of selectedFiles) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
        setFileError(`Invalid file type for "${file.name}". Only JPG, PNG, WEBP, and PDF files are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${file.name}" exceeds the maximum limit of 5MB.`);
        return;
      }
    }

    setFiles(selectedFiles);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!summary.trim()) {
      newErrors.summary = "Summary is required.";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!categoryId) {
      newErrors.categoryId = "Category is required.";
    }
    if (!relatedSystemId) {
      newErrors.relatedSystemId = "Related System is required.";
    }
    if (!requestedPriority) {
      newErrors.requestedPriority = "Requested Priority is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !fileError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setUploadedCount(0);

    if (!selectedRequester) {
      setApiError("Please select a Requester User context first.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateTicketPayload = {
        categoryId: Number(categoryId),
        relatedSystemId: Number(relatedSystemId),
        summary: summary.trim(),
        description: description.trim(),
        requestedPriority,
      };

      const result = await createTicket(payload, selectedRequester.id);

      // Upload selected attachments after successful ticket creation (FR-04)
      const toUpload = files;
      let uploaded = 0;
      const failed: string[] = [];

      for (const file of toUpload) {
        try {
          await uploadAttachment(result.id, file, selectedRequester.id);
          uploaded += 1;
        } catch (uploadErr: any) {
          failed.push(`${file.name}: ${uploadErr.message || "upload failed"}`);
        }
      }

      setCreatedTicket(result);
      setUploadedCount(uploaded);

      // Reset form
      setSummary("");
      setDescription("");
      setRequestedPriority("MEDIUM");
      setFiles([]);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (failed.length > 0) {
        setApiError(`Ticket created (${result.ticketNumber}), but ${failed.length} attachment(s) could not be uploaded: ${failed.join("; ")}`);
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h2 className="h4 fw-bold text-dark m-0">
            📝 Create New <span style={{ color: "#006B3C" }}>IT Request Ticket</span>
          </h2>
          <small className="text-muted">Fill in the details below to submit your issue to the IT Service Desk</small>
        </div>
      </div>

      {/* System-generated / read-only fields (ui-spec 3.2) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <label htmlFor="readonly-ticket-number" className="form-label fw-semibold text-dark mb-1">
            Ticket Number
          </label>
          <div
            id="readonly-ticket-number"
            className="border rounded px-3 py-2 fw-semibold"
            style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}
            data-testid="readonly-ticket-number"
          >
            {createdTicket ? createdTicket.ticketNumber : "Auto-generated on submit"}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="readonly-ticket-date" className="form-label fw-semibold text-dark mb-1">
            Ticket Date
          </label>
          <div
            id="readonly-ticket-date"
            className="border rounded px-3 py-2"
            style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}
            data-testid="readonly-ticket-date"
          >
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="readonly-requester" className="form-label fw-semibold text-dark mb-1">
            Requester
          </label>
          <div
            id="readonly-requester"
            className="border rounded px-3 py-2 fw-semibold"
            style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}
            data-testid="readonly-requester"
          >
            {selectedRequester ? selectedRequester.name : "—"}
          </div>
        </div>
      </div>

      {createdTicket && (
        <div
          className="alert border-0 shadow-sm mb-4 p-4"
          style={{ backgroundColor: "#EAF6EF", color: "#006B3C", borderRadius: "12px" }}
          data-testid="success-alert"
        >
          <div className="d-flex align-items-start">
            <span className="fs-2 me-3">🎉</span>
            <div>
              <h5 className="fw-bold mb-1">Ticket Submitted Successfully!</h5>
              <p className="mb-2">Your ticket has been logged with the IT Service Desk.</p>
              <div className="bg-white p-2 rounded border border-success border-opacity-25 d-inline-block">
                Ticket Number: <strong className="fs-5 text-success">{createdTicket.ticketNumber}</strong>
              </div>
              {uploadedCount > 0 && (
                <p className="mt-2 mb-0 small" data-testid="uploaded-count">
                  Attachments uploaded: <strong>{uploadedCount}</strong> file(s)
                </p>
              )}
              {apiError && (
                <div
                  className="alert alert-warning border-0 shadow-sm mt-3 mb-0 py-2 px-3"
                  role="alert"
                  data-testid="upload-api-error"
                >
                  ⚠️ <strong>Warning:</strong> {apiError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {apiError && !createdTicket && (
        <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert" data-testid="api-error">
          ⚠️ <strong>Error:</strong> {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Category & Related System */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="categoryId" className="form-label fw-semibold text-dark">
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="categoryId"
              className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSubmitting}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} Category
                </option>
              ))}
            </select>
            {errors.categoryId && <div className="invalid-feedback text-danger">{errors.categoryId}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="relatedSystemId" className="form-label fw-semibold text-dark">
              Related System <span className="text-danger">*</span>
            </label>
            <select
              id="relatedSystemId"
              className={`form-select ${errors.relatedSystemId ? "is-invalid" : ""}`}
              value={relatedSystemId}
              onChange={(e) => setRelatedSystemId(e.target.value)}
              disabled={isSubmitting}
            >
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.relatedSystemId && <div className="invalid-feedback text-danger">{errors.relatedSystemId}</div>}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-3">
          <label htmlFor="summary" className="form-label fw-semibold text-dark">
            Summary <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="summary"
            className={`form-control ${errors.summary ? "is-invalid" : ""}`}
            placeholder="Brief description of your issue (e.g. Cannot connect to Wi-Fi)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.summary && <div className="invalid-feedback text-danger">{errors.summary}</div>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold text-dark">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            placeholder="Detailed explanation of the issue, error messages, or steps to reproduce..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
          {errors.description && <div className="invalid-feedback text-danger">{errors.description}</div>}
        </div>

        {/* Requested Priority */}
        <div className="mb-4">
          <label htmlFor="requestedPriority" className="form-label fw-semibold text-dark">
            Requested Priority <span className="text-danger">*</span>
          </label>
          <select
            id="requestedPriority"
            className={`form-select ${errors.requestedPriority ? "is-invalid" : ""}`}
            value={requestedPriority}
            onChange={(e) => setRequestedPriority(e.target.value as CreateTicketPayload["requestedPriority"])}
            disabled={isSubmitting}
          >
            {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.requestedPriority && <div className="invalid-feedback text-danger">{errors.requestedPriority}</div>}
        </div>

        {/* File Attachments */}
        <div className="mb-4">
          <label htmlFor="attachments" className="form-label fw-semibold text-dark">
            Attachments <small className="text-muted fw-normal">(Optional: Max 5 files, 5MB each. JPG, PNG, WEBP, PDF)</small>
          </label>
          <input
            type="file"
            id="attachments"
            className="form-control"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            disabled={isSubmitting}
            ref={fileInputRef}
            data-testid="create-attachment-input"
          />
          {fileError && <div className="text-danger small mt-1">{fileError}</div>}
          {files.length > 0 && !fileError && (
            <div className="mt-2 text-success small fw-semibold">
              📎 Selected {files.length} file(s): {files.map((f) => f.name).join(", ")}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn text-white fw-bold px-4 py-2 shadow-sm rounded-pill d-flex align-items-center gap-2"
            style={{ backgroundColor: "#006B3C", borderColor: "#006B3C" }}
            disabled={isSubmitting}
            data-testid="submit-ticket-btn"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Submitting Ticket...</span>
              </>
            ) : (
              <>
                <span>Submit Request Ticket</span> 🚀
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
