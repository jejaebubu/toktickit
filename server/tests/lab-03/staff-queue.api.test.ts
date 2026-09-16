import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 IT Staff Ticket Queue API Suite (staff-queue.api.test.ts)", () => {
  let staffToken: string;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({
      where: { email: { in: ["alex.it@toktickit.com", "kevin.it@toktickit.com", "emily.it@toktickit.com", "admin@toktickit.com"] } },
      data: { mustChangePassword: false, isActive: true },
    });

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
    expect(res.body.tickets.length).toBeGreaterThanOrEqual(1);
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

  it("API-07d: IT Staff filters queue by unassigned tickets (ownerId=unassigned)", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ ownerId: "unassigned" });

    expect(res.status).toBe(200);
    res.body.tickets.forEach((t: any) => {
      expect(t.ownerId).toBeNull();
    });
  });

  it("API-07e: Case-insensitive priority filter (lowercase input is uppercased before matching)", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ requestedPriority: "low", itPriority: "urgent" });

    expect(res.status).toBe(200);
    res.body.tickets.forEach((t: any) => {
      expect(t.requestedPriority).toBe("LOW");
      expect(t.itPriority).toBe("URGENT");
    });
  });

  it("API-07f: Invalid ownerId returns 400 Bad Request instead of throwing 500", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${staffToken}`)
      .query({ ownerId: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bad Request");
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.ticket.deleteMany({ where: { ticketNumber: { startsWith: "TKT-2026-QUEUE-" } } });
  });
});