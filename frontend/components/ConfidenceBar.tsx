"use client";

import React from "react";
import "../app/footer.css";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface ConfidenceBarProps {
  confidence?: number;
  confidenceLevel?: "High" | "Medium" | "Low";
  score?: number;
  level?: "High" | "Medium" | "Low";
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  confidenceLevel,
  score,
  level,
}) => {
  const actualConfidence = confidence ?? score ?? 0.85;
  const actualLevel = confidenceLevel ?? level ?? (actualConfidence >= 0.75 ? "High" : actualConfidence >= 0.55 ? "Medium" : "Low");
  const percentage = Math.round(actualConfidence * 100);

  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-800 bg-emerald-50 border-emerald-300";
  let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;

  if (actualLevel === "Medium" || (actualConfidence >= 0.55 && actualConfidence < 0.75)) {
    barColor = "bg-blue-600";
    textColor = "text-blue-700 bg-blue-50 border-blue-200";
    icon = <Info className="w-3.5 h-3.5 text-blue-600" />;
  } else if (actualLevel === "Low" || actualConfidence < 0.55) {
    barColor = "bg-red-500";
    textColor = "text-red-700 bg-red-50 border-red-200";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
  }

  return (
    <div className="my-2.5 p-3 rounded-xl border bg-slate-50 border-slate-200">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          {icon}
          <span>Retrieval Confidence:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${textColor}`}>
            {actualLevel} ({percentage}%)
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Traceable Knowledge Engine</span>
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(10, percentage))}%` }}
        />
      </div>

      {actualLevel === "Low" && (
        <div className="mt-2.5 p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-950">Low confidence notice</p>
            <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
              The available indexed BIS sources do not provide sufficient statistical evidence to confirm every technical detail of this query. Please cross-verify with the official gazette notification on{" "}
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold hover:text-red-950"
              >
                manakonline.in
              </a>{" "}
              before regulatory decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

