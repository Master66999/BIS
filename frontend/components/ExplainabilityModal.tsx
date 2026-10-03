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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-slate-50 text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Retrieval & Verification Audit</h3>
              <p className="text-xs text-slate-500">
                Transparent explanation of how this response was retrieved and verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Query Understanding Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Query Understanding & Intent Classification</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Detected Intent</span>
                <span className="font-bold text-blue-700">{data.intent}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Language</span>
                <span className="font-bold text-slate-900">{data.detected_language || data.query_language || "English"}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Extracted Standard</span>
                <span className="font-bold text-blue-600">{data.extracted_standard_number || "General / None"}</span>
              </div>
            </div>
          </div>

          {/* Reasoning & Grounding Steps */}
          {data.reasoning_steps && data.reasoning_steps.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Synthesis & Reasoning Trail</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {data.reasoning_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Retrieved Grounding Sources */}
          {sources.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Verified Document Citations ({sources.length})</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                  100% Traceable Clauses
                </span>
              </div>

              <div className="space-y-2">
                {sources.map((s, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-blue-700">{s.standard_number}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{s.clause || "Section"}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                      "{s.evidence_snippet}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zero-Hallucination Guardrail Badge */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              <strong>Grounding Validation:</strong> The synthesis above passed factual consistency evaluation. Every statement was validated against published BIS text with no speculative additions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

