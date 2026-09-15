import React, { useEffect, useState } from "react";
import {
  Category,
  QueueUserRef,
  StaffQueueQuery,
  TicketListItem,
  TicketsPage,
  fetchCategories,
  fetchTicketQueue,
} from "../api.js";
import { useAuth } from "../context/AuthContext.js";
import { StatusBadge, PriorityBadge } from "./ui/Badges.js";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUSES = ["New", "Open", "In Progress", "Waiting for Requester", "Resolved", "Closed", "Reopened", "Cancelled"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface StaffQueueState {
  search: string;
  category: string;
  status: string;
  requestedPriority: string;
  itPriority: string;
  ownerId: string;
  sort: string;
  order: "asc" | "desc";
  page: number;
}

const DEFAULT: StaffQueueState = {
  search: "",
  category: "",
  status: "",
  requestedPriority: "",
  itPriority: "",
  ownerId: "",
  sort: "createdAt",
  order: "desc",
  page: 1,
};

function getPageItems(current: number, total: number): number[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

interface StaffTicketQueueProps {
  onOpenTicket: (ticketId: number) => void;
}

export const StaffTicketQueue: React.FC<StaffTicketQueueProps> = ({ onOpenTicket }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<StaffQueueState>(DEFAULT);
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<TicketsPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const updateFilter = (patch: Partial<StaffQueueState>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchTicketQueue({
      search: filters.search || undefined,
      category: filters.category ? Number(filters.category) : undefined,
      status: filters.status || undefined,
      requestedPriority: filters.requestedPriority || undefined,
      itPriority: filters.itPriority || undefined,
      ownerId: filters.ownerId || undefined,
      sort: filters.sort,
      order: filters.order,
      page: filters.page,
    })
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err: any) => { if (!cancelled) setError(err?.message || "Failed to load ticket queue."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [user, filters]);

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput.trim() });
  };

  const hasActiveFilters = !!filters.search || !!filters.category || !!filters.status ||
    !!filters.requestedPriority || !!filters.itPriority || !!filters.ownerId;

  const tickets = data?.tickets ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;
  const page = meta?.page ?? 1;
  const limit = meta?.limit ?? 10;
  const showingStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingEnd = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div
      className="card border-0 shadow-sm p-4 mb-4"
      style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
      data-testid="staff-queue-card"
    >
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
        <div>
          <h2 className="h4 fw-bold text-dark m-0">
            🗂️ IT Staff <span style={{ color: "#006B3C" }}>Ticket Queue</span>
          </h2>
          <small className="text-muted">Search, filter, and prioritize IT support requests</small>
        </div>
      </div>

      <form onSubmit={applySearch} className="row g-2 mb-3" noValidate>
        <div className="col-12 col-md-3">
          <label htmlFor="queue-search" className="form-label fw-semibold text-dark small mb-1">
            Search <span className="text-danger">*</span>
          </label>
          <input
            id="queue-search"
            type="text"
            className="form-control"
            placeholder="Ticket no. or summary..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            data-testid="queue-search"
            style={{ minHeight: 44 }}
          />
        </div>
        <div className="col-6 col-md-2">
          <label htmlFor="queue-category" className="form-label fw-semibold text-dark small mb-1">Category</label>
          <select
            id="queue-category"
            className="form-select"
            value={filters.category}
            onChange={(e) => updateFilter({ category: e.target.value })}
            data-testid="queue-filter-category"
            style={{ minHeight: 44 }}
          >
            <option value="">All</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label htmlFor="queue-status" className="form-label fw-semibold text-dark small mb-1">Status</label>
          <select
            id="queue-status"
            className="form-select"
            value={filters.status}
            onChange={(e) => updateFilter({ status: e.target.value })}
            data-testid="queue-filter-status"
            style={{ minHeight: 44 }}
          >
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label htmlFor="queue-priority" className="form-label fw-semibold text-dark small mb-1">Priority</label>
          <select
            id="queue-priority"
            className="form-select"
            value={filters.requestedPriority}
            onChange={(e) => updateFilter({ requestedPriority: e.target.value })}
            data-testid="queue-filter-priority"
            style={{ minHeight: 44 }}
          >
            <option value="">All</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label htmlFor="queue-owner" className="form-label fw-semibold text-dark small mb-1">Owner</label>
          <select
            id="queue-owner"
            className="form-select"
            value={filters.ownerId}
            onChange={(e) => updateFilter({ ownerId: e.target.value })}
            data-testid="queue-filter-owner"
            style={{ minHeight: 44 }}
          >
            <option value="">All</option>
            <option value="unassigned">Unassigned</option>
            {user && <option value={String(user.id)}>Myself</option>}
          </select>
        </div>
        <div className="col-12 col-md-1 d-flex align-items-end">
          <button
            type="submit"
            className="btn text-white fw-semibold w-100"
            style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
            data-testid="queue-search-btn"
          >
            Search
          </button>
        </div>
      </form>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <label htmlFor="queue-sort" className="form-label fw-semibold text-dark m-0 small">Sort by</label>
        <select
          id="queue-sort"
          className="form-select form-select-sm w-auto"
          value={filters.sort}
          onChange={(e) => updateFilter({ sort: e.target.value })}
          data-testid="queue-sort"
          style={{ minHeight: 44 }}
        >
          <option value="createdAt">Created Date</option>
          <option value="ticketNumber">Ticket Number</option>
          <option value="requestedPriority">Requested Priority</option>
          <option value="itPriority">IT Priority</option>
          <option value="status">Status</option>
          <option value="updatedAt">Last Updated</option>
        </select>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
          onClick={() => updateFilter({ order: filters.order === "asc" ? "desc" : "asc" })}
          data-testid="queue-order-toggle"
          aria-label="Toggle sort order"
          style={{ minHeight: 44 }}
        >
          {filters.order === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-5" data-testid="queue-loading">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading ticket queue...
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="queue-error">
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && total === 0 && (
        <div className="text-center py-5" data-testid={hasActiveFilters ? "queue-no-results" : "queue-empty"}>
          {hasActiveFilters ? (
            <>
              <div className="fs-1 mb-2">🔍</div>
              <h5 className="fw-bold text-dark">No Tickets Match</h5>
              <p className="text-muted mb-0">No tickets match your filters. Try adjusting your criteria.</p>
            </>
          ) : (
            <>
              <div className="fs-1 mb-2">📭</div>
              <h5 className="fw-bold text-dark">Queue is Empty</h5>
              <p className="text-muted mb-0">There are currently no tickets in the queue.</p>
            </>
          )}
        </div>
      )}

      {!isLoading && !error && total > 0 && (
        <>
          {/* Desktop table (>= md) */}
          <div className="d-none d-md-block overflow-hidden">
            <div className="border rounded overflow-hidden">
              <table className="table table-hover align-middle mb-0" data-testid="queue-table">
                <thead style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}>
                  <tr>
                    <th className="fw-semibold">Ticket No.</th>
                    <th className="fw-semibold">Created</th>
                    <th className="fw-semibold">Summary</th>
                    <th className="fw-semibold">Category</th>
                    <th className="fw-semibold">Priority</th>
                    <th className="fw-semibold">IT Priority</th>
                    <th className="fw-semibold">Status</th>
                    <th className="fw-semibold">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => onOpenTicket(t.id)}
                      style={{ cursor: "pointer" }}
                      data-testid={`queue-row-${t.id}`}
                    >
                      <td className="fw-semibold text-success" style={{ whiteSpace: "nowrap" }}>{t.ticketNumber}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(t.createdAt)}</td>
                      <td className="text-truncate" style={{ maxWidth: 220 }} title={t.summary}>{t.summary}</td>
                      <td>{t.categoryName}</td>
                      <td><PriorityBadge priority={t.requestedPriority} kind="requested" /></td>
                      <td><PriorityBadge priority={t.itPriority || t.requestedPriority} kind="it" /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td className="text-nowrap small text-muted">
                        {t.owner ? t.owner.name : <span className="text-warning fw-semibold">Unassigned</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards (< md) */}
          <div className="d-md-none d-flex flex-column gap-3" data-testid="queue-cards">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="border rounded-3 p-3 shadow-sm"
                style={{ backgroundColor: "#F5F7F6", borderColor: "#EAF6EF", cursor: "pointer" }}
                onClick={() => onOpenTicket(t.id)}
                data-testid={`queue-card-${t.id}`}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <strong className="text-success">{t.ticketNumber}</strong>
                  <StatusBadge status={t.status} />
                </div>
                <div className="fw-semibold text-dark mb-1" style={{ wordBreak: "break-word" }}>{t.summary}</div>
                <div className="small text-muted">
                  {formatDate(t.createdAt)} · {t.categoryName} ·{" "}
                  <PriorityBadge priority={t.requestedPriority} kind="requested" /> ·{" "}
                  Owner: {t.owner ? t.owner.name : <span className="text-warning fw-semibold">Unassigned</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-2">
            <small className="text-muted" data-testid="queue-total">
              Showing {showingStart}–{showingEnd} of {total}
            </small>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-success btn-sm fw-semibold"
                onClick={() => updateFilter({ page: Math.max(1, filters.page - 1) })}
                disabled={filters.page <= 1 || totalPages <= 1}
                data-testid="queue-prev"
                style={{ minHeight: 44 }}
              >
                ← Prev
              </button>
              {totalPages > 1 &&
                getPageItems(page, totalPages).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`btn btn-sm fw-semibold ${n === page ? "text-white" : "btn-outline-success"}`}
                    style={n === page ? { backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 } : { minHeight: 44 }}
                    onClick={() => updateFilter({ page: n })}
                    disabled={n === page}
                    data-testid={`queue-page-${n}`}
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                className="btn btn-outline-success btn-sm fw-semibold"
                onClick={() => updateFilter({ page: Math.min(totalPages, filters.page + 1) })}
                disabled={filters.page >= totalPages || totalPages <= 1}
                data-testid="queue-next"
                style={{ minHeight: 44 }}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};