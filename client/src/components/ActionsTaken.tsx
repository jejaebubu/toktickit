import React, { useEffect, useMemo, useState } from "react";
import {
  ActionTaken,
  ActionTakenPayload,
  ActionTakenStatus,
  ActionTakenUser,
  ApiError,
  createActionTaken,
  fetchAssignableStaff,
  updateActionTaken,
} from "../api.js";
import { useAuth } from "../context/AuthContext.js";
import { RoleBadge } from "./ui/Badges.js";

const ACTION_STATUSES: ActionTakenStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const ACTION_STATUS_TRANSITIONS: Record<ActionTakenStatus, ActionTakenStatus[]> = {
  PENDING: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const ACTION_STATUS_META: Record<ActionTakenStatus, { label: string; backgroundColor: string; color: string }> = {
  PENDING: { label: "⏳ Pending", backgroundColor: "#FEF3C7", color: "#92400E" },
  IN_PROGRESS: { label: "🔧 In Progress", backgroundColor: "#DBEAFE", color: "#1E40AF" },
  COMPLETED: { label: "✅ Completed", backgroundColor: "#C6F6D5", color: "#22543D" },
  CANCELLED: { label: "⛔ Cancelled", backgroundColor: "#E5E7EB", color: "#374151" },
};

const ROLE_LABELS: Record<string, string> = {
  REQUESTER: "Requester",
  IT_STAFF: "IT Staff",
  ADMINISTRATOR: "Admin",
};

interface ActionsTakenProps {
  ticketId: number;
  actions?: ActionTaken[];
  onActionsChange?: (actions: ActionTaken[]) => void;
}

interface FormState {
  actionDateTime: string;
  actionDescription: string;
  result: string;
  assigneeId: string;
  status: ActionTakenStatus;
  followUpRequired: boolean;
  followUpNote: string;
  attachmentNotes: string;
}

function sortActions(actions: ActionTaken[]): ActionTaken[] {
  return [...actions].sort((a, b) => {
    const byDate = new Date(b.actionDateTime).getTime() - new Date(a.actionDateTime).getTime();
    if (byDate !== 0) return byDate;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateTimeLocal(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const safe = Number.isNaN(date.getTime()) ? new Date() : date;
  return `${safe.getFullYear()}-${pad(safe.getMonth() + 1)}-${pad(safe.getDate())}T${pad(safe.getHours())}:${pad(safe.getMinutes())}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function emptyForm(assigneeId: number | string = ""): FormState {
  return {
    actionDateTime: toDateTimeLocal(new Date()),
    actionDescription: "",
    result: "",
    assigneeId: String(assigneeId),
    status: "PENDING",
    followUpRequired: false,
    followUpNote: "",
    attachmentNotes: "",
  };
}

function formFromAction(action: ActionTaken): FormState {
  return {
    actionDateTime: toDateTimeLocal(action.actionDateTime),
    actionDescription: action.actionDescription,
    result: action.result ?? "",
    assigneeId: String(action.assigneeId),
    status: action.status,
    followUpRequired: action.followUpRequired,
    followUpNote: action.followUpNote ?? "",
    attachmentNotes: action.attachmentNotes ?? "",
  };
}

function statusBadge(action: ActionTaken): React.ReactElement {
  const meta = ACTION_STATUS_META[action.status];
  return (
    <span
      className="badge rounded-pill fw-semibold px-2 py-1"
      style={{ fontSize: "0.78rem", backgroundColor: meta.backgroundColor, color: meta.color }}
      data-testid={`action-status-${action.id}`}
    >
      {meta.label}
    </span>
  );
}

export const ActionsTaken: React.FC<ActionsTakenProps> = ({ ticketId, actions, onActionsChange }) => {
  const { user } = useAuth();
  const canManage = user?.role === "IT_STAFF" || user?.role === "ADMINISTRATOR";

  const [items, setItems] = useState<ActionTaken[]>(() => sortActions(actions ?? []));
  const [assignees, setAssignees] = useState<ActionTakenUser[]>([]);
  const [assigneesError, setAssigneesError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ActionTaken | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  useEffect(() => {
    setItems(sortActions(actions ?? []));
  }, [actions]);

  useEffect(() => {
    if (!canManage) return;
    let cancelled = false;
    fetchAssignableStaff()
      .then((list) => {
        if (cancelled) return;
        setAssignees(list);
        setAssigneesError(null);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setAssignees([]);
        setAssigneesError(err instanceof ApiError ? err.message : "Failed to load assignable staff.");
      });
    return () => {
      cancelled = true;
    };
  }, [canManage]);

  const statusOptions = useMemo(() => {
    if (!editing) return ACTION_STATUSES;
    const allowed = [editing.status, ...(ACTION_STATUS_TRANSITIONS[editing.status] ?? [])];
    return Array.from(new Set(allowed));
  }, [editing]);

  const isFinalStatus = editing ? ACTION_STATUS_TRANSITIONS[editing.status].length === 0 : false;

  const assignablePeople = useMemo(
    () => assignees.filter((person) => person.isActive !== false && (person.role === "IT_STAFF" || person.role === "ADMINISTRATOR")),
    [assignees],
  );

  const updateItems = (next: ActionTaken[]) => {
    const sorted = sortActions(next);
    setItems(sorted);
    onActionsChange?.(sorted);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditing(null);
    setForm(emptyForm());
    setFieldErrors({});
    setFormError(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(user?.id ?? assignees[0]?.id ?? ""));
    setFieldErrors({});
    setFormError(null);
    setListError(null);
    setIsFormOpen(true);
  };

  const openEdit = (action: ActionTaken, status: ActionTakenStatus = action.status) => {
    setEditing(action);
    setForm({ ...formFromAction(action), status });
    setFieldErrors({});
    setFormError(null);
    setListError(null);
    setIsFormOpen(true);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const description = form.actionDescription.trim();
    if (description.length < 3) errors.actionDescription = "Action Description must be at least 3 characters.";
    if (description.length > 1000) errors.actionDescription = "Action Description must not exceed 1000 characters.";
    if (!form.assigneeId) errors.assigneeId = "Assignee is required.";
    if (form.status === "COMPLETED" && !form.result.trim()) {
      errors.result = "Result is required when Action Status is COMPLETED.";
    }
    if (form.followUpRequired && !form.followUpNote.trim()) {
      errors.followUpNote = "Follow-Up Note is required when follow-up is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!validate()) return;

    const payload: ActionTakenPayload = {
      actionDescription: form.actionDescription.trim(),
      result: form.result.trim() ? form.result.trim() : null,
      assigneeId: Number(form.assigneeId),
      status: form.status,
      followUpRequired: form.followUpRequired,
      followUpNote: form.followUpRequired && form.followUpNote.trim() ? form.followUpNote.trim() : null,
      attachmentNotes: form.attachmentNotes.trim() ? form.attachmentNotes.trim() : null,
    };
    if (form.actionDateTime) {
      const parsed = new Date(form.actionDateTime);
      if (Number.isNaN(parsed.getTime())) {
        setFieldErrors((prev) => ({ ...prev, actionDateTime: "Action Date/Time must be a valid date." }));
        return;
      }
      payload.actionDateTime = parsed.toISOString();
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const saved = editing
        ? await updateActionTaken(ticketId, editing.id, payload)
        : await createActionTaken(ticketId, payload);
      updateItems([...items.filter((item) => item.id !== saved.id), saved]);
      closeForm();
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save Action Taken.");
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (action: ActionTaken, status: ActionTakenStatus) => {
    if (status === "COMPLETED" && !action.result) {
      openEdit(action, "COMPLETED");
      return;
    }
    setBusyActionId(action.id);
    setListError(null);
    try {
      const saved = await updateActionTaken(ticketId, action.id, { status });
      updateItems(items.map((item) => (item.id === saved.id ? saved : item)));
    } catch (err: any) {
      setListError(err instanceof ApiError ? err.message : "Failed to update Action status.");
    } finally {
      setBusyActionId(null);
    }
  };

  return (
    <div className="border rounded-3 p-3 mb-4" style={{ backgroundColor: "#F8FBF9", borderColor: "#B4D7C5" }} data-testid="actions-taken-container">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
        <h3 className="h6 fw-bold text-dark mb-0">
          🛠️ Actions Taken{" "}
          <span className="badge rounded-pill" style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }} data-testid="actions-taken-count">
            {items.length}
          </span>
        </h3>
        {canManage && !isFormOpen && (
          <button
            type="button"
            className="btn btn-sm text-white fw-semibold ms-auto"
            style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
            onClick={openCreate}
            data-testid="action-add"
          >
            + Add Action Taken
          </button>
        )}
      </div>
      <p className="small text-muted mb-3">Work performed on this ticket, including assignee and follow-up status.</p>

      {listError && (
        <div className="alert alert-danger border-0 shadow-sm py-2" role="alert" data-testid="action-list-error">
          ⚠️ {listError}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={submit} className="border rounded-3 p-3 mb-3" style={{ backgroundColor: "#FFFFFF" }} noValidate data-testid="action-form">
          <h4 className="h6 fw-bold text-dark mb-3">{editing ? "Edit Action Taken" : "Add Action Taken"}</h4>

          {formError && (
            <div className="alert alert-danger border-0 shadow-sm py-2" role="alert" data-testid="action-form-error">
              ⚠️ {formError}
            </div>
          )}

          {assigneesError && (
            <div className="alert alert-warning border-0 shadow-sm py-2" role="alert" data-testid="action-assignees-error">
              ⚠️ {assigneesError}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label htmlFor="action-date" className="form-label fw-semibold small text-dark mb-1">Action Date/Time</label>
              <input
                id="action-date"
                type="datetime-local"
                className="form-control"
                value={form.actionDateTime}
                onChange={(e) => setField("actionDateTime", e.target.value)}
                data-testid="action-date"
                style={{ minHeight: 44 }}
              />
              {fieldErrors.actionDateTime && <div className="text-danger small mt-1" data-testid="action-date-error">{fieldErrors.actionDateTime}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="action-assignee" className="form-label fw-semibold small text-dark mb-1">
                Assignee <span className="text-danger">*</span>
              </label>
              <select
                id="action-assignee"
                className="form-select"
                value={form.assigneeId}
                onChange={(e) => setField("assigneeId", e.target.value)}
                data-testid="action-assignee"
                style={{ minHeight: 44 }}
              >
                <option value="">Select an assignee…</option>
                {assignablePeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} — {ROLE_LABELS[person.role] ?? person.role}
                  </option>
                ))}
              </select>
              {fieldErrors.assigneeId && <div className="text-danger small mt-1" data-testid="action-assignee-error">{fieldErrors.assigneeId}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="action-status" className="form-label fw-semibold small text-dark mb-1">Action Status</label>
              <select
                id="action-status"
                className="form-select"
                value={form.status}
                onChange={(e) => setField("status", e.target.value as ActionTakenStatus)}
                disabled={isFinalStatus}
                data-testid="action-status"
                style={{ minHeight: 44 }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{ACTION_STATUS_META[status].label}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="action-description" className="form-label fw-semibold small text-dark mb-1">
                Action Description <span className="text-danger">*</span>
              </label>
              <textarea
                id="action-description"
                className="form-control"
                rows={2}
                value={form.actionDescription}
                onChange={(e) => setField("actionDescription", e.target.value)}
                placeholder="Describe the work performed (3–1000 characters)…"
                data-testid="action-description"
              />
              {fieldErrors.actionDescription && <div className="text-danger small mt-1" data-testid="action-description-error">{fieldErrors.actionDescription}</div>}
            </div>

            <div className="col-12">
              <label htmlFor="action-result" className="form-label fw-semibold small text-dark mb-1">
                Result {form.status === "COMPLETED" && <span className="text-danger">*</span>}
              </label>
              <textarea
                id="action-result"
                className="form-control"
                rows={2}
                value={form.result}
                onChange={(e) => setField("result", e.target.value)}
                placeholder={form.status === "COMPLETED" ? "Record the outcome (required to complete)…" : "Optional until the action is completed…"}
                data-testid="action-result"
              />
              {fieldErrors.result && <div className="text-danger small mt-1" data-testid="action-result-error">{fieldErrors.result}</div>}
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  id="action-followup-required"
                  className="form-check-input"
                  type="checkbox"
                  checked={form.followUpRequired}
                  onChange={(e) => setField("followUpRequired", e.target.checked)}
                  data-testid="action-followup-required"
                />
                <label htmlFor="action-followup-required" className="form-check-label fw-semibold small text-dark">
                  Follow-Up Required?
                </label>
              </div>
            </div>

            {form.followUpRequired && (
              <div className="col-12">
                <label htmlFor="action-followup-note" className="form-label fw-semibold small text-dark mb-1">
                  Follow-Up Note <span className="text-danger">*</span>
                </label>
                <textarea
                  id="action-followup-note"
                  className="form-control"
                  rows={2}
                  value={form.followUpNote}
                  onChange={(e) => setField("followUpNote", e.target.value)}
                  placeholder="What needs to be followed up?"
                  data-testid="action-followup-note"
                />
                {fieldErrors.followUpNote && <div className="text-danger small mt-1" data-testid="action-followup-note-error">{fieldErrors.followUpNote}</div>}
              </div>
            )}

            <div className="col-12">
              <label htmlFor="action-attachment-notes" className="form-label fw-semibold small text-dark mb-1">Attachment Notes</label>
              <input
                id="action-attachment-notes"
                type="text"
                className="form-control"
                value={form.attachmentNotes}
                onChange={(e) => setField("attachmentNotes", e.target.value)}
                placeholder="e.g. network-log.txt, switch-photo.jpg"
                data-testid="action-attachment-notes"
                style={{ minHeight: 44 }}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="submit"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
              disabled={isSaving}
              data-testid="action-save"
            >
              {isSaving ? "Saving…" : "Save Action"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold"
              style={{ minHeight: 44 }}
              onClick={closeForm}
              disabled={isSaving}
              data-testid="action-form-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-muted small mb-0" data-testid="actions-taken-empty">No Actions Taken recorded yet.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((action) => {
            const isOpen = action.status === "PENDING" || action.status === "IN_PROGRESS";
            return (
              <div key={action.id} className="border rounded-3 p-3" style={{ backgroundColor: "#FFFFFF" }} data-testid={`action-card-${action.id}`}>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <small className="fw-semibold text-dark">{formatDate(action.actionDateTime)}</small>
                  {statusBadge(action)}
                  {canManage && !isFormOpen && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success fw-semibold ms-auto"
                      style={{ minHeight: 44 }}
                      onClick={() => openEdit(action)}
                      data-testid={`action-edit-${action.id}`}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <span className="small text-muted">Performed by</span>
                  <strong className="small text-dark">{action.performedBy.name}</strong>
                  <RoleBadge role={action.performedBy.role} testId={`action-performer-role-${action.id}`} />
                  <span className="small text-muted ms-md-3">Assignee</span>
                  <strong className="small text-dark">{action.assignee.name}</strong>
                  <RoleBadge role={action.assignee.role} testId={`action-assignee-role-${action.id}`} />
                </div>

                <div className="text-dark mb-1" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} data-testid={`action-description-${action.id}`}>
                  {action.actionDescription}
                </div>

                {action.result && (
                  <div className="small mb-1" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} data-testid={`action-result-${action.id}`}>
                    <span className="fw-semibold">Result:</span> {action.result}
                  </div>
                )}

                {action.followUpRequired && (
                  <div className="small mb-1" data-testid={`action-followup-${action.id}`}>
                    <span className="badge rounded-pill" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>🔔 Follow-Up Required</span>{" "}
                    <span className="text-dark">{action.followUpNote}</span>
                  </div>
                )}

                {action.attachmentNotes && (
                  <div className="small text-muted mb-1" data-testid={`action-attachment-notes-${action.id}`}>📎 {action.attachmentNotes}</div>
                )}

                {canManage && isOpen && !isFormOpen && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm text-white fw-semibold"
                      style={{ backgroundColor: "#0B7A46", borderColor: "#0B7A46", minHeight: 44 }}
                      onClick={() => changeStatus(action, "COMPLETED")}
                      disabled={busyActionId === action.id}
                      data-testid={`action-complete-${action.id}`}
                    >
                      {busyActionId === action.id ? "Saving…" : "Complete"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary fw-semibold"
                      style={{ minHeight: 44 }}
                      onClick={() => changeStatus(action, "CANCELLED")}
                      disabled={busyActionId === action.id}
                      data-testid={`action-cancel-status-${action.id}`}
                    >
                      Cancel Action
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
