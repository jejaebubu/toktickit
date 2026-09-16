import React, { useEffect, useState } from "react";
import { AdminUser, ApiError, createUser, fetchUsers, resetUserPassword, updateUser } from "../api.js";
import { RoleBadge } from "./ui/Badges.js";

const ROLES = ["REQUESTER", "IT_STAFF", "ADMINISTRATOR"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface FormState {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  initialPassword: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", role: "REQUESTER", isActive: true, initialPassword: "" };

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "create" | "edit" | "reset">(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = (q?: { search?: string; role?: string }) => {
    setIsLoading(true);
    setError(null);
    fetchUsers(q)
      .then(setUsers)
      .catch((err: any) => setError(err instanceof ApiError ? err.message : "Failed to fetch users."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const applyFilters = () => {
    setSearch(searchInput.trim());
    load({ search: searchInput.trim() || undefined, role: roleFilter === "ALL" ? undefined : roleFilter });
  };

  const reset = (message?: string) => {
    setModal(null);
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setSearch("");
    setSearchInput("");
    setRoleFilter("ALL");
    load();
    if (message) setNotice(message);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setNotice(null);
    setIsSaving(true);
    try {
      await createUser({ name: form.name, email: form.email, role: form.role, isActive: form.isActive, initialPassword: form.initialPassword });
      reset(`User "${form.name}" created successfully.`);
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to create user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);
    setNotice(null);
    setIsSaving(true);
    try {
      await updateUser(editingUser.id, { name: form.name, email: form.email, role: form.role, isActive: form.isActive });
      reset(`Changes saved for "${form.name}".`);
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (u: AdminUser) => {
    setError(null);
    setNotice(null);
    try {
      await updateUser(u.id, { isActive: !u.isActive });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
      setNotice(`User "${u.name}" ${u.isActive ? "deactivated" : "reactivated"}.`);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to update user.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);
    setNotice(null);
    setIsSaving(true);
    try {
      await resetUserPassword(editingUser.id, form.initialPassword);
      reset(`Password for "${editingUser.name}" has been reset. The user must change it on next sign-in.`);
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to reset password.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, isActive: u.isActive, initialPassword: "" });
    setModal("edit");
  };

  const openReset = (u: AdminUser) => {
    setEditingUser(u);
    setForm(EMPTY_FORM);
    setModal("reset");
  };

  const filtered = users.filter(
    (u) =>
      (roleFilter === "ALL" || u.role === roleFilter) &&
      (!search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }} data-testid="user-mgmt-card">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 border-bottom pb-3 gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark m-0">
            👥 <span style={{ color: "#006B3C" }}>User Management</span>
          </h2>
          <small className="text-muted">Create, edit, and manage accounts for all roles</small>
        </div>
        <button
          className="btn text-white fw-semibold"
          style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }}
          onClick={() => { setModal("create"); setEditingUser(null); setForm(EMPTY_FORM); setFormError(null); }}
          data-testid="user-mgmt-add-btn"
        >
          + Add User
        </button>
      </div>

      {notice && (
        <div className="alert alert-success border-0 shadow-sm" role="alert" data-testid="user-mgmt-notice" style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}>
          ✅ {notice}
        </div>
      )}

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <label htmlFor="user-search" className="form-label fw-semibold text-dark small mb-1">Search Users</label>
          <div className="d-flex gap-2">
            <input
              id="user-search"
              type="search"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              data-testid="user-search-input"
              style={{ minHeight: 44 }}
            />
            <button
              className="btn text-white fw-semibold"
              style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44, whiteSpace: "nowrap" }}
              onClick={applyFilters}
              data-testid="user-search-btn"
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <label htmlFor="user-role-filter" className="form-label fw-semibold text-dark small mb-1">Role</label>
          <select
            id="user-role-filter"
            className="form-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); }}
            data-testid="user-role-filter"
            style={{ minHeight: 44 }}
          >
            <option value="ALL">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-4 d-flex align-items-end">
          <button
            className="btn btn-outline-success fw-semibold"
            style={{ minHeight: 44 }}
            onClick={() => { setSearch(""); setSearchInput(""); setRoleFilter("ALL"); load(); }}
            data-testid="user-clear-filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-5" data-testid="user-mgmt-loading">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading users...
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert" data-testid="user-mgmt-error">
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-5" data-testid={users.length === 0 ? "user-mgmt-empty" : "user-mgmt-no-results"}>
          {users.length === 0 ? (
            <>📌<h5 className="fw-bold text-dark mb-0 mt-2">No users found</h5></>
          ) : (
            <>
              <div className="fs-1 mb-2">🔍</div>
              <h5 className="fw-bold text-dark">No Users Match</h5>
              <p className="text-muted mb-0">Try adjusting your search or role filter.</p>
            </>
          )}
        </div>
      )}

      {/* Desktop table (>= md) */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="d-none d-md-block overflow-hidden">
          <div className="border rounded overflow-hidden">
            <table className="table table-hover align-middle mb-0" data-testid="user-mgmt-table">
              <thead style={{ backgroundColor: "#EAF6EF", color: "#006B3C" }}>
                <tr>
                  <th className="fw-semibold">#</th>
                  <th className="fw-semibold">Name</th>
                  <th className="fw-semibold">Email</th>
                  <th className="fw-semibold">Role</th>
                  <th className="fw-semibold">Status</th>
                  <th className="fw-semibold">Created</th>
                  <th className="fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} data-testid={`user-row-${u.id}`}>
                    <td className="text-muted">{u.id}</td>
                    <td className="fw-semibold text-dark">{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td>
                      <span
                        className={u.isActive ? "text-success fw-semibold" : "text-muted"}
                        data-testid={`user-active-${u.id}`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-muted small">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-outline-success fw-semibold"
                          style={{ minHeight: 44 }}
                          onClick={() => openEdit(u)}
                          data-testid={`user-edit-${u.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary fw-semibold"
                          style={{ minHeight: 44 }}
                          onClick={() => openReset(u)}
                          data-testid={`user-reset-${u.id}`}
                        >
                          Reset Password
                        </button>
                        <button
                          className={`btn btn-sm fw-semibold ${u.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                          style={{ minHeight: 44 }}
                          onClick={() => handleToggleActive(u)}
                          data-testid={`user-toggle-${u.id}`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile cards (< md) */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="d-md-none d-flex flex-column gap-3" data-testid="user-mgmt-cards">
          {filtered.map((u) => (
            <div key={u.id} className="border rounded-3 p-3 shadow-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "#EAF6EF" }} data-testid={`user-card-${u.id}`}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <strong className="text-dark">{u.name}</strong>
                <RoleBadge role={u.role} />
              </div>
              <div className="small text-muted mb-2">{u.email}</div>
              <div className="d-flex flex-wrap gap-1 align-items-center mb-2">
                <span className={u.isActive ? "text-success fw-semibold small" : "text-muted small"}>{u.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-sm btn-outline-success fw-semibold" style={{ minHeight: 44 }} onClick={() => openEdit(u)} data-testid={`user-edit-mobile-${u.id}`}>Edit</button>
                <button className="btn btn-sm btn-outline-secondary fw-semibold" style={{ minHeight: 44 }} onClick={() => openReset(u)} data-testid={`user-reset-mobile-${u.id}`}>Reset Password</button>
                <button className={`btn btn-sm fw-semibold ${u.isActive ? "btn-outline-danger" : "btn-outline-success"}`} style={{ minHeight: 44 }} onClick={() => handleToggleActive(u)} data-testid={`user-toggle-mobile-${u.id}`}>{u.isActive ? "Deactivate" : "Activate"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
          data-testid="user-mgmt-modal"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-dark">
                  {modal === "create" ? "Add New User" : "Edit User"}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => reset()}></button>
              </div>
              <form onSubmit={modal === "create" ? handleCreate : handleSaveEdit} noValidate>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2" role="alert" data-testid="user-form-error">{formError}</div>}
                  <div className="mb-3">
                    <label htmlFor="user-name" className="form-label fw-semibold text-dark small mb-1">Full Name <span className="text-danger">*</span></label>
                    <input
                      id="user-name"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      data-testid="user-name-input"
                      style={{ minHeight: 44 }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="user-email" className="form-label fw-semibold text-dark small mb-1">Email <span className="text-danger">*</span></label>
                    <input
                      id="user-email"
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      data-testid="user-email-input"
                      style={{ minHeight: 44 }}
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="user-role" className="form-label fw-semibold text-dark small mb-1">Role <span className="text-danger">*</span></label>
                      <select
                        id="user-role"
                        className="form-select"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        data-testid="user-role-input"
                        style={{ minHeight: 44 }}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="col-12 col-md-6 d-flex align-items-end">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="user-active"
                          checked={form.isActive}
                          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                          data-testid="user-active-input"
                          style={{ width: 44, height: 22 }}
                        />
                        <label className="form-check-label small fw-semibold text-dark" htmlFor="user-active">Active</label>
                      </div>
                    </div>
                  </div>
                  {modal === "create" && (
                    <div className="mb-3">
                      <label htmlFor="user-password" className="form-label fw-semibold text-dark small mb-1">Initial Password <span className="text-danger">*</span></label>
                      <input
                        id="user-password"
                        type="password"
                        className="form-control"
                        placeholder="Min. 8 characters"
                        value={form.initialPassword}
                        onChange={(e) => setForm({ ...form, initialPassword: e.target.value })}
                        data-testid="user-password-input"
                        style={{ minHeight: 44 }}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={() => reset()} data-testid="user-modal-cancel" style={{ minHeight: 44 }}>Cancel</button>
                  <button type="submit" className="btn text-white fw-semibold" style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }} disabled={isSaving} data-testid="user-modal-save">
                    {isSaving ? "Saving..." : modal === "create" ? "Create User" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {modal === "reset" && editingUser && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
          data-testid="user-reset-modal"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-dark">Reset Password for {editingUser.name}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => reset()}></button>
              </div>
              <form onSubmit={handleResetPassword} noValidate>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2" role="alert" data-testid="user-form-error">{formError}</div>}
                  <div className="mb-3">
                    <label htmlFor="reset-password" className="form-label fw-semibold text-dark small mb-1">New Initial Password <span className="text-danger">*</span></label>
                    <input
                      id="reset-password"
                      type="password"
                      className="form-control"
                      placeholder="Min. 8 characters"
                      value={form.initialPassword}
                      onChange={(e) => setForm({ ...form, initialPassword: e.target.value })}
                      data-testid="user-reset-password-input"
                      style={{ minHeight: 44 }}
                    />
                  </div>
                  <p className="small text-muted mb-0">The user will be required to change this password on their next sign-in.</p>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={() => reset()} data-testid="user-modal-cancel" style={{ minHeight: 44 }}>Cancel</button>
                  <button type="submit" className="btn text-white fw-semibold" style={{ backgroundColor: "#006B3C", borderColor: "#006B3C", minHeight: 44 }} disabled={isSaving} data-testid="user-reset-save">
                    {isSaving ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};