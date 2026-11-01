import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const PASSWORD = "Password123!";
const DEDICATED_STAFF_EMAIL = "staff.dashboard.spec@toktickit.com";

async function loginAs(email: string): Promise<string> {
  const res = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
  if (res.status !== 200 || !res.body?.token) {
    throw new Error(`Failed to login as ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}

describe("Lab 4 IT Staff Dashboard API Suite (staff-dashboard.api.test.ts)", () => {
  const prisma = getPrisma();
  const createdTicketNumbers: string[] = [];

  let dedicatedStaffToken: string;
  let adminToken: string;
  let requesterToken: string;

  let dedicatedStaffId: number;
  let requesterId: number;
  let categoryId: number;
  let relatedSystemId: number;

  async function createDashboardTicket(status: string, ownerId: number | null, summary: string) {
    const ticketNumber = `TKT-2026-SD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    createdTicketNumbers.push(ticketNumber);
    return prisma.ticket.create({
      data: {
        ticketNumber,
        requesterId,
        ownerId,
        categoryId,
        relatedSystemId,
        summary,
        description: `Dashboard metric verification ticket (${status})`,
        requestedPriority: "HIGH",
        itPriority: "HIGH",
        status,
      },
    });
  }

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    await prisma.user.updateMany({
      where: {
        email: {
          in: ["admin@toktickit.com", "jennifer@toktickit.com"],
        },
      },
      data: { mustChangePassword: false, isActive: true },
    });

    const dedicatedStaff = await prisma.user.upsert({
      where: { email: DEDICATED_STAFF_EMAIL },
      update: {
        name: "Dashboard Spec Staff",
        passwordHash,
        role: "IT_STAFF",
        isActive: true,
        mustChangePassword: false,
      },
      create: {
        name: "Dashboard Spec Staff",
        email: DEDICATED_STAFF_EMAIL,
        passwordHash,
        role: "IT_STAFF",
        isActive: true,
        mustChangePassword: false,
      },
    });

    const [requester, category, system] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { email: "jennifer@toktickit.com" } }),
      prisma.category.findFirstOrThrow(),
      prisma.relatedSystem.findFirstOrThrow({ where: { isActive: true } }),
    ]);

    dedicatedStaffId = dedicatedStaff.id;
    requesterId = requester.id;
    categoryId = category.id;
    relatedSystemId = system.id;

    // Clean any leftover tickets owned by the dedicated staff user
    await prisma.ticket.deleteMany({ where: { ownerId: dedicatedStaffId } });

    [dedicatedStaffToken, adminToken, requesterToken] = await Promise.all([
      loginAs(DEDICATED_STAFF_EMAIL),
      loginAs("admin@toktickit.com"),
      loginAs("jennifer@toktickit.com"),
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
    await prisma.user.deleteMany({ where: { email: DEDICATED_STAFF_EMAIL } });
  });

  it("API-09: IT Staff & Admin Dashboard returns accurate real-time metrics, recentTickets, and quickActions (AC-04, FR-08, BR-10)", async () => {
    // Initially dedicated staff has 0 assigned tickets
    const initialRes = await request(app)
      .get("/api/dashboard/staff")
      .set("Authorization", `Bearer ${dedicatedStaffToken}`);

    expect(initialRes.status).toBe(200);
    expect(initialRes.body.metrics.myAssigned).toBe(0);

    // Create tickets across statuses and assign active + terminal tickets to dedicatedStaffId
    const newTicket = await createDashboardTicket("New", null, "Staff Dashboard New Ticket");
    const openTicket = await createDashboardTicket("Open", dedicatedStaffId, "Staff Dashboard Open Assigned");
    const inProgTicket = await createDashboardTicket("In Progress", dedicatedStaffId, "Staff Dashboard InProgress Assigned");
    const waitingTicket = await createDashboardTicket("Waiting for Requester", dedicatedStaffId, "Staff Dashboard Waiting Assigned");
    // Terminal tickets owned by dedicatedStaffId must NOT be counted in myAssigned
    await createDashboardTicket("Resolved", dedicatedStaffId, "Staff Dashboard Resolved Assigned");
    await createDashboardTicket("Closed", dedicatedStaffId, "Staff Dashboard Closed Assigned");
    await createDashboardTicket("Cancelled", dedicatedStaffId, "Staff Dashboard Cancelled Assigned");

    const [res, dbNew, dbOpen, dbInProg, dbWaiting] = await Promise.all([
      request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${dedicatedStaffToken}`),
      prisma.ticket.count({ where: { status: { in: ["New", "NEW"] } } }),
      prisma.ticket.count({ where: { status: { in: ["Open", "OPEN"] } } }),
      prisma.ticket.count({ where: { status: { in: ["In Progress", "IN PROGRESS", "IN_PROGRESS"] } } }),
      prisma.ticket.count({ where: { status: { in: ["Waiting for Requester", "WAITING FOR REQUESTER", "WAITING_FOR_REQUESTER"] } } }),
    ]);

    expect(res.status).toBe(200);
    expect(res.body.metrics).toBeDefined();
    expect(res.body.metrics.new).toBe(dbNew);
    expect(res.body.metrics.open).toBe(dbOpen);
    expect(res.body.metrics.inProgress).toBe(dbInProg);
    expect(res.body.metrics.waitingForRequester).toBe(dbWaiting);
    // Only Open, In Progress, Waiting for Requester (3 active tickets) count toward myAssigned
    expect(res.body.metrics.myAssigned).toBe(3);

    // Verify recentTickets structure and limit <= 5
    expect(Array.isArray(res.body.recentTickets)).toBe(true);
    expect(res.body.recentTickets.length).toBeGreaterThan(0);
    expect(res.body.recentTickets.length).toBeLessThanOrEqual(5);
    const firstRecent = res.body.recentTickets[0];
    expect(firstRecent).toHaveProperty("id");
    expect(firstRecent).toHaveProperty("ticketNumber");
    expect(firstRecent).toHaveProperty("title");
    expect(firstRecent).toHaveProperty("summary");
    expect(firstRecent).toHaveProperty("status");
    expect(firstRecent).toHaveProperty("itPriority");
    expect(firstRecent).toHaveProperty("category");
    expect(firstRecent).toHaveProperty("requester");
    expect(firstRecent).toHaveProperty("updatedAt");

    // Verify quickActions contract
    expect(Array.isArray(res.body.quickActions)).toBe(true);
    expect(res.body.quickActions.map((qa: any) => qa.id)).toEqual([
      "create-ticket",
      "search-tickets",
      "my-queue",
    ]);

    // Verify Administrator can also access GET /api/dashboard/staff
    const adminRes = await request(app)
      .get("/api/dashboard/staff")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.metrics).toBeDefined();

    // Verify drill-down filter ownerId=me on GET /api/tickets returns tickets owned by dedicatedStaffId
    const myQueueRes = await request(app)
      .get("/api/tickets?ownerId=me")
      .set("Authorization", `Bearer ${dedicatedStaffToken}`);
    expect(myQueueRes.status).toBe(200);
    expect(myQueueRes.body.tickets.length).toBeGreaterThanOrEqual(3);
    expect(myQueueRes.body.tickets.every((t: any) => t.owner?.id === dedicatedStaffId)).toBe(true);

    // Suppress unused warnings
    void newTicket;
    void openTicket;
    void inProgTicket;
    void waitingTicket;
  });

  it("API-10: Requester and unauthenticated callers are denied access to GET /api/dashboard/staff (AC-06)", async () => {
    const unauthRes = await request(app).get("/api/dashboard/staff");
    expect(unauthRes.status).toBe(401);

    const requesterRes = await request(app)
      .get("/api/dashboard/staff")
      .set("Authorization", `Bearer ${requesterToken}`);
    expect(requesterRes.status).toBe(403);
    expect(requesterRes.body.error).toBe("Forbidden");
  });
});
