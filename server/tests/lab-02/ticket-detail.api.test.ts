import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";
import { loginAs, TEST_PASSWORD } from "./helpers.js";

const OWNER_EMAIL = "issue9.owner@example.com";
const OTHER_EMAIL = "issue9.other@example.com";

describe("GET /api/tickets/:id (Issue 9 - Ticket Detail & Ownership)", () => {
  let owner: { id: number; email: string };
  let other: { id: number; email: string };
  let ticketId: number;
  let category: { id: number; name: string };
  let system: { id: number; name: string };

  beforeAll(async () => {
    const prisma = getPrisma();
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);

    let cat = await prisma.category.findFirst();
    if (!cat) cat = await prisma.category.create({ data: { name: "Network" } });
    category = cat;

    let sys = await prisma.relatedSystem.findFirst({ where: { isActive: true } });
    if (!sys) sys = await prisma.relatedSystem.create({ data: { name: "Campus Wi-Fi", isActive: true } });
    system = sys;

    let a = await prisma.user.findUnique({ where: { email: OWNER_EMAIL } });
    if (!a) a = await prisma.user.create({ data: { name: "Issue9 Owner", email: OWNER_EMAIL, passwordHash: hash, isActive: true } });
    owner = a;

    let b = await prisma.user.findUnique({ where: { email: OTHER_EMAIL } });
    if (!b) b = await prisma.user.create({ data: { name: "Issue9 Other", email: OTHER_EMAIL, passwordHash: hash, isActive: true } });
    other = b;

    await prisma.user.updateMany({
      where: { id: { in: [a.id, b.id] } },
      data: { passwordHash: hash, mustChangePassword: false, isActive: true },
    });

    const t = await prisma.ticket.create({
      data: {
        ticketNumber: "TKT-2026-710001",
        requesterId: owner.id,
        categoryId: cat.id,
        relatedSystemId: sys.id,
        summary: "Detail test ticket",
        description: "Detail test description",
        requestedPriority: "HIGH",
      },
    });
    ticketId = t.id;
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.attachment.deleteMany({ where: { ticketId } });
    await prisma.ticket.deleteMany({ where: { id: ticketId } });
    await prisma.user.deleteMany({
      where: { email: { in: [OWNER_EMAIL, OTHER_EMAIL] } },
    });
  });

  it("API-03a: Owner can view full ticket detail (200 OK)", async () => {
    const token = await loginAs(OWNER_EMAIL);
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ticketId);
    expect(res.body.ticketNumber).toBe("TKT-2026-710001");
    expect(res.body.summary).toBe("Detail test ticket");
    expect(res.body.description).toBe("Detail test description");
    expect(res.body.requestedPriority).toBe("HIGH");
    expect(res.body.status).toBe("New");
    expect(res.body.category).toEqual({ id: category.id, name: category.name });
    expect(res.body.relatedSystem).toEqual({ id: system.id, name: system.name });
    expect(res.body.requester.id).toBe(owner.id);
    expect(Array.isArray(res.body.attachments)).toBe(true);
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
  });

  it("API-03b: Another requester gets 403 Forbidden (Ownership Protection)", async () => {
    const token = await loginAs(OTHER_EMAIL);
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
    expect(res.body.message).toContain("permission");
  });

  it("API-03c: Nonexistent or malformed ticket ID returns 404 Not Found", async () => {
    const token = await loginAs(OWNER_EMAIL);

    const missing = await request(app)
      .get("/api/tickets/99999999")
      .set("Authorization", `Bearer ${token}`);
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe("Not Found");

    const malformed = await request(app)
      .get("/api/tickets/not-a-number")
      .set("Authorization", `Bearer ${token}`);
    expect(malformed.status).toBe(404);
    expect(malformed.body.error).toBe("Not Found");
  });

it("API-03d: Missing credentials header returns 401 Unauthorized", async () => {
    const res = await request(app).get(`/api/tickets/${ticketId}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });
});