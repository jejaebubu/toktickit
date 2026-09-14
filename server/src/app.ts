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

export const app = express();

app.use(cors());
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
// Lab 2 & 3 — Attachment Upload Handling (Multer)
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

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = MIME_TO_EXT[file.mimetype] || path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed."));
    }
    cb(null, true);
  },
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
  return { status: 400, message: err?.message || "Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed." };
}

// ---------------------------------------------------------------------------
// Auth & Security Middlewares
// ---------------------------------------------------------------------------
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
    if (!token && xRequesterId) {
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

    const decoded = jwt.verify(token, JWT_SECRET) as any;
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

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Authentication required." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to perform this action." });
    }
    next();
  };
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
// Health & Baseline Endpoints
// ---------------------------------------------------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "TokTickIT API" });
});

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

app.get("/api/related-systems", async (_req: Request, res: Response) => {
  try {
    const systems = await getPrisma().relatedSystem.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json(systems);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/requesters", async (_req: Request, res: Response) => {
  try {
    const requesters = await getPrisma().user.findMany({
      where: { role: "REQUESTER", isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true, email: true, isActive: true },
    });
    res.status(200).json(requesters);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------
// Authentication APIs
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
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error", message: err?.message });
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

    res.status(200).json({
      message: "Password changed successfully.",
      user: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error", message: err?.message });
  }
});

// ---------------------------------------------------------------------------
// Ticket Number Generator Helper
// ---------------------------------------------------------------------------
async function generateTicketNumber(): Promise<String> {
  const currentYear = new Date().getFullYear();
  const prefix = `TKT-${currentYear}-`;

  const yearTickets = await getPrisma().ticket.findMany({
    where: { ticketNumber: { startsWith: prefix } },
    select: { ticketNumber: true },
  });

  let maxSequence = 0;
  const seqPattern = /^\d{6}$/;
  for (const t of yearTickets) {
    const lastPart = t.ticketNumber.split("-").pop();
    if (lastPart && seqPattern.test(lastPart)) {
      const seq = parseInt(lastPart, 10);
      if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
    }
  }

  return `${prefix}${(maxSequence + 1).toString().padStart(6, "0")}`;
}

function formatTicket(t: any) {
  if (!t) return t;
  return {
    ...t,
    categoryName: t.category?.name,
    relatedSystemName: t.relatedSystem?.name,
  };
}

// ---------------------------------------------------------------------------
// Ticket Endpoints (Requester & IT Staff Queue)
// ---------------------------------------------------------------------------
app.post("/api/tickets", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { categoryId, relatedSystemId, summary, description, requestedPriority } = req.body;

    if (!summary || summary.trim().length === 0) {
      return res.status(400).json({ error: "Bad Request", message: "Validation failed: 'summary' is required." });
    }
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: "Bad Request", message: "Validation failed: 'description' is required." });
    }
    if (!categoryId) {
      return res.status(400).json({ error: "Bad Request", message: "Validation failed: 'categoryId' is required." });
    }
    if (!relatedSystemId) {
      return res.status(400).json({ error: "Bad Request", message: "Validation failed: 'relatedSystemId' is required." });
    }

    const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (requestedPriority && !VALID_PRIORITIES.includes(String(requestedPriority))) {
      return res.status(400).json({ error: "Bad Request", message: "Validation failed: 'requestedPriority' is invalid." });
    }

    const category = await getPrisma().category.findUnique({ where: { id: Number(categoryId) } });
    if (!category) {
      return res.status(400).json({ error: "Bad Request", message: "Invalid Category ID." });
    }

    const system = await getPrisma().relatedSystem.findUnique({ where: { id: Number(relatedSystemId) } });
    if (!system || !system.isActive) {
      return res.status(400).json({ error: "Bad Request", message: "Invalid or inactive Related System." });
    }

    const priority = requestedPriority || "MEDIUM";
    const ticketNumber = await generateTicketNumber();

    const ticket = await getPrisma().ticket.create({
      data: {
        ticketNumber: ticketNumber as string,
        requesterId: req.user!.id,
        categoryId: Number(categoryId),
        relatedSystemId: Number(relatedSystemId),
        summary: summary.trim(),
        description: description.trim(),
        requestedPriority: priority,
        itPriority: priority,
        status: "New",
      },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(formatTicket(ticket));
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.get("/api/tickets", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userRole = req.user!.role;
    const userId = req.user!.id;

    // Requester query view
    if (userRole === "REQUESTER") {
      const { search, category, priority, status, sort, order, page, limit } = req.query;

      if (page !== undefined && (isNaN(Number(page)) || Number(page) < 1)) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid page parameter." });
      }
      if (limit !== undefined && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid limit parameter." });
      }

      const validSortFields = ["createdAt", "ticketNumber", "requestedPriority", "itPriority", "status", "updatedAt"];
      if (sort !== undefined && !validSortFields.includes(String(sort))) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid sort parameter." });
      }
      if (order !== undefined && !["asc", "desc"].includes(String(order).toLowerCase())) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid order parameter." });
      }

      const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      if (priority !== undefined && !VALID_PRIORITIES.includes(String(priority).toUpperCase())) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid priority parameter." });
      }

      const VALID_STATUSES = ["NEW", "OPEN", "IN PROGRESS", "WAITING FOR REQUESTER", "RESOLVED", "CLOSED", "REOPENED", "CANCELLED"];
      if (status !== undefined && !VALID_STATUSES.includes(String(status).toUpperCase())) {
        return res.status(400).json({ error: "Bad Request", message: "Invalid status parameter." });
      }

      const where: any = { requesterId: userId };
      if (search) {
        where.OR = [
          { ticketNumber: { contains: String(search), mode: "insensitive" } },
          { summary: { contains: String(search), mode: "insensitive" } },
        ];
      }
      if (category) where.categoryId = Number(category);
      if (priority) where.requestedPriority = String(priority);
      if (status) where.status = { equals: String(status), mode: "insensitive" };

      const pageNum = Math.max(1, parseInt(String(page || 1), 10));
      const limitNum = Math.max(1, parseInt(String(limit || 10), 10));
      const skip = (pageNum - 1) * limitNum;

      const sortField = String(sort || "createdAt");
      const sortOrder = String(order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

      const [tickets, total] = await Promise.all([
        getPrisma().ticket.findMany({
          where,
          orderBy: { [sortField]: sortOrder },
          skip,
          take: limitNum,
          include: {
            category: true,
            relatedSystem: true,
            requester: { select: { id: true, name: true, email: true } },
            owner: { select: { id: true, name: true, email: true } },
            attachments: { where: { isRemoved: false } },
          },
        }),
        getPrisma().ticket.count({ where }),
      ]);

      const metaObj = { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) };
      return res.status(200).json({
        tickets: tickets.map(formatTicket),
        meta: metaObj,
        pagination: metaObj,
      });
    }

    // IT Staff & Administrator Queue view
    const { search, category, status, requestedPriority, itPriority, ownerId, sort, order, page, limit } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { ticketNumber: { contains: String(search), mode: "insensitive" } },
        { summary: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (category) where.categoryId = Number(category);
    if (status) where.status = { equals: String(status), mode: "insensitive" };
    if (requestedPriority) where.requestedPriority = String(requestedPriority);
    if (itPriority) where.itPriority = String(itPriority);

    if (ownerId !== undefined && ownerId !== "") {
      if (ownerId === "unassigned" || ownerId === "null") {
        where.ownerId = null;
      } else {
        where.ownerId = Number(ownerId);
      }
    }

    const pageNum = Math.max(1, parseInt(String(page || 1), 10));
    const limitNum = Math.max(1, parseInt(String(limit || 10), 10));
    const skip = (pageNum - 1) * limitNum;

    const validSortFields = ["createdAt", "ticketNumber", "requestedPriority", "itPriority", "status", "updatedAt"];
    const sortField = validSortFields.includes(String(sort)) ? String(sort) : "createdAt";
    const sortOrder = String(order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const [tickets, total] = await Promise.all([
      getPrisma().ticket.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
        include: {
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
          requester: { select: { id: true, name: true, email: true } },
          owner: { select: { id: true, name: true, email: true } },
          attachments: { where: { isRemoved: false } },
        },
      }),
      getPrisma().ticket.count({ where }),
    ]);

    const metaObj = { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) };
    res.status(200).json({
      tickets: tickets.map(formatTicket),
      meta: metaObj,
      pagination: metaObj,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.get("/api/tickets/:id", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: "Not Found", message: "Invalid ticket ID." });
    }

    const ticket = await getPrisma().ticket.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
        attachments: true,
        publicComments: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { id: true, name: true, email: true, role: true } } },
        },
        internalNotes: req.user!.role !== "REQUESTER" ? {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { id: true, name: true, email: true, role: true } } },
        } : false,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Not Found", message: "Ticket not found." });
    }

    // Ownership check for Requester
    if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to view this ticket." });
    }

    res.status(200).json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.patch("/api/tickets/:id", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    const ticket = await getPrisma().ticket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const { ownerId, itPriority, status, requesterResolution } = req.body;

    // Requester special action: Indicate problem appears resolved
    if (req.user!.role === "REQUESTER") {
      if (ticket.requesterId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden", message: "You do not have permission to update this ticket." });
      }
      if (requesterResolution === true || status === "Waiting for Requester") {
        const updated = await getPrisma().ticket.update({
          where: { id },
          data: { status: "Waiting for Requester" },
          include: {
            category: true,
            relatedSystem: true,
            requester: { select: { id: true, name: true, email: true } },
            owner: { select: { id: true, name: true, email: true } },
          },
        });
        return res.status(200).json(updated);
      }
      return res.status(403).json({ error: "Forbidden", message: "Requesters cannot formally update ticket status or assignment." });
    }

    // IT Staff / Admin ticket workflow updates
    const dataToUpdate: any = {};

    if (ownerId !== undefined) {
      dataToUpdate.ownerId = ownerId === null || ownerId === "unassigned" ? null : Number(ownerId);
    }
    if (itPriority !== undefined) {
      dataToUpdate.itPriority = String(itPriority);
    }
    if (status !== undefined) {
      dataToUpdate.status = String(status);
    }

    const updatedTicket = await getPrisma().ticket.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        relatedSystem: true,
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updatedTicket);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

