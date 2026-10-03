"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { SourceCitation } from "../types";

interface SourceCardProps {
  source: SourceCitation;
  index: number;
  onSelect?: (source: any) => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => onSelect?.(source)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all overflow-hidden text-xs cursor-pointer"
    >
      {/* Top Header */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[11px] border border-blue-200 flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {source.source_type && (
                <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {source.source_type}
                </span>
              )}
              {source.standard_number && (
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[11px]">
                  {source.standard_number}
                </span>
              )}
              {source.booklet_name && (
                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium text-[10px] border border-slate-200">
                  {source.department ? `${source.department} - ` : ""}{source.booklet_name}
                </span>
              )}
              {source.clause && (
                <span className="bg-white text-slate-700 px-1.5 py-0.5 rounded font-medium text-[11px] border border-slate-200">
                  {source.clause}
                </span>
              )}
              {source.page && (
                <span className="text-slate-500 font-medium text-[11px]">Page {source.page}</span>
              )}
              {source.final_score !== undefined && (
                <span className="text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  Match: {Math.round(source.final_score * 100)}%
                </span>
              )}
            </div>
            <h4 className="font-semibold text-slate-900 mt-1 line-clamp-1 text-[12px]">
              {source.title}
            </h4>
          </div>
        </div>

        {source.source_url && (
          <a
            href={source.source_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded bg-white border border-slate-200 hover:border-blue-300 transition-colors flex-shrink-0"
          >
            <span>BIS Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Snippet / Clause preview */}
      {source.evidence_snippet && (
        <div className="p-3 text-slate-700 bg-white">
          <p className={`leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            "{source.evidence_snippet}"
          </p>

          {source.evidence_snippet.length > 130 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 text-[11px]"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Full Clause Evidence <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

