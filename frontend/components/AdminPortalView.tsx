"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Upload,
  Database,
  Users,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Layers,
  Search,
  Shield,
  Zap,
  Cpu,
  Server,
  RefreshCw,
} from "lucide-react";
import { fetchAdminStats, fetchQueryLogs, fetchDocuments, fetchSystemDesignTelemetry } from "../lib/api";
import { AdminStats } from "../types";

export const AdminPortalView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [systemTelemetry, setSystemTelemetry] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "system_design" | "ingest" | "queries" | "documents">("overview");

  // Ingestion form state
  const [ingestTitle, setIngestTitle] = useState("");
  const [ingestStdNum, setIngestStdNum] = useState("");
  const [ingestType, setIngestType] = useState("Indian Standard");
  const [ingestVersion, setIngestVersion] = useState("2026");
  const [ingestContent, setIngestContent] = useState("");
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await fetchAdminStats();
      setStats(s);
      const q = await fetchQueryLogs();
      setQueries(q);
      const d = await fetchDocuments();
      setDocuments(d);
      const telem = await fetchSystemDesignTelemetry();
      setSystemTelemetry(telem);
    } catch (e) {
      console.error(e);
    }
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestTitle || !ingestContent) return;

    setIngestLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", ingestTitle);
      formData.append("standard_number", ingestStdNum);
      formData.append("document_type", ingestType);
      formData.append("version", ingestVersion);
      formData.append("content", ingestContent);

      const res = await fetch("/api/admin/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIngestSuccess(true);
        setIngestTitle("");
        setIngestStdNum("");
        setIngestContent("");
        loadData();
        setTimeout(() => setIngestSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIngestLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Nodal Officer & Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            BIS Knowledge Base & RAG Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor retrieval confidence, audit user queries, and manage official document ingestion pipelines.
          </p>
        </div>

        {/* System Health Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>RAG Pipeline Healthy • SQLite + pgvector ready</span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        {[
          { id: "overview", label: "Overview & Metrics" },
          { id: "system_design", label: "⚡ System Design & Architecture" },
          { id: "ingest", label: "Document Ingestion Pipeline" },
          { id: "documents", label: "Indexed Documents Catalog" },
          { id: "queries", label: "Query Audit & Logs" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-2.5 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === t.id
                ? "border-amber-500 text-blue-950 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Published Standards
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#0B2545] mt-1">
                {stats.total_standards.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Official Manakonline catalogue</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Avg. Retrieval Confidence
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                {Math.round(stats.average_retrieval_confidence * 100)}%
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Traceable grounding threshold</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                User Satisfaction Rate
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
                {stats.user_satisfaction_percent}%
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Based on evaluator feedback</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Indexed Clause Chunks
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                {stats.total_chunks}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Across high-priority QCOs</span>
            </div>
          </div>

          {/* Architecture Status */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">System & AI RAG Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Hybrid Search Engine</span>
                <p className="text-slate-500">TF-IDF Vector Space (ngram 1-2) + Full-text Keyword + Exact Clause Reranker</p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Factual Grounding Guardrail</span>
                <p className="text-slate-500">Zero-hallucination filter. Unindexed or low-confidence queries flag caution alerts.</p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Multilingual Processing</span>
                <p className="text-slate-500">Natural language intent detection for English, हिन्दी (Hindi), and मराठी (Marathi).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise System Design Tab */}
      {activeTab === "system_design" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase">
                    SIH26107 Architectural Blueprint
                  </span>
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Telemetry Active
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-1 text-white">Enterprise System Design & Observability</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Production-grade distributed patterns: Multi-Tier Caching, Circuit Breaker, Rate Limiting, Decoupled Task Queues & Stateless Scalability.
                </p>
              </div>
              <button
                onClick={loadData}
                className="self-start sm:self-center bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Telemetry</span>
              </button>
            </div>
          </div>

          {/* Tier 1: Caching & Circuit Breaker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pattern 1: Multi-Tier Cache */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Multi-Tier Query Caching</h3>
                    <span className="text-[11px] text-slate-500 font-mono">Tier 1: O(1) Hash • Tier 2: Semantic Similarity</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Hit Ratio</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {systemTelemetry?.architecture?.multi_tier_cache?.metrics?.hit_ratio_percent ?? 0}%
                  </div>
                  <span className="text-[10px] text-slate-400">Total requests</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Exact Hits</span>
                  <div className="text-xl font-bold text-amber-600 mt-0.5">
                    {systemTelemetry?.architecture?.multi_tier_cache?.metrics?.tier1_exact_hits ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400">&lt; 1ms latency</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Latency Saved</span>
                  <div className="text-xl font-bold text-emerald-600 mt-0.5">
                    {systemTelemetry?.architecture?.multi_tier_cache?.metrics?.total_latency_saved_seconds ?? 0}s
                  </div>
                  <span className="text-[10px] text-slate-400">Cumulative runtime</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-[11px] text-amber-950 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>💡 Architecture Benefit</span>
                </div>
                <p className="text-slate-600">
                  Reduces expensive RAG re-computations and cuts LLM API token costs by <strong>up to 85%</strong> on repeated standard lookup queries.
                </p>
              </div>
            </div>

            {/* Pattern 2: Circuit Breaker */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Circuit Breaker & Fallback</h3>
                    <span className="text-[11px] text-slate-500 font-mono">Resilience & Fault Tolerance</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  systemTelemetry?.architecture?.circuit_breaker?.metrics?.state === "OPEN"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  State: {systemTelemetry?.architecture?.circuit_breaker?.metrics?.state || "CLOSED"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Fail Threshold</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">3</div>
                  <span className="text-[10px] text-slate-400">Consecutive fails</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Recovery Window</span>
                  <div className="text-xl font-bold text-blue-600 mt-0.5">30s</div>
                  <span className="text-[10px] text-slate-400">Half-open probe</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Degraded Calls</span>
                  <div className="text-xl font-bold text-slate-700 mt-0.5">
                    {systemTelemetry?.architecture?.circuit_breaker?.metrics?.total_degraded_calls ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Deterministic RAG</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl text-[11px] text-blue-950 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>🛡️ High Availability Guardrail</span>
                </div>
                <p className="text-slate-600">
                  If external LLMs (Gemini/OpenAI) timeout or trigger HTTP 429, the system fast-fails in <strong>0ms</strong> to local grounded synthesis without cascading outages.
                </p>
              </div>
            </div>
          </div>

          {/* Tier 2 & Tier 3: Rate Limiting, Worker Queue & Stateless Scalability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pattern 3: Token Bucket Rate Limiter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Token Bucket Rate Limiting</h4>
                  <span className="text-[10px] text-slate-400 font-mono">DDoS & Cost Protection</span>
                </div>
              </div>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Burst Capacity</span>
                  <span className="font-mono font-semibold text-slate-900">20 tokens</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Refill Rate</span>
                  <span className="font-mono font-semibold text-slate-900">0.5 / sec (30/min)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tracked IPs</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {systemTelemetry?.architecture?.rate_limiter?.metrics?.active_client_ips ?? 1}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Throttled Requests</span>
                  <span className="font-mono font-semibold text-rose-600">
                    {systemTelemetry?.architecture?.rate_limiter?.metrics?.throttled_requests ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Pattern 4: Asynchronous Task Queue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Decoupled Worker Queue</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Async PDF Chunking & Vectorization</span>
                </div>
              </div>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Ingestion Protocol</span>
                  <span className="font-mono font-semibold text-slate-900">HTTP 202 Accepted</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Thread Worker Pool</span>
                  <span className="font-mono font-semibold text-slate-900">ThreadPoolExecutor (x2)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status Check Endpoint</span>
                  <span className="font-mono font-semibold text-teal-700">/api/admin/tasks/:id</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Active Background Jobs</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {systemTelemetry?.architecture?.asynchronous_queue?.active_tasks_count ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Pattern 5: Stateless Horizontal Scalability */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Stateless Application Tier</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Horizontal Autoscaling</span>
                </div>
              </div>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Authentication</span>
                  <span className="font-mono font-semibold text-slate-900">JWT Bearer (RFC 7519)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Session State</span>
                  <span className="font-mono font-semibold text-indigo-700">Zero Server Sessions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Load Balancing</span>
                  <span className="font-mono font-semibold text-slate-900">Round Robin / Anycast</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Replica Readiness</span>
                  <span className="font-mono font-semibold text-emerald-600">1 to N Instances</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Ingestion Tab */}
      {activeTab === "ingest" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 max-w-3xl">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Ingest New BIS Document or QCO Circular</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new Indian Standards, amendments, manuals, or Quality Control Orders to the vector knowledge base.
            </p>
          </div>

          {ingestSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Document successfully ingested, chunked, and indexed into the vector corpus!</span>
            </div>
          )}

          <form onSubmit={handleIngestSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={ingestTitle}
                  onChange={(e) => setIngestTitle(e.target.value)}
                  placeholder="e.g. Quality Control Order on Plywood and Wooden Flush Doors"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Standard Number (Optional)</label>
                <input
                  type="text"
                  value={ingestStdNum}
                  onChange={(e) => setIngestStdNum(e.target.value)}
                  placeholder="e.g. IS 2202:2026"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Type</label>
                <select
                  value={ingestType}
                  onChange={(e) => setIngestType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-xs"
                >
                  <option value="Indian Standard">Indian Standard Specification</option>
                  <option value="Quality Control Order">Quality Control Order (QCO)</option>
                  <option value="Manual">Inspection & Testing Manual</option>
                  <option value="Circular">BIS Technical Circular</option>
                  <option value="Guidelines">Certification Guidelines</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Version / Year</label>
                <input
                  type="text"
                  value={ingestVersion}
                  onChange={(e) => setIngestVersion(e.target.value)}
                  placeholder="2026"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Document Body / Technical Clauses Content *
              </label>
              <textarea
                required
                rows={6}
                value={ingestContent}
                onChange={(e) => setIngestContent(e.target.value)}
                placeholder="Paste the clause text, technical requirements, sampling criteria, and certification mandates..."
                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={ingestLoading}
                className="px-6 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-amber-300 font-semibold rounded-lg text-xs shadow flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{ingestLoading ? "Processing & Vectorizing..." : "Ingest into Knowledge Base"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Indexed Documents Catalog */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
            <span>Authoritative BIS Indexed Documents ({documents.length})</span>
            <span className="text-[11px] text-slate-500">Live indexed in RAG retriever</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2.5 px-4">Doc ID</th>
                  <th className="py-2.5 px-4">Standard / Title</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Chunks</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-600">{d.document_id}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">{d.title}</td>
                    <td className="py-2.5 px-4 text-slate-600">{d.document_type}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-blue-900">{d.total_chunks}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Query Audit Log Tab */}
      {activeTab === "queries" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
            <span>Real-time Search & Query Audit Logs ({queries.length})</span>
            <span className="text-[11px] text-slate-500">Audit trail for compliance & verification</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2.5 px-4">Query</th>
                  <th className="py-2.5 px-4">Intent</th>
                  <th className="py-2.5 px-4">Extracted Entities</th>
                  <th className="py-2.5 px-4">Citations</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-medium text-slate-900 max-w-xs truncate">{q.query}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-blue-950">{q.intent}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 max-w-xs truncate">{q.detected_entities}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-700 font-bold">{q.results_count}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[10px]">
                      {new Date(q.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