// ---------------------------------------------------------------------------
// Public Comments & Internal Notes APIs
// ---------------------------------------------------------------------------
app.get("/api/tickets/:id/comments", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: "Invalid ticket ID" });

    const ticket = await getPrisma().ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const comments = await getPrisma().publicComment.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });

    res.status(200).json(comments);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.post("/api/tickets/:id/comments", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: "Invalid ticket ID" });

    const ticket = await getPrisma().ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Validation Error", message: "Comment content cannot be empty." });
    }

    const comment = await getPrisma().publicComment.create({
      data: {
        ticketId,
        authorId: req.user!.id,
        content: content.trim(),
      },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });

    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.get("/api/tickets/:id/internal-notes", authenticateToken, checkPasswordChangeState, requireRole("IT_STAFF", "ADMINISTRATOR"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: "Invalid ticket ID" });

    const ticket = await getPrisma().ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const notes = await getPrisma().internalNote.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });

    res.status(200).json(notes);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.post("/api/tickets/:id/internal-notes", authenticateToken, checkPasswordChangeState, requireRole("IT_STAFF", "ADMINISTRATOR"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: "Invalid ticket ID" });

    const ticket = await getPrisma().ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Validation Error", message: "Internal note content cannot be empty." });
    }

    const note = await getPrisma().internalNote.create({
      data: {
        ticketId,
        authorId: req.user!.id,
        content: content.trim(),
      },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });

    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

