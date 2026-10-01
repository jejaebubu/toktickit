import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

// Issue 4 — GET /api/categories returns the four seeded categories in id order.
// Requires the DB to be migrated and seeded first.
describe("GET /api/categories", () => {
  const EXTRA_NAMES = ["Printing", "Email Support"];

  afterAll(async () => {
    await getPrisma().category.deleteMany({ where: { name: { in: EXTRA_NAMES } } });
    await getPrisma().$disconnect();
  });

  it("returns the four seeded categories in id order", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.map((c: { name: string }) => c.name)).toEqual([
      "Account and Access",
      "Hardware",
      "Software",
      "Network",
    ]);
    const ids = res.body.map((c: { id: number }) => c.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
  });

  it("returns categories sorted by id ascending, not by name", async () => {
    for (const name of EXTRA_NAMES) {
      await getPrisma().category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    const ids = res.body.map((c: { id: number }) => c.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
    expect(res.body[0].name).toBe("Account and Access");
    expect(res.body[res.body.length - 1].name).toBe("Email Support");
  });

  it("returns an empty array when no categories exist", async () => {
    const prisma = getPrisma();

    // Snapshot everything this assertion destroys. The previous version ran
    // ticket.deleteMany({}) + category.deleteMany({}) and only re-created the
    // four category *names* afterwards, which (a) destroyed the seeded tickets
    // permanently and (b) re-issued Category ids, so suites that hardcode
    // categoryId 1 started failing purely because of file execution order.
    const categories = await prisma.category.findMany();
    const tickets = await prisma.ticket.findMany();
    const ticketIds = tickets.map((t) => t.id);
    const attachments = await prisma.attachment.findMany({ where: { ticketId: { in: ticketIds } } });
    const publicComments = await prisma.publicComment.findMany({ where: { ticketId: { in: ticketIds } } });
    const internalNotes = await prisma.internalNote.findMany({ where: { ticketId: { in: ticketIds } } });

    try {
      await prisma.internalNote.deleteMany({});
      await prisma.publicComment.deleteMany({});
      await prisma.attachment.deleteMany({});
      await prisma.ticket.deleteMany({});
      await prisma.category.deleteMany({});

      const res = await request(app).get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    } finally {
      for (const c of categories) {
        await prisma.category.create({ data: { id: c.id, name: c.name } });
      }
      for (const t of tickets) {
        await prisma.ticket.create({ data: { ...t } });
      }
      for (const a of attachments) {
        await prisma.attachment.create({ data: { ...a } });
      }
      for (const c of publicComments) {
        await prisma.publicComment.create({ data: { ...c } });
      }
      for (const n of internalNotes) {
        await prisma.internalNote.create({ data: { ...n } });
      }
    }
  });
});