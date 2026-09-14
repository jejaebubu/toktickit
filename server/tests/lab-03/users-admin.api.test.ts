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

  afterAll(async () => {
    const prisma = getPrisma();
    const seedHash = await bcrypt.hash("Password123!", 10);
    await prisma.user.updateMany({
      where: { email: "jennifer@toktickit.com" },
      data: { passwordHash: seedHash, mustChangePassword: false },
    });
  });
});