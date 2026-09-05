import React, { useState } from "react";
import { useRequester } from "../context/RequesterContext.js";
import { RequesterSelector } from "./RequesterSelector.js";

export const Header: React.FC = () => {
  const { selectedRequester } = useRequester();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <>
      <header
        className="navbar navbar-expand-lg navbar-dark shadow-sm px-4 py-2"
        style={{ backgroundColor: "#006B3C" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white" href="/">
            <span className="me-2">🎫</span> Service Desk
            <span
              className="badge ms-2 fs-6 fw-normal px-2 py-1"
              style={{ backgroundColor: "#0B7A46", color: "#EAF6EF" }}
            >
              Requester MVP
            </span>
          </a>

          <div className="d-flex align-items-center">
            {selectedRequester ? (
              <div className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1 text-white border border-white border-opacity-25">
                <span className="me-2 small">👤 Active Requester:</span>
                <strong className="me-3 small" data-testid="active-requester-name">
                  {selectedRequester.name}
                </strong>
                <button
                  className="btn btn-sm btn-light text-success fw-bold px-2 py-0 rounded-pill fs-7"
                  onClick={() => setIsSelectorOpen(true)}
                  style={{ backgroundColor: "#EAF6EF", borderColor: "transparent" }}
                >
                  Switch User
                </button>
              </div>
            ) : (
              <button
                className="btn btn-warning btn-sm fw-bold px-3 rounded-pill shadow-sm"
                onClick={() => setIsSelectorOpen(true)}
              >
                ⚠️ Select Requester User
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Requester Selector Modal when triggered */}
      {isSelectorOpen && (
        <RequesterSelector isOpen={true} onClose={() => setIsSelectorOpen(false)} />
      )}
    </>
  );
};
