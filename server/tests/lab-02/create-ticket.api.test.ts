import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";
import { loginAs, TEST_PASSWORD } from "./helpers.js";

const TEST_REQUESTER_EMAIL = "test.requester.create-ticket@example.com";
const createdTicketIds: number[] = [];

describe("POST /api/tickets (Issue 5 - Create Ticket REST API)", () => {
  afterAll(async () => {
    // Remove only what this suite created. A blanket ticket.deleteMany({}) also
    // removed the seeded tickets, which made the ticket-count assertions in the
    // Lab 3 queue suites depend on file execution order.
    const prisma = getPrisma();
    if (createdTicketIds.length > 0) {
      await prisma.ticket.deleteMany({ where: { id: { in: createdTicketIds } } });
    }
    await prisma.user.deleteMany({ where: { email: TEST_REQUESTER_EMAIL } });
  });

  async function getValidTestEntities() {
    const prisma = getPrisma();

    let category = await prisma.category.findFirst({ orderBy: { id: "asc" } });
    if (!category) {
      category = await prisma.category.create({ data: { name: "Network" } });
    }

    let system = await prisma.relatedSystem.findFirst({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });
    if (!system) {
      system = await prisma.relatedSystem.create({ data: { name: "Campus Wi-Fi", isActive: true } });
    }

    // Dedicated requester owned by this suite. The previous
    // findFirst({ where: { isActive: true } }) returned an arbitrary active
    // user — sometimes alex.it — and this block then overwrote that seeded
    // account's passwordHash with TEST_PASSWORD, breaking every later suite
    // that logs in with the seed password "Password123!".
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    const requester = await prisma.user.upsert({
      where: { email: TEST_REQUESTER_EMAIL },
      update: { passwordHash: hash, mustChangePassword: false, isActive: true },
      create: {
        name: "Create Ticket Requester",
        email: TEST_REQUESTER_EMAIL,
        passwordHash: hash,
        role: "REQUESTER",
        mustChangePassword: false,
        isActive: true,
      },
    });

    return { category, system, requester };
  }

  it("API-01: Creates a new ticket successfully with JWT Authorization header", async () => {
    const { category, system, requester } = await getValidTestEntities();
    const token = await loginAs(requester.email);

    const payload = {
      categoryId: category.id,
      relatedSystemId: system.id,
      summary: "Cannot connect to campus Wi-Fi in Library",
      description: "Getting authentication error when connecting since this morning.",
      requestedPriority: "HIGH",
    };

    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("ticketNumber");
    expect(res.body.ticketNumber).toMatch(/^TKT-\d{4}-\d{6}$/);
    expect(res.body.summary).toBe(payload.summary);
    expect(res.body.status).toBe("New");
    expect(res.body).toHaveProperty("createdAt");
    createdTicketIds.push(res.body.id);
  });

  it("API-01b: Creates a new ticket successfully as the logged-in requester", async () => {
    const { category, system, requester } = await getValidTestEntities();
    const token = await loginAs(requester.email);

    const payload = {
      categoryId: category.id,
      relatedSystemId: system.id,
      summary: "VPN disconnections during peak hours",
      description: "Frequent drops every 15 minutes.",
      requestedPriority: "MEDIUM",
    };

    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.summary).toBe(payload.summary);
    createdTicketIds.push(res.body.id);
  });

  it("API-02: Rejects ticket creation if mandatory fields are missing (HTTP 400 Bad Request)", async () => {
    const { requester } = await getValidTestEntities();
    const token = await loginAs(requester.email);

    // Missing summary - returns specific error message
    const resNoSummary = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        description: "Test description",
        requestedPriority: "HIGH",
      });

    expect(resNoSummary.status).toBe(400);
    expect(resNoSummary.body.error).toBe("Bad Request");
    expect(resNoSummary.body.message).toBe("Validation failed: 'summary' is required.");

// Missing X-Requester-Id / Authorization header — now 401 (auth foundation, spec §6.2)
    const resNoHeader = await request(app)
      .post("/api/tickets")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        summary: "Test summary",
        description: "Test description",
        requestedPriority: "HIGH",
      });

    expect(resNoHeader.status).toBe(401);
    expect(resNoHeader.body.error).toBe("Unauthorized");

    // Invalid priority
    const resInvalidPriority = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        summary: "Test summary",
        description: "Test description",
        requestedPriority: "SUPER_HIGH",
      });

    expect(resInvalidPriority.status).toBe(400);
    expect(resInvalidPriority.body.error).toBe("Bad Request");
    expect(resInvalidPriority.body.message).toContain("requestedPriority");
  });
});