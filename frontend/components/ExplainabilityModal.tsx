"use client";

import React from "react";
import { X, Sparkles, CheckCircle2, Layers, Cpu, Compass } from "lucide-react";
import { ExplainabilityData, SourceCitation } from "../types";

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ExplainabilityData;
  sources?: SourceCitation[];
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  data,
  sources = [],
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950">
              <Sparkles className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-bold text-base">Retrieval & Verification Audit</h3>
              <p className="text-xs text-slate-300">
                Transparent explanation of how this response was retrieved and verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Query Understanding Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Query Understanding & Intent Classification</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Detected Intent</span>
                <span className="font-semibold text-blue-900">{data.intent}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Language</span>
                <span className="font-semibold uppercase text-slate-800">{data.query_language}</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Confidence</span>
                <span className="font-semibold text-emerald-700">{data.confidence_level} ({Math.round(data.confidence_score * 100)}%)</span>
              </div>
            </div>

            {data.detected_entities && Object.keys(data.detected_entities).length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                <span className="text-[11px] font-medium text-slate-600 block mb-1">Extracted Entities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(data.detected_entities).map(([k, v]) =>
                    v ? (
                      <span key={k} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[11px]">
                        <strong>{k}:</strong> {String(v)}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Retrieval Engine */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Retrieval Strategy & Reranking</span>
              </div>
              {data.rl_action && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                  RL Agent Active
                </span>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Strategy:</strong> {data.search_strategy}
            </p>
            <p className="text-slate-600 mt-1">
              Cross-referenced against <strong>23,866 published Indian Standards</strong> and indexed clause repository.
            </p>

            {/* Reinforcement Learning Live Policy Parameters */}
            {data.rl_action && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-800">
                    Reinforcement Learning Retrieval Policy Weights
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Dynamic Top-K: {data.rl_action.top_k} docs
                  </span>
                </div>
                
                {/* Weight Ratio Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex mb-2">
                  <div
                    style={{ width: `${Math.round(data.rl_action.dense_weight * 100)}%` }}
                    className="bg-indigo-600 h-full transition-all duration-300"
                    title={`Dense Embedding: ${Math.round(data.rl_action.dense_weight * 100)}%`}
                  />
                  <div
                    style={{ width: `${Math.round(data.rl_action.bm25_weight * 100)}%` }}
                    className="bg-amber-500 h-full transition-all duration-300"
                    title={`BM25 Lexical: ${Math.round(data.rl_action.bm25_weight * 100)}%`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-indigo-50 border border-indigo-200 rounded p-1.5">
                    <span className="text-indigo-800 font-bold block">
                      {Math.round(data.rl_action.dense_weight * 100)}%
                    </span>
                    <span className="text-indigo-600">Dense Semantic</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded p-1.5">
                    <span className="text-amber-800 font-bold block">
                      {Math.round(data.rl_action.bm25_weight * 100)}%
                    </span>
                    <span className="text-amber-600">BM25 Lexical</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5">
                    <span className="text-emerald-800 font-bold block">
                      +{Math.round(data.rl_action.exact_boost * 100)}%
                    </span>
                    <span className="text-emerald-600">IS Exact Boost</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sources and Evidence Verified */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Consulted Evidence & Clauses ({sources.length})</span>
            </div>
            <div className="space-y-2">
              {sources.map((src, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
                  <div className="flex items-center justify-between font-medium text-slate-800">
                    <span className="text-blue-950 font-bold">
                      {src.standard_number || src.title}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {src.clause || "Section"} {src.page ? `• Page ${src.page}` : ""}
                    </span>
                  </div>
                  {src.evidence_snippet && (
                    <p className="text-slate-600 mt-1 italic line-clamp-2">
                      "{src.evidence_snippet}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#0A2540] text-white hover:bg-[#16385C] font-medium text-xs transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
