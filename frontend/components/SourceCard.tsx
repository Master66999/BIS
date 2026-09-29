"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { SourceCitation } from "../types";

interface SourceCardProps {
  source: SourceCitation;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all overflow-hidden text-xs">
      {/* Top Header */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[11px] border border-amber-300">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {source.standard_number && (
                <span className="font-mono font-bold text-slate-900 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                  {source.standard_number}
                </span>
              )}
              {source.clause && (
                <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-medium text-[11px]">
                  {source.clause}
                </span>
              )}
              {source.page && (
                <span className="text-slate-500 text-[11px]">Page {source.page}</span>
              )}
            </div>
            <h4 className="font-semibold text-slate-800 mt-1 line-clamp-1 text-[12px]">
              {source.title}
            </h4>
          </div>
        </div>

        {source.source_url && (
          <a
            href={source.source_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-700 hover:text-amber-700 font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-amber-50 border border-blue-200 transition-colors flex-shrink-0"
          >
            <span>BIS Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Snippet / Clause preview */}
      {source.evidence_snippet && (
        <div className="p-3 text-slate-600 bg-white">
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
