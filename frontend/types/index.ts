export interface SourceCitation {
  document_id?: string;
  title: string;
  standard_number?: string;
  clause?: string;
  sub_clause?: string;
  page?: number;
  source_url?: string;
  relevance_score?: number;
  evidence_snippet?: string;
  source_type?: string;
  booklet_name?: string;
  department?: string;
  rerank_score?: number;
  final_score?: number;
}

export interface ExplainabilityData {
  intent: string;
  detected_entities: Record<string, any>;
  query_language: string;
  detected_language?: string;
  extracted_standard_number?: string;
  reasoning_steps?: string[];
  retrieved_documents_count: number;
  confidence_level: "Very High" | "High" | "Medium" | "Low";
  confidence_score: number;
  search_strategy: string;
  reasoning_summary?: string;
  timing_ms?: {
    retrieval_ms?: number;
    rerank_ms?: number;
    total_ms?: number;
  };
  confidence_breakdown?: Record<string, any>;
  reranker_applied?: boolean;
  rl_action?: {
    dense_weight: number;
    bm25_weight: number;
    exact_boost: number;
    top_k: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  intent?: string;
  confidence?: number;
  confidence_level?: "High" | "Medium" | "Low";
  sources?: SourceCitation[];
  explainability?: ExplainabilityData;
  created_at?: string;
}

export interface Conversation {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface Standard {
  id: number;
  standard_number: string;
  title: string;
  date_of_publish?: string;
  type_of_standard?: string;
  degree_of_equivalence?: string;
  product_category?: string;
  is_mandatory?: boolean;
  certification_scheme?: string;
  summary?: string;
  key_requirements?: string;
  source_url?: string;
}

export interface ProductFinderResult {
  standard_number: string;
  title: string;
  product_category: string;
  relevance: string;
  is_mandatory: boolean;
  certification_scheme: string;
  key_requirements: string[];
  testing_requirements: string[];
  source_url?: string;
  clauses: string[];
}

export interface ProductFinderResponse {
  query_product: string;
  detected_category: string;
  overview: string;
  standards: ProductFinderResult[];
}

export interface Laboratory {
  id: number;
  lab_name: string;
  state: string;
  city: string;
  address?: string;
  contact?: string;
  accredited_scope?: string;
  recognized_standards?: string;
  status: string;
}

export interface BisService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  portal_url: string;
  key_features: string[];
  faqs: { q: string; a: string }[];
}

export interface AdminStats {
  total_documents: number;
  total_standards: number;
  total_chunks: number;
  total_queries: number;
  active_users: number;
  average_retrieval_confidence: number;
  unanswered_queries: number;
  user_satisfaction_percent: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  organization?: string;
}
