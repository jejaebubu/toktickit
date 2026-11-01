import React, { useEffect, useMemo, useState } from "react";
import {
  AdminUser,
  ApiError,
  ConversationEntry,
  TicketDetail as TicketDetailData,
  fetchInternalNotes,
  fetchTicketComments,
  fetchTicketDetail,
  fetchUsers,
  postInternalNote,
  postTicketComment,
  updateTicket,
} from "../api.js";
import { useAuth } from "../context/AuthContext.js";
import { AttachmentSection } from "./AttachmentSection.js";
import { ActionsTaken } from "./ActionsTaken.js";
import { PriorityBadge, RoleBadge, StatusBadge } from "./ui/Badges.js";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const TICKET_STATUS_TRANSITIONS: Record<string, string[]> = {
  New: ["Open", "Cancelled"],
  Open: ["In Progress", "Waiting for Requester", "Pending", "Cancelled"],
  "In Progress": ["Waiting for Requester", "Pending", "Resolved", "Cancelled"],
  "Waiting for Requester": ["In Progress", "Pending", "Resolved", "Cancelled"],
  Pending: ["In Progress", "Waiting for Requester", "Resolved", "Cancelled"],
  Resolved: ["Closed", "Reopened"],
  Reopened: ["In Progress", "Waiting for Requester", "Pending", "Resolved", "Cancelled"],
  Closed: [],
  Cancelled: [],
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface StaffTicketDetailProps {
  ticketId: number;
  onBack: () => void;
}

function EntryList({ entries, testId }: { entries: ConversationEntry[]; testId: string }) {
  return (
    <div className="d-flex flex-column gap-2" data-testid={testId}>
      {entries.map((entry) => (
        <div key={entry.id} className="border rounded-3 p-3" style={{ backgroundColor: "#FFFFFF" }} data-testid={`${testId}-entry-${entry.id}`}>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <strong className="small text-dark">{entry.author.name}</strong>
            <RoleBadge role={entry.author.role} testId={`${testId}-author-role-${entry.id}`} />
            <small className="text-muted ms-auto">{formatDate(entry.createdAt)}</small>
          </div>
          <div className="text-dark" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{entry.content}</div>
        </div>
      ))}
    </div>
  );
}

export const StaffTicketDetail: React.FC<StaffTicketDetailProps> = ({ ticketId, onBack }) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketDetailData | null>(null);
  const [comments, setComments] = useState<ConversationEntry[]>([]);
  const [notes, setNotes] = useState<ConversationEntry[]>([]);
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([]);
  const [staffUsersError, setStaffUsersError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolutionGateModal, setShowResolutionGateModal] = useState(false);
  const [showStaleModal, setShowStaleModal] = useState(false);
  const isAdmin = user?.role === "ADMINISTRATOR";

  const load = () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchTicketDetail(ticketId)
      .then((data) => {
        if (cancelled) return;
        setTicket(data);
        setComments(data.publicComments ?? []);
        setNotes(data.internalNotes ?? []);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load ticket details.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  };

  useEffect(() => load(), [ticketId]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers()
      .then((list) => { setStaffUsers(list); setStaffUsersError(null); })
      .catch((err: any) => {
        setStaffUsers([]);
        setStaffUsersError(err instanceof ApiError ? err.message : "Failed to load assignable staff. Owner reassignment is unavailable.");
      });
  }, [isAdmin]);

  const assignableUsers = useMemo(
    () => staffUsers.filter((u) => u.isActive && (u.role === "IT_STAFF" || u.role === "ADMINISTRATOR")),
    [staffUsers]
  );

  const notify = (msg: string | null, isError = false) => {
    if (!msg) return;
    if (isError) { setNotice(null); setActionError(msg); }
    else { setActionError(null); setNotice(msg); }
  };

  const refreshConversation = async () => {
    try {
      const [cs, ns] = await Promise.all([fetchTicketComments(ticketId), fetchInternalNotes(ticketId)]);
      setComments(cs);
      setNotes(ns);
    } catch {
      // detail fetch already loaded lists; polishing only
    }
  };

  const patchTicket = async (payload: { ownerId?: number | "unassigned" | null; itPriority?: string; status?: string }) => {
    setNotice(null);
    setActionError(null);
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const requestPayload = ticket?.updatedAt ? { ...payload, expectedUpdatedAt: ticket.updatedAt } : payload;
      const updated = await updateTicket(ticketId, requestPayload);
      // The PATCH response omits attachments/conversation lists; merge it into the
      // current ticket so those collections are preserved instead of wiped to undefined.
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ...updated,
              attachments: prev.attachments ?? [],
              actionsTaken: updated.actionsTaken ?? prev.actionsTaken ?? [],
            }
          : { ...updated, attachments: [], actionsTaken: updated.actionsTaken ?? [] },
      );
      notify("Ticket updated successfully.");
      await refreshConversation();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 409 && (err.code === "STALE_UPDATE" || /updated by another user/i.test(err.message))) {
        setShowStaleModal(true);
      }
      notify(err instanceof ApiError ? err.message : "Failed to update ticket.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const unresolvedActions = useMemo(
    () => (ticket?.actionsTaken ?? []).filter((a) => a.status === "PENDING" || a.status === "IN_PROGRESS"),
    [ticket?.actionsTaken],
  );
  const openActionsCount = unresolvedActions.length;

  const requestStatusChange = (nextStatus: string) => {
    if (!ticket || nextStatus === ticket.status) return;
    if (nextStatus === "Resolved" && openActionsCount > 0) {
      setShowResolutionGateModal(true);
      return;
    }
    void patchTicket({ status: nextStatus });
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsPostingComment(true);
    try {
      await postTicketComment(ticketId, commentInput.trim());
      setCommentInput("");
      await refreshConversation();
    } catch (err: any) {
      notify(err instanceof ApiError ? err.message : "Failed to post comment.", true);
    } finally {
      setIsPostingComment(false);
    }
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setIsPostingNote(true);
    try {
      await postInternalNote(ticketId, noteInput.trim());
      setNoteInput("");
      await refreshConversation();
    } catch (err: any) {
      notify(err instanceof ApiError ? err.message : "Failed to post internal note.", true);
    } finally {
      setIsPostingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5" data-testid="detail-loading">
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Loading ticket details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="detail-error">
        ⚠️ <strong>Error:</strong> {error}
        <div className="mt-2">
          <button className="btn btn-sm btn-outline-secondary fw-semibold" onClick={onBack} data-testid="detail-unauthorized-back">
            ← Back to Ticket Queue
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) return null;
  const isOwner = user !== null && user!.id === ticket.owner?.id;
  const isResolved = ["Resolved", "Closed"].includes(ticket.status);
  const allowedTransitions = TICKET_STATUS_TRANSITIONS[ticket.status] ?? [];
  const statusOptions = [ticket.status, ...allowedTransitions];

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }} data-testid="staff-detail-card">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
        <button className="btn btn-outline-success btn-sm fw-semibold" onClick={onBack} data-testid="back-to-queue" style={{ minHeight: 44 }}>
          ← Back to Ticket Queue
        </button>
        <StatusBadge status={ticket.status} testId="detail-status" />
      </div>

      {notice && (
        <div className="alert alert-success border-0 shadow-sm" role="alert" data-testid="detail-notice" style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}>
          ✅ {notice}
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="detail-action-error">
          ⚠️ <strong>Error:</strong> {actionError}
        </div>
      )}

      {isAdmin && staffUsersError && (
        <div className="alert alert-warning border-0 shadow-sm" role="alert" data-testid="detail-staff-users-error">
          ⚠️ <strong>Warning:</strong> {staffUsersError} The owner dropdown shows only "Unassigned".
        </div>
      )}

      {ticket.requesterIndicatedResolved && !["Resolved", "Closed", "Cancelled"].includes(ticket.status) && (
        <div className="alert border-0 shadow-sm d-flex flex-wrap align-items-center gap-2" role="alert" data-testid="detail-resolved-intent" style={{ backgroundColor: "#EAF6EF", color: "#006B3C", border: "1px solid #B4D7C5" }}>
          <span className="badge rounded-pill fw-semibold px-2 py-1" style={{ backgroundColor: "#006B3C", color: "#FFFFFF", whiteSpace: "normal", textAlign: "left" }} data-testid="staff-resolved-advisory-badge">
            Requester indicated problem resolved - Pending Staff Review
          </span>
          <span>🙋 Requester indicated the problem appears resolved. Review the ticket and update its status.</span>
        </div>
      )}

      {/* Header info */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Ticket No.</label>
          <div className="border rounded px-3 py-2 fw-semibold text-success" style={{ backgroundColor: "#F0F4F2" }}>{ticket.ticketNumber}</div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Category</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>{ticket.category.name}</div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Related System</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>{ticket.relatedSystem.name}</div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Requester</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>{ticket.requester.name}</div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Requested Priority</label>
          <div className="d-flex align-items-center py-1"><PriorityBadge priority={ticket.requestedPriority} kind="requested" /></div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">IT Priority</label>
          <div className="d-flex align-items-center py-1"><PriorityBadge priority={ticket.itPriority} kind="it" /></div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Ticket Owner</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>
            {ticket.owner ? ticket.owner.name : <span className="text-warning fw-semibold">Unassigned</span>}
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Created</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>{formatShortDate(ticket.createdAt)}</div>
        </div>
      </div>

      {/* Operational controls */}
      <div className="border rounded-3 p-3 mb-4" style={{ backgroundColor: "#EAF6EF", borderColor: "#B4D7C5" }} data-testid="detail-operations">
        <h3 className="h6 fw-bold text-dark mb-3">⚙️ Operational Controls</h3>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label htmlFor="detail-owner" className="form-label fw-semibold text-dark small mb-1">Owner</label>
            {isAdmin ? (
              <select
                id="detail-owner"
                className="form-select"
                value={ticket.owner?.id ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  patchTicket({ ownerId: v === "" ? null : Number(v) });
                }}
                data-testid="detail-owner-select"
                disabled={isSubmitting}
                style={{ minHeight: 44 }}
              >
                <option value="">Unassigned</option>
                {assignableUsers.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn fw-semibold"
                  style={{ backgroundColor: isOwner ? "#0B7A46" : "#FFFFFF", color: isOwner ? "#FFFFFF" : "#006B3C", border: "1px solid #0B7A46", minHeight: 44 }}
                  onClick={() => patchTicket({ ownerId: user!.id })}
                  disabled={isOwner || isSubmitting}
                  data-testid="detail-claim"
                >
                  {isOwner ? "✓ Claimed by you" : "Claim this ticket"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary fw-semibold"
                  onClick={() => patchTicket({ ownerId: "unassigned" })}
                  disabled={!ticket.owner || isSubmitting}
                  data-testid="detail-unassign"
                  style={{ minHeight: 44 }}
                >
                  Unassign
                </button>
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="detail-priority" className="form-label fw-semibold text-dark small mb-1">IT Priority</label>
            <select
              id="detail-priority"
              className="form-select"
              value={ticket.itPriority}
              onChange={(e) => patchTicket({ itPriority: e.target.value })}
              data-testid="detail-priority-select"
              disabled={isSubmitting}
              style={{ minHeight: 44 }}
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="detail-status" className="form-label fw-semibold text-dark small mb-1">Status</label>
            <select
              id="detail-status"
              className="form-select"
              value={ticket.status}
              onChange={(e) => requestStatusChange(e.target.value)}
              data-testid="detail-status-select"
              disabled={isSubmitting || allowedTransitions.length === 0}
              style={{ minHeight: 44 }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === "Resolved" && openActionsCount > 0 && ticket.status !== "Resolved"
                    ? `Resolved (${openActionsCount} action(s) still open)`
                    : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Workflow Transition Action Bar */}
        <div className="mt-3 pt-2 border-top d-flex flex-wrap align-items-center gap-2" data-testid="workflow-action-bar">
          <span className="small fw-semibold text-dark me-1">Allowed Transitions:</span>
          {allowedTransitions.length === 0 ? (
            <span className="small text-muted" data-testid="workflow-final-state">
              {ticket.status} is a final state (no further status transitions).
            </span>
          ) : (
            allowedTransitions.map((nextStatus) => {
              const isResolveBtn = nextStatus === "Resolved";
              const isCancelBtn = nextStatus === "Cancelled";
              const hasOpenActions = isResolveBtn && openActionsCount > 0;
              const slug = nextStatus.toLowerCase().replace(/\s+/g, "-");
              const btnClass = hasOpenActions
                ? "btn btn-sm fw-semibold"
                : isCancelBtn
                  ? "btn btn-sm btn-outline-danger fw-semibold"
                  : "btn btn-sm btn-outline-success fw-semibold";
              return (
                <button
                  key={nextStatus}
                  type="button"
                  className={btnClass}
                  style={
                    hasOpenActions
                      ? { backgroundColor: "#FEF3C7", color: "#92400E", border: "1px solid #F59E0B", minHeight: 44 }
                      : { minHeight: 44 }
                  }
                  onClick={() => requestStatusChange(nextStatus)}
                  disabled={isSubmitting}
                  data-testid={isResolveBtn ? "workflow-resolve-btn" : `workflow-transition-${slug}`}
                >
                  {hasOpenActions ? (
                    <>
                      <span aria-hidden="true">⚠️</span> Resolve ({openActionsCount} action(s) still open)
                    </>
                  ) : (
                    nextStatus
                  )}
                </button>
              );
            })
          )}
          {openActionsCount > 0 && allowedTransitions.includes("Resolved") && (
            <span
              className="badge rounded-pill fw-semibold px-2 py-1 ms-auto"
              style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
              data-testid="resolution-gate-warning"
            >
              <span aria-hidden="true">⚠️</span> {openActionsCount} action(s) still open
            </span>
          )}
        </div>

        {isResolved && <div className="small text-muted mt-2">Ticket is {ticket.status}. Change its status via the Status selector above to reopen or continue work.</div>}
      </div>

      {showResolutionGateModal && (
        <div
          className="border rounded-3 p-3 mb-4 shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resolution-gate-modal-title"
          style={{ backgroundColor: "#FFFBEB", borderColor: "#F59E0B" }}
          data-testid="resolution-gate-modal"
        >
          <h4 id="resolution-gate-modal-title" className="h6 fw-bold mb-2" style={{ color: "#92400E" }}>
            <span aria-hidden="true">⚠️</span> Unresolved Actions Warning
          </h4>
          <p className="small text-dark mb-2" data-testid="resolution-gate-modal-message">
            This ticket still has {openActionsCount} unresolved action(s). Complete or cancel them before resolving the ticket.
          </p>
          <ul className="small text-dark mb-3" data-testid="resolution-gate-open-list">
            {unresolvedActions.map((act) => (
              <li key={act.id}>
                <strong>{act.status}</strong>: {act.actionDescription}
              </li>
            ))}
          </ul>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-secondary fw-semibold"
              style={{ minHeight: 44 }}
              autoFocus
              onClick={() => setShowResolutionGateModal(false)}
              data-testid="resolution-gate-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-danger fw-semibold"
              style={{ minHeight: 44 }}
              onClick={() => {
                setShowResolutionGateModal(false);
                void patchTicket({ status: "Resolved" });
              }}
              data-testid="resolution-gate-confirm"
            >
              Attempt Resolve Anyway
            </button>
          </div>
        </div>
      )}

      {showStaleModal && (
        <div
          className="border rounded-3 p-3 mb-4 shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stale-update-modal-title"
          style={{ backgroundColor: "#FEF2F2", borderColor: "#DC2626" }}
          data-testid="stale-update-modal"
        >
          <h4 id="stale-update-modal-title" className="h6 fw-bold mb-2" style={{ color: "#991B1B" }}>
            <span aria-hidden="true">⚠️</span> Concurrent Update Detected
          </h4>
          <p className="small text-dark mb-3" data-testid="stale-update-modal-message">
            Ticket has been updated by another user. Please refresh.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
              onClick={() => {
                setShowStaleModal(false);
                setActionError(null);
                load();
              }}
              data-testid="stale-update-refresh"
            >
              Refresh Ticket
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold"
              style={{ minHeight: 44 }}
              onClick={() => setShowStaleModal(false)}
              data-testid="stale-update-dismiss"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Summary & Description */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Summary</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923" }}>{ticket.summary}</div>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-dark mb-1 d-block">Description</label>
          <div className="border rounded px-3 py-2" style={{ backgroundColor: "#F0F4F2", color: "#1F2923", whiteSpace: "pre-wrap" }}>{ticket.description}</div>
        </div>
      </div>

      {/* Public Comments */}
      <div className="border rounded-3 p-3 mb-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#EAF6EF" }} data-testid="public-comments-container">
        <h3 className="h6 fw-bold text-dark mb-1">💬 Public Comments</h3>
        <p className="small text-muted mb-3">Shared with the Requester — visible to everyone on this ticket.</p>
        {comments.length === 0 ? (
          <p className="text-muted small mb-3" data-testid="public-comments-empty">No public comments yet.</p>
        ) : (
          <EntryList entries={comments} testId="public-comments" />
        )}
        <form onSubmit={submitComment} className="mt-3" noValidate>
          <label htmlFor="comment-input" className="form-label fw-semibold text-dark small mb-1">Add a comment <span className="text-danger">*</span></label>
          <textarea
            id="comment-input"
            className="form-control mb-2"
            rows={2}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a public message to share with the Requester..."
            data-testid="comment-input"
            style={{ minHeight: 66 }}
          />
          <button
            type="submit"
            className="btn text-white fw-semibold"
            style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
            disabled={isPostingComment || !commentInput.trim()}
            data-testid="comment-submit"
          >
            {isPostingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>

      {/* Internal Notes */}
      <div className="border rounded-3 p-3 mb-4" style={{ backgroundColor: "#FFFDF0", borderColor: "#FBD38D" }} data-testid="internal-notes-container">
        <h3 className="h6 fw-bold text-dark mb-1">🔒 Internal Notes</h3>
        <p className="small mb-3" style={{ color: "#7A4E00" }} data-testid="internal-notes-label">
          Internal Note — Visible only to IT Staff &amp; Admin
        </p>
        {notes.length === 0 ? (
          <p className="text-muted small mb-3" data-testid="internal-notes-empty">No internal notes yet.</p>
        ) : (
          <EntryList entries={notes} testId="internal-notes" />
        )}
        <form onSubmit={submitNote} className="mt-3" noValidate>
          <label htmlFor="note-input" className="form-label fw-semibold text-dark small mb-1">Add a note <span className="text-danger">*</span></label>
          <textarea
            id="note-input"
            className="form-control mb-2"
            rows={2}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Visible only to IT staff and administrators..."
            data-testid="note-input"
            style={{ minHeight: 66 }}
          />
          <button
            type="submit"
            className="btn fw-semibold"
            style={{ backgroundColor: "#FFFFFF", color: "#7A4E00", border: "1px solid #FBD38D", minHeight: 44 }}
            disabled={isPostingNote || !noteInput.trim()}
            data-testid="note-submit"
          >
            {isPostingNote ? "Posting..." : "Save Note"}
          </button>
        </form>
      </div>

      {/* Actions Taken */}
      <ActionsTaken
        ticketId={ticket.id}
        actions={ticket.actionsTaken}
        onActionsChange={(updatedActions) =>
          setTicket((prev) => (prev ? { ...prev, actionsTaken: updatedActions } : prev))
        }
      />

      {/* Attachments */}
      <h3 className="h5 fw-bold text-dark mb-3">Attachments</h3>
      <AttachmentSection
        ticketId={ticket.id}
        attachments={ticket.attachments}
        onAttachmentsChange={(atts) => setTicket((prev) => (prev ? { ...prev, attachments: atts } : prev))}
        onError={(msg) => notify(msg, true)}
        onSuccess={(msg) => notify(msg)}
      />
    </div>
  );
};