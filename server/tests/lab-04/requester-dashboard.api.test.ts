import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const PASSWORD = "Password123!";
const DEDICATED_REQ_EMAIL = "requester.dashboard.spec@toktickit.com";

async function loginAs(email: string): Promise<string> {
  const res = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
  if (res.status !== 200 || !res.body?.token) {
    throw new Error(`Failed to login as ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}

describe("Lab 4 Requester Dashboard API Suite (requester-dashboard.api.test.ts)", () => {
  const prisma = getPrisma();
  const createdTicketNumbers: string[] = [];

  let dedicatedRequesterToken: string;
  let staffToken: string;
  let adminToken: string;

  let dedicatedRequesterId: number;
  let otherRequesterId: number;
  let categoryId: number;
  let relatedSystemId: number;

  async function createRequesterTicket(reqId: number, status: string, summary: string) {
    const ticketNumber = `TKT-2026-RD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    createdTicketNumbers.push(ticketNumber);
    return prisma.ticket.create({
      data: {
        ticketNumber,
        requesterId: reqId,
        ownerId: null,
        categoryId,
        relatedSystemId,
        summary,
        description: `Requester dashboard test ticket (${status})`,
        requestedPriority: "MEDIUM",
        itPriority: "MEDIUM",
        status,
      },
    });
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    await prisma.user.updateMany({
      where: {
        email: {
          in: ["alex.it@toktickit.com", "admin@toktickit.com", "jennifer@toktickit.com"],
        },
      },
      data: { mustChangePassword: false, isActive: true },
    });

    const dedicatedRequester = await prisma.user.upsert({
      where: { email: DEDICATED_REQ_EMAIL },
      update: {
        name: "Requester Spec User",
        passwordHash,
        role: "REQUESTER",
        isActive: true,
        mustChangePassword: false,
      },
      create: {
        name: "Requester Spec User",
        email: DEDICATED_REQ_EMAIL,
        passwordHash,
        role: "REQUESTER",
        isActive: true,
        mustChangePassword: false,
      },
    });

    const [otherRequester, category, system] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: "jennifer@toktickit.com" } }),
      prisma.category.findFirstOrThrow(),
      prisma.relatedSystem.findFirstOrThrow({ where: { isActive: true } }),
    ]);

    dedicatedRequesterId = dedicatedRequester.id;
    otherRequesterId = otherRequester.id;
    categoryId = category.id;
    relatedSystemId = system.id;

    await prisma.ticket.deleteMany({ where: { requesterId: dedicatedRequesterId } });

    [dedicatedRequesterToken, staffToken, adminToken] = await Promise.all([
      loginAs(DEDICATED_REQ_EMAIL),
      loginAs("alex.it@toktickit.com"),
      loginAs("admin@toktickit.com"),
    ]);
  });

  afterAll(async () => {
    if (createdTicketNumbers.length > 0) {
      const tickets = await prisma.ticket.findMany({
        where: { ticketNumber: { in: createdTicketNumbers } },
        select: { id: true },
      });
      const ids = tickets.map((t) => t.id);
      if (ids.length > 0) {
        await prisma.actionTaken.deleteMany({ where: { ticketId: { in: ids } } });
        await prisma.ticket.deleteMany({ where: { id: { in: ids } } });
      }
    }
    await prisma.user.deleteMany({ where: { email: DEDICATED_REQ_EMAIL } });
  });

  it("API-11: Requester Dashboard returns only the caller's own ticket metrics and recentTickets (AC-05, FR-09, BR-11)", async () => {
    // 1. Initially the dedicated requester has 0 tickets
    const emptyRes = await request(app)
      .get("/api/dashboard/requester")
      .set("Authorization", `Bearer ${dedicatedRequesterToken}`);

    expect(emptyRes.status).toBe(200);
    expect(emptyRes.body.metrics).toEqual({
      myOpen: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
    });
    expect(emptyRes.body.recentTickets).toEqual([]);

    // 2. Create tickets for another requester — must NOT leak into dedicatedRequester's dashboard
    const otherTicket = await createRequesterTicket(otherRequesterId, "Open", "Other User Secret Ticket");

    // 3. Create tickets across all 4 metric buckets for dedicatedRequesterId
    // myOpen: New + Open (2)
    await createRequesterTicket(dedicatedRequesterId, "New", "My New Request");
    await createRequesterTicket(dedicatedRequesterId, "Open", "My Open Request");
    // inProgress: In Progress + Waiting for Requester + Reopened (3)
    await createRequesterTicket(dedicatedRequesterId, "In Progress", "My InProgress Request");
    await createRequesterTicket(dedicatedRequesterId, "Waiting for Requester", "My Waiting Request");
    await createRequesterTicket(dedicatedRequesterId, "Reopened", "My Reopened Request");
    // resolved: Resolved (1)
    await createRequesterTicket(dedicatedRequesterId, "Resolved", "My Resolved Request");
    // closed: Closed + Cancelled (2)
    await createRequesterTicket(dedicatedRequesterId, "Closed", "My Closed Request");
    await createRequesterTicket(dedicatedRequesterId, "Cancelled", "My Cancelled Request");

    const res = await request(app)
      .get("/api/dashboard/requester")
      .set("Authorization", `Bearer ${dedicatedRequesterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.metrics).toEqual({
      myOpen: 2,
      inProgress: 3,
      resolved: 1,
      closed: 2,
    });

    // Verify recentTickets returns at most 5 tickets and never includes another user's ticket
    expect(Array.isArray(res.body.recentTickets)).toBe(true);
    expect(res.body.recentTickets.length).toBe(5);
    expect(res.body.recentTickets.some((t: any) => t.id === otherTicket.id)).toBe(false);
    expect(res.body.recentTickets.some((t: any) => t.title === "Other User Secret Ticket")).toBe(false);

    const firstRecent = res.body.recentTickets[0];
    expect(firstRecent).toHaveProperty("id");
    expect(firstRecent).toHaveProperty("ticketNumber");
    expect(firstRecent).toHaveProperty("title");
    expect(firstRecent).toHaveProperty("summary");
    expect(firstRecent).toHaveProperty("status");
    expect(firstRecent).toHaveProperty("category");
    expect(firstRecent).toHaveProperty("updatedAt");

    // Verify quickActions contract
    expect(Array.isArray(res.body.quickActions)).toBe(true);
    expect(res.body.quickActions.map((qa: any) => qa.id)).toEqual([
      "create-ticket",
      "view-tickets",
    ]);
  });

  it("API-11b: Unauthenticated and non-Requester callers are denied access to GET /api/dashboard/requester", async () => {
    const unauthRes = await request(app).get("/api/dashboard/requester");
    expect(unauthRes.status).toBe(401);

    const staffRes = await request(app)
      .get("/api/dashboard/requester")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(staffRes.status).toBe(403);

    const adminRes = await request(app)
      .get("/api/dashboard/requester")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(403);
  });
});
