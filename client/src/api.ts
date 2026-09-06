const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface Category {
  id: number;
  name: string;
}

export interface RequesterUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export interface RelatedSystem {
  id: number;
  name: string;
}

export interface SystemStatus {
  online: boolean;
  categories: Category[];
}

export interface CreateTicketPayload {
  categoryId: number;
  relatedSystemId: number;
  summary: string;
  description: string;
  requestedPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface TicketResponse {
  id: number;
  ticketNumber: string;
  summary: string;
  description: string;
  requestedPriority: string;
  itPriority: string;
  status: string;
  createdAt: string;
  categoryId: number;
  relatedSystemId: number;
  requesterId: number;
}

export interface TicketListItem {
  id: number;
  ticketNumber: string;
  summary: string;
  requestedPriority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  relatedSystemId: number;
  relatedSystemName: string;
}

export interface TicketsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketsPage {
  tickets: TicketListItem[];
  meta: TicketsMeta;
}

export interface MyTicketsQuery {
  search?: string;
  category?: number;
  priority?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function checkSystem(): Promise<SystemStatus> {
  const healthRes = await fetch(`${API_URL}/api/health`);
  if (!healthRes.ok) throw new Error("Health check failed");
  const categoriesRes = await fetch(`${API_URL}/api/categories`);
  if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
  const categories: Category[] = await categoriesRes.json();
  return { online: true, categories };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchRequesters(): Promise<RequesterUser[]> {
  const res = await fetch(`${API_URL}/api/requesters`);
  if (!res.ok) throw new Error("Failed to fetch requesters");
  return res.json();
}

export async function fetchRelatedSystems(): Promise<RelatedSystem[]> {
  const res = await fetch(`${API_URL}/api/related-systems`);
  if (!res.ok) throw new Error("Failed to fetch related systems");
  return res.json();
}

export async function fetchMyTickets(
  query: MyTicketsQuery,
  requesterId: number
): Promise<TicketsPage> {
  const params = new URLSearchParams();
  if (query.search && query.search.trim() !== "") params.set("search", query.search.trim());
  if (query.category) params.set("category", String(query.category));
  if (query.priority) params.set("priority", query.priority);
  if (query.status) params.set("status", query.status);
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await fetch(`${API_URL}/api/tickets?${params.toString()}`, {
    headers: {
      "X-Requester-Id": String(requesterId),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch tickets");
  }

  return res.json();
}

export interface Attachment {
  id: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  isRemoved: boolean;
  removeReason: string | null;
  removedAt: string | null;
  createdAt: string;
}

export interface TicketDetail {
  id: number;
  ticketNumber: string;
  summary: string;
  description: string;
  requestedPriority: string;
  itPriority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requester: { id: number; name: string; email: string };
  category: { id: number; name: string };
  relatedSystem: { id: number; name: string };
  attachments: Attachment[];
}

export interface RemoveAttachmentResult {
  id: number;
  originalName: string;
  isRemoved: boolean;
  removeReason: string;
  removedAt: string;
}

export async function fetchTicketDetail(
  ticketId: number,
  requesterId: number
): Promise<TicketDetail> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
    headers: { "X-Requester-Id": String(requesterId) },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch ticket");
  }
  return res.json();
}

export async function uploadAttachment(
  ticketId: number,
  file: File,
  requesterId: number
): Promise<Attachment> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/attachments`, {
    method: "POST",
    headers: { "X-Requester-Id": String(requesterId) },
    body: form,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload attachment");
  }
  return res.json();
}

export function getAttachmentDownloadUrl(attachmentId: number, requesterId: number): string {
  return `${API_URL}/api/attachments/${attachmentId}/download?X-Requester-Id=${requesterId}`;
}

export async function removeAttachment(
  attachmentId: number,
  reason: string,
  requesterId: number
): Promise<RemoveAttachmentResult> {
  const res = await fetch(`${API_URL}/api/attachments/${attachmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Requester-Id": String(requesterId),
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove attachment");
  }
  return res.json();
}

export async function createTicket(
  payload: CreateTicketPayload,
  requesterId: number
): Promise<TicketResponse> {
  const res = await fetch(`${API_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requester-Id": String(requesterId),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create ticket");
  }

  return res.json();
}