import React, { useCallback, useEffect, useState } from "react";
import { RequesterDashboardData, RequesterDashboardTicket, fetchRequesterDashboard } from "../api.js";
import { useAuth } from "../context/AuthContext.js";
import { PriorityBadge, StatusBadge } from "./ui/Badges.js";

export interface RequesterDashboardDrillDown {
  status?: string;
}

export interface RequesterDashboardProps {
  onDrillDown?: (filters: RequesterDashboardDrillDown) => void;
  onOpenTicket?: (ticketId: number) => void;
  onCreateTicket?: () => void;
}

interface RequesterMetricCardConfig {
  key: string;
  label: string;
  icon: string;
  value: number;
  drillDown: RequesterDashboardDrillDown;
  accentBg: string;
  accentText: string;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({
  onDrillDown,
  onOpenTicket,
  onCreateTicket,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<RequesterDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRequesterDashboard();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load requester dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = data?.metrics ?? {
    myOpen: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  const metricCards: RequesterMetricCardConfig[] = [
    {
      key: "my-open",
      label: "My Open Tickets",
      icon: "🎫",
      value: metrics.myOpen,
      drillDown: { status: "Open" },
      accentBg: "#E6FFFA",
      accentText: "#234E52",
    },
    {
      key: "in-progress",
      label: "In Progress",
      icon: "⚙️",
      value: metrics.inProgress,
      drillDown: { status: "In Progress" },
      accentBg: "#FEFCBF",
      accentText: "#975A16",
    },
    {
      key: "resolved",
      label: "Resolved",
      icon: "✅",
      value: metrics.resolved,
      drillDown: { status: "Resolved" },
      accentBg: "#C6F6D5",
      accentText: "#22543D",
    },
    {
      key: "closed",
      label: "Closed",
      icon: "🔒",
      value: metrics.closed,
      drillDown: { status: "Closed" },
      accentBg: "#EDF2F7",
      accentText: "#4A5568",
    },
  ];

  const recentTickets: RequesterDashboardTicket[] = data?.recentTickets ?? [];

  return (
    <section
      className="mb-4"
      style={{ overflowX: "hidden" }}
      data-testid="requester-dashboard"
      aria-label="Requester Support Dashboard"
    >
      {/* Greeting & Header */}
      <div
        className="card border-0 shadow-sm p-4 mb-4"
        style={{ borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
        data-testid="requester-dashboard-header-card"
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2
              className="h4 fw-bold m-0"
              style={{ color: "#1A202C" }}
              data-testid="requester-dashboard-greeting"
            >
              Welcome, <span style={{ color: "#006B3C" }}>{user?.name || "Requester"}</span>!
            </h2>
            <p className="mb-0 mt-1 small" style={{ color: "#6C757D" }}>
              Here&apos;s the latest on your requests.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-success fw-semibold px-3"
            style={{ minHeight: 44, minWidth: 44, borderColor: "#006B3C", color: "#006B3C" }}
            onClick={loadDashboard}
            disabled={isLoading}
            data-testid="requester-dashboard-refresh"
          >
            <span aria-hidden="true" className="me-1">
              🔄
            </span>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between mb-4"
          role="alert"
          data-testid="requester-dashboard-error"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger fw-semibold"
            style={{ minHeight: 44 }}
            onClick={loadDashboard}
            data-testid="requester-dashboard-retry"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !data && (
        <div
          className="card border-0 shadow-sm p-4 mb-4 text-center"
          style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
          data-testid="requester-dashboard-loading"
        >
          <div className="py-3">
            <span className="spinner-border text-success" role="status" aria-hidden="true"></span>
            <p className="mt-2 mb-0 small" style={{ color: "#6C757D" }}>
              Loading your requests summary...
            </p>
          </div>
        </div>
      )}

      {/* 4 Requester Metric Cards Grid */}
      <div
        className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4"
        data-testid="requester-metrics-grid"
      >
        {metricCards.map((card) => (
          <div className="col" key={card.key}>
            <button
              type="button"
              className="card h-100 w-100 text-start border-0 shadow-sm p-3"
              style={{
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                minHeight: 44,
                cursor: "pointer",
              }}
              onClick={() => onDrillDown?.(card.drillDown)}
              data-testid={`requester-metric-card-${card.key}`}
              aria-label={`${card.label}: ${card.value} tickets. Click to view all.`}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  className="badge rounded-pill px-2 py-1 fw-semibold"
                  style={{ backgroundColor: card.accentBg, color: card.accentText }}
                >
                  <span aria-hidden="true" className="me-1">
                    {card.icon}
                  </span>
                  {card.label}
                </span>
              </div>
              <div
                className="fw-bold my-1"
                style={{ fontSize: "32px", lineHeight: 1.15, color: "#1A202C" }}
                data-testid={`requester-metric-value-${card.key}`}
              >
                {card.value}
              </div>
              <div
                className="small fw-semibold mt-auto pt-2 d-flex align-items-center justify-content-between"
                style={{ color: "#006B3C" }}
              >
                <span>View all</span>
                <span aria-hidden="true">→</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Two-Column Content Layout on Desktop */}
      <div className="row g-4">
        {/* Left Column: My Recent Tickets */}
        <div className="col-12 col-lg-8">
          <div
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
            data-testid="requester-recent-tickets-panel"
          >
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h3 className="h5 fw-bold m-0" style={{ color: "#1A202C" }}>
                  <span aria-hidden="true" className="me-2">
                    📋
                  </span>
                  My Recent Tickets
                </h3>
                <small style={{ color: "#6C757D" }}>
                  Your latest 5 support requests
                </small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link fw-semibold text-decoration-none px-2"
                style={{ color: "#006B3C", minHeight: 44 }}
                onClick={() => onDrillDown?.({})}
                data-testid="requester-dashboard-view-all"
              >
                View all <span aria-hidden="true">→</span>
              </button>
            </div>

            {recentTickets.length === 0 ? (
              <div
                className="text-center py-5 px-3 rounded-3"
                style={{ backgroundColor: "#EAF6EF", color: "#1A202C" }}
                data-testid="requester-dashboard-empty"
              >
                <div className="fs-2 mb-2" aria-hidden="true">
                  🎫
                </div>
                <p className="fw-semibold mb-1" style={{ color: "#006B3C" }}>
                  You haven&apos;t submitted any support requests yet.
                </p>
                <p className="small mb-3" style={{ color: "#6C757D" }}>
                  Need help with hardware, software, or network access? Open your first ticket below.
                </p>
                <button
                  type="button"
                  className="btn text-white fw-semibold px-4"
                  style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
                  onClick={() => onCreateTicket?.()}
                  data-testid="requester-empty-create-btn"
                >
                  Submit a new request
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div
                  className="d-none d-md-block overflow-hidden"
                  data-testid="requester-recent-tickets-table-wrapper"
                >
                  <table
                    className="table table-hover align-middle mb-0"
                    data-testid="requester-recent-tickets-table"
                  >
                    <thead style={{ backgroundColor: "#EAF6EF" }}>
                      <tr>
                        <th style={{ color: "#006B3C" }}>Ticket #</th>
                        <th style={{ color: "#006B3C" }}>Title</th>
                        <th style={{ color: "#006B3C" }}>Status</th>
                        <th style={{ color: "#006B3C" }}>Priority</th>
                        <th style={{ color: "#006B3C" }}>Updated</th>
                        <th className="text-end" style={{ color: "#006B3C" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTickets.map((ticket) => {
                        const ticketTitle = ticket.title || ticket.summary || "Untitled Ticket";
                        const priority = ticket.requestedPriority || ticket.itPriority || "MEDIUM";
                        return (
                          <tr
                            key={ticket.id}
                            data-testid={`requester-recent-row-${ticket.id}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => onOpenTicket?.(ticket.id)}
                          >
                            <td className="fw-semibold" style={{ color: "#006B3C" }}>
                              {ticket.ticketNumber}
                            </td>
                            <td style={{ color: "#1A202C" }}>
                              <div className="fw-semibold">{ticketTitle}</div>
                              {ticket.category?.name && (
                                <small style={{ color: "#6C757D" }}>{ticket.category.name}</small>
                              )}
                            </td>
                            <td>
                              <StatusBadge status={ticket.status} />
                            </td>
                            <td>
                              <PriorityBadge priority={priority} kind="requested" />
                            </td>
                            <td className="small" style={{ color: "#6C757D" }}>
                              {formatDateTime(ticket.updatedAt)}
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success fw-semibold"
                                style={{ minHeight: 44, minWidth: 44 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenTicket?.(ticket.id);
                                }}
                                data-testid={`requester-recent-open-${ticket.id}`}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div
                  className="d-md-none d-flex flex-column gap-3"
                  data-testid="requester-recent-tickets-cards"
                >
                  {recentTickets.map((ticket) => {
                    const ticketTitle = ticket.title || ticket.summary || "Untitled Ticket";
                    const priority = ticket.requestedPriority || ticket.itPriority || "MEDIUM";
                    return (
                      <div
                        key={ticket.id}
                        className="card border p-3"
                        style={{ borderRadius: "12px", borderColor: "#E2E8F0" }}
                        data-testid={`requester-recent-card-${ticket.id}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="fw-bold" style={{ color: "#006B3C" }}>
                            {ticket.ticketNumber}
                          </span>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <div className="fw-semibold mb-2" style={{ color: "#1A202C" }}>
                          {ticketTitle}
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <PriorityBadge priority={priority} kind="requested" />
                          <small style={{ color: "#6C757D" }}>
                            {formatDateTime(ticket.updatedAt)}
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success fw-semibold w-100 mt-3"
                          style={{ minHeight: 44 }}
                          onClick={() => onOpenTicket?.(ticket.id)}
                          data-testid={`requester-recent-mobile-open-${ticket.id}`}
                        >
                          Open Ticket
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions Panel */}
        <div className="col-12 col-lg-4">
          <div
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
            data-testid="requester-quick-actions-panel"
          >
            <div className="mb-3 pb-2 border-bottom">
              <h3 className="h5 fw-bold m-0" style={{ color: "#1A202C" }}>
                <span aria-hidden="true" className="me-2">
                  ⚡
                </span>
                Quick Actions
              </h3>
              <small style={{ color: "#6C757D" }}>
                Manage your support requests quickly
              </small>
            </div>

            <div className="d-flex flex-column gap-3">
              <button
                type="button"
                className="btn fw-semibold text-white text-start px-3 py-2 d-flex align-items-center justify-content-between"
                style={{
                  backgroundColor: "#006B3C",
                  borderColor: "#006B3C",
                  minHeight: 44,
                  borderRadius: "10px",
                }}
                onClick={() => onCreateTicket?.()}
                data-testid="requester-quick-action-create-ticket"
              >
                <span>
                  <span aria-hidden="true" className="me-2">
                    ➕
                  </span>
                  + Create Ticket
                </span>
                <span aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="btn fw-semibold text-start px-3 py-2 d-flex align-items-center justify-content-between"
                style={{
                  backgroundColor: "#EAF6EF",
                  color: "#006B3C",
                  borderColor: "#006B3C",
                  minHeight: 44,
                  borderRadius: "10px",
                }}
                onClick={() => onDrillDown?.({})}
                data-testid="requester-quick-action-view-tickets"
              >
                <span>
                  <span aria-hidden="true" className="me-2">
                    📁
                  </span>
                  View My Tickets
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
