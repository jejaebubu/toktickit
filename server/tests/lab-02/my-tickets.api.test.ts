import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const TEST_TICKET_NUMBERS = [
  "TKT-2026-700001",
  "TKT-2026-700002",
  "TKT-2026-700003",
  "TKT-2026-700004",
  "TKT-2026-700005",
];

type RefRow = { id: number };

describe("GET /api/tickets (Issue 7 - My Tickets List REST API)", () => {
  let requesterA: RefRow;
  let requesterB: RefRow;
  let category: RefRow;
  let system: RefRow;

  beforeAll(async () => {
    const prisma = getPrisma();

    let cat = await prisma.category.findFirst();
    if (!cat) cat = await prisma.category.create({ data: { name: "Network" } });
    category = cat;

    let sys = await prisma.relatedSystem.findFirst({ where: { isActive: true } });
    if (!sys) sys = await prisma.relatedSystem.create({ data: { name: "Campus Wi-Fi", isActive: true } });
    system = sys;

    let a = await prisma.requesterUser.findUnique({ where: { email: "test.requester.a@example.com" } });
    if (!a) a = await prisma.requesterUser.create({ data: { name: "Tester A", email: "test.requester.a@example.com", isActive: true } });
    requesterA = a;

    let b = await prisma.requesterUser.findUnique({ where: { email: "test.requester.b@example.com" } });
    if (!b) b = await prisma.requesterUser.create({ data: { name: "Tester B", email: "test.requester.b@example.com", isActive: true } });
    requesterB = b;

    const tickets = [
      { ticketNumber: "TKT-2026-700001", requesterId: a.id, summary: "Laptop battery drains quickly", requestedPriority: "MEDIUM", status: "New" },
      { ticketNumber: "TKT-2026-700002", requesterId: a.id, summary: "Cannot connect to VPN from dorms", requestedPriority: "HIGH", status: "New" },
      { ticketNumber: "TKT-2026-700003", requesterId: a.id, summary: "Printer offline in the study room", requestedPriority: "LOW", status: "New" },
      { ticketNumber: "TKT-2026-700004", requesterId: a.id, summary: "Email is not syncing", requestedPriority: "URGENT", status: "New" },
      { ticketNumber: "TKT-2026-700005", requesterId: b.id, summary: "Software license is expiring", requestedPriority: "MEDIUM", status: "New" },
    ];

    for (const t of tickets) {
      await prisma.ticket.create({
        data: {
          ...t,
          categoryId: category.id,
          relatedSystemId: system.id,
          description: "Created by Issue 7 test.",
        },
      });
    }
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.ticket.deleteMany({ where: { ticketNumber: { in: TEST_TICKET_NUMBERS } } });
  });

  it("API-07a: Returns only the selected requester's tickets (ownership) with meta", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer dev_requester_${requesterA.id}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    expect(res.body.tickets).toHaveLength(4);
    expect(res.body.meta).toEqual({
      total: 4,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const numbers = res.body.tickets.map((t: any) => t.ticketNumber);
    expect(numbers).not.toContain("TKT-2026-700005"); // Tester B's ticket must not leak
    expect(res.body.tickets[0]).toHaveProperty("categoryName");
    expect(res.body.tickets[0]).toHaveProperty("relatedSystemName");
  });

  it("API-07b: Search filters by summary text (case-insensitive)", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ search: "vpn" });

    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.tickets[0].ticketNumber).toBe("TKT-2026-700002");
  });

  it("API-07c: Search matches by official ticket number", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ search: "700003" });

    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.tickets[0].summary).toBe("Printer offline in the study room");
  });

  it("API-07d: Filters by priority and status", async () => {
    const byPriority = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ priority: "URGENT" });

    expect(byPriority.status).toBe(200);
    expect(byPriority.body.meta.total).toBe(1);
    expect(byPriority.body.tickets[0].ticketNumber).toBe("TKT-2026-700004");

    const byStatus = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ status: "New" });

    expect(byStatus.status).toBe(200);
    expect(byStatus.body.meta.total).toBe(4);
  });

  it("API-07e: Sorts by created ASC / requestedPriority DESC", async () => {
    const asc = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ sort: "createdAt", order: "asc" });

    expect(asc.status).toBe(200);
    expect(asc.body.tickets[0].ticketNumber).toBe("TKT-2026-700001");

    const byPriorityDesc = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ sort: "requestedPriority", order: "desc" });

    expect(byPriorityDesc.status).toBe(200);
    expect(byPriorityDesc.body.tickets[0].requestedPriority).toBe("URGENT");
  });

  it("API-07f: Paginates with page and limit", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ page: 2, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body.tickets).toHaveLength(2);
    expect(res.body.meta).toEqual({ total: 4, page: 2, limit: 2, totalPages: 2 });

    const beyond = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(requesterA.id))
      .query({ page: 99 });

    expect(beyond.status).toBe(200);
    expect(beyond.body.tickets).toHaveLength(0);
  });

  it("API-07g: Rejects missing requester header with 400", async () => {
    const res = await request(app).get("/api/tickets");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bad Request");
  });

  it("API-07h: Rejects invalid query parameters with 400", async () => {
    const reqA = requesterA.id;

    const badPage = await request(app).get("/api/tickets").set("X-Requester-Id", String(reqA)).query({ page: 0 });
    expect(badPage.status).toBe(400);

    const badLimit = await request(app).get("/api/tickets").set("X-Requester-Id", String(reqA)).query({ limit: 999 });
    expect(badLimit.status).toBe(400);

    const badSort = await request(app).get("/api/tickets").set("X-Requester-Id", String(reqA)).query({ sort: "bogus" });
    expect(badSort.status).toBe(400);

    const badOrder = await request(app).get("/api/tickets").set("X-Requester-Id", String(reqA)).query({ order: "sideways" });
    expect(badOrder.status).toBe(400);

    const badPriority = await request(app).get("/api/tickets").set("X-Requester-Id", String(reqA)).query({ priority: "CRITICAL" });
    expect(badPriority.status).toBe(400);
  });

  it("API-07i: Rejects inactive or missing requester with 400", async () => {
    const prisma = getPrisma();
    let inactive = await prisma.requesterUser.findUnique({ where: { email: "test.requester.inactive@example.com" } });
    if (!inactive) {
      inactive = await prisma.requesterUser.create({
        data: { name: "Tester Inactive", email: "test.requester.inactive@example.com", isActive: false },
      });
    }

    const res = await request(app)
      .get("/api/tickets")
      .set("X-Requester-Id", String(inactive.id));

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("inactive");
  });
});