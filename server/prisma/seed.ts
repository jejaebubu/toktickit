import { getPrisma } from "../src/prisma.js";
import { ActionTakenStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

// Seed initial categories, users, related systems, tickets, comments, and internal notes.
// Idempotent: running seed repeatedly will update/upsert without creating duplicates.

const DEFAULT_PASSWORD = "Password123!";

const USERS = [
  // Requesters (4 active, 1 inactive)
  { name: "Jennifer Anderson", email: "jennifer@toktickit.com", role: "REQUESTER", isActive: true, mustChangePassword: false },
  { name: "Michael Brown", email: "michael@toktickit.com", role: "REQUESTER", isActive: true, mustChangePassword: false },
  { name: "Sarah Jenkins", email: "sarah@toktickit.com", role: "REQUESTER", isActive: true, mustChangePassword: false },
  { name: "David Lee", email: "david.lee@toktickit.com", role: "REQUESTER", isActive: true, mustChangePassword: false },
  { name: "Inactive Requester", email: "inactive.requester@toktickit.com", role: "REQUESTER", isActive: false, mustChangePassword: false },

  // IT Staff (3 active, 1 inactive)
  { name: "Alex Thompson (IT Support)", email: "alex.it@toktickit.com", role: "IT_STAFF", isActive: true, mustChangePassword: false },
  { name: "Kevin Patel (IT Lead)", email: "kevin.it@toktickit.com", role: "IT_STAFF", isActive: true, mustChangePassword: false },
  { name: "Emily Davis (IT Support)", email: "emily.it@toktickit.com", role: "IT_STAFF", isActive: true, mustChangePassword: false },
  { name: "Inactive IT Staff", email: "inactive.it@toktickit.com", role: "IT_STAFF", isActive: false, mustChangePassword: false },

  // Administrator (1 active)
  { name: "John Smith (Admin)", email: "admin@toktickit.com", role: "ADMINISTRATOR", isActive: true, mustChangePassword: false },

  // First-login test user
  { name: "New User (First Login)", email: "newuser@toktickit.com", role: "REQUESTER", isActive: true, mustChangePassword: true },
];

const CATEGORIES = [
  "Account and Access",
  "Hardware",
  "Software",
  "Network",
];

const RELATED_SYSTEMS = [
  "Email",
  "Campus Wi-Fi",
  "VPN",
  "ERP System",
  "Library Portal",
  "Corporate Laptop",
];

const TICKETS = [
  {
    ticketNumber: "TKT-2026-001234",
    requesterEmail: "jennifer@toktickit.com",
    ownerEmail: "alex.it@toktickit.com",
    category: "Hardware",
    relatedSystem: "Corporate Laptop",
    summary: "Laptop battery drains quickly",
    description: "My laptop battery is draining much faster than usual even when the system is idle. This started happening after last week's Windows update.",
    requestedPriority: "MEDIUM",
    itPriority: "MEDIUM",
    status: "In Progress",
  },
  {
    ticketNumber: "TKT-2026-001233",
    requesterEmail: "sarah@toktickit.com",
    ownerEmail: "kevin.it@toktickit.com",
    category: "Network",
    relatedSystem: "VPN",
    summary: "Cannot connect to VPN",
    description: "Unable to establish VPN connection from home office.",
    requestedPriority: "HIGH",
    itPriority: "HIGH",
    status: "Open",
  },
  {
    ticketNumber: "TKT-2026-001232",
    requesterEmail: "david.lee@toktickit.com",
    ownerEmail: null,
    category: "Software",
    relatedSystem: "Email",
    summary: "Email not syncing on mobile",
    description: "Outlook mobile app fails to sync incoming emails.",
    requestedPriority: "MEDIUM",
    itPriority: "MEDIUM",
    status: "In Progress",
  },
  {
    ticketNumber: "TKT-2026-001231",
    requesterEmail: "jennifer@toktickit.com",
    ownerEmail: "emily.it@toktickit.com",
    category: "Account and Access",
    relatedSystem: "ERP System",
    summary: "New employee setup request",
    description: "Provision access for new team member joining next week.",
    requestedPriority: "LOW",
    itPriority: "LOW",
    status: "Resolved",
  },
  {
    ticketNumber: "TKT-2026-001230",
    requesterEmail: "michael@toktickit.com",
    ownerEmail: "alex.it@toktickit.com",
    category: "Hardware",
    relatedSystem: "Corporate Laptop",
    summary: "Printer keeps showing offline",
    description: "Office printer disconnects frequently during print jobs.",
    requestedPriority: "MEDIUM",
    itPriority: "LOW",
    status: "Open",
  },
  {
    ticketNumber: "TKT-2026-001229",
    requesterEmail: "sarah@toktickit.com",
    ownerEmail: null,
    category: "Account and Access",
    relatedSystem: "Library Portal",
    summary: "Request access to SharePoint",
    description: "Need read/write access to project documentation site.",
    requestedPriority: "LOW",
    itPriority: "LOW",
    status: "Waiting for Requester",
  },
  {
    ticketNumber: "TKT-2026-001228",
    requesterEmail: "david.lee@toktickit.com",
    ownerEmail: "kevin.it@toktickit.com",
    category: "Software",
    relatedSystem: "Email",
    summary: "Outlook freezing intermittently",
    description: "Application hangs when attaching files larger than 2MB.",
    requestedPriority: "HIGH",
    itPriority: "MEDIUM",
    status: "In Progress",
  },
  {
    ticketNumber: "TKT-2026-001227",
    requesterEmail: "michael@toktickit.com",
    ownerEmail: "emily.it@toktickit.com",
    category: "Hardware",
    relatedSystem: "Corporate Laptop",
    summary: "Docking station not detected",
    description: "Monitors and peripherals fail to connect via USB-C dock.",
    requestedPriority: "MEDIUM",
    itPriority: "MEDIUM",
    status: "Resolved",
  },
];

type SeedAction = {
  ticketNumber: string;
  performedByEmail: string;
  assigneeEmail: string;
  actionDateTime: string;
  actionDescription: string;
  result?: string | null;
  status: ActionTakenStatus;
  followUpRequired?: boolean;
  followUpNote?: string | null;
  attachmentNotes?: string | null;
};

// Covers tickets with zero, one, and multiple Actions Taken, every ActionTakenStatus,
// and cases where the performer differs from the assignee.
const ACTIONS: SeedAction[] = [
  {
    ticketNumber: "TKT-2026-001234",
    performedByEmail: "alex.it@toktickit.com",
    assigneeEmail: "alex.it@toktickit.com",
    actionDateTime: "2026-05-13T10:35:00Z",
    actionDescription: "Ran battery health diagnostic and captured report",
    result: "Battery health reported at 68%, replacement recommended",
    status: ActionTakenStatus.COMPLETED,
    followUpRequired: true,
    followUpNote: "Monitor battery behaviour after replacement",
    attachmentNotes: "battery-report.png",
  },
  {
    ticketNumber: "TKT-2026-001234",
    performedByEmail: "kevin.it@toktickit.com",
    assigneeEmail: "kevin.it@toktickit.com",
    actionDateTime: "2026-05-14T09:10:00Z",
    actionDescription: "Ordered replacement battery under hardware warranty",
    status: ActionTakenStatus.IN_PROGRESS,
    followUpRequired: false,
    attachmentNotes: "warranty-approval.pdf",
  },
  {
    ticketNumber: "TKT-2026-001234",
    performedByEmail: "alex.it@toktickit.com",
    assigneeEmail: "emily.it@toktickit.com",
    actionDateTime: "2026-05-15T14:00:00Z",
    actionDescription: "Prepared device for battery replacement",
    status: ActionTakenStatus.PENDING,
    followUpRequired: true,
    followUpNote: "Notify user as soon as the new battery arrives",
  },
  {
    ticketNumber: "TKT-2026-001233",
    performedByEmail: "kevin.it@toktickit.com",
    assigneeEmail: "kevin.it@toktickit.com",
    actionDateTime: "2026-05-16T08:45:00Z",
    actionDescription: "Requested VPN client logs from the user",
    status: ActionTakenStatus.PENDING,
    followUpRequired: true,
    followUpNote: "Follow up if logs are not received within 24 hours",
  },
  {
    ticketNumber: "TKT-2026-001232",
    performedByEmail: "emily.it@toktickit.com",
    assigneeEmail: "emily.it@toktickit.com",
    actionDateTime: "2026-05-12T11:20:00Z",
    actionDescription: "Reconfigured Outlook mobile sync profile",
    result: "Test email delivered successfully to the device",
    status: ActionTakenStatus.COMPLETED,
    followUpRequired: false,
  },
  {
    ticketNumber: "TKT-2026-001232",
    performedByEmail: "alex.it@toktickit.com",
    assigneeEmail: "kevin.it@toktickit.com",
    actionDateTime: "2026-05-12T15:05:00Z",
    actionDescription: "Attempted mailbox cache rebuild",
    result: "Cancelled after user reported sync restored",
    status: ActionTakenStatus.CANCELLED,
    followUpRequired: false,
  },
  {
    ticketNumber: "TKT-2026-001231",
    performedByEmail: "emily.it@toktickit.com",
    assigneeEmail: "emily.it@toktickit.com",
    actionDateTime: "2026-05-10T09:00:00Z",
    actionDescription: "Provisioned ERP account and assigned access roles",
    result: "New employee can sign in and access required modules",
    status: ActionTakenStatus.COMPLETED,
    followUpRequired: false,
    attachmentNotes: "erp-access-checklist.txt",
  },
  {
    ticketNumber: "TKT-2026-001228",
    performedByEmail: "kevin.it@toktickit.com",
    assigneeEmail: "kevin.it@toktickit.com",
    actionDateTime: "2026-05-14T13:30:00Z",
    actionDescription: "Reproduced attachment hang with a 3MB test file",
    result: "Issue reproduced; investigating add-in conflict",
    status: ActionTakenStatus.IN_PROGRESS,
    followUpRequired: false,
  },
  {
    ticketNumber: "TKT-2026-001228",
    performedByEmail: "admin@toktickit.com",
    assigneeEmail: "kevin.it@toktickit.com",
    actionDateTime: "2026-05-15T10:10:00Z",
    actionDescription: "Scheduled add-in compatibility review",
    status: ActionTakenStatus.PENDING,
    followUpRequired: true,
    followUpNote: "Chase vendor response before end of week",
    attachmentNotes: "addin-inventory.csv",
  },
  {
    ticketNumber: "TKT-2026-001227",
    performedByEmail: "emily.it@toktickit.com",
    assigneeEmail: "emily.it@toktickit.com",
    actionDateTime: "2026-05-09T16:40:00Z",
    actionDescription: "Replaced USB-C dock and verified peripherals",
    result: "Monitors, keyboard, and network detected normally",
    status: ActionTakenStatus.COMPLETED,
    followUpRequired: false,
  },
];

async function main() {
  const prisma = getPrisma();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // 0. Reset transactional data so every run starts from the same state.
  // Upsert alone is idempotent for the canonical rows but lets tickets and
  // throwaway accounts created by the test suites accumulate, which makes
  // `findFirst({ role: "REQUESTER" })` and queue-count assertions resolve to
  // different rows from run to run. Child rows are removed before parents.
  const seededEmails = USERS.map((u) => u.email);

  await prisma.internalNote.deleteMany({});
  await prisma.publicComment.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.actionTaken.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.user.deleteMany({ where: { email: { notIn: seededEmails } } });

  // 1. Seed Categories
  for (const name of CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 2. Seed Related Systems
  for (const name of RELATED_SYSTEMS) {
    await prisma.relatedSystem.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 3. Seed Users
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
        isActive: u.isActive,
        mustChangePassword: u.mustChangePassword,
        updatedAt: new Date(),
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        isActive: u.isActive,
        mustChangePassword: u.mustChangePassword,
      },
    });
  }

  // Fetch created maps for foreign keys
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
  const systems = await prisma.relatedSystem.findMany();
  const systemMap = new Map(systems.map((s) => [s.name, s.id]));
  const users = await prisma.user.findMany();
  const userMap = new Map(users.map((u) => [u.email, u.id]));

  // 4. Seed Tickets
  const ticketMap = new Map<string, number>();
  for (const t of TICKETS) {
    const requesterId = userMap.get(t.requesterEmail)!;
    const ownerId = t.ownerEmail ? userMap.get(t.ownerEmail) : null;
    const categoryId = categoryMap.get(t.category)!;
    const relatedSystemId = systemMap.get(t.relatedSystem)!;

    const ticket = await prisma.ticket.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {
        ownerId,
        itPriority: t.itPriority,
        status: t.status,
      },
      create: {
        ticketNumber: t.ticketNumber,
        requesterId,
        ownerId,
        categoryId,
        relatedSystemId,
        summary: t.summary,
        description: t.description,
        requestedPriority: t.requestedPriority,
        itPriority: t.itPriority,
        status: t.status,
      },
    });

    ticketMap.set(t.ticketNumber, ticket.id);

    // 5. Seed Public Comments for TKT-2026-001234
    if (t.ticketNumber === "TKT-2026-001234") {
      const alexId = userMap.get("alex.it@toktickit.com")!;
      const jenniferId = userMap.get("jennifer@toktickit.com")!;

      const commentCount = await prisma.publicComment.count({ where: { ticketId: ticket.id } });
      if (commentCount === 0) {
        await prisma.publicComment.createMany({
          data: [
            {
              ticketId: ticket.id,
              authorId: jenniferId,
              content: "Just adding that this issue occurs even when I close all applications.",
              createdAt: new Date("2026-05-12T09:20:00Z"),
            },
            {
              ticketId: ticket.id,
              authorId: alexId,
              content: "We are investigating the issue on your device. We'll update you shortly.",
              createdAt: new Date("2026-05-13T10:30:00Z"),
            },
            {
              ticketId: ticket.id,
              authorId: jenniferId,
              content: "Thank you for the update. Please let me know if you need any additional information.",
              createdAt: new Date("2026-05-13T11:45:00Z"),
            },
          ],
        });
      }

      // Seed Internal Notes for TKT-2026-001234
      const noteCount = await prisma.internalNote.count({ where: { ticketId: ticket.id } });
      if (noteCount === 0) {
        await prisma.internalNote.createMany({
          data: [
            {
              ticketId: ticket.id,
              authorId: alexId,
              content: "Internal note: Battery health diagnostic score is 68%. Will schedule battery replacement.",
              createdAt: new Date("2026-05-13T10:32:00Z"),
            },
            {
              ticketId: ticket.id,
              authorId: userMap.get("kevin.it@toktickit.com")!,
              content: "Replacement battery ordered under hardware warranty.",
              createdAt: new Date("2026-05-13T11:00:00Z"),
            },
          ],
        });
      }
    }
  }

  // 6. Seed Actions Taken
  // Ticket rows are recreated on every run, so actions are attached fresh and
  // never accumulate duplicates. Status, performer, and assignee are explicit.
  for (const a of ACTIONS) {
    await prisma.actionTaken.create({
      data: {
        ticketId: ticketMap.get(a.ticketNumber)!,
        actionDateTime: new Date(a.actionDateTime),
        actionDescription: a.actionDescription,
        result: a.result ?? null,
        performedById: userMap.get(a.performedByEmail)!,
        assigneeId: userMap.get(a.assigneeEmail)!,
        status: a.status,
        followUpRequired: a.followUpRequired ?? false,
        followUpNote: a.followUpNote ?? null,
        attachmentNotes: a.attachmentNotes ?? null,
      },
    });
  }

  console.log("Database seeded successfully with Users, Tickets, Actions Taken, Public Comments, and Internal Notes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
