import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("POST /api/tickets (Issue 5 - Create Ticket REST API)", () => {
  afterAll(async () => {
    // Clean up created test tickets to prevent foreign key issues in other test suites
    const prisma = getPrisma();
    await prisma.ticket.deleteMany({});
  });

  it("API-01: Creates a new ticket successfully and returns HTTP 201 with ticketNumber", async () => {
    const prisma = getPrisma();

    // Ensure category exists
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({ data: { name: "Network" } });
    }

    // Ensure related system exists
    let system = await prisma.relatedSystem.findFirst({ where: { isActive: true } });
    if (!system) {
      system = await prisma.relatedSystem.create({ data: { name: "Campus Wi-Fi", isActive: true } });
    }

    // Ensure requester user exists
    let requester = await prisma.requesterUser.findFirst({ where: { isActive: true } });
    if (!requester) {
      requester = await prisma.requesterUser.create({
        data: { name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true },
      });
    }

    const payload = {
      categoryId: category.id,
      relatedSystemId: system.id,
      summary: "Cannot connect to campus Wi-Fi in Library",
      description: "Getting authentication error when connecting since this morning.",
      requestedPriority: "HIGH",
    };

    const res = await request(app)
      .post("/api/tickets")
      .set("X-Requester-Id", String(requester.id))
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("ticketNumber");
    expect(res.body.ticketNumber).toMatch(/^TKT-\d{4}-\d{6}$/);
    expect(res.body.summary).toBe(payload.summary);
    expect(res.body.status).toBe("New");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("API-02: Rejects ticket creation if mandatory fields are missing (HTTP 400 Bad Request)", async () => {
    const prisma = getPrisma();
    let requester = await prisma.requesterUser.findFirst({ where: { isActive: true } });
    if (!requester) {
      requester = await prisma.requesterUser.create({
        data: { name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true },
      });
    }

    // Missing summary
    const resNoSummary = await request(app)
      .post("/api/tickets")
      .set("X-Requester-Id", String(requester.id))
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        description: "Test description",
        requestedPriority: "HIGH",
      });

    expect(resNoSummary.status).toBe(400);
    expect(resNoSummary.body.error).toBe("Bad Request");

    // Missing X-Requester-Id header
    const resNoHeader = await request(app)
      .post("/api/tickets")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        summary: "Test summary",
        description: "Test description",
        requestedPriority: "HIGH",
      });

    expect(resNoHeader.status).toBe(400);
    expect(resNoHeader.body.error).toBe("Bad Request");

    // Invalid priority
    const resInvalidPriority = await request(app)
      .post("/api/tickets")
      .set("X-Requester-Id", String(requester.id))
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