// ---------------------------------------------------------------------------
// Attachments APIs
// ---------------------------------------------------------------------------
app.post("/api/tickets/:id/attachments", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId)) return res.status(400).json({ error: "Invalid ticket ID" });

    const ticket = await getPrisma().ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const activeCount = await getPrisma().attachment.count({ where: { ticketId, isRemoved: false } });
    if (activeCount >= MAX_ACTIVE_ATTACHMENTS) {
      return res.status(400).json({ error: "Validation Error", message: "Maximum active attachments limit reached." });
    }

    const uploadErr = await processUpload(req, res);
    if (uploadErr) {
      const errRes = uploadErrorResponse(uploadErr);
      return res.status(errRes.status).json({ error: "Bad Request", message: errRes.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Bad Request", message: "No file provided." });
    }

    const attachment = await getPrisma().attachment.create({
      data: {
        ticketId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json(attachment);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.get("/api/attachments/:id/download", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid attachment ID" });

    const attachment = await getPrisma().attachment.findUnique({ where: { id }, include: { ticket: true } });
    if (!attachment || attachment.isRemoved) {
      return res.status(400).json({ error: "Bad Request", message: "Attachment not found or removed" });
    }

    const xReqIdQuery = req.query["X-Requester-Id"] || req.query.requesterId;
    if (xReqIdQuery) {
      const reqId = parseInt(String(xReqIdQuery), 10);
      if (!isNaN(reqId) && attachment.ticket.requesterId !== reqId) {
        return res.status(403).json({ error: "Forbidden", message: "You do not have permission to download this attachment." });
      }
    } else if (req.user!.role === "REQUESTER" && attachment.ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to download this attachment." });
    }

    const filePath = path.join(uploadsDir, attachment.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File binary not found" });
    }

    res.download(filePath, attachment.originalName);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.delete("/api/attachments/:id", authenticateToken, checkPasswordChangeState, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid attachment ID" });

    const reason = (req.body.removeReason || req.body.reason || "").trim();
    if (!reason) {
      return res.status(400).json({ error: "Bad Request", message: "Removal reason is required." });
    }

    const attachment = await getPrisma().attachment.findUnique({ where: { id }, include: { ticket: true } });
    if (!attachment || attachment.isRemoved) {
      return res.status(400).json({ error: "Bad Request", message: "Attachment not found or has already been removed." });
    }

    const xReqHeader = req.headers["x-requester-id"];
    if (xReqHeader) {
      const reqId = parseInt(String(xReqHeader), 10);
      if (!isNaN(reqId) && attachment.ticket.requesterId !== reqId) {
        return res.status(403).json({ error: "Forbidden", message: "You do not have permission to remove this attachment." });
      }
    } else if (req.user!.role === "REQUESTER" && attachment.ticket.requesterId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to remove this attachment." });
    }

    const updated = await getPrisma().attachment.update({
      where: { id },
      data: {
        isRemoved: true,
        removeReason: reason,
        removedAt: new Date(),
      },
    });

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

// ---------------------------------------------------------------------------
// Administrator User Management APIs
// ---------------------------------------------------------------------------
app.get("/api/users", authenticateToken, checkPasswordChangeState, requireRole("ADMINISTRATOR"), async (req: Request, res: Response) => {
  try {
    const { search, role } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { email: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (role && role !== "ALL") {
      where.role = String(role);
    }

    const users = await getPrisma().user.findMany({
      where,
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.post("/api/users", authenticateToken, checkPasswordChangeState, requireRole("ADMINISTRATOR"), async (req: Request, res: Response) => {
  try {
    const { name, email, role, isActive, initialPassword } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Validation Error", message: "Name is required." });
    }
    if (!email || email.trim().length === 0) {
      return res.status(400).json({ error: "Validation Error", message: "Email is required." });
    }
    if (!initialPassword || initialPassword.length < 8) {
      return res.status(400).json({ error: "Validation Error", message: "Initial password must be at least 8 characters long." });
    }

    const allowedRoles = ["REQUESTER", "IT_STAFF", "ADMINISTRATOR"];
    const targetRole = role || "REQUESTER";
    if (!allowedRoles.includes(targetRole)) {
      return res.status(400).json({ error: "Validation Error", message: "Invalid role specified." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getPrisma().user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: "Conflict", message: "A user with this email address already exists." });
    }

    const passwordHash = await bcrypt.hash(initialPassword, 10);
    const user = await getPrisma().user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: targetRole,
        isActive: isActive !== false,
        mustChangePassword: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.patch("/api/users/:id", authenticateToken, checkPasswordChangeState, requireRole("ADMINISTRATOR"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    const targetUser = await getPrisma().user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const { name, email, role, isActive } = req.body;

    // Safety Rule 1: Admin cannot deactivate own account
    if (req.user!.id === id && isActive === false) {
      return res.status(400).json({ error: "Validation Error", message: "Administrators cannot deactivate their own account." });
    }

    // Safety Rule 2: Cannot deactivate or change role of the last active Administrator
    if ((isActive === false || (role && role !== "ADMINISTRATOR")) && targetUser.role === "ADMINISTRATOR" && targetUser.isActive) {
      const activeAdminCount = await getPrisma().user.count({
        where: { role: "ADMINISTRATOR", isActive: true },
      });
      if (activeAdminCount <= 1) {
        return res.status(400).json({ error: "Validation Error", message: "Cannot deactivate or change role of the last active Administrator." });
      }
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name.trim();
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== targetUser.email) {
        const duplicate = await getPrisma().user.findUnique({ where: { email: normalizedEmail } });
        if (duplicate) {
          return res.status(409).json({ error: "Conflict", message: "Email is already taken by another user." });
        }
        dataToUpdate.email = normalizedEmail;
      }
    }
    if (role !== undefined) {
      const allowedRoles = ["REQUESTER", "IT_STAFF", "ADMINISTRATOR"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Validation Error", message: "Invalid role specified." });
      }
      dataToUpdate.role = role;
    }
    if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

    const updatedUser = await getPrisma().user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});

app.post("/api/users/:id/reset-password", authenticateToken, checkPasswordChangeState, requireRole("ADMINISTRATOR"), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    const targetUser = await getPrisma().user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const { initialPassword } = req.body;
    if (!initialPassword || initialPassword.length < 8) {
      return res.status(400).json({ error: "Validation Error", message: "Initial password must be at least 8 characters long." });
    }

    const passwordHash = await bcrypt.hash(initialPassword, 10);
    await getPrisma().user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
      },
    });

    res.status(200).json({ message: "Initial password set successfully. User must change password at next login." });
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error", message: err?.message });
  }
});
