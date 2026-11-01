import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../src/context/AuthContext.js";
import { StaffTicketDetail } from "../../src/components/StaffTicketDetail.js";
import { TicketDetail } from "../../src/components/TicketDetail.js";
import { ActionTaken, ActionTakenUser, TicketDetail as TicketDetailData } from "../../src/api.js";

const staffUser: ActionTakenUser = {
  id: 2,
  name: "Sam Patel",
  email: "sam@toktickit.com",
  role: "IT_STAFF",
  isActive: true,
};

const authStaff = {
  id: 2,
  name: "Sam Patel",
  email: "sam@toktickit.com",
  role: "IT_STAFF",
  mustChangePassword: false,
  isActive: true,
};

const authRequester = {
  id: 1,
  name: "Jennifer Anderson",
  email: "jennifer@toktickit.com",
  role: "REQUESTER",
  mustChangePassword: false,
  isActive: true,
};

function okRes(data: unknown) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
}

function errRes(status: number, body: Record<string, unknown>) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) });
}

function makeAction(overrides: Partial<ActionTaken> = {}): ActionTaken {
  return {
    id: "act-1",
    ticketId: 201,
    actionDateTime: "2026-10-30T03:30:00.000Z",
    actionDescription: "Inspect power supply unit",
    result: null,
    performedById: 2,
    performedBy: staffUser,
    assigneeId: 2,
    assignee: staffUser,
    status: "PENDING",
    followUpRequired: false,
    followUpNote: null,
    attachmentNotes: null,
    createdAt: "2026-10-30T03:30:00.000Z",
    updatedAt: "2026-10-30T03:30:00.000Z",
    ...overrides,
  };
}

