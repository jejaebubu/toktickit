import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 RBAC Authorization Matrix Suite (authorization.api.test.ts)", () => {
  let requesterToken: string;
  let staffToken: string;
  let adminToken: string;
  let ticketId: number;

  beforeAll(async () => {
    const prisma = getPrisma();
    await prisma.user.updateMany({
      data: { mustChangePassword: false, isActive: true },
    });

    let cat = await prisma.category.findFirst();
    if (!cat) cat = await prisma.category.create({ data: { name: "Software" } });

    let sys = await prisma.relatedSystem.findFirst();
    if (!sys) sys = await prisma.relatedSystem.create({ data: { name: "Email", isActive: true } });

    const reqUser = await prisma.user.findFirst({ where: { role: "REQUESTER" } });
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-2026-AUTH-${Date.now()}`,
        requesterId: reqUser!.id,
        categoryId: cat.id,
        relatedSystemId: sys.id,
        summary: "Auth test ticket",
        description: "Testing RBAC matrix",
        requestedPriority: "MEDIUM",
      },
    });
    ticketId = ticket.id;

    const reqLogin = await request(app).post("/api/auth/login").send({ email: "jennifer@toktickit.com", password: "Password123!" });
    requesterToken = reqLogin.body.token;

    const staffLogin = await request(app).post("/api/auth/login").send({ email: "alex.it@toktickit.com", password: "Password123!" });
    staffToken = staffLogin.body.token;

    const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin@toktickit.com", password: "Password123!" });
    adminToken = adminLogin.body.token;
  });

  it("API-05: Requester requesting Internal Notes endpoint returns 403 Forbidden", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}/internal-notes`)
      .set("Authorization", `Bearer ${requesterToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  });

  it("API-06: Requester requesting Admin User Management API returns 403 Forbidden", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${requesterToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  });

  it("API-07: IT Staff requesting Admin User Management API returns 403 Forbidden", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  });

  it("API-08: IT Staff can read internal notes", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}/internal-notes`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("API-09: Administrator can access User Management API", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
