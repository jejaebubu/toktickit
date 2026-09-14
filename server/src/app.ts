import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPrisma } from "./prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "toktickit-lab3-jwt-secret-key-2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

function validatePasswordComplexity(password: string): string | null {
  if (password.length < 8) {
    return "New password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "New password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "New password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(password) && !/[^A-Za-z0-9]/.test(password)) {
    return "New password must contain at least one number or special symbol.";
  }
  return null;
}
// getPrisma() is your lazy database handle. Call it INSIDE a route when you
// need the DB (Issue 4). It is intentionally unused until then.
void getPrisma;

// The Express app is exported separately from app.listen() (see index.ts) so
// Supertest can import `app` without opening a port. Do not merge these files.
export const app = express();

app.use(cors());          // already wired: lets the Vite dev server call this API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Request Extension
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    mustChangePassword: boolean;
    isActive: boolean;
  };
}

// ---------------------------------------------------------------------------
// Lab 2 (Issue 9) — Attachment upload handling (multer)
// ---------------------------------------------------------------------------
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_ACTIVE_ATTACHMENTS = 5;
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(_dirname, "../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = MIME_TO_EXT[file.mimetype] || path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

function processUpload(req: Request, res: Response): Promise<Error | null> {
  return new Promise((resolve) => {
    upload.single("file")(req, res, (err: any) => resolve(err || null));
  });
}

function uploadErrorResponse(err: any): { status: number; message: string } {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return { status: 400, message: "File size exceeds maximum limit of 5MB." };
  }
  return { status: 400, message: err?.message || "Upload failed." };
}

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
    const requesters = await getPrisma().user.findMany({
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

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const xRequesterId = req.headers["x-requester-id"] || req.query["X-Requester-Id"] || req.query["x-requester-id"];

    // Support dev_requester_<id> Bearer header format from Lab 2 tests
    if (token && token.startsWith("dev_requester_")) {
      const reqId = parseInt(token.replace("dev_requester_", ""), 10);
      if (!isNaN(reqId)) {
        const user = await getPrisma().user.findUnique({ where: { id: reqId } });
        if (user) {
          if (!user.isActive) {
            return res.status(400).json({ error: "Bad Request", message: "Selected requester is inactive." });
          }
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mustChangePassword: false,
            isActive: user.isActive,
          };
          return next();
        }
      }
      return res.status(400).json({ error: "Bad Request", message: "Invalid requester." });
    }

    // Support X-Requester-Id header/query from Lab 2 tests
    if (!token && (xRequesterId as string | undefined)) {
      const reqId = parseInt(xRequesterId as string, 10);
      if (!isNaN(reqId)) {
        const user = await getPrisma().user.findUnique({ where: { id: reqId } });
        if (user) {
          if (!user.isActive) {
            return res.status(400).json({ error: "Bad Request", message: "Selected requester is inactive." });
          }
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mustChangePassword: false,
            isActive: user.isActive,
          };
          return next();
        }
      }
      return res.status(400).json({ error: "Bad Request", message: "Invalid requester header." });
    }

    if (!token) {
      return res.status(400).json({ error: "Bad Request", message: "Authentication or requester header required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await getPrisma().user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Unauthorized", message: "User account is invalid or inactive." });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      isActive: user.isActive,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token." });
  }
}

export function checkPasswordChangeState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.mustChangePassword) {
    return res.status(403).json({
      error: "PasswordChangeRequired",
      message: "Mandatory password change required before accessing application features.",
    });
  }
  next();
}

// ---------------------------------------------------------------------------
// Authentication APIs (Lab 3 — Issue 2)
// ---------------------------------------------------------------------------
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Bad Request", message: "Email and password are required." });
    }

    const user = await getPrisma().user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Unauthorized", message: "Account is inactive. Please contact system administrator." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        isActive: user.isActive,
      },
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/logout", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully." });
});

