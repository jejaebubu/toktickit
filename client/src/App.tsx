import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { Header, ViewId } from "./components/Header.js";
import { CreateTicketForm } from "./components/CreateTicketForm.js";
import { MyTicketsList } from "./components/MyTicketsList.js";
import { TicketDetail } from "./components/TicketDetail.js";
import { StaffTicketQueue } from "./components/StaffTicketQueue.js";
import { StaffTicketDetail } from "./components/StaffTicketDetail.js";
import { UserManagement } from "./components/UserManagement.js";
import { LoginScreen } from "./screens/LoginScreen.js";
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen.js";
import { checkSystem, Category } from "./api.js";

type UiState = "idle" | "loading" | "success" | "error";

const ROLE_VIEW: Record<string, ViewId> = {
  REQUESTER: "my-tickets",
  IT_STAFF: "ticket-queue",
  ADMINISTRATOR: "user-management",
};

function SystemHealthCard() {
  const [state, setState] = useState<UiState>("idle");
  const [categories, setCategories] = useState<Category[]>([]);

  async function handleCheck() {
    setState("loading");
    try {
      const result = await checkSystem();
      setCategories(result.categories);
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}>
      <h2 className="h5 fw-bold text-dark mb-2">🔍 System Health & Connectivity</h2>
      <p className="text-muted small mb-3">Verify API backend connectivity and category initialization.</p>
      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={handleCheck} disabled={state === "loading"}>
          {state === "loading" ? "Loading…" : "Check System"}
        </button>
      </div>

      {state === "success" && (
        <div className="mt-3">
          <p className="text-success mb-1" data-testid="system-status">
            System Status: Online
          </p>
          <h2 className="h6 mb-2">Supported Request Categories:</h2>
          <ul className="list-group">
            {categories.map((category) => (
              <li key={category.id} className="list-group-item">
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state === "error" && (
        <div className="alert alert-danger mt-3" role="alert">
          System Offline — could not reach the TokTickIT API. Try again later.
        </div>
      )}
    </div>
  );
}

interface RequesterViewsProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

function RequesterViews({ activeView, onNavigate }: RequesterViewsProps): React.ReactElement {
  const [openTicketId, setOpenTicketId] = useState<number | null>(null);
  const [ticketListRefreshKey, setTicketListRefreshKey] = useState(0);

  const handleTicketOpen = (id: number) => setOpenTicketId(id);
  const handleTicketBack = () => setOpenTicketId(null);
  const handleNavigate = (view: ViewId) => {
    onNavigate(view);
    setOpenTicketId(null);
  };

  return (
    <>
      {activeView === "create-ticket" && openTicketId === null && (
        <CreateTicketForm onCreated={() => setTicketListRefreshKey((k) => k + 1)} />
      )}
      {openTicketId !== null ? (
        <TicketDetail ticketId={openTicketId} onBack={handleTicketBack} />
      ) : (
        activeView === "my-tickets" && (
          <MyTicketsList refreshKey={ticketListRefreshKey} onOpenTicket={handleTicketOpen} />
        )
      )}
      <SystemHealthCard />
    </>
  );
}

function TicketQueueSpotlight(): React.ReactElement {
  const [openTicketId, setOpenTicketId] = useState<number | null>(null);

  if (openTicketId !== null) {
    return <StaffTicketDetail ticketId={openTicketId} onBack={() => setOpenTicketId(null)} />;
  }

  return <StaffTicketQueue onOpenTicket={setOpenTicketId} />;
}

function UserManagementSpotlight(): React.ReactElement {
  return <UserManagement />;
}

function Shell(): React.ReactElement {
  const { user } = useAuth();
  const defaultView = ROLE_VIEW[user!.role] || "my-tickets";
  const [activeView, setActiveView] = useState<ViewId>(() => defaultView);

  const navigate = (view: ViewId) => {
    setActiveView(view);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7F6" }}>
      <Header activeView={activeView} onNavigate={navigate} />

      <main className="container py-4" style={{ maxWidth: 1200 }}>
        {activeView === "change-password" ? (
          <ChangePasswordScreen embedded onComplete={() => navigate(defaultView)} />
        ) : (
          <>
            <h1 className="h3 mb-4">
              TokTickIT <span className="text-success">IT Service Desk</span>
            </h1>

            {user!.role === "REQUESTER" && <RequesterViews activeView={activeView} onNavigate={navigate} />}
            {user!.role === "IT_STAFF" && <TicketQueueSpotlight />}
            {user!.role === "ADMINISTRATOR" && <UserManagementSpotlight />}
          </>
        )}
      </main>
    </div>
  );
}

function AppShell(): React.ReactElement {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "#F5F7F6" }}
        data-testid="app-bootstrapping"
      >
        <div className="text-center text-muted">
          <span className="spinner-border text-success" role="status" aria-hidden="true"></span>
          <p className="mt-2 mb-0">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (user.mustChangePassword) {
    return <ChangePasswordScreen />;
  }

  return <Shell />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}