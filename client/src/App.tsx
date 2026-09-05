import React, { useState } from "react";
import { RequesterProvider, useRequester } from "./context/RequesterContext.js";
import { Header } from "./components/Header.js";
import { RequesterSelector } from "./components/RequesterSelector.js";
import { checkSystem, Category } from "./api.js";

type UiState = "idle" | "loading" | "success" | "error";

function MainContent() {
  const { selectedRequester } = useRequester();
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
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7F6" }}>
      <Header />

      {/* Mandatory modal if no requester selected */}
      {!selectedRequester && <RequesterSelector isOpen={true} />}

      <main className="container py-5" style={{ maxWidth: 640 }}>
        <h1 className="h3 mb-4">
          TokTickIT <span className="text-success">IT Service Desk</span>
        </h1>

        <button className="btn btn-success" onClick={handleCheck} disabled={state === "loading"}>
          {state === "loading" ? "Loading…" : "Check System"}
        </button>

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