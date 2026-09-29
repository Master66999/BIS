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
} from "lucide-react";
import { fetchAdminStats, fetchQueryLogs, fetchDocuments } from "../lib/api";
import { AdminStats } from "../types";

export const AdminPortalView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "ingest" | "queries" | "documents">("overview");

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