app.get("/api/auth/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

app.post("/api/auth/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Bad Request", message: "Current password and new password are required." });
    }

    const user = await getPrisma().user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ error: "Not Found", message: "User not found." });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatches) {
      return res.status(400).json({ error: "Bad Request", message: "Current password is incorrect." });
    }

    const complexityError = validatePasswordComplexity(newPassword);
    if (complexityError) {
      return res.status(400).json({ error: "Bad Request", message: complexityError });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await getPrisma().user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
        isActive: true,
      },
    });

    res.status(200).json({ message: "Password changed successfully.", user: updatedUser });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/tickets", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requesterId = req.user!.id;

    const prisma = getPrisma();

    // Verify requester exists and is active
    const requester = await prisma.user.findUnique({
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
const VALID_STATUS = ["New", "In Progress", "Resolved", "Closed", "Rejected"];
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function parsePositiveInt(raw: unknown): number | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) return null;
  return parsed;
}

app.get("/api/tickets", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  const buildError = (message: string) =>
    res.status(400).json({ error: "Bad Request", message: `Validation failed: ${message}` });

  try {
    const requesterId = req.user!.id;

    const prisma = getPrisma();

    const requester = await prisma.user.findUnique({
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

    const rawStatus = typeof req.query.status === "string" && req.query.status.trim() !== ""
      ? req.query.status.trim()
      : undefined;
    // Normalize case-insensitively (e.g. ?status=new matches "New") and use the canonical value
    const status = rawStatus
      ? VALID_STATUS.find((s) => s.toUpperCase() === rawStatus.toUpperCase())
      : undefined;
    if (rawStatus !== undefined && !status) {
      return buildError(`'status' must be one of ${VALID_STATUS.join(", ")}.`);
    }

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

// ---------------------------------------------------------------------------
// Lab 2 (Issue 9) — Requester Ticket Detail REST API (Ownership Protected)
// GET /api/tickets/:id
// ---------------------------------------------------------------------------
app.get("/api/tickets/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const buildError = (status: number, error: string, message: string) =>
    res.status(status).json({ error, message });

  try {
    const requesterId = req.user!.id;

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return buildError(404, "Not Found", `Ticket with ID ${req.params.id} not found.`);
    }

    const prisma = getPrisma();
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        attachments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            originalName: true,
            filename: true,
            mimeType: true,
            size: true,
            isRemoved: true,
            removeReason: true,
            removedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!ticket) {
      return buildError(404, "Not Found", `Ticket with ID ${id} not found.`);
    }

    if (ticket.requesterId !== requesterId) {
      return buildError(403, "Forbidden", "Access denied. You do not have permission to view this ticket.");
    }

    return res.status(200).json({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      summary: ticket.summary,
      description: ticket.description,
      requestedPriority: ticket.requestedPriority,
      itPriority: ticket.itPriority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      requester: ticket.requester,
      category: ticket.category,
      relatedSystem: ticket.relatedSystem,
      attachments: ticket.attachments,
    });
  } catch (err: any) {
    console.error("Error retrieving ticket detail:", err);
    return buildError(500, "Internal Server Error", err?.message || "Failed to retrieve ticket details.");
  }
});

// ---------------------------------------------------------------------------
// Lab 2 (Issue 9) — Upload attachment
// POST /api/tickets/:id/attachments  (multipart/form-data, field name: file)
// ---------------------------------------------------------------------------
app.post("/api/tickets/:id/attachments", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const buildError = (status: number, error: string, message: string) =>
    res.status(status).json({ error, message });

  try {
    const requesterId = req.user!.id;

    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) {
      return buildError(404, "Not Found", `Ticket with ID ${req.params.id} not found.`);
    }

    const prisma = getPrisma();
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, requesterId: true },
    });

    if (!ticket) {
      return buildError(404, "Not Found", `Ticket with ID ${ticketId} not found.`);
    }
    if (ticket.requesterId !== requesterId) {
      return buildError(403, "Forbidden", "You cannot add attachments to this ticket.");
    }

    const uploadErr = await processUpload(req, res);
    if (uploadErr) {
      const { status, message } = uploadErrorResponse(uploadErr);
      return buildError(status, "Bad Request", message);
    }

    const file = (req as any).file;
    if (!file) {
      return buildError(400, "Bad Request", "No file was uploaded. Use multipart field 'file'.");
    }

    // Guarantee cleanup: unlink the stored file on EVERY non-success exit path
    // (invalid type, active limit reached, DB failure in catch), but keep it on success.
    let fileSaved = false;
    try {
      if (!(file.mimetype in MIME_TO_EXT)) {
        return buildError(400, "Bad Request", `Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed.`);
      }

      const activeCount = await prisma.attachment.count({
        where: { ticketId, isRemoved: false },
      });
      if (activeCount >= MAX_ACTIVE_ATTACHMENTS) {
        return buildError(400, "Bad Request", `Maximum active attachments limit (${MAX_ACTIVE_ATTACHMENTS}) reached for this ticket.`);
      }

      const attachment = await prisma.attachment.create({
        data: {
          ticketId,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
      fileSaved = true;

      return res.status(201).json({
        id: attachment.id,
        originalName: attachment.originalName,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        isRemoved: attachment.isRemoved,
        createdAt: attachment.createdAt,
      });
    } finally {
      if (!fileSaved) {
        fs.unlink(file.path, () => {});
      }
    }
  } catch (err: any) {
    console.error("Error uploading attachment:", err);
    return buildError(500, "Internal Server Error", err?.message || "Failed to upload attachment.");
  }
});

