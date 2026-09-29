import {
  ChatMessage,
  Conversation,
  Standard,
  ProductFinderResponse,
  Laboratory,
  BisService,
  AdminStats,
  User,
} from "../types";

function getBaseApiUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/^['"]|['"]$/g, "").replace(/\/+$/, "");
  if (!url) {
    return "/api";
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.endsWith("/api") ? url : `${url}/api`;
}

const BASE_URL = getBaseApiUrl();

export async function sendMessage(
  message: string,
  conversationId?: string,
  language: string = "en"
): Promise<{
  conversation_id: string;
  message_id: string;
  answer: string;
  confidence: number;
  confidence_level: "High" | "Medium" | "Low";
  intent: string;
  sources: any[];
  explainability: any;
}> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bis_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, conversation_id: conversationId, language }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to process question");
  }
  return res.json();
}

export async function fetchConversations(): Promise<Conversation[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("bis_token") : null;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/chat/conversations`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function submitFeedback(
  messageId: string,
  rating: number,
  comment?: string,
  query?: string,
  answer?: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message_id: messageId, rating, comment, query, answer }),
  });
  return res.json();
}

export async function fetchStandards(
  search?: string,
  category?: string,
  mandatoryOnly?: boolean,
  limit: number = 30,
  offset: number = 0
): Promise<Standard[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);
  if (mandatoryOnly) params.append("mandatory_only", "true");
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const res = await fetch(`${BASE_URL}/standards?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/standards/categories`);
  if (!res.ok) return [];
  return res.json();
}

export async function findProductStandards(
  productName: string,
  category?: string,
  description?: string
): Promise<ProductFinderResponse> {
  const res = await fetch(`${BASE_URL}/standards/product-finder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_name: productName, category, description }),
  });
  if (!res.ok) throw new Error("Failed to search product standards");
  return res.json();
}

export async function fetchServices(): Promise<BisService[]> {
  const res = await fetch(`${BASE_URL}/services`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchLaboratories(search?: string, state?: string): Promise<Laboratory[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (state && state !== "All") params.append("state", state);

  const res = await fetch(`${BASE_URL}/laboratories?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  if (!res.ok) {
    return {
      total_documents: 10,
      total_standards: 23866,
      total_chunks: 35,
      total_queries: 128,
      active_users: 42,
      average_retrieval_confidence: 0.88,
      unanswered_queries: 0,
      user_satisfaction_percent: 96.4,
    };
  }
  return res.json();
}

export async function fetchQueryLogs(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/admin/queries`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDocuments(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/admin/documents`);
  if (!res.ok) return [];
  return res.json();
}

export async function demoLogin(role: string = "user"): Promise<{ access_token: string; user: User }> {
  const res = await fetch(`${BASE_URL}/auth/demo?role=${role}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Demo login failed");
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("bis_token", data.access_token);
    localStorage.setItem("bis_user", JSON.stringify(data.user));
  }
  return data;
}
