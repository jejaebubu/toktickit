import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";

interface ChangePasswordScreenProps {
  embedded?: boolean;
  onComplete?: () => void;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ embedded = false, onComplete }) => {
  const { changePassword, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumberOrSymbol = /\d|[^A-Za-z0-9]/.test(newPassword);
  const checklistPassed = hasMinLength && hasUpper && hasLower && hasNumberOrSymbol;

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const liveConfirmError =
    confirmPassword.length > 0 && !passwordsMatch ? "New password and confirmation do not match." : undefined;
  const canSubmit = !isSubmitting && currentPassword.length > 0 && checklistPassed && passwordsMatch;

  const validate = (): boolean => {
    const next: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) {
      next.current = "Current password is required.";
    }
    if (!checklistPassed) {
      next.new = "New password does not meet the required criteria yet.";
    }
    if (!passwordsMatch) {
      next.confirm = "New password and confirmation do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      onComplete?.();
    } catch (err: any) {
      setApiError(err?.message || "Failed to change password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checklist = [
    { label: "At least 8 characters", met: hasMinLength },
    { label: "Contains an uppercase letter", met: hasUpper },
    { label: "Contains a lowercase letter", met: hasLower },
    { label: "Contains a number or special symbol", met: hasNumberOrSymbol },
  ];

return (
    <div
      className={embedded ? "d-flex justify-content-center py-4" : "d-flex align-items-center justify-content-center"}
      style={!embedded ? { minHeight: "100vh", backgroundColor: "#F5F7F6", padding: "1rem" } : undefined}
      data-testid="change-password-card"
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: 480, borderRadius: "16px", overflow: "hidden" }}
      >
        <div className="text-white px-4 py-4" style={{ backgroundColor: "#006B3C" }}>
          <h1 className="h5 fw-bold m-0">🔒 Mandatory Password Change</h1>
        </div>

        <div className="p-4" style={{ backgroundColor: "#FFFFFF" }}>
          <div
            className="alert border-0 shadow-sm"
            role="alert"
            style={{ backgroundColor: "#FFF4E5", color: "#7A4E00", borderRadius: "12px" }}
            data-testid="change-password-warning"
          >
            <strong>You must change your password to continue.</strong>
            <div className="small mt-1">
              This is required before you can access any application features.
            </div>
          </div>

          {apiError && (
            <div
              className="alert alert-danger border-0 shadow-sm"
              role="alert"
              data-testid="change-password-error"
            >
              ⚠️ <strong>Error:</strong> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="change-current" className="form-label fw-semibold text-dark">
                Current Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="change-current"
                className={`form-control ${errors.current ? "is-invalid" : ""}`}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                data-testid="change-password-current"
              />
              {errors.current && <div className="invalid-feedback">{errors.current}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="change-new" className="form-label fw-semibold text-dark">
                New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="change-new"
                className={`form-control ${errors.new ? "is-invalid" : ""}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
                data-testid="change-password-new"
              />
              {errors.new && <div className="invalid-feedback">{errors.new}</div>}
            </div>

            <div
              className="border rounded-3 p-3 mb-3"
              style={{ backgroundColor: "#F5F7F6" }}
              data-testid="change-password-checklist"
            >
              <div className="fw-semibold text-dark small mb-2">Password requirements:</div>
              <ul className="list-unstyled mb-0">
                {checklist.map((item) => (
                  <li key={item.label} className="small mb-1">
                    <span data-testid={item.met ? "checklist-met" : "checklist-unmet"}>{item.met ? "✅" : "⬜"}</span>{" "}
                    <span style={{ color: item.met ? "#006B3C" : "#6C757D" }}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <label htmlFor="change-confirm" className="form-label fw-semibold text-dark">
                Confirm New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="change-confirm"
                className={`form-control ${errors.confirm || liveConfirmError ? "is-invalid" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
                data-testid="change-password-confirm"
              />
              {(liveConfirmError || errors.confirm) && (
                <div className="invalid-feedback" data-testid="change-password-mismatch">
                  {liveConfirmError || errors.confirm}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn text-white fw-bold w-100 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "#006B3C", borderColor: "#006B3C" }}
              disabled={!canSubmit}
              data-testid="change-password-submit"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving...</span>
                </>
              ) : (
                "Save New Password"
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link btn-sm fw-semibold"
              onClick={logout}
              data-testid="change-password-logout"
            >
              Sign out instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};