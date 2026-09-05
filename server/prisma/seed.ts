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

// Sample tickets for My Tickets (Issue 7). Upserted by ticketNumber so the seed
// stays idempotent. Numbers use a low sequence so generateTicketNumber continues
// from the highest existing value when real tickets are created.
const TICKETS = [
  {
    ticketNumber: "TKT-2026-000001",
    requesterEmail: "jennifer@example.com",
    category: "Account and Access",
    relatedSystem: "Email",
    summary: "Cannot reset password for email account",
    description: "The reset link in the email is expired and I cannot complete the password change.",
    requestedPriority: "HIGH",
  },
  {
    ticketNumber: "TKT-2026-000002",
    requesterEmail: "jennifer@example.com",
    category: "Hardware",
    relatedSystem: "ERP System",
    summary: "Office printer jams on every print job",
    description: "The shared office printer jams roughly every print job since this morning.",
    requestedPriority: "MEDIUM",
  },
  {
    ticketNumber: "TKT-2026-000003",
    requesterEmail: "jennifer@example.com",
    category: "Network",
    relatedSystem: "Campus Wi-Fi",
    summary: "Wi-Fi keeps disconnecting in Lab 4",
    description: "Connection drops every few minutes in Lab 4, making online classes unusable.",
    requestedPriority: "URGENT",
  },
  {
    ticketNumber: "TKT-2026-000004",
    requesterEmail: "michael@example.com",
    category: "Software",
    relatedSystem: "VPN",
    summary: "VPN client fails to connect after update",
    description: "After the latest update the VPN client exits with a certificate error.",
    requestedPriority: "HIGH",
  },
  {
    ticketNumber: "TKT-2026-000005",
    requesterEmail: "michael@example.com",
    category: "Network",
    relatedSystem: "Campus Wi-Fi",
    summary: "Cannot connect to campus Wi-Fi on my phone",
    description: "Phone keeps showing authentication failure when joining campus Wi-Fi.",
    requestedPriority: "LOW",
  },
  {
    ticketNumber: "TKT-2026-000006",
    requesterEmail: "sarah@example.com",
    category: "Account and Access",
    relatedSystem: "Email",
    summary: "Permission to shared mailbox missing",
    description: "I was added to the team shared mailbox yesterday but still cannot open it.",
    requestedPriority: "MEDIUM",
  },
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

  // 4. Seed Sample Tickets (Issue 7)
  const categories = await prisma.category.findMany();
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]));
  const systems = await prisma.relatedSystem.findMany();
  const systemByName = new Map(systems.map((s) => [s.name, s.id]));
  const requesters = await prisma.requesterUser.findMany();
  const requesterByEmail = new Map(requesters.map((r) => [r.email, r.id]));

  for (const t of TICKETS) {
    await prisma.ticket.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {},
      create: {
        ticketNumber: t.ticketNumber,
        requesterId: requesterByEmail.get(t.requesterEmail) as number,
        categoryId: categoryByName.get(t.category) as number,
        relatedSystemId: systemByName.get(t.relatedSystem) as number,
        summary: t.summary,
        description: t.description,
        requestedPriority: t.requestedPriority,
        itPriority: "MEDIUM",
        status: "New",
      },
    });
  }

  console.log("Database seeded successfully with Categories, Requesters, Related Systems, and Sample Tickets.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
