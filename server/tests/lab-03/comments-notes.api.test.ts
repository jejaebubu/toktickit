import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 Comments & Internal Notes API Suite (comments-notes.api.test.ts)", () => {
  let requesterToken: string;
  let staffToken: string;
  let targetTicketId: number;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({
      where: { email: { in: ["alex.it@toktickit.com", "kevin.it@toktickit.com", "emily.it@toktickit.com", "admin@toktickit.com"] } },
      data: { mustChangePassword: false, isActive: true },
    });

    let reqUser = await prisma.user.findFirst({ where: { role: "REQUESTER", email: "jennifer@toktickit.com" } });
    let ticket = await prisma.ticket.findFirst({ where: { requesterId: reqUser!.id } });

    if (!ticket) {
      let cat = await prisma.category.findFirst() || await prisma.category.create({ data: { name: "Hardware" } });
      let sys = await prisma.relatedSystem.findFirst() || await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });

      ticket = await prisma.ticket.create({
        data: {
          ticketNumber: `TKT-2026-COMM-${Date.now()}`,
          requesterId: reqUser!.id,
          categoryId: cat.id,
          relatedSystemId: sys.id,
          summary: "Comment test ticket",
          description: "Testing public comments and internal notes",
          requestedPriority: "MEDIUM",
        },
      });
    }
    targetTicketId = ticket.id;

    const reqLogin = await request(app).post("/api/auth/login").send({ email: "jennifer@toktickit.com", password: "Password123!" });
    requesterToken = reqLogin.body.token;

    const staffLogin = await request(app).post("/api/auth/login").send({ email: "alex.it@toktickit.com", password: "Password123!" });
    staffToken = staffLogin.body.token;
  });

  it("API-10a: Requester posts a Public Comment successfully", async () => {
    const res = await request(app)
      .post(`/api/tickets/${targetTicketId}/comments`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ content: "I tried rebooting and the issue persists." });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("I tried rebooting and the issue persists.");
    expect(res.body.author.email).toBe("jennifer@toktickit.com");
  });

  it("API-10b: Empty Public Comment content is rejected with 400 Bad Request", async () => {
    const res = await request(app)
      .post(`/api/tickets/${targetTicketId}/comments`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ content: "   " });

    expect(res.status).toBe(400);
  });

  it("API-10b2: Overlong Public Comment content (>1000 chars) is rejected with 400 Bad Request", async () => {
    const res = await request(app)
      .post(`/api/tickets/${targetTicketId}/comments`)
      .set("Authorization", `Bearer ${requesterToken}`)
      .send({ content: "x".repeat(1001) });

    expect(res.status).toBe(400);
  });

  it("API-10c: IT Staff posts an Internal Note successfully", async () => {
    const res = await request(app)
      .post(`/api/tickets/${targetTicketId}/internal-notes`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ content: "Diagnostic check completed. Escalated to tier 2." });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("Diagnostic check completed. Escalated to tier 2.");
    expect(res.body.author.role).toBe("IT_STAFF");
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.ticket.deleteMany({ where: { ticketNumber: { startsWith: "TKT-2026-COMM-" } } });
  });
});