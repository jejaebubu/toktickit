import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 Admin User Management API Suite (users-admin.api.test.ts)", () => {
  let adminToken: string;
  let adminUserId: number;

  beforeAll(async () => {
    const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin@toktickit.com", password: "Password123!" });
    adminToken = adminLogin.body.token;
    adminUserId = adminLogin.body.user.id;
  });

  it("API-11: Admin fetches user list with search and role filter", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ search: "jennifer", role: "REQUESTER" });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].email).toBe("jennifer@toktickit.com");
  });

  it("API-12: Admin creates a new user successfully", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test New User",
        email: `test.user.${Date.now()}@toktickit.com`,
        role: "IT_STAFF",
        isActive: true,
        initialPassword: "Password123!",
      });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("IT_STAFF");
    expect(res.body.mustChangePassword).toBe(true);
  });

  it("API-13: Duplicate email user creation returns 409 Conflict", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Duplicate User",
        email: "jennifer@toktickit.com",
        role: "REQUESTER",
        initialPassword: "Password123!",
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Conflict");
  });

  it("API-14: Admin self-deactivation attempt returns 400 Bad Request", async () => {
    const res = await request(app)
      .patch(`/api/users/${adminUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("deactivate their own account");
  });

  it("API-15: Admin resets initial password for user", async () => {
    const usersRes = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);
    const reqUser = usersRes.body.find((u: any) => u.email === "jennifer@toktickit.com");

    const resetRes = await request(app)
      .post(`/api/users/${reqUser.id}/reset-password`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ initialPassword: "ResetPassword123!" });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.message).toContain("successfully");
  });

  it("API-16: The last active Administrator cannot hand their own role away (400)", async () => {
    const prisma = getPrisma();

    // Isolate the rule: exactly one active Administrator, and it is the caller.
    const others = await prisma.user.findMany({
      where: { role: "ADMINISTRATOR", isActive: true, NOT: { id: adminUserId } },
      select: { id: true },
    });
    for (const other of others) {
      await prisma.user.update({ where: { id: other.id }, data: { isActive: false } });
    }

    try {
      const activeAdmins = await prisma.user.count({ where: { role: "ADMINISTRATOR", isActive: true } });
      expect(activeAdmins).toBe(1);

      const res = await request(app)
        .patch(`/api/users/${adminUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "REQUESTER" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("last active Administrator");

      const after = await prisma.user.findUnique({ where: { id: adminUserId } });
      expect(after!.role).toBe("ADMINISTRATOR");
    } finally {
      await prisma.user.updateMany({ where: { role: "ADMINISTRATOR" }, data: { isActive: true } });
    }
  });

  it("API-17: A second Administrator may be demoted while one remains (200)", async () => {
    const prisma = getPrisma();

    const secondAdmin = await prisma.user.findUnique({ where: { email: "sarah@toktickit.com" } });
    expect(secondAdmin).not.toBeNull();
    await prisma.user.update({
      where: { id: secondAdmin!.id },
      data: { role: "ADMINISTRATOR", isActive: true },
    });

    try {
      const activeAdmins = await prisma.user.count({ where: { role: "ADMINISTRATOR", isActive: true } });
      expect(activeAdmins).toBe(2);

      const res = await request(app)
        .patch(`/api/users/${secondAdmin!.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "REQUESTER" });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe("REQUESTER");

      const after = await prisma.user.findUnique({ where: { id: secondAdmin!.id } });
      expect(after!.role).toBe("REQUESTER");
    } finally {
      await prisma.user.update({
        where: { id: secondAdmin!.id },
        data: { role: "REQUESTER", isActive: true },
      });
    }
  });

  afterAll(async () => {
    const prisma = getPrisma();
    const seedHash = await bcrypt.hash("Password123!", 10);
    await prisma.user.updateMany({
      where: { email: "jennifer@toktickit.com" },
      data: { passwordHash: seedHash, mustChangePassword: false },
    });
    // Guarantee the seeded single Administrator is active again for other suites.
    await prisma.user.updateMany({
      where: { role: "ADMINISTRATOR" },
      data: { isActive: true },
    });
  });
});