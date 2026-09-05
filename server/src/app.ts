import express, { Request, Response } from "express";
import cors from "cors";
import { getPrisma } from "./prisma.js";
// getPrisma() is your lazy database handle. Call it INSIDE a route when you
// need the DB (Issue 4). It is intentionally unused until then.
void getPrisma;

// The Express app is exported separately from app.listen() (see index.ts) so
// Supertest can import `app` without opening a port. Do not merge these files.
export const app = express();

app.use(cors());          // already wired: lets the Vite dev server call this API
app.use(express.json());

// ---------------------------------------------------------------------------
// Issue 2 — API health check
// Make the test in tests/lab-01/health.test.ts pass.
// It must return HTTP 200 with JSON: { status: "ok", service: "TokTickIT API" }
// ---------------------------------------------------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "TokTickIT API" });
});

// ---------------------------------------------------------------------------
// Issue 4 — Category list
// ---------------------------------------------------------------------------
app.get("/api/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await getPrisma().category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json(categories);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------
// Lab 2 — Development Requesters list
// ---------------------------------------------------------------------------
app.get("/api/requesters", async (_req: Request, res: Response) => {
  try {
    const requesters = await getPrisma().requesterUser.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
    res.status(200).json(requesters);
  } catch {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve requesters list.",
    });
  }
});

// ---------------------------------------------------------------------------
// Lab 2 — Related Systems list
// ---------------------------------------------------------------------------
app.get("/api/related-systems", async (_req: Request, res: Response) => {
  try {
    const systems = await getPrisma().relatedSystem.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(systems);
  } catch {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve related systems.",
    });
  }
});

// ---------------------------------------------------------------------------
// Lab 2 (Issue 5) — Create Ticket REST API & Validation
// ---------------------------------------------------------------------------
const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

async function generateTicketNumber(): Promise<string> {
  const prisma = getPrisma();
  const currentYear = new Date().getFullYear();
  const prefix = `TKT-${currentYear}-`;

  const lastTicket = await prisma.ticket.findFirst({
    where: { ticketNumber: { startsWith: prefix } },
    orderBy: { id: "desc" },
    select: { ticketNumber: true },
  });

  let nextSeq = 1;
  if (lastTicket?.ticketNumber) {
    const parts = lastTicket.ticketNumber.split("-");
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq)) {
        nextSeq = seq + 1;
      }
    }
  }

  return `${prefix}${String(nextSeq).padStart(6, "0")}`;
}

app.post("/api/tickets", async (req: Request, res: Response) => {
  try {
    const requesterIdHeader = req.headers["x-requester-id"];
    if (!requesterIdHeader || Array.isArray(requesterIdHeader)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'X-Requester-Id' header is required.",
      });
    }

    const requesterId = parseInt(requesterIdHeader, 10);
    if (isNaN(requesterId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'X-Requester-Id' must be a valid integer.",
      });
    }

    const prisma = getPrisma();

    // Verify requester exists and is active
    const requester = await prisma.requesterUser.findUnique({
      where: { id: requesterId },
    });
    if (!requester || !requester.isActive) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: Requester not found or inactive.",
      });
    }

    const { categoryId, relatedSystemId, summary, description, requestedPriority } = req.body;

    if (!summary || typeof summary !== "string" || summary.trim() === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'summary' and 'categoryId' are required.",
      });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'description' is required.",
      });
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'summary' and 'categoryId' are required.",
      });
    }

    if (!relatedSystemId || isNaN(Number(relatedSystemId))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: 'relatedSystemId' is required.",
      });
    }

    if (!requestedPriority || !VALID_PRIORITIES.includes(requestedPriority)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid 'requestedPriority'. Must be one of LOW, MEDIUM, HIGH, URGENT.",
      });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    if (!category) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: Category not found.",
      });
    }

    // Verify related system exists
    const relatedSystem = await prisma.relatedSystem.findUnique({
      where: { id: Number(relatedSystemId) },
    });
    if (!relatedSystem || !relatedSystem.isActive) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: Related system not found or inactive.",
      });
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        requesterId,
        categoryId: Number(categoryId),
        relatedSystemId: Number(relatedSystemId),
        summary: summary.trim(),
        description: description.trim(),
        requestedPriority,
        itPriority: "MEDIUM",
        status: "New",
      },
      select: {
        id: true,
        ticketNumber: true,
        summary: true,
        description: true,
        requestedPriority: true,
        itPriority: true,
        status: true,
        createdAt: true,
        categoryId: true,
        relatedSystemId: true,
        requesterId: true,
      },
    });

    return res.status(201).json(ticket);
  } catch (err: any) {
    console.error("Error creating ticket:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "Failed to create ticket.",
    });
  }
});

export default app;
