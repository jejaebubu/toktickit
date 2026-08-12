import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

vi.mock("../../src/prisma.js", () => ({
  getPrisma: () => ({
    category: {
      findMany: vi.fn().mockRejectedValue(new Error("connection refused")),
    },
  }),
}));

describe("GET /api/categories error handling", () => {
  it("returns 500 with a safe message when the database query fails", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
    expect(res.body).not.toHaveProperty("details");
    expect(JSON.stringify(res.body)).not.toContain("connection refused");
  });
});