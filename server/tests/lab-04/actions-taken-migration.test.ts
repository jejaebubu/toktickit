import { describe, it, expect } from "vitest";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 4 Actions Taken Migration & Seed (Issue #2)", () => {
  it("applies the ActionTaken table with assignee and status columns", async () => {
    const prisma = getPrisma();
    const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'ActionTaken'
    `;
    const names = columns.map((c) => c.column_name);
    expect(names).toEqual(
      expect.arrayContaining([
        "id",
        "ticketId",
        "actionDateTime",
        "actionDescription",
        "result",
        "performedById",
        "assigneeId",
        "status",
        "followUpRequired",
        "followUpNote",
        "attachmentNotes",
      ]),
    );
  });

  it("defines the ActionTakenStatus enum with all four values", async () => {
    const prisma = getPrisma();
    const values = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'ActionTakenStatus'
      ORDER BY e.enumsortorder
    `;
    expect(values.map((v) => v.enumlabel)).toEqual([
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ]);
  });

  it("seeds tickets with zero, one, and multiple Actions Taken", async () => {
    const prisma = getPrisma();
    const tickets = await prisma.ticket.findMany({
      include: { _count: { select: { actionsTaken: true } } },
    });
    const counts = tickets.map((t) => t._count.actionsTaken);
    expect(counts).toContain(0);
    expect(counts).toContain(1);
    expect(counts.some((n) => n >= 2)).toBe(true);
  });

  it("seeds at least one Action Taken for every status", async () => {
    const prisma = getPrisma();
    const rows = await prisma.actionTaken.findMany({ select: { status: true } });
    expect(new Set(rows.map((r) => r.status))).toEqual(
      new Set(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
    );
  });

  it("only assigns Actions Taken to active IT Staff or Administrators", async () => {
    const prisma = getPrisma();
    const invalidAssignees = await prisma.actionTaken.count({
      where: {
        assignee: {
          OR: [
            { role: { notIn: ["IT_STAFF", "ADMINISTRATOR"] } },
            { isActive: false },
          ],
        },
      },
    });
    expect(invalidAssignees).toBe(0);
  });

  it("only records performers who are active IT Staff or Administrators", async () => {
    const prisma = getPrisma();
    const invalidPerformers = await prisma.actionTaken.count({
      where: {
        performedBy: {
          OR: [
            { role: { notIn: ["IT_STAFF", "ADMINISTRATOR"] } },
            { isActive: false },
          ],
        },
      },
    });
    expect(invalidPerformers).toBe(0);
  });

  it("supports a performer and assignee who are different staff members", async () => {
    const prisma = getPrisma();
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS count
      FROM "ActionTaken"
      WHERE "performedById" <> "assigneeId"
    `;
    expect(rows[0].count).toBeGreaterThan(0);
  });

  it("never seeds a Resolved ticket that still has open Actions Taken", async () => {
    const prisma = getPrisma();
    const blocked = await prisma.ticket.count({
      where: {
        status: "Resolved",
        actionsTaken: { some: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
      },
    });
    expect(blocked).toBe(0);
  });

  it("always provides a follow-up note when follow-up is required", async () => {
    const prisma = getPrisma();
    const invalid = await prisma.actionTaken.count({
      where: {
        followUpRequired: true,
        OR: [{ followUpNote: null }, { followUpNote: "" }],
      },
    });
    expect(invalid).toBe(0);
  });
});
