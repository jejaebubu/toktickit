import React, { useState } from "react";
import { RequesterProvider, useRequester } from "./context/RequesterContext.js";
import { Header } from "./components/Header.js";
import { RequesterSelector } from "./components/RequesterSelector.js";
import { CreateTicketForm } from "./components/CreateTicketForm.js";
import { MyTicketsList } from "./components/MyTicketsList.js";
import { TicketDetail } from "./components/TicketDetail.js";
import { checkSystem, Category } from "./api.js";

type UiState = "idle" | "loading" | "success" | "error";

function MainContent() {
  const { selectedRequester } = useRequester();
  const [state, setState] = useState<UiState>("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [openTicketId, setOpenTicketId] = useState<number | null>(null);

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
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7F6" }}>
      <Header />

      {/* Mandatory modal if no requester selected */}
      {!selectedRequester && <RequesterSelector isOpen={true} />}

      <main className="container py-4" style={{ maxWidth: 1200 }}>
        <h1 className="h3 mb-4">
          TokTickIT <span className="text-success">IT Service Desk</span>
        </h1>

        {/* Create Ticket Form (Issue 6) */}
        <CreateTicketForm />

        {/* My Tickets List (Issue 8) */}
        {openTicketId === null ? (
          <MyTicketsList onOpenTicket={(id) => setOpenTicketId(id)} />
        ) : (
          <TicketDetail ticketId={openTicketId} onBack={() => setOpenTicketId(null)} />
        )}

        {/* System Health Check Card (Lab 1 compatibility) */}
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
              <p className="text-success mb-1">System Status: Online</p>
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
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RequesterProvider>
      <MainContent />
    </RequesterProvider>
  );
}