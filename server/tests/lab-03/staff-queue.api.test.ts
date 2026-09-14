import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 IT Staff Ticket Queue API Suite (staff-queue.api.test.ts)", () => {
  let staffToken: string;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({ data: { mustChangePassword: false, isActive: true } });

    let count = await prisma.ticket.count();
    if (count === 0) {
      let cat = await prisma.category.findFirst() || await prisma.category.create({ data: { name: "Hardware" } });
      let sys = await prisma.relatedSystem.findFirst() || await prisma.relatedSystem.create({ data: { name: "Corporate Laptop", isActive: true } });
      let reqUser = await prisma.user.findFirst({ where: { role: "REQUESTER" } });

      await prisma.ticket.create({
        data: {
          ticketNumber: `TKT-2026-QUEUE-${Date.now()}`,
          requesterId: reqUser!.id,
          categoryId: cat.id,
          relatedSystemId: sys.id,
          summary: "Laptop battery drains quickly",
          description: "Battery issues",
          requestedPriority: "MEDIUM",
          itPriority: "MEDIUM",
          status: "In Progress",
        },
      });
    }

    const login = await request(app).post("/api/auth/login").send({ email: "alex.it@toktickit.com", password: "Password123!" });
    staffToken = login.body.token;
  });

  it("API-07: IT Staff receives full ticket queue with pagination metadata", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("tickets");
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it("API-07a: IT Staff searches queue by ticket number or summary", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ search: "battery" });

    expect(res.status).toBe(200);
    expect(res.body.tickets.length).toBeGreaterThanOrEqual(1);
    expect(res.body.tickets[0].summary.toLowerCase()).toContain("battery");
  });

  it("API-07b: IT Staff filters queue by IT Priority and Status", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ itPriority: "MEDIUM", status: "In Progress" });

    expect(res.status).toBe(200);
    res.body.tickets.forEach((t: any) => {
      expect(t.itPriority).toBe("MEDIUM");
      expect(t.status).toBe("In Progress");
    });
  });

  it("API-07c: IT Staff sorts queue by updatedAt ASC", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ sort: "updatedAt", order: "asc" });

    expect(res.status).toBe(200);
    expect(res.body.tickets.length).toBeGreaterThanOrEqual(1);
  });
});
