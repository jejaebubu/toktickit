import React from "react";
import { useRequester } from "../context/RequesterContext.js";
import { RequesterUser } from "../api.js";

interface RequesterSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const RequesterSelector: React.FC<RequesterSelectorProps> = ({
  isOpen = false,
  onClose,
}) => {
  const { selectedRequester, setSelectedRequester, requesters, isLoading, error } = useRequester();

  const handleSelect = (user: RequesterUser) => {
    setSelectedRequester(user);
    if (onClose) onClose();
  };

  const showModal = isOpen || !selectedRequester;

  if (!showModal) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="requesterSelectorModalTitle"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", backdropFilter: "blur(4px)" }}
      data-testid="requester-selector-modal"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px", overflow: "hidden" }}>
          {/* Header with Zen Green Theme */}
          <div
            className="modal-header text-white border-0 px-4 py-3"
            style={{ backgroundColor: "#006B3C" }}
          >
            <div>
              <h5 className="modal-title fw-bold m-0" id="requesterSelectorModalTitle">
                👤 Development Requester Selector
              </h5>
              <small style={{ color: "#EAF6EF" }}>
                Select a simulated requester user context for testing Lab 2 MVP
              </small>
            </div>
            {selectedRequester && onClose && (
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            )}
          </div>

          <div className="modal-body p-4" style={{ backgroundColor: "#F5F7F6" }}>
            {!selectedRequester && (
              <div
                className="alert border-0 shadow-sm mb-4"
                style={{ backgroundColor: "#EAF6EF", color: "#006B3C", borderRadius: "12px" }}
              >
                <div className="d-flex align-items-center">
                  <span className="fs-4 me-2">⚠️</span>
                  <div>
                    <strong>Requester Context Required:</strong> Please select a simulated user below to access ticket management.
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading requesters...</span>
                </div>
                <p className="mt-2 text-muted">Fetching active requesters list...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger border-0 shadow-sm" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!isLoading && !error && requesters.length === 0 && (
              <div className="text-center py-4 text-muted">
                No active requesters found in the database. Please run seed script (`npm run prisma:seed`).
              </div>
            )}

            {!isLoading && !error && requesters.length > 0 && (
              <div className="row g-3">
                {requesters.map((user) => {
                  const isCurrent = selectedRequester?.id === user.id;
                  return (
                    <div className="col-12 col-md-6" key={user.id}>
                      <div
                        className={`card h-100 border-2 transition-all ${
                          isCurrent ? "shadow-sm" : ""
                        }`}
                        style={{
                          borderRadius: "12px",
                          borderColor: isCurrent ? "#006B3C" : "#E2E8F0",
                          backgroundColor: isCurrent ? "#EAF6EF" : "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelect(user)}
                        data-testid={`requester-card-${user.id}`}
                      >
                        <div className="card-body p-3 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                              style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: isCurrent ? "#006B3C" : "#0B7A46",
                                fontSize: "1.1rem",
                              }}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold text-dark">{user.name}</h6>
                              <p className="mb-0 text-muted small">{user.email}</p>
                            </div>
                          </div>

                          <div>
                            {isCurrent ? (
                              <span className="badge bg-success px-3 py-2 rounded-pill">
                                Selected
                              </span>
                            ) : (
                              <button
                                className="btn btn-outline-success btn-sm px-3 rounded-pill fw-semibold"
                                style={{ borderColor: "#006B3C", color: "#006B3C" }}
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-footer border-0 px-4 py-3 bg-white">
            <div className="w-100 d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                Current User:{" "}
                <strong className="text-dark">
                  {selectedRequester ? `${selectedRequester.name} (${selectedRequester.email})` : "None Selected"}
                </strong>
              </span>
              {selectedRequester && onClose && (
                <button className="btn btn-secondary btn-sm px-3" onClick={onClose}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
