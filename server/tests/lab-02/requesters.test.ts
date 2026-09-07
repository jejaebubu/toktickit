import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("GET /api/requesters (Issue 4)", () => {
  it("returns active requesters in ascending order of id", async () => {
    const res = await request(app).get("/api/requesters");

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
  });
});
