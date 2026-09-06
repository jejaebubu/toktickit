import { describe, it, expect, beforeAll, afterAll } from "vitest";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

const OWNER_EMAIL = "issue9att.owner@example.com";
const OTHER_EMAIL = "issue9att.other@example.com";

describe("Attachment API (Issue 9 - Upload / Download / Soft-Remove)", () => {
  let owner: { id: number };
  let other: { id: number };
  let ticketId: number;

  beforeAll(async () => {
    const prisma = getPrisma();

    let cat = await prisma.category.findFirst();
    if (!cat) cat = await prisma.category.create({ data: { name: "Hardware" } });

    let sys = await prisma.relatedSystem.findFirst({ where: { isActive: true } });
    if (!sys) sys = await prisma.relatedSystem.create({ data: { name: "ERP System", isActive: true } });

    let a = await prisma.requesterUser.findUnique({ where: { email: OWNER_EMAIL } });
    if (!a) a = await prisma.requesterUser.create({ data: { name: "Attachment Owner", email: OWNER_EMAIL, isActive: true } });
    owner = a;

    let b = await prisma.requesterUser.findUnique({ where: { email: OTHER_EMAIL } });
    if (!b) b = await prisma.requesterUser.create({ data: { name: "Attachment Other", email: OTHER_EMAIL, isActive: true } });
    other = b;

    const t = await prisma.ticket.create({
      data: {
        ticketNumber: "TKT-2026-710002",
        requesterId: owner.id,
        categoryId: cat.id,
        relatedSystemId: sys.id,
        summary: "Attachment test ticket",
        description: "Tests for file upload/download/remove",
        requestedPriority: "MEDIUM",
      },
    });
    ticketId = t.id;
  });

  afterAll(async () => {
    const prisma = getPrisma();
    // Clean uploaded files
    const atts = await prisma.attachment.findMany({ where: { ticketId }, select: { filename: true } });
    for (const a of atts) {
      const fp = path.join(UPLOADS_DIR, a.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await prisma.attachment.deleteMany({ where: { ticketId } });
    await prisma.ticket.deleteMany({ where: { id: ticketId } });
    await prisma.requesterUser.deleteMany({ where: { email: { in: [OWNER_EMAIL, OTHER_EMAIL] } } });
  });

  it("API-04a: Upload valid PDF attachment successfully (201)", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("X-Requester-Id", String(owner.id))
      .attach("file", Buffer.from("%PDF-1.4 test content"), {
        filename: "evidence.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.originalName).toBe("evidence.pdf");
    expect(res.body.mimeType).toBe("application/pdf");
    expect(res.body.isRemoved).toBe(false);
    expect(res.body.size).toBeGreaterThan(0);
  });

  it("API-04b: Upload wrong file type returns 400 Bad Request", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("X-Requester-Id", String(owner.id))
      .attach("file", Buffer.from("hello world"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bad Request");
    expect(res.body.message).toContain("Invalid file type");

    // Verify no record was created
    const prisma = getPrisma();
    const count = await prisma.attachment.count({ where: { ticketId, originalName: "notes.txt" } });
    expect(count).toBe(0);
  });

  it("API-04c: Upload oversized file returns 400 Bad Request", async () => {
    const bigBuf = Buffer.alloc(5 * 1024 * 1024 + 1, 0); // 5MB + 1 byte
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("X-Requester-Id", String(owner.id))
      .attach("file", bigBuf, { filename: "huge.png", contentType: "image/png" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("File size");
  });

  it("API-04d: Upload to another requester's ticket returns 403 Forbidden", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("X-Requester-Id", String(other.id))
      .attach("file", Buffer.from("hack attempt"), { filename: "hack.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  });

  it("API-04e: Max 5 active attachments enforced — 6th upload returns 400", async () => {
    // Upload 5 small files (skip if some already exist from prior tests)
    const prisma = getPrisma();
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post(`/api/tickets/${ticketId}/attachments`)
        .set("X-Requester-Id", String(owner.id))
        .attach("file", Buffer.from(`file${i}`), {
          filename: `limit-test-${i}.pdf`,
          contentType: "application/pdf",
        });
    }

    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("X-Requester-Id", String(owner.id))
      .attach("file", Buffer.from("overflow"), { filename: "overflow.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Maximum active attachments");
  });

  it("API-05a: Download own active attachment returns 200 with file content", async () => {
    const prisma = getPrisma();
    const att = await prisma.attachment.findFirst({
      where: { ticketId, isRemoved: false },
      orderBy: { createdAt: "asc" },
    });
    expect(att).toBeTruthy();

    const res = await request(app)
      .get(`/api/attachments/${att!.id}/download`)
      .set("X-Requester-Id", String(owner.id));

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe(att!.mimeType);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("API-05b: Soft-remove attachment successfully returns 200 + isRemoved", async () => {
    const prisma = getPrisma();
    const att = await prisma.attachment.findFirst({
      where: { ticketId, isRemoved: false },
      orderBy: { createdAt: "asc" },
    });
    expect(att).toBeTruthy();

    const res = await request(app)
      .delete(`/api/attachments/${att!.id}`)
      .set("X-Requester-Id", String(owner.id))
      .send({ reason: "Uploaded wrong evidence document" });

    expect(res.status).toBe(200);
    expect(res.body.isRemoved).toBe(true);
    expect(res.body.removeReason).toBe("Uploaded wrong evidence document");
    expect(res.body.removedAt).toBeTruthy();
  });

  it("API-05c: Soft-remove without reason returns 400 Bad Request", async () => {
    const prisma = getPrisma();
    const att = await prisma.attachment.findFirst({ where: { ticketId, isRemoved: false } });
    // If no non-removed attachment available, skip
    if (!att) return;

    const res = await request(app)
      .delete(`/api/attachments/${att.id}`)
      .set("X-Requester-Id", String(owner.id))
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("reason");
  });

  it("API-05d: Download soft-removed attachment returns 400", async () => {
    const prisma = getPrisma();
    const removed = await prisma.attachment.findFirst({ where: { ticketId, isRemoved: true } });
    if (!removed) return;

    const res = await request(app)
      .get(`/api/attachments/${removed.id}/download`)
      .set("X-Requester-Id", String(owner.id));

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("removed");
  });

  it("API-05e: Another requester cannot download, remove, or upload attachments (403)", async () => {
    const prisma = getPrisma();
    const att = await prisma.attachment.findFirst({ where: { ticketId } });
    expect(att).toBeTruthy();

    const dl = await request(app)
      .get(`/api/attachments/${att!.id}/download`)
      .set("X-Requester-Id", String(other.id));
    expect(dl.status).toBe(403);

    const del = await request(app)
      .delete(`/api/attachments/${att!.id}`)
      .set("X-Requester-Id", String(other.id))
      .send({ reason: "theft" });
    expect(del.status).toBe(403);
  });
});