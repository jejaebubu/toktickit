import { getPrisma } from "../src/prisma.js";

// Seed initial categories, requesters, and related systems (Issue #14).
// Requirement: running the seed twice must NOT create duplicates (idempotent).

const CATEGORIES = [
  "Account and Access",
  "Hardware",
  "Software",
  "Network",
];

const REQUESTERS = [
  { name: "Jennifer Anderson", email: "jennifer@example.com", isActive: true },
  { name: "Michael Brown", email: "michael@example.com", isActive: true },
  { name: "Sarah Jenkins", email: "sarah@example.com", isActive: true },
  { name: "Inactive User", email: "inactive@example.com", isActive: false },
];

const RELATED_SYSTEMS = [
  "Email",
  "Campus Wi-Fi",
  "VPN",
  "ERP System",
  "Library Portal",
];

async function main() {
  const prisma = getPrisma();

  // 1. Seed Categories
  for (const name of CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 2. Seed Requester Users
  for (const req of REQUESTERS) {
    await prisma.requesterUser.upsert({
      where: { email: req.email },
      update: { name: req.name, isActive: req.isActive },
      create: { name: req.name, email: req.email, isActive: req.isActive },
    });
  }

  // 3. Seed Related Systems
  for (const name of RELATED_SYSTEMS) {
    await prisma.relatedSystem.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Database seeded successfully with Categories, Requesters, and Related Systems.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
