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
    orderBy: { ticketNumber: "desc" },
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

function extractRequesterId(req: Request): number | null {
  // 1. Try X-Requester-Id header
  const xHeader = req.headers["x-requester-id"];
  if (xHeader && !Array.isArray(xHeader)) {
    const parsed = parseInt(xHeader, 10);
    if (!isNaN(parsed)) return parsed;
  }

  // 2. Try Authorization: Bearer dev_requester_X or Bearer X header
  const authHeader = req.headers["authorization"];
  if (authHeader && typeof authHeader === "string") {
    const match = authHeader.match(/(?:dev_requester_|\b)(\d+)\b/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return null;
}

app.post("/api/tickets", async (req: Request, res: Response) => {
  try {
    const requesterId = extractRequesterId(req);
    if (!requesterId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation failed: Requester authentication header is required ('Authorization: Bearer dev_requester_X' or 'X-Requester-Id').",
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
        message: "Validation failed: 'summary' is required.",
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
        message: "Validation failed: 'categoryId' is required.",
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

// ---------------------------------------------------------------------------
// Lab 2 (Issue 7) — My Tickets List REST API (Search, Filter, Sort, Page)
// GET /api/tickets?search=&category=&priority=&status=&sort=&order=&page=&limit=
// ---------------------------------------------------------------------------
const VALID_SORT_FIELDS = ["createdAt", "ticketNumber", "summary", "requestedPriority", "status"];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function parsePositiveInt(raw: unknown): number | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) return null;
  return parsed;
}

app.get("/api/tickets", async (req: Request, res: Response) => {
  const buildError = (message: string) =>
    res.status(400).json({ error: "Bad Request", message: `Validation failed: ${message}` });

  try {
    const requesterId = extractRequesterId(req);
    if (!requesterId) {
      return buildError("Requester authentication header is required ('Authorization: Bearer dev_requester_X' or 'X-Requester-Id').");
    }

    const prisma = getPrisma();

    const requester = await prisma.requesterUser.findUnique({
      where: { id: requesterId },
    });
    if (!requester || !requester.isActive) {
      return buildError("Requester not found or inactive.");
    }

    const pageRaw = typeof req.query.page === "string" ? req.query.page.trim() : "";
    let page = 1;
    if (pageRaw !== "") {
      const p = parsePositiveInt(pageRaw);
      if (p === null) return buildError("'page' must be a positive integer.");
      page = p;
    }

    const limitRaw = typeof req.query.limit === "string" ? req.query.limit.trim() : "";
    let limit = DEFAULT_PAGE_SIZE;
    if (limitRaw !== "") {
      const l = parsePositiveInt(limitRaw);
      if (l === null) return buildError("'limit' must be a positive integer between 1 and 50.");
      if (l > MAX_PAGE_SIZE) return buildError(`'limit' must be between 1 and ${MAX_PAGE_SIZE}.`);
      limit = l;
    }

    const sort = typeof req.query.sort === "string" && VALID_SORT_FIELDS.includes(req.query.sort)
      ? req.query.sort
      : null;
    if (typeof req.query.sort === "string" && req.query.sort !== "" && !sort) {
      return buildError(`'sort' must be one of ${VALID_SORT_FIELDS.join(", ")}.`);
    }

    const order = req.query.order === "asc" ? "asc" : req.query.order === "desc" ? "desc" : null;
    if (typeof req.query.order === "string" && req.query.order !== "" && !order) {
      return buildError("'order' must be 'asc' or 'desc'.");
    }

    const categoryRaw = typeof req.query.category === "string" ? req.query.category.trim() : "";
    let categoryId: number | undefined;
    if (categoryRaw !== "") {
      const c = parsePositiveInt(categoryRaw);
      if (c === null) return buildError("'category' must be a positive integer.");
      categoryId = c;
    }

    const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
    if (priority !== undefined && priority !== "" && !VALID_PRIORITIES.includes(priority)) {
      return buildError(`'priority' must be one of ${VALID_PRIORITIES.join(", ")}.`);
    }

    const status = typeof req.query.status === "string" && req.query.status.trim() !== ""
      ? req.query.status.trim()
      : undefined;

    const search = typeof req.query.search === "string" && req.query.search.trim() !== ""
      ? req.query.search.trim()
      : undefined;

    const where: any = { requesterId };
    if (categoryId) where.categoryId = categoryId;
    if (priority) where.requestedPriority = priority;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: [{ [sort ?? "createdAt"]: order ?? "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          ticketNumber: true,
          summary: true,
          requestedPriority: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          category: { select: { name: true } },
          relatedSystemId: true,
          relatedSystem: { select: { name: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return res.status(200).json({
      tickets: tickets.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        summary: t.summary,
        requestedPriority: t.requestedPriority,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        categoryId: t.categoryId,
        categoryName: t.category.name,
        relatedSystemId: t.relatedSystemId,
        relatedSystemName: t.relatedSystem.name,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("Error listing tickets:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "Failed to retrieve tickets.",
    });
  }
});

export default app;
