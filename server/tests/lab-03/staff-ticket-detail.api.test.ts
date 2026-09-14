import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 IT Staff Ticket Operations API Suite (staff-ticket-detail.api.test.ts)", () => {
  let staffToken: string;
  let targetTicketId: number;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({ data: { mustChangePassword: false, isActive: true } });

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
});
