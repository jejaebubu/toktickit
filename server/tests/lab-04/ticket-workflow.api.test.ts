import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const PASSWORD = "Password123!";

async function loginAs(email: string): Promise<string> {
  const res = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
  if (res.status !== 200 || !res.body?.token) {
    throw new Error(`Failed to login as ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}

describe("Lab 4 Ticket Workflow, Resolution Gate & Concurrency API Suite (ticket-workflow.api.test.ts)", () => {
  const prisma = getPrisma();
  const createdTicketNumbers: string[] = [];

  let staffToken: string;
  let requesterToken: string;
  let otherRequesterToken: string;

  let staffId: number;
  let requesterId: number;
  let categoryId: number;
  let relatedSystemId: number;

  async function createTestTicket(status = "New") {
    const ticketNumber = `TKT-2026-WF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    createdTicketNumbers.push(ticketNumber);
    return prisma.ticket.create({
      data: {
        ticketNumber,
        requesterId,
        ownerId: status === "New" ? null : staffId,
        categoryId,
        relatedSystemId,
        summary: `Workflow test ticket (${status})`,
        description: "Testing Lab 4 ticket workflow transition matrix and resolution gate.",
        requestedPriority: "MEDIUM",
        itPriority: "MEDIUM",
        status,
      },
    });
  }

  beforeAll(async () => {
    await prisma.user.updateMany({
      where: {
        email: {
          in: ["alex.it@toktickit.com", "jennifer@toktickit.com", "michael@toktickit.com"],
        },
      },
      data: { mustChangePassword: false, isActive: true },
    });

    const [staff, requester, category, system] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: "alex.it@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "jennifer@toktickit.com" } }),
      prisma.category.findFirstOrThrow({ orderBy: { id: "asc" } }),
      prisma.relatedSystem.findFirstOrThrow({ where: { isActive: true }, orderBy: { id: "asc" } }),
    ]);

    staffId = staff.id;
    requesterId = requester.id;
    categoryId = category.id;
    relatedSystemId = system.id;

    [staffToken, requesterToken, otherRequesterToken] = await Promise.all([
      loginAs("alex.it@toktickit.com"),
      loginAs("jennifer@toktickit.com"),
      loginAs("michael@toktickit.com"),
    ]);
  });

  afterAll(async () => {
    if (createdTicketNumbers.length > 0) {
      await prisma.ticket.deleteMany({
        where: { ticketNumber: { in: createdTicketNumbers } },
      });
    }
  });

  it("API-06: enforces the 8-state Ticket Status Transition Matrix and rejects invalid jumps with 400", async () => {
    const ticket = await createTestTicket("New");

    // Illegal jump: New -> Closed (AC-07, BR-08)
    const illegalNewToClosed = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Closed" });
    expect(illegalNewToClosed.status).toBe(400);
    expect(illegalNewToClosed.body.code).toBe("INVALID_STATUS_TRANSITION");

    // Illegal jump: New -> Resolved
    const illegalNewToResolved = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Resolved" });
    expect(illegalNewToResolved.status).toBe(400);

    // Valid: New -> Open
    const toOpen = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Open" });
    expect(toOpen.status).toBe(200);
    expect(toOpen.body.status).toBe("Open");

    // Illegal jump: Open -> Closed
    const illegalOpenToClosed = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Closed" });
    expect(illegalOpenToClosed.status).toBe(400);

    // Valid: Open -> In Progress -> Waiting for Requester -> In Progress -> Resolved -> Reopened -> Resolved -> Closed
    for (const nextStatus of [
      "In Progress",
      "Waiting for Requester",
      "In Progress",
      "Resolved",
      "Reopened",
      "Resolved",
      "Closed",
    ]) {
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ status: nextStatus });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(nextStatus);
    }

    // Closed is a final state: cannot transition further
    const fromClosed = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Reopened" });
    expect(fromClosed.status).toBe(400);
    expect(fromClosed.body.code).toBe("INVALID_STATUS_TRANSITION");

    // Cancelled is also a final state
    const cancelTicket = await createTestTicket("New");
    const toCancelled = await request(app)
      .patch(`/api/tickets/${cancelTicket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Cancelled" });
    expect(toCancelled.status).toBe(200);
    expect(toCancelled.body.status).toBe("Cancelled");

    const fromCancelled = await request(app)
      .patch(`/api/tickets/${cancelTicket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Open" });
    expect(fromCancelled.status).toBe(400);
    expect(fromCancelled.body.code).toBe("INVALID_STATUS_TRANSITION");
  });

  it("API-07: Requester sets 'Problem Appears Resolved' advisory flag without changing status to Resolved, and cannot change status directly", async () => {
    const ticket = await createTestTicket("In Progress");

    // Requester cannot directly set status to Resolved (403 Forbidden)
    const directResolve = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ status: "Resolved" });
    expect(directResolve.status).toBe(403);

    // Another requester gets 404 (no ownership leak)
    const otherRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${otherRequesterToken}`)
      .send({ requesterIndicatedResolved: true });
    expect(otherRes.status).toBe(404);

    // Owner requester sets requesterIndicatedResolved = true (AC-08, BR-09)
    const advisoryRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ requesterIndicatedResolved: true });
    expect(advisoryRes.status).toBe(200);
    expect(advisoryRes.body.requesterIndicatedResolved).toBe(true);
    expect(advisoryRes.body.status).toBe("In Progress");
    expect(advisoryRes.body.status).not.toBe("Resolved");
  });

  it("API-08: detects stale concurrent updates via expectedUpdatedAt or If-Unmodified-Since and returns 409 Conflict", async () => {
    const ticket = await createTestTicket("Open");
    const staleTimestamp = new Date(ticket.updatedAt.getTime() - 60_000).toISOString();

    // Mismatched expectedUpdatedAt in body -> 409 Conflict
    const staleBodyRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "In Progress",
        expectedUpdatedAt: staleTimestamp,
      });
    expect(staleBodyRes.status).toBe(409);
    expect(staleBodyRes.body.code).toBe("STALE_UPDATE");

    // Mismatched If-Unmodified-Since header -> 409 Conflict
    const staleHeaderRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .set("If-Unmodified-Since", staleTimestamp)
      .send({ status: "In Progress" });
    expect(staleHeaderRes.status).toBe(409);
    expect(staleHeaderRes.body.code).toBe("STALE_UPDATE");

    // Verify status in DB was NOT modified
    const unchanged = await prisma.ticket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(unchanged.status).toBe("Open");

    // Matching expectedUpdatedAt -> 200 OK
    const freshRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "In Progress",
        expectedUpdatedAt: unchanged.updatedAt.toISOString(),
      });
    expect(freshRes.status).toBe(200);
    expect(freshRes.body.status).toBe("In Progress");
  });

  it("API-13: Resolution Gate blocks resolving a ticket with PENDING or IN_PROGRESS Actions Taken (409 Conflict) until all actions are completed or cancelled", async () => {
    const ticket = await createTestTicket("In Progress");

    // Create 1 PENDING action and 1 IN_PROGRESS action
    const pendingAction = await prisma.actionTaken.create({
      data: {
        ticketId: ticket.id,
        actionDescription: "Diagnose switch port packet loss",
        performedById: staffId,
        assigneeId: staffId,
        status: "PENDING",
      },
    });
    const inProgressAction = await prisma.actionTaken.create({
      data: {
        ticketId: ticket.id,
        actionDescription: "Replace damaged Cat6 patch cable",
        performedById: staffId,
        assigneeId: staffId,
        status: "IN_PROGRESS",
      },
    });

    // Attempt to resolve while 2 open actions exist -> 409 Conflict
    const blockedTwo = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Resolved" });
    expect(blockedTwo.status).toBe(409);
    expect(blockedTwo.body.code).toBe("UNRESOLVED_ACTIONS_EXIST");
    expect(blockedTwo.body.unresolvedCount).toBe(2);

    // Complete the first action, leaving 1 IN_PROGRESS action
    await prisma.actionTaken.update({
      where: { id: pendingAction.id },
      data: { status: "COMPLETED", result: "Packet loss isolated to port 14" },
    });

    // Still blocked with 1 open action -> 409 Conflict
    const blockedOne = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Resolved" });
    expect(blockedOne.status).toBe(409);
    expect(blockedOne.body.code).toBe("UNRESOLVED_ACTIONS_EXIST");
    expect(blockedOne.body.unresolvedCount).toBe(1);

    // Verify ticket status in DB is still "In Progress"
    const stillOpen = await prisma.ticket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(stillOpen.status).toBe("In Progress");

    // Cancel the remaining IN_PROGRESS action
    await prisma.actionTaken.update({
      where: { id: inProgressAction.id },
      data: { status: "CANCELLED" },
    });

    // Now resolving succeeds -> 200 OK
    const resolvedRes = await request(app)
      .patch(`/api/tickets/${ticket.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "Resolved" });
    expect(resolvedRes.status).toBe(200);
    expect(resolvedRes.body.status).toBe("Resolved");
  });
});
