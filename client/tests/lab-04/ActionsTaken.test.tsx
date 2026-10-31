import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { ActionsTaken } from "../../src/components/ActionsTaken.js";
import { ActionTaken, ActionTakenUser } from "../../src/api.js";

const staff: ActionTakenUser = { id: 2, name: "Sam Patel", email: "sam@toktickit.com", role: "IT_STAFF", isActive: true };
const admin: ActionTakenUser = { id: 3, name: "Alice Admin", email: "alice@toktickit.com", role: "ADMINISTRATOR", isActive: true };
const requester: ActionTakenUser = { id: 1, name: "Rita Requester", email: "rita@toktickit.com", role: "REQUESTER", isActive: true };

const authStaff = { id: 2, name: "Sam Patel", email: "sam@toktickit.com", role: "IT_STAFF", mustChangePassword: false, isActive: true };
const authRequester = { id: 1, name: "Rita Requester", email: "rita@toktickit.com", role: "REQUESTER", mustChangePassword: false, isActive: true };

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
}

function errRes(status: number, message: string) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve({ message }) });
}

function makeAction(overrides: Partial<ActionTaken> = {}): ActionTaken {
  return {
    id: "act-1",
    ticketId: 201,
    actionDateTime: "2026-10-30T03:30:00.000Z",
    actionDescription: "Replaced the toner cartridge",
    result: "Printed a test page successfully",
    performedById: 2,
    performedBy: staff,
    assigneeId: 2,
    assignee: staff,
    status: "COMPLETED",
    followUpRequired: false,
    followUpNote: null,
    attachmentNotes: null,
    createdAt: "2026-10-30T03:30:00.000Z",
    updatedAt: "2026-10-30T03:30:00.000Z",
    ...overrides,
  };
}

function renderWithAuth(ui: React.ReactNode, user: typeof authStaff | typeof authRequester = authStaff) {
  localStorage.setItem("toktickit_token", "test-token");
  const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
    if (url.includes("/api/auth/me")) return okRes({ user });
    if (url.includes("/api/users/assignable")) return okRes([staff, admin]);
    if (url.includes("/api/tickets/201/actions-taken") && init?.method === "POST") {
      return okRes(makeAction({ id: "act-new", actionDescription: "Replaced toner", result: null, status: "PENDING" }));
    }
    return Promise.reject(new Error("Unhandled URL: " + url));
  });
  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, ...render(<AuthProvider>{ui}</AuthProvider>) };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Actions Taken UI — form validation, read-only requester view, and status controls", () => {
  it("UI-01: toggles the follow-up note field and blocks saving when the required note is empty", async () => {
    const user = userEvent.setup();
    renderWithAuth(<ActionsTaken ticketId={201} actions={[]} />);

    await user.click(await screen.findByTestId("action-add"));
    expect(screen.queryByTestId("action-followup-note")).toBeNull();

    await user.click(screen.getByTestId("action-followup-required"));
    expect(await screen.findByTestId("action-followup-note")).toBeInTheDocument();
    expect(document.querySelector('label[for="action-followup-note"]')).toHaveTextContent("*");

    await user.type(screen.getByTestId("action-description"), "Replaced toner");
    await user.click(screen.getByTestId("action-save"));

    expect(await screen.findByTestId("action-followup-note-error")).toHaveTextContent(/required/i);

    await user.click(screen.getByTestId("action-followup-required"));
    expect(screen.queryByTestId("action-followup-note")).toBeNull();
  });

  it("UI-02: renders the Actions Taken history read-only for a Requester and hides create/edit controls", async () => {
    const { fetchMock } = renderWithAuth(
      <ActionsTaken ticketId={201} actions={[makeAction()]} />,
      authRequester,
    );

    expect(await screen.findByTestId("actions-taken-count")).toHaveTextContent("1");
    expect(screen.getByTestId("action-description-act-1")).toHaveTextContent("Replaced the toner cartridge");
    expect(screen.getByTestId("action-result-act-1")).toHaveTextContent("Printed a test page successfully");
    expect(screen.getByTestId("action-status-act-1")).toHaveTextContent(/Completed/i);

    expect(screen.queryByTestId("action-add")).toBeNull();
    expect(screen.queryByTestId("action-edit-act-1")).toBeNull();
    expect(screen.queryByTestId("action-complete-act-1")).toBeNull();
    expect(screen.queryByTestId("action-cancel-status-act-1")).toBeNull();
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes("/api/users/assignable"))).toBe(false);
  });

  it("UI-06: only lists active IT Staff/Admin assignees, preserves input, and shows the API 422 message", async () => {
    const user = userEvent.setup();
    const inactive: ActionTakenUser = { id: 4, name: "Inactive Ivan", email: "ivan@toktickit.com", role: "IT_STAFF", isActive: false };

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authStaff });
      if (url.includes("/api/users/assignable")) return okRes([staff, admin, inactive, requester]);
      if (url.includes("/api/tickets/201/actions-taken") && init?.method === "POST") {
        return errRes(422, "Assignee must be an active IT Staff or Administrator.");
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem("toktickit_token", "test-token");
    render(<AuthProvider><ActionsTaken ticketId={201} actions={[]} /></AuthProvider>);

    await user.click(await screen.findByTestId("action-add"));
    expect(await screen.findByRole("option", { name: /Sam Patel/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Alice Admin/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Inactive Ivan/ })).toBeNull();
    expect(screen.queryByRole("option", { name: /Rita Requester/ })).toBeNull();

    await user.selectOptions(screen.getByTestId("action-assignee"), "3");
    await user.type(screen.getByTestId("action-description"), "Swap the network switch");
    await user.click(screen.getByTestId("action-save"));

    expect(await screen.findByTestId("action-form-error")).toHaveTextContent(
      "Assignee must be an active IT Staff or Administrator.",
    );
    expect(screen.getByTestId("action-description")).toHaveValue("Swap the network switch");
    expect(screen.getByTestId("action-form")).toBeInTheDocument();

    const postCall = fetchMock.mock.calls.find(
      ([url, init]) => String(url).includes("/api/tickets/201/actions-taken") && (init as RequestInit)?.method === "POST",
    );
    expect(postCall).toBeTruthy();
    expect(JSON.parse(String((postCall?.[1] as RequestInit).body))).toMatchObject({ assigneeId: 3 });
  });

  it("UI-06: Complete/Cancel quick actions persist the new status and hide the final-state controls", async () => {
    const user = userEvent.setup();
    const pending = makeAction({ id: "act-open", status: "PENDING", result: null });

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authStaff });
      if (url.includes("/api/users/assignable")) return okRes([staff, admin]);
      if (url.includes("/api/tickets/201/actions-taken/act-open") && init?.method === "PATCH") {
        return okRes({ ...pending, status: "CANCELLED" });
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem("toktickit_token", "test-token");
    render(<AuthProvider><ActionsTaken ticketId={201} actions={[pending]} /></AuthProvider>);

    await user.click(await screen.findByTestId("action-cancel-status-act-open"));

    await waitFor(() => expect(screen.getByTestId("action-status-act-open")).toHaveTextContent(/Cancelled/i));
    expect(screen.queryByTestId("action-complete-act-open")).toBeNull();
    expect(screen.queryByTestId("action-cancel-status-act-open")).toBeNull();

    const patchCall = fetchMock.mock.calls.find(
      ([url, init]) => String(url).includes("/api/tickets/201/actions-taken/act-open") && (init as RequestInit)?.method === "PATCH",
    );
    expect(JSON.parse(String((patchCall?.[1] as RequestInit).body))).toMatchObject({ status: "CANCELLED" });
  });
});
