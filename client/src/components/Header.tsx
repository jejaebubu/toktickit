import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";

function roleBadgeStyle(role: string): { backgroundColor: string; color: string } {
  switch (role) {
    case "IT_STAFF":
      return { backgroundColor: "#F0F0FF", color: "#4B0082" };
    case "ADMINISTRATOR":
      return { backgroundColor: "#FFF8E6", color: "#B7791F" };
    default:
      return { backgroundColor: "#E6F6FF", color: "#006699" };
  }
}

function roleLabel(role: string): string {
  switch (role) {
    case "IT_STAFF":
      return "IT Staff";
    case "ADMINISTRATOR":
      return "Admin";
    default:
      return "Requester";
  }
}

type ViewId = "create-ticket" | "my-tickets" | "ticket-detail" | "ticket-queue" | "user-management" | "change-password";

interface NavItem {
  id: ViewId;
  label: string;
  matches: ViewId[];
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  REQUESTER: [
    { id: "my-tickets", label: "My Tickets", matches: ["my-tickets", "ticket-detail"] },
    { id: "create-ticket", label: "Create Ticket", matches: ["create-ticket"] },
  ],
  IT_STAFF: [{ id: "ticket-queue", label: "Ticket Queue", matches: ["ticket-queue"] }],
  ADMINISTRATOR: [{ id: "user-management", label: "User Management", matches: ["user-management"] }],
};

interface HeaderProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role] || NAV_BY_ROLE.REQUESTER;
  const badge = roleBadgeStyle(user.role);

  return (
    <header
      className="navbar navbar-expand-lg navbar-dark shadow-sm px-4 py-2"
      style={{ backgroundColor: "#006B3C" }}
    >
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(navItems[0]?.id || "my-tickets");
          }}
        >
          <span className="me-2">🎫</span> TokTickIT
        </a>

        <nav className="d-none d-lg-flex align-items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`btn btn-sm fw-semibold rounded-pill px-3 py-1 ${
                item.matches.includes(activeView)
                  ? "text-white"
                  : "btn-outline-light"
              }`}
              style={
                item.matches.includes(activeView)
                  ? { backgroundColor: "#0B7A46", borderColor: "transparent" }
                  : undefined
              }
              onClick={() => onNavigate(item.id)}
              data-testid={`header-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-light bg-opacity-10 rounded-pill px-3 py-1 text-white border border-white border-opacity-25 d-flex align-items-center gap-2"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            onClick={() => setMenuOpen((o) => !o)}
            data-testid="header-user-menu"
          >
            <span className="small">👤</span>
            <strong className="small d-none d-sm-inline" data-testid="header-user-name">
              {user.name}
            </strong>
            <span
              className="badge fw-semibold px-2 py-1"
              style={{ backgroundColor: badge.backgroundColor, color: badge.color, fontSize: "0.7rem" }}
              data-testid="header-role-badge"
            >
              {roleLabel(user.role)}
            </span>
          </button>

          {menuOpen && (
            <div
              className="position-absolute end-0 mt-2 border rounded-3 shadow-lg overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", minWidth: 180, zIndex: 1000 }}
              data-testid="header-user-dropdown"
            >
              <button
                type="button"
                className="dropdown-item fw-semibold py-2 px-3 text-start w-100"
                style={{ color: "#1F2923" }}
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate("change-password");
                }}
                data-testid="header-change-password-trigger"
              >
                🔑 Change Password
              </button>
              <hr className="m-0" style={{ color: "#EAF6EF" }} />
              <button
                type="button"
                className="dropdown-item fw-semibold py-2 px-3 text-start w-100 text-danger"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                data-testid="header-logout"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export type { ViewId };