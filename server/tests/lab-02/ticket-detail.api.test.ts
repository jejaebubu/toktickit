import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const OWNER_EMAIL = "issue9.owner@example.com";
const OTHER_EMAIL = "issue9.other@example.com";

describe("GET /api/tickets/:id (Issue 9 - Ticket Detail & Ownership)", () => {
  let owner: { id: number };
  let other: { id: number };
  let ticketId: number;
  let category: { id: number; name: string };
  let system: { id: number; name: string };

  beforeAll(async () => {
    const prisma = getPrisma();

    let cat = await prisma.category.findFirst();
    if (!cat) cat = await prisma.category.create({ data: { name: "Network" } });
    category = cat;

    let sys = await prisma.relatedSystem.findFirst({ where: { isActive: true } });
    if (!sys) sys = await prisma.relatedSystem.create({ data: { name: "Campus Wi-Fi", isActive: true } });
    system = sys;

    let a = await prisma.requesterUser.findUnique({ where: { email: OWNER_EMAIL } });
    if (!a) a = await prisma.requesterUser.create({ data: { name: "Issue9 Owner", email: OWNER_EMAIL, isActive: true } });
    owner = a;

    let b = await prisma.requesterUser.findUnique({ where: { email: OTHER_EMAIL } });
    if (!b) b = await prisma.requesterUser.create({ data: { name: "Issue9 Other", email: OTHER_EMAIL, isActive: true } });
    other = b;

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
    await prisma.requesterUser.deleteMany({
      where: { email: { in: [OWNER_EMAIL, OTHER_EMAIL] } },
    });
  });

  it("API-03a: Owner can view full ticket detail (200 OK)", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("X-Requester-Id", String(owner.id));

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
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("X-Requester-Id", String(other.id));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
    expect(res.body.message).toContain("permission");
  });

  it("API-03c: Nonexistent or malformed ticket ID returns 404 Not Found", async () => {
    const missing = await request(app)
      .get("/api/tickets/99999999")
      .set("X-Requester-Id", String(owner.id));
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe("Not Found");

    const malformed = await request(app)
      .get("/api/tickets/not-a-number")
      .set("X-Requester-Id", String(owner.id));
    expect(malformed.status).toBe(404);
    expect(malformed.body.error).toBe("Not Found");
  });

  it("API-03d: Missing requester header returns 400 Bad Request", async () => {
    const res = await request(app).get(`/api/tickets/${ticketId}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bad Request");
  });
});