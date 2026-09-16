import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { ApiError } from "../api.js";

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Please enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
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
      await login(email.trim(), password);
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
        setApiError(err.message || "Login failed. Please check your credentials.");
      } else {
        setApiError(err?.message || "Login failed. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#F5F7F6", padding: "1rem" }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: 440, borderRadius: "16px", overflow: "hidden" }}
        data-testid="login-card"
      >
        <div className="text-white text-center px-4 py-4" style={{ backgroundColor: "#006B3C" }}>
          <div className="display-6 mb-1">🎫</div>
          <h1 className="h4 fw-bold m-0">TokTickIT</h1>
          <small style={{ color: "#EAF6EF" }}>IT Service Desk — Sign in to continue</small>
        </div>

        <div className="p-4" style={{ backgroundColor: "#FFFFFF" }}>
          {apiError && (
            <div
              className="alert alert-danger border-0 shadow-sm"
              role="alert"
              data-testid="login-error"
            >
              ⚠️ <strong>Sign-in failed:</strong> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-semibold text-dark">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="login-email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="you@toktickit.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (apiError) setApiError(null);
                }}
                disabled={isSubmitting}
                autoComplete="username"
                data-testid="login-email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="form-label fw-semibold text-dark">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (apiError) setApiError(null);
                  }}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  data-testid="login-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-testid="login-password-toggle"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn text-white fw-bold w-100 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "#006B3C", borderColor: "#006B3C" }}
              disabled={isSubmitting}
              data-testid="login-submit"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};