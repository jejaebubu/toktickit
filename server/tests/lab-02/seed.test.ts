import { describe, it, expect } from "vitest";
import { getPrisma } from "../../src/prisma.js";

describe("Database Seed Data (Issue 6)", () => {
  it("should contain seeded categories", async () => {
    const prisma = getPrisma();
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    expect(categories.length).toBeGreaterThanOrEqual(4);
    const names = categories.map((c) => c.name);
    expect(names).toContain("Account and Access");
    expect(names).toContain("Hardware");
    expect(names).toContain("Software");
    expect(names).toContain("Network");
  });

  it("should contain seeded active and inactive requesters", async () => {
    const prisma = getPrisma();
    const requesters = await prisma.requesterUser.findMany({
      orderBy: { id: "asc" },
    });
    expect(requesters.length).toBeGreaterThanOrEqual(3);

    const activeRequesters = requesters.filter((r) => r.isActive);
    expect(activeRequesters.length).toBeGreaterThanOrEqual(3);

    const inactiveRequesters = requesters.filter((r) => !r.isActive);
    expect(inactiveRequesters.length).toBeGreaterThanOrEqual(1);
  });

  it("should contain seeded related systems", async () => {
    const prisma = getPrisma();
    const systems = await prisma.relatedSystem.findMany({
      orderBy: { id: "asc" },
    });
    expect(systems.length).toBeGreaterThanOrEqual(3);
    const names = systems.map((s) => s.name);
    expect(names).toContain("Campus Wi-Fi");
    expect(names).toContain("Email");
    expect(names).toContain("VPN");
  });
});