function makeTicket(overrides: Partial<TicketDetailData> = {}): TicketDetailData {
  return {
    id: 201,
    ticketNumber: "TKT-2026-000201",
    summary: "Workstation fails to boot",
    description: "Power LED blinks amber when pressing power button.",
    requestedPriority: "HIGH",
    itPriority: "HIGH",
    status: "In Progress",
    createdAt: "2026-10-30T01:00:00.000Z",
    updatedAt: "2026-10-30T02:00:00.000Z",
    requesterId: 1,
    requesterIndicatedResolved: false,
    requester: { id: 1, name: "Jennifer Anderson", email: "jennifer@toktickit.com" },
    owner: { id: 2, name: "Sam Patel", email: "sam@toktickit.com" },
    category: { id: 1, name: "Hardware" },
    relatedSystem: { id: 3, name: "Corporate Laptop" },
    attachments: [],
    publicComments: [],
    internalNotes: [],
    actionsTaken: [],
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("toktickit_token", "test-token");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Ticket Workflow & Resolution Gate UI (UI-03, UI-07)", () => {
  it("UI-03: renders only allowed status transitions per the Transition Matrix and shows the advisory indicator when Requester indicated resolved", async () => {
    const newTicket = makeTicket({
      status: "New",
      requesterIndicatedResolved: true,
    });

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authStaff });
      if (url.includes("/api/users/assignable")) return okRes([staffUser]);
      if (url.includes("/api/tickets/201/comments")) return okRes([]);
      if (url.includes("/api/tickets/201/internal-notes")) return okRes([]);
      if (url.includes("/api/tickets/201")) return okRes(newTicket);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthProvider>
        <StaffTicketDetail ticketId={201} onBack={vi.fn()} />
      </AuthProvider>,
    );

    const statusSelect = await screen.findByTestId("detail-status-select");
    const optionValues = within(statusSelect)
      .getAllByRole("option")
      .map((opt) => (opt as HTMLOptionElement).value);

    // From "New", only "New" (current), "Open", and "Cancelled" are present
    expect(optionValues).toEqual(["New", "Open", "Cancelled"]);
    expect(optionValues).not.toContain("Closed");
    expect(optionValues).not.toContain("Resolved");

    // Workflow Action Bar shows only Open and Cancelled buttons, with Cancelled styled as btn-outline-danger
    const actionBar = screen.getByTestId("workflow-action-bar");
    expect(within(actionBar).getByTestId("workflow-transition-open")).toBeInTheDocument();
    const cancelBtn = within(actionBar).getByTestId("workflow-transition-cancelled");
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveClass("btn-outline-danger");
    expect(within(actionBar).queryByTestId("workflow-resolve-btn")).toBeNull();

    // Advisory banner is visible on non-terminal ticket
    expect(screen.getByTestId("detail-resolved-intent")).toHaveTextContent(
      /Requester indicated problem resolved - Pending Staff Review/i,
    );
  });

  it("UI-03b: Requester can click 'My problem is resolved', confirm the prompt, and see the advisory badge while ticket status stays unchanged", async () => {
    const user = userEvent.setup();
    const initialTicket = makeTicket({ status: "In Progress", requesterIndicatedResolved: false });

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authRequester });
      if (url.includes("/api/tickets/201") && init?.method === "PATCH") {
        return okRes({ ...initialTicket, requesterIndicatedResolved: true, status: "In Progress" });
      }
      if (url.includes("/api/tickets/201")) return okRes(initialTicket);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthProvider>
        <TicketDetail ticketId={201} onBack={vi.fn()} />
      </AuthProvider>,
    );

    const indicateBtn = await screen.findByTestId("requester-indicate-resolved-btn");
    expect(indicateBtn).toHaveTextContent(/My problem is resolved/i);

    await user.click(indicateBtn);
    const confirmBox = await screen.findByTestId("requester-indicate-resolved-confirm-box");
    expect(confirmBox).toHaveTextContent(
      /This will notify IT Staff that your issue is resolved\. IT Staff will verify and officially close the ticket\./i,
    );

    await user.click(screen.getByTestId("requester-indicate-resolved-confirm"));

    const advisory = await screen.findByTestId("requester-resolved-advisory");
    expect(advisory).toHaveTextContent(/Requester indicated problem resolved - Pending Staff Review/i);
    expect(screen.getByTestId("detail-status")).toHaveTextContent("In Progress");
  });

  it("UI-07: displays open-actions warning on Resolve, opens confirmation modal, and preserves status when backend returns 409 UNRESOLVED_ACTIONS_EXIST", async () => {
    const user = userEvent.setup();
    const ticketWithOpenActions = makeTicket({
      status: "In Progress",
      actionsTaken: [
        makeAction({ id: "act-pending", status: "PENDING", actionDescription: "Run memory diagnostics" }),
        makeAction({ id: "act-progress", status: "IN_PROGRESS", actionDescription: "Reseat RAM modules" }),
      ],
    });

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authStaff });
      if (url.includes("/api/users/assignable")) return okRes([staffUser]);
      if (url.includes("/api/tickets/201/comments")) return okRes([]);
      if (url.includes("/api/tickets/201/internal-notes")) return okRes([]);
      if (url.includes("/api/tickets/201") && init?.method === "PATCH") {
        return errRes(409, {
          error: "Conflict",
          code: "UNRESOLVED_ACTIONS_EXIST",
          unresolvedCount: 2,
          message:
            "Cannot resolve ticket while 2 action(s) are still open (PENDING or IN_PROGRESS). Complete or cancel them before resolving the ticket.",
        });
      }
      if (url.includes("/api/tickets/201")) return okRes(ticketWithOpenActions);
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthProvider>
        <StaffTicketDetail ticketId={201} onBack={vi.fn()} />
      </AuthProvider>,
    );

    const resolveBtn = await screen.findByTestId("workflow-resolve-btn");
    expect(resolveBtn).toHaveTextContent(/2 action\(s\) still open/i);
    expect(screen.getByTestId("resolution-gate-warning")).toHaveTextContent(/2 action\(s\) still open/i);

    // Clicking Resolve opens the confirmation modal instead of immediately calling PATCH
    await user.click(resolveBtn);
    const modal = await screen.findByTestId("resolution-gate-modal");
    expect(modal).toHaveTextContent(
      /This ticket still has 2 unresolved action\(s\)\. Complete or cancel them before resolving the ticket\./i,
    );
    expect(modal).toHaveTextContent("Run memory diagnostics");
    expect(modal).toHaveTextContent("Reseat RAM modules");

    // Clicking Cancel dismisses the modal without calling PATCH
    await user.click(screen.getByTestId("resolution-gate-cancel"));
    expect(screen.queryByTestId("resolution-gate-modal")).toBeNull();
    expect(
      fetchMock.mock.calls.some(([url, init]) => String(url).includes("/api/tickets/201") && (init as RequestInit)?.method === "PATCH"),
    ).toBe(false);

    // Reopen modal via status select and confirm -> calls PATCH, shows 409 error, status stays "In Progress"
    await user.selectOptions(screen.getByTestId("detail-status-select"), "Resolved");
    expect(await screen.findByTestId("resolution-gate-modal")).toBeInTheDocument();
    await user.click(screen.getByTestId("resolution-gate-confirm"));

    const errAlert = await screen.findByTestId("detail-action-error");
    expect(errAlert).toHaveTextContent(/Cannot resolve ticket while 2 action\(s\) are still open/i);
    expect(screen.getByTestId("detail-status")).toHaveTextContent("In Progress");
  });

  it("UI-07b: displays the Concurrent Update modal when backend returns 409 STALE_UPDATE and reloads on refresh", async () => {
    const user = userEvent.setup();
    const initialTicket = makeTicket({ status: "Open", actionsTaken: [] });
    let detailCallCount = 0;

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/auth/me")) return okRes({ user: authStaff });
      if (url.includes("/api/users/assignable")) return okRes([staffUser]);
      if (url.includes("/api/tickets/201/comments")) return okRes([]);
      if (url.includes("/api/tickets/201/internal-notes")) return okRes([]);
      if (url.includes("/api/tickets/201") && init?.method === "PATCH") {
        return errRes(409, {
          error: "Conflict",
          code: "STALE_UPDATE",
          message: "Ticket has been updated by another user. Please refresh.",
        });
      }
      if (url.includes("/api/tickets/201")) {
        detailCallCount += 1;
        return okRes(detailCallCount > 1 ? { ...initialTicket, status: "In Progress" } : initialTicket);
      }
      return Promise.reject(new Error("Unhandled URL: " + url));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthProvider>
        <StaffTicketDetail ticketId={201} onBack={vi.fn()} />
      </AuthProvider>,
    );

    const inProgressBtn = await screen.findByTestId("workflow-transition-in-progress");
    await user.click(inProgressBtn);

    const staleModal = await screen.findByTestId("stale-update-modal");
    expect(staleModal).toHaveTextContent(/Ticket has been updated by another user\. Please refresh\./i);
    expect(screen.getByTestId("stale-update-dismiss")).toBeInTheDocument();

    await user.click(screen.getByTestId("stale-update-refresh"));
    await waitFor(() => expect(screen.queryByTestId("stale-update-modal")).toBeNull());
    await waitFor(() => expect(screen.getByTestId("detail-status")).toHaveTextContent("In Progress"));
  });
});