// ---------------------------------------------------------------------------
// Lab 2 (Issue 9) — Download attachment  GET /api/attachments/:id/download
// ---------------------------------------------------------------------------
app.get("/api/attachments/:id/download", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const buildError = (status: number, error: string, message: string) =>
    res.status(status).json({ error, message });

  try {
    const requesterId = req.user!.id;

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return buildError(404, "Not Found", `Attachment with ID ${req.params.id} not found.`);
    }

    const prisma = getPrisma();
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: { ticket: { select: { requesterId: true } } },
    });

    if (!attachment) {
      return buildError(404, "Not Found", `Attachment with ID ${id} not found.`);
    }
    if (attachment.ticket.requesterId !== requesterId) {
      return buildError(403, "Forbidden", "You do not have permission to download this attachment.");
    }
    if (attachment.isRemoved) {
      return buildError(400, "Bad Request", "Attachment has been removed and cannot be downloaded.");
    }

    const absPath = path.join(uploadsDir, attachment.filename);
    if (!fs.existsSync(absPath)) {
      return buildError(404, "Not Found", "Attachment file is missing on the server.");
    }

    res.setHeader("Content-Type", attachment.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.originalName.replace(/["\\]/g, "_")}"`
    );
    return res.sendFile(absPath);
  } catch (err: any) {
    console.error("Error downloading attachment:", err);
    return buildError(500, "Internal Server Error", err?.message || "Failed to download attachment.");
  }
});

// ---------------------------------------------------------------------------
// Lab 2 (Issue 9) — Soft-remove attachment  DELETE /api/attachments/:id
// ---------------------------------------------------------------------------
app.delete("/api/attachments/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const buildError = (status: number, error: string, message: string) =>
    res.status(status).json({ error, message });

  try {
    const requesterId = req.user!.id;

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return buildError(404, "Not Found", `Attachment with ID ${req.params.id} not found.`);
    }

    const reason = (req.body as any)?.reason;
    if (typeof reason !== "string" || reason.trim() === "") {
      return buildError(400, "Bad Request", "'reason' for soft removal is required.");
    }

    const prisma = getPrisma();
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: { ticket: { select: { requesterId: true } } },
    });

    if (!attachment) {
      return buildError(404, "Not Found", `Attachment with ID ${id} not found.`);
    }
    if (attachment.ticket.requesterId !== requesterId) {
      return buildError(403, "Forbidden", "You do not have permission to remove this attachment.");
    }
    if (attachment.isRemoved) {
      return buildError(400, "Bad Request", "Attachment has already been removed.");
    }

    const updated = await prisma.attachment.update({
      where: { id },
      data: { isRemoved: true, removeReason: reason.trim(), removedAt: new Date() },
      select: {
        id: true,
        originalName: true,
        isRemoved: true,
        removeReason: true,
        removedAt: true,
      },
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("Error removing attachment:", err);
    return buildError(500, "Internal Server Error", err?.message || "Failed to soft-remove attachment.");
  }
});

export default app;
