import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";

async function loginAs(email: string): Promise<string> {
  const res = await request(app).post("/api/auth/login").send({ email, password: "Password123!" });
  expect(res.status).toBe(200);
  return res.body.token;
}

describe("GET /api/requesters (Issue 4)", () => {
  it("returns active requesters in ascending order of id for IT Staff", async () => {
    const token = await loginAs("alex.it@toktickit.com");
    const res = await request(app)
      .get("/api/requesters")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("email");
    expect(first).toHaveProperty("isActive");
    expect(first.isActive).toBe(true);

    // Verify all returned users are active (BR-07)
    for (const user of res.body) {
      expect(user.isActive).toBe(true);
    }

    // The suite name promises ascending id order; assert it explicitly.
    const ids = res.body.map((u: { id: number }) => u.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));

    // Lab 3 tightening: the endpoint is named "requesters", so only accounts
    // whose role is REQUESTER may be listed (BR-03, BR-04).
    for (const user of res.body) {
      const account = await getPrisma().user.findUnique({ where: { id: user.id } });
      expect(account?.role).toBe("REQUESTER");
    }
  });

  it("returns active requesters in ascending order of id for Administrator", async () => {
    const token = await loginAs("admin@toktickit.com");
    const res = await request(app)
      .get("/api/requesters")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("rejects unauthenticated access with 401 (Lab 3 hardening)", async () => {
    const res = await request(app).get("/api/requesters");

    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty("users");
    expect(Array.isArray(res.body)).toBe(false);
  });

  it("rejects a Requester with 403 (Lab 3 hardening)", async () => {
    const token = await loginAs("jennifer@toktickit.com");
    const res = await request(app)
      .get("/api/requesters")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(Array.isArray(res.body)).toBe(false);
  });
});
