import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

describe("Lab 3 Auth API Suite (auth.api.test.ts)", () => {
  beforeAll(async () => {
    const prisma = getPrisma();
    const hash = await bcrypt.hash("Password123!", 10);

    await prisma.user.upsert({
      where: { email: "jennifer@toktickit.com" },
      update: { passwordHash: hash, isActive: true, mustChangePassword: false },
      create: {
        name: "Jennifer Anderson",
        email: "jennifer@toktickit.com",
        passwordHash: hash,
        role: "REQUESTER",
        isActive: true,
        mustChangePassword: false,
      },
    });

    await prisma.user.upsert({
      where: { email: "newuser@toktickit.com" },
      update: { passwordHash: hash, isActive: true, mustChangePassword: true },
      create: {
        name: "New User",
        email: "newuser@toktickit.com",
        passwordHash: hash,
        role: "REQUESTER",
        isActive: true,
        mustChangePassword: true,
      },
    });

    await prisma.user.upsert({
      where: { email: "inactive.requester@toktickit.com" },
      update: { passwordHash: hash, isActive: false },
      create: {
        name: "Inactive Requester",
        email: "inactive.requester@toktickit.com",
        passwordHash: hash,
        role: "REQUESTER",
        isActive: false,
      },
    });
  });

  it("API-01: Valid login returns 200, user object, and JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jennifer@toktickit.com", password: "Password123!" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "jennifer@toktickit.com");
    expect(res.body.user.role).toBe("REQUESTER");
  });

  it("API-02: Invalid password returns 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jennifer@toktickit.com", password: "WrongPassword999!" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  it("API-03: Inactive account login returns 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inactive.requester@toktickit.com", password: "Password123!" });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("inactive");
  });

  it("API-04: GET /api/auth/me returns current authenticated user profile", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "jennifer@toktickit.com", password: "Password123!" });

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe("jennifer@toktickit.com");
  });

  it("API-05: First login user must change password before accessing normal APIs", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "newuser@toktickit.com", password: "Password123!" });

    expect(loginRes.body.user.mustChangePassword).toBe(true);

    const normalApiRes = await request(app)
      .get("/api/tickets")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(normalApiRes.status).toBe(403);
    expect(normalApiRes.body.error).toBe("PasswordChangeRequired");

    // Perform mandatory password change
    const changeRes = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({ currentPassword: "Password123!", newPassword: "BrandNewPassword123!" });

    expect(changeRes.status).toBe(200);
    expect(changeRes.body.user.mustChangePassword).toBe(false);

    // Re-login with new password
    const reLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "newuser@toktickit.com", password: "BrandNewPassword123!" });

    expect(reLogin.status).toBe(200);
    expect(reLogin.body.user.mustChangePassword).toBe(false);
  });

  it("API-06: change-password enforces complexity rules (uppercase/lowercase/digit-or-symbol)", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "jennifer@toktickit.com", password: "Password123!" });

    const token = loginRes.body.token;

    const lowerOnly = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "Password123!", newPassword: "weakpassword" });

    expect(lowerOnly.status).toBe(400);
    expect(lowerOnly.body.message).toContain("uppercase");

    const upperOnly = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "Password123!", newPassword: "ONLYUPPERCASE" });

    expect(upperOnly.status).toBe(400);
    expect(upperOnly.body.message).toContain("lowercase");

    const noDigitOrSymbol = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "Password123!", newPassword: "NoNumberHere" });

    expect(noDigitOrSymbol.status).toBe(400);
    expect(noDigitOrSymbol.body.message).toContain("number or special symbol");

    const tooShort = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "Password123!", newPassword: "A1b" });

    expect(tooShort.status).toBe(400);
    expect(tooShort.body.message).toContain("at least 8");
  });
});
