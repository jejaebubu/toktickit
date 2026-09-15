import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 IT Staff Ticket Operations API Suite (staff-ticket-detail.api.test.ts)", () => {
  let staffToken: string;
  let targetTicketId: number;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({
      where: { email: { in: ["alex.it@toktickit.com", "kevin.it@toktickit.com", "emily.it@toktickit.com", "admin@toktickit.com"] } },
      data: { mustChangePassword: false, isActive: true },
    });

    let ticket = await prisma.ticket.findFirst();
    if (!ticket) {
      let cat = await prisma.category.findFirst() || await prisma.category.create({ data: { name: "Hardware" } });
      let sys = await prisma.relatedSystem.findFirst() || await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });
      let reqUser = await prisma.user.findFirst({ where: { role: "REQUESTER" } });

      ticket = await prisma.ticket.create({
        data: {
          ticketNumber: `TKT-2026-DETAIL-${Date.now()}`,
          requesterId: reqUser!.id,
          categoryId: cat.id,
          relatedSystemId: sys.id,
          summary: "Detail test ticket",
          description: "Detail description",
          requestedPriority: "MEDIUM",
        },
      });
    }
    targetTicketId = ticket.id;

    const login = await request(app).post("/api/auth/login").send({ email: "alex.it@toktickit.com", password: "Password123!" });
    staffToken = login.body.token;
  });

  it("API-08: IT Staff claims ticket ownership", async () => {
    const meRes = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${staffToken}`);
    const staffUser = meRes.body.user;

    const claimRes = await request(app)
      .patch(`/api/tickets/${targetTicketId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ownerId: staffUser.id });

    expect(claimRes.status).toBe(200);
    expect(claimRes.body.owner.id).toBe(staffUser.id);
  });

  it("API-09: IT Staff updates IT Priority and Status", async () => {
    const updateRes = await request(app)
      .patch(`/api/tickets/${targetTicketId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ itPriority: "HIGH", status: "In Progress" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.itPriority).toBe("HIGH");
    expect(updateRes.body.status).toBe("In Progress");
  });

  it("API-10: Requester indicates problem resolved via requesterIndicatedResolved (AC-08)", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "jennifer@toktickit.com", password: "Password123!" });
    const requesterToken = login.body.token;

    const prisma = getPrisma();
    let cat = await prisma.category.findFirst() || await prisma.category.create({ data: { name: "Hardware" } });
    let sys = await prisma.relatedSystem.findFirst() || await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });
    const ownTicket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-2026-RESOLVE-${Date.now()}`,
        requesterId: login.body.user.id,
        categoryId: cat.id,
        relatedSystemId: sys.id,
        summary: "Resolve indicator test ticket",
        description: "Resolve description",
        requestedPriority: "LOW",
        status: "OPEN",
        requesterIndicatedResolved: false,
      },
    });

    const res = await request(app)
      .patch(`/api/tickets/${ownTicket.id}`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ requesterIndicatedResolved: true });

    expect(res.status).toBe(200);
    expect(res.body.requesterIndicatedResolved).toBe(true);
    expect(res.body.status).toBe("Waiting for Requester");
  });

  it("API-11: Requester cannot view or update another user's ticket — 404 no-leak (§6.2)", async () => {
    const login = await request(app).post("/api/auth/login").send({ email: "jennifer@toktickit.com", password: "Password123!" });
    const requesterToken = login.body.token;

    const prisma = getPrisma();
    let cat = await prisma.category.findFirst() || await prisma.category.create({ data: { name: "Hardware" } });
    let sys = await prisma.relatedSystem.findFirst() || await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });
    const otherRequester = await prisma.user.findFirst({ where: { role: "REQUESTER", email: { not: "jennifer@toktickit.com" } } });
    const otherTicket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-2026-NOLEAK-${Date.now()}`,
        requesterId: otherRequester!.id,
        categoryId: cat.id,
        relatedSystemId: sys.id,
        summary: "No-leak ticket owned by another requester",
        description: "Must be invisible to jennifer",
        requestedPriority: "LOW",
        status: "OPEN",
      },
    });

    const detailRes = await request(app).get(`/api/tickets/${otherTicket.id}`).set("Authorization", `Bearer ${requesterToken}`);
    expect(detailRes.status).toBe(404);

    const commentsRes = await request(app).get(`/api/tickets/${otherTicket.id}/comments`).set("Authorization", `Bearer ${requesterToken}`);
    expect(commentsRes.status).toBe(404);

    const patchRes = await request(app)
      .patch(`/api/tickets/${otherTicket.id}`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ itPriority: "URGENT" });
    expect(patchRes.status).toBe(404);
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.ticket.deleteMany({ where: { ticketNumber: { startsWith: "TKT-2026-NOLEAK-" } } });
    await prisma.ticket.deleteMany({ where: { ticketNumber: { startsWith: "TKT-2026-RESOLVE-" } } });
    await prisma.ticket.deleteMany({ where: { ticketNumber: { startsWith: "TKT-2026-DETAIL-" } } });
  });
});