import React from "react";

const STATUS_COLORS: Record<string, { backgroundColor: string; color: string }> = {
  New: { backgroundColor: "#EBF8FF", color: "#2B6CB0" },
  Open: { backgroundColor: "#E6FFFA", color: "#234E52" },
  "In Progress": { backgroundColor: "#FEFCBF", color: "#975A16" },
  "Waiting for Requester": { backgroundColor: "#EBF4FF", color: "#4C51BF" },
  Resolved: { backgroundColor: "#C6F6D5", color: "#22543D" },
  Closed: { backgroundColor: "#EDF2F7", color: "#4A5568" },
  Reopened: { backgroundColor: "#FED7D7", color: "#9B2C2C" },
  Cancelled: { backgroundColor: "#FFF2E5", color: "#C2410C" },
};

const ROLE_COLORS: Record<string, { backgroundColor: string; color: string }> = {
  REQUESTER: { backgroundColor: "#E6F6FF", color: "#006699" },
  IT_STAFF: { backgroundColor: "#F0F0FF", color: "#4B0082" },
  ADMINISTRATOR: { backgroundColor: "#FFF8E6", color: "#B7791F" },
};

const ROLE_LABELS: Record<string, string> = {
  REQUESTER: "Requester",
  IT_STAFF: "IT Staff",
  ADMINISTRATOR: "Admin",
};

const PRIORITY_COLORS: Record<string, { backgroundColor: string; color: string }> = {
  URGENT: { backgroundColor: "#FEE4E2", color: "#D92D20" },
  HIGH: { backgroundColor: "#FEF0C7", color: "#B54708" },
  MEDIUM: { backgroundColor: "#EAF6EF", color: "#0B7A46" },
  LOW: { backgroundColor: "#F0F4F2", color: "#6B7280" },
};

export function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[\s_]+/g, "-");
}

interface BadgeProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
  children: React.ReactNode;
}

function Badge({ className = "", style, testId, children }: BadgeProps): React.ReactElement {
  return (
    <span
      className={`badge rounded-pill fw-semibold px-2 py-1 ${className}`}
      style={{ fontSize: "0.78rem", ...style }}
      data-testid={testId}
    >
      {children}
    </span>
  );
}

export const StatusBadge: React.FC<{ status: string; testId?: string }> = ({ status, testId }) => {
  const colors = STATUS_COLORS[status] || { backgroundColor: "#EAF6EF", color: "#006B3C" };
  return (
    <Badge style={colors} testId={testId || `badge-status-${normalizeToken(status)}`}>
      {status}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: string; kind?: "requested" | "it"; testId?: string }> = ({
  priority,
  kind = "requested",
  testId,
}) => {
  const colors = PRIORITY_COLORS[priority.toUpperCase()] || { backgroundColor: "#F0F4F2", color: "#6B7280" };
  return (
    <Badge style={colors} testId={testId || `badge-priority-${kind}-${normalizeToken(priority)}`}>
      {priority}
    </Badge>
  );
};

export const RoleBadge: React.FC<{ role: string; testId?: string }> = ({ role, testId }) => {
  const colors = ROLE_COLORS[role] || { backgroundColor: "#E6F6FF", color: "#006699" };
  return (
    <Badge style={colors} testId={testId || `badge-role-${normalizeToken(role)}`}>
      {ROLE_LABELS[role] || role}
    </Badge>
  );
};

export { ROLE_LABELS, ROLE_COLORS, STATUS_COLORS, PRIORITY_COLORS };