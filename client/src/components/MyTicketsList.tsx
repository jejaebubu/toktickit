import React, { useEffect, useState } from "react";
import {
  Category,
  TicketListItem,
  TicketsPage,
  fetchCategories,
  fetchMyTickets,
} from "../api.js";
import { useRequester } from "../context/RequesterContext.js";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUS_OPTIONS = ["New", "In Progress", "Resolved", "Closed", "Rejected"];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "ticketNumber", label: "Ticket Number" },
  { value: "summary", label: "Summary" },
  { value: "requestedPriority", label: "Priority" },
  { value: "status", label: "Status" },
];

interface FilterState {
  search: string;
  categoryId: number | "";
  priority: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categoryId: "",
  priority: "",
  status: "",
  sort: "createdAt",
  order: "desc",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function priorityColor(priority: string): string {
  switch (priority) {
    case "URGENT":
      return "#D92D20";
    case "HIGH":
      return "#F79009";
    case "MEDIUM":
      return "#0B7A46";
    default:
      return "#6B7280";
  }
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

function getPageItems(current: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(current - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
}

interface MyTicketsListProps {
  onOpenTicket?: (ticketId: number) => void;
}

export const MyTicketsList: React.FC<MyTicketsListProps> = ({ onOpenTicket }) => {
  const { selectedRequester } = useRequester();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<TicketsPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!selectedRequester) {
      setData(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchMyTickets(
      {
        search: filters.search,
        category: filters.categoryId || undefined,
        priority: filters.priority || undefined,
        status: filters.status || undefined,
        sort: filters.sort,
        order: filters.order,
        page,
      },
      selectedRequester.id
    )
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setData(null);
          setError(err?.message || "Failed to load your tickets.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRequester?.id, filters, page]);

  const updateFilter = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput.trim() });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.categoryId !== "" ||
    filters.priority !== "" ||
    filters.status !== "";

  const meta = data?.meta;
  const tickets = data?.tickets ?? [];
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;
  const metaPage = meta?.page ?? 1;
  const metaLimit = meta?.limit ?? 10;
  const showingStart = total === 0 ? 0 : (metaPage - 1) * metaLimit + 1;
  const showingEnd = total === 0 ? 0 : Math.min(metaPage * metaLimit, total);

  if (!selectedRequester) {
    return null;
  }

  return (
    <div
      className="card border-0 shadow-sm p-4 mb-4"
      style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
      data-testid="my-tickets-card"
    >
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
        <div>
          <h2 className="h4 fw-bold text-dark m-0">
            🎫 My <span style={{ color: "#006B3C" }}>Tickets</span>
          </h2>
          <small className="text-muted">
            All your IT requests for: <strong>{selectedRequester.name}</strong>
          </small>
        </div>
      </div>

      {/* Search + Filters (ui-spec 3.3) */}
      <form onSubmit={applySearch} className="row g-2 mb-3" noValidate>
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Ticket No. or Summary..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            data-testid="my-tickets-search"
          />
        </div>
        <div className="col-12 col-md-2">
          <button
            type="submit"
            className="btn text-white fw-semibold w-100"
            style={{ backgroundColor: "#006B3C", borderColor: "#006B3C" }}
            data-testid="my-tickets-search-btn"
          >
            Search
          </button>
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={filters.categoryId}
            onChange={(e) => updateFilter({ categoryId: e.target.value ? Number(e.target.value) : "" })}
            data-testid="my-tickets-filter-category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => updateFilter({ priority: e.target.value })}
            data-testid="my-tickets-filter-priority"
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => updateFilter({ status: e.target.value })}
            data-testid="my-tickets-filter-status"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Sort + Order */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <label htmlFor="my-tickets-sort" className="form-label fw-semibold text-dark m-0">
          Sort by
        </label>
        <select
          id="my-tickets-sort"
          className="form-select w-auto"
          value={filters.sort}
          onChange={(e) => updateFilter({ sort: e.target.value })}
          data-testid="my-tickets-sort"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline-success btn-sm fw-bold"
          onClick={() => updateFilter({ order: filters.order === "asc" ? "desc" : "asc" })}
          data-testid="my-tickets-order-toggle"
          aria-label="Toggle sort order"
        >
          {filters.order === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-5" data-testid="my-tickets-loading">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading your tickets...
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="my-tickets-error">
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && total === 0 && (
        <div className="text-center py-5" data-testid={hasActiveFilters ? "my-tickets-no-results" : "my-tickets-empty"}>
          {hasActiveFilters ? (
            <>
              <div className="fs-1 mb-2">🔍</div>
              <h5 className="fw-bold text-dark">No Tickets Match</h5>
              <p className="text-muted mb-0">
                No tickets match your search or filters. Try adjusting your criteria.
              </p>
            </>
          ) : (
            <>
              <div className="fs-1 mb-2">📭</div>
              <h5 className="fw-bold text-dark">No Tickets Yet</h5>
              <p className="text-muted mb-0">
                You haven't created any tickets yet. Use the Create Ticket form above to submit your first request.
              </p>
            </>
          )}
        </div>
      )}

      {!isLoading && !error && total > 0 && (
        <>
          {/* Desktop table (>= md) */}
          <div className="d-none d-md-block overflow-hidden">
            <div className="border rounded overflow-hidden">
              <table className="table table-hover align-middle mb-0" data-testid="my-tickets-table">
                <thead style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}>
                  <tr>
                    <th className="fw-semibold">Ticket No.</th>
                    <th className="fw-semibold">Created Date</th>
                    <th className="fw-semibold">Summary</th>
                    <th className="fw-semibold">Category</th>
                    <th className="fw-semibold">Requested Priority</th>
                    <th className="fw-semibold">Status</th>
                    <th className="fw-semibold">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => onOpenTicket?.(t.id)}
                      style={{ cursor: onOpenTicket ? "pointer" : "default" }}
                      data-testid={`my-tickets-row-${t.id}`}
                    >
                      <td className="fw-semibold text-success" style={{ whiteSpace: "nowrap" }}>
                        {t.ticketNumber}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(t.createdAt)}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: 260 }}
                        title={t.summary}
                      >
                        {t.summary}
                      </td>
                      <td>{t.categoryName}</td>
                      <td>
                        <span
                          className="badge fw-semibold"
                          style={{
                            backgroundColor: "#F0F4F2",
                            color: priorityColor(t.requestedPriority),
                          }}
                        >
                          {t.requestedPriority}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge fw-semibold"
                          style={{
                            backgroundColor: "#EAF6EF",
                            color: statusColor(t.status),
                          }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(t.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards (< md) */}
          <div className="d-md-none d-flex flex-column gap-3" data-testid="my-tickets-cards">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="border rounded-3 p-3 shadow-sm"
                style={{ backgroundColor: "#F5F7F6", borderColor: "#EAF6EF", cursor: onOpenTicket ? "pointer" : "default" }}
                onClick={() => onOpenTicket?.(t.id)}
                data-testid={`my-tickets-card-${t.id}`}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <strong className="text-success">{t.ticketNumber}</strong>
                  <span
                    className="badge fw-semibold"
                    style={{ backgroundColor: "#EAF6EF", color: statusColor(t.status) }}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="fw-semibold text-dark mb-1" style={{ wordBreak: "break-word" }}>
                  {t.summary}
                </div>
                <div className="small text-muted">
                  {formatDate(t.createdAt)} · {t.categoryName} ·{" "}
                  <span style={{ color: priorityColor(t.requestedPriority), fontWeight: 600 }}>
                    Priority: {t.requestedPriority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination + totals */}
          <div className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-2">
            <small className="text-muted" data-testid="my-tickets-total">
              Showing {showingStart}–{showingEnd} of {total} ticket{total === 1 ? "" : "s"}
            </small>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-success btn-sm fw-semibold"
                onClick={() => setPage((p) => Math.min(Math.max(1, p - 1), totalPages))}
                disabled={page <= 1 || totalPages <= 1}
                data-testid="my-tickets-prev"
              >
                ← Prev
              </button>
              {totalPages > 1 &&
                getPageItems(page, totalPages).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`btn btn-sm fw-semibold ${
                      n === page
                        ? "text-white"
                        : "btn-outline-success"
                    }`}
                    style={n === page ? { backgroundColor: "#006B3C", borderColor: "#006B3C" } : undefined}
                    onClick={() => setPage(n)}
                    disabled={n === page}
                    data-testid={`my-tickets-page-${n}`}
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                className="btn btn-outline-success btn-sm fw-semibold"
                onClick={() => setPage((p) => Math.min(Math.max(1, p + 1), totalPages))}
                disabled={page >= totalPages || totalPages <= 1}
                data-testid="my-tickets-next"
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