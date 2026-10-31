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

describe("Lab 4 Actions Taken API Suite (actions-taken.api.test.ts)", () => {
  const prisma = getPrisma();
  const createdTicketNumbers: string[] = [];

  let staffToken: string;
  let adminToken: string;
  let requesterToken: string;
  let otherRequesterToken: string;

  let ticketId: number;
  let otherTicketId: number;
  let staffId: number;
  let adminId: number;
  let requesterId: number;
  let otherRequesterId: number;
  let inactiveStaffId: number;
  let inactiveRequesterId: number;
  let actionId: string;

  beforeAll(async () => {
    await prisma.user.updateMany({
      where: {
        email: {
          in: [
            "alex.it@toktickit.com",
            "admin@toktickit.com",
            "jennifer@toktickit.com",
            "michael@toktickit.com",
          ],
        },
      },
      data: { mustChangePassword: false, isActive: true },
    });

    const [staff, admin, requester, otherRequester, inactiveStaff, inactiveRequester] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: "alex.it@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "admin@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "jennifer@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "michael@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "inactive.it@toktickit.com" } }),
      prisma.user.findUniqueOrThrow({ where: { email: "inactive.requester@toktickit.com" } }),
    ]);
    staffId = staff.id;
    adminId = admin.id;
    requesterId = requester.id;
    otherRequesterId = otherRequester.id;
    inactiveStaffId = inactiveStaff.id;
    inactiveRequesterId = inactiveRequester.id;

    let category = await prisma.category.findFirst();
    if (!category) category = await prisma.category.create({ data: { name: "Hardware" } });
    let system = await prisma.relatedSystem.findFirst();
    if (!system) system = await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });

    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ownTicketNumber = `TKT-2026-ACT-${unique}-1`;
    const otherTicketNumber = `TKT-2026-ACT-${unique}-2`;
    createdTicketNumbers.push(ownTicketNumber, otherTicketNumber);

    const [ownTicket, otherTicket] = await Promise.all([
      prisma.ticket.create({
        data: {
          ticketNumber: ownTicketNumber,
          requesterId,
          categoryId: category.id,
          relatedSystemId: system.id,
          summary: "Actions Taken API test ticket",
          description: "Ticket used by the Lab 4 Actions Taken API suite",
          requestedPriority: "MEDIUM",
          status: "OPEN",
        },
      }),
      prisma.ticket.create({
        data: {
          ticketNumber: otherTicketNumber,
          requesterId: otherRequesterId,
          categoryId: category.id,
          relatedSystemId: system.id,
          summary: "Actions Taken API other requester ticket",
          description: "Ticket owned by another requester for no-leak checks",
          requestedPriority: "LOW",
          status: "OPEN",
        },
      }),
    ]);
    ticketId = ownTicket.id;
    otherTicketId = otherTicket.id;

    [staffToken, adminToken, requesterToken, otherRequesterToken] = await Promise.all([
      loginAs("alex.it@toktickit.com"),
      loginAs("admin@toktickit.com"),
      loginAs("jennifer@toktickit.com"),
      loginAs("michael@toktickit.com"),
    ]);
  });

  afterAll(async () => {
    if (createdTicketNumbers.length) {
      await prisma.ticket.deleteMany({ where: { ticketNumber: { in: createdTicketNumbers } } });
    }
  });

  it("API-01: IT Staff creates a valid Action Taken and performer comes from the token", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        actionDescription: "Diagnosing intermittent docking station disconnects",
        assigneeId: adminId,
        status: "PENDING",
        followUpRequired: true,
        followUpNote: "Check dock firmware after 24 hours",
        attachmentNotes: "dock-event-log.txt",
        performedById: 999999,
      });

    expect(res.status).toBe(201);
    expect(res.body.ticketId).toBe(ticketId);
    expect(res.body.actionDescription).toBe("Diagnosing intermittent docking station disconnects");
    expect(res.body.result).toBeNull();
    expect(res.body.status).toBe("PENDING");
    expect(res.body.performedById).toBe(staffId);
    expect(res.body.performedBy.id).toBe(staffId);
    expect(res.body.assigneeId).toBe(adminId);
    expect(res.body.assignee.id).toBe(adminId);
    expect(res.body.followUpRequired).toBe(true);
    actionId = res.body.id;
  });

  it("API-02: Requester cannot create an Action Taken (403)", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ actionDescription: "Requester should not create this", assigneeId: staffId });

    expect(res.status).toBe(403);
  });

  it("API-03: followUpRequired=true without a non-empty followUpNote is rejected (400)", async () => {
    const missingNote = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Follow-up missing note", assigneeId: staffId, followUpRequired: true });

    expect(missingNote.status).toBe(400);

    const blankNote = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Follow-up blank note", assigneeId: staffId, followUpRequired: true, followUpNote: "   " });

    expect(blankNote.status).toBe(400);

    const tooLong = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "x".repeat(1001), assigneeId: staffId });

    expect(tooLong.status).toBe(400);
  });

  it("API-03b: disabling followUpRequired clears the stale followUpNote", async () => {
    const created = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        actionDescription: "Follow-up hygiene action",
        assigneeId: staffId,
        followUpRequired: true,
        followUpNote: "Temporary note that should be cleared",
      });
    expect(created.status).toBe(201);
    expect(created.body.followUpNote).toBe("Temporary note that should be cleared");

    const cleared = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${created.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ followUpRequired: false });

    expect(cleared.status).toBe(200);
    expect(cleared.body.followUpRequired).toBe(false);
    expect(cleared.body.followUpNote).toBeNull();

    const reenableWithoutNote = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${created.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ followUpRequired: true });
    expect(reenableWithoutNote.status).toBe(400);
  });

  it("API-04: IT Staff updates an existing Action Taken without changing its performer", async () => {
    const before = await prisma.actionTaken.findUniqueOrThrow({ where: { id: actionId } });

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${actionId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        actionDescription: "Diagnosing docking station disconnects (updated with serial number)",
        attachmentNotes: "dock-event-log-v2.txt",
        performedById: 999999,
      });

    expect(res.status).toBe(200);
    expect(res.body.actionDescription).toBe("Diagnosing docking station disconnects (updated with serial number)");
    expect(res.body.attachmentNotes).toBe("dock-event-log-v2.txt");
    expect(res.body.performedById).toBe(staffId);
    expect(res.body.performedById).toBe(before.performedById);
    expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(before.updatedAt).getTime());
  });

  it("API-05: Requester can list own Actions Taken but gets 404 for another requester's ticket", async () => {
    const ownRes = await request(app)
      .get(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${requesterToken}`);

    expect(ownRes.status).toBe(200);
    expect(Array.isArray(ownRes.body)).toBe(true);
    expect(ownRes.body.map((a: any) => a.id)).toContain(actionId);

    const otherRes = await request(app)
      .get(`/api/tickets/${otherTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${requesterToken}`);
    expect(otherRes.status).toBe(404);

    const otherOwnerRes = await request(app)
      .get(`/api/tickets/${otherTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${otherRequesterToken}`);
    expect(otherOwnerRes.status).toBe(200);

    const staffRes = await request(app)
      .get(`/api/tickets/${otherTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(staffRes.status).toBe(200);

    const missingRes = await request(app)
      .get("/api/tickets/999999/actions-taken")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(missingRes.status).toBe(404);
  });

  it("API-12: inactive, requester, or unknown assignees are rejected with 422 and nothing is written", async () => {
    const countBefore = await prisma.actionTaken.count({ where: { ticketId } });

    for (const assigneeId of [inactiveStaffId, inactiveRequesterId, requesterId, 999999]) {
      const res = await request(app)
        .post(`/api/tickets/${ticketId}/actions-taken`)
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ actionDescription: `Invalid assignee ${assigneeId}`, assigneeId });
      expect(res.status).toBe(422);
    }

    const patchRes = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${actionId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ assigneeId: inactiveStaffId });
    expect(patchRes.status).toBe(422);

    const countAfter = await prisma.actionTaken.count({ where: { ticketId } });
    expect(countAfter).toBe(countBefore);
  });

  it("API-14: status transitions follow the Action Taken Status Matrix", async () => {
    const created = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Status matrix action", assigneeId: staffId, status: "PENDING" });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const inProgress = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "IN_PROGRESS" });
    expect(inProgress.status).toBe(200);
    expect(inProgress.body.status).toBe("IN_PROGRESS");

    const completed = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "COMPLETED", result: "Dock replaced and verified stable" });
    expect(completed.status).toBe(200);
    expect(completed.body.status).toBe("COMPLETED");
    expect(completed.body.result).toBe("Dock replaced and verified stable");

    const reopen = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "IN_PROGRESS" });
    expect(reopen.status).toBe(400);

    const cancelAfterComplete = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "CANCELLED" });
    expect(cancelAfterComplete.status).toBe(400);

    const cancellable = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Action to cancel", assigneeId: staffId, status: "PENDING" });
    const cancelled = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${cancellable.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "CANCELLED" });
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.status).toBe("CANCELLED");

    const completeAfterCancel = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${cancellable.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "COMPLETED", result: "Should not be allowed" });
    expect(completeAfterCancel.status).toBe(400);
  });

  it("API-15: result is optional for open work but required for COMPLETED", async () => {
    const pending = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Pending action without result", assigneeId: staffId, status: "PENDING" });
    expect(pending.status).toBe(201);
    expect(pending.body.result).toBeNull();

    const inProgress = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "In-progress action without result", assigneeId: staffId, status: "IN_PROGRESS" });
    expect(inProgress.status).toBe(201);
    expect(inProgress.body.result).toBeNull();

    const completedWithoutResult = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Completed without result", assigneeId: staffId, status: "COMPLETED" });
    expect(completedWithoutResult.status).toBe(400);

    const completedBlankResult = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Completed with blank result", assigneeId: staffId, status: "COMPLETED", result: "   " });
    expect(completedBlankResult.status).toBe(400);

    const completedWithResult = await request(app)
      .post(`/api/tickets/${ticketId}/actions-taken`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ actionDescription: "Completed with result", assigneeId: staffId, status: "COMPLETED", result: "Verified fixed" });
    expect(completedWithResult.status).toBe(201);

    const completeWithoutResult = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${pending.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "COMPLETED" });
    expect(completeWithoutResult.status).toBe(400);

    const stillPending = await prisma.actionTaken.findUniqueOrThrow({ where: { id: pending.body.id } });
    expect(stillPending.status).toBe("PENDING");

    const completeWithResult = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${pending.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "COMPLETED", result: "Resolved after validation" });
    expect(completeWithResult.status).toBe(200);
    expect(completeWithResult.body.status).toBe("COMPLETED");
    expect(completeWithResult.body.result).toBe("Resolved after validation");

    const clearOpenResult = await request(app)
      .patch(`/api/tickets/${ticketId}/actions-taken/${inProgress.body.id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ result: null });
    expect(clearOpenResult.status).toBe(200);
    expect(clearOpenResult.body.result).toBeNull();
  });

  it("API-16: assignable staff endpoint lists only active IT Staff/Admin and rejects Requesters", async () => {
    const res = await request(app)
      .get("/api/users/assignable")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    const ids = res.body.map((u: any) => u.id);
    expect(ids).toContain(staffId);
    expect(ids).toContain(adminId);
    expect(ids).not.toContain(inactiveStaffId);
    expect(ids).not.toContain(requesterId);
    expect(res.body.every((u: any) => u.role === "IT_STAFF" || u.role === "ADMINISTRATOR")).toBe(true);

    const requesterRes = await request(app)
      .get("/api/users/assignable")
      .set("Authorization", `Bearer ${requesterToken}`);
    expect(requesterRes.status).toBe(403);
  });

  it("API-17: ticket detail includes the Actions Taken history for the UI", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.actionsTaken)).toBe(true);
    expect(res.body.actionsTaken.length).toBeGreaterThan(0);

    const action = res.body.actionsTaken.find((a: any) => a.id === actionId);
    expect(action).toBeTruthy();
    expect(action.performedBy.id).toBe(staffId);
    expect(action.assignee.id).toBe(adminId);
  });
});
