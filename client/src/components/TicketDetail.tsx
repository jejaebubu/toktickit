import React, { useEffect, useState } from "react";
import { ApiError, TicketDetail as TicketDetailData, fetchTicketDetail } from "../api.js";
import { useRequester } from "../context/RequesterContext.js";
import { AttachmentSection } from "./AttachmentSection.js";

interface TicketDetailProps {
  ticketId: number;
  onBack: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusColor(status: string): string {
  switch (status) {
    case "In Progress":
      return "#F79009";
    case "Resolved":
      return "#12B76A";
    default:
      return "#006B3C";
  }
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const { selectedRequester } = useRequester();
  const [ticket, setTicket] = useState<TicketDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!selectedRequester) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchTicketDetail(ticketId, selectedRequester.id)
      .then((data) => {
        if (!cancelled) setTicket(data);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err?.message || "Failed to load ticket details.");
          setIsUnauthorized(err instanceof ApiError && err.status === 403);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ticketId, selectedRequester?.id]);

  if (!selectedRequester) return null;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
        <button
          className="btn btn-outline-success btn-sm fw-semibold"
          onClick={onBack}
          data-testid="back-to-my-tickets"
        >
          ← Back to My Tickets
        </button>
        {ticket && (
          <span
            className="badge fs-6 fw-semibold px-3 py-2"
            style={{ backgroundColor: "#EAF6EF", color: statusColor(ticket.status) }}
            data-testid="detail-status"
          >
            {ticket.status}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-5" data-testid="detail-loading">
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Loading ticket details...
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="detail-error">
          {isUnauthorized ? "🔒 " : "⚠️ "}
          <strong>Error:</strong> {error}
          {isUnauthorized && (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-secondary fw-semibold"
                onClick={onBack}
                data-testid="detail-unauthorized-back"
              >
                ← Back to My Tickets
              </button>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && ticket && (
        <>
          <h2 className="h4 fw-bold text-dark mb-4">
            Ticket <span style={{ color: "#006B3C" }}>{ticket.ticketNumber}</span>
          </h2>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Summary</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.summary}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Description</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.description}
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Category</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.category.name}
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Related System</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.relatedSystem.name}
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Requested Priority</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.requestedPriority}
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <label className="form-label fw-semibold text-dark mb-1 d-block">IT Priority</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.itPriority}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Requester</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {ticket.requester.name} ({ticket.requester.email})
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-dark mb-1 d-block">Created</label>
              <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
                {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          {notice && (
            <div
              className="alert alert-success border-0 shadow-sm"
              role="alert"
              data-testid="detail-notice"
              style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}
            >
              ✅ {notice}
            </div>
          )}

          <h3 className="h5 fw-bold text-dark mb-3">Attachments</h3>
          <AttachmentSection
            ticketId={ticket.id}
            requesterId={ticket.requester.id}
            attachments={ticket.attachments}
            onAttachmentsChange={(atts) => setTicket((prev) => (prev ? { ...prev, attachments: atts } : prev))}
            onError={(msg) => {
              setNotice(null);
              setError(msg);
            }}
            onSuccess={(msg) => {
              setError(null);
              setNotice(msg);
            }}
          />
        </>
      )}
    </div>
  );
};