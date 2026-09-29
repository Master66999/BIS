"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface ConfidenceBarProps {
  confidence: number;
  confidenceLevel: "High" | "Medium" | "Low";
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  confidenceLevel,
}) => {
  const percentage = Math.round(confidence * 100);

  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;

  if (confidenceLevel === "Medium" || (confidence >= 0.55 && confidence < 0.75)) {
    barColor = "bg-amber-500";
    textColor = "text-amber-800 bg-amber-50 border-amber-200";
    icon = <Info className="w-3.5 h-3.5 text-amber-600" />;
  } else if (confidenceLevel === "Low" || confidence < 0.55) {
    barColor = "bg-rose-500";
    textColor = "text-rose-800 bg-rose-50 border-rose-200";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
  }

  return (
    <div className="my-2.5 p-3 rounded-lg border bg-slate-50/70 border-slate-200">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          {icon}
          <span>Retrieval Confidence:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${textColor}`}>
            {confidenceLevel} ({percentage}%)
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Traceable Knowledge Engine</span>
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(10, percentage))}%` }}
        />
      </div>

      {confidenceLevel === "Low" && (
        <div className="mt-2.5 p-2.5 bg-rose-50 rounded-md border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Low confidence notice</p>
            <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
              The available indexed BIS sources do not provide sufficient statistical evidence to confirm every technical detail of this query. Please cross-verify with the official gazette notification on{" "}
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold hover:text-rose-900"
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
