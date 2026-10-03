"use client";

import React, { useState, useEffect } from "react";
import "../app/footer.css";
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  Printer,
  ChevronRight,
  Shield,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
  Calendar,
  Layers,
  FlaskConical,
  Award,
  Zap,
  Info
} from "lucide-react";
import { fetchAuditSamples, inspectTestReport } from "../lib/api";
import { AuditDossierModal } from "./AuditDossierModal";

interface ReportInspectorViewProps {
  onAskAI?: (query: string) => void;
}

export function ReportInspectorView({ onAskAI }: ReportInspectorViewProps) {
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-tmt-fail");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preset" | "upload" | "custom">("preset");
  const [customParams, setCustomParams] = useState({
    yield_strength: 492,
    tensile_strength: 574,
    elongation: 16.5,
    carbon: 0.22,
    sulphur: 0.043,
  });

  // Load preset sample reports on mount
  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await fetchAuditSamples();
        if (data && data.length > 0) {
          setSamples(data);
          runInspection(data[0].id);
        } else {
          runInspection("sample-tmt-fail");
        }
      } catch (e) {
        runInspection("sample-tmt-fail");
      }
    }
    loadPresets();
  }, []);

  const runInspection = async (sampleId?: string) => {
    setLoading(true);
    try {
      const res = await inspectTestReport({
        sample_id: sampleId || selectedSampleId,
      });
      setAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async () => {
    setLoading(true);
    try {
      const formattedParams = [
        { param_key: "proof_stress", measured_value: Number(customParams.yield_strength) },
        { param_key: "tensile_strength", measured_value: Number(customParams.tensile_strength) },
        {
          param_key: "ts_ys_ratio",
          measured_value: Number(
            (Number(customParams.tensile_strength) / Number(customParams.yield_strength || 1)).toFixed(3)
          ),
        },
        { param_key: "elongation", measured_value: Number(customParams.elongation) },
        { param_key: "carbon", measured_value: Number(customParams.carbon) },
        { param_key: "sulphur", measured_value: Number(customParams.sulphur) },
        { param_key: "phosphorus", measured_value: 0.038 },
        { param_key: "s_plus_p", measured_value: Number((Number(customParams.sulphur) + 0.038).toFixed(3)) },
      ];

      const res = await inspectTestReport({
        standard_code: "IS 1786",
        sample_metadata: {
          sample_name: "Manual Parameter Scrutiny — Fe 500D TMT Bar",
          manufacturer: "Factory In-House Quality Assurance",
          heat_no: "LIVE-INPUT-LOT",
          nominal_size: "16 mm Dia Rebar",
          test_date: new Date().toISOString().split("T")[0],
          lab_name: "Testing & Inspection System",
          sample_type: "Live Scrutiny Simulation",
        },
        parameters: formattedParams,
      });
      setAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRawTextSubmit = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const res = await inspectTestReport({
        raw_text: rawText,
      });
      setAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const evalData = auditResult?.evaluation;
  const metaData = auditResult?.sample_metadata;
  const isPassed = evalData?.overall_verdict === "PASS";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                SIH26107 AI Innovation
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Automated Regulatory Scrutiny Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Lab Test Report & MTC Inspector
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Upload or test factory Mill Test Certificates (MTC) and laboratory reports. The AI cross-examines measured values against published Indian Standards clauses in real-time, detecting sub-standard batches before dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDossierOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Export Official Dossier</span>
            </button>
            {onAskAI && evalData && (
              <button
                onClick={() =>
                  onAskAI(
                    `Explain why this test report for ${evalData.standard_title} received a ${evalData.overall_verdict} verdict and detail the non-conforming clauses.`
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition flex items-center gap-2 shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ask AI Co-Pilot</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Selector Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("preset")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "preset"
                ? "bg-blue-600 text-white shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Preset Authentic Test Reports</span>
            <span className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono font-bold">1-Click Demo</span>
          </button>

          <button
            onClick={() => setActiveTab("custom")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "custom"
                ? "bg-blue-600 text-white shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Interactive Parameter Sliders</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Raw Text & Certificate Upload</span>
          </button>
        </div>

        {/* Tab 1: Preset Samples */}
        {activeTab === "preset" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "sample-tmt-fail",
                title: "Fe 500D TMT Rebar (IS 1786)",
                subtitle: "Sub-Standard Heat Lot (Violates YS & Sulphur)",
                verdict: "FAIL",
                accent: "border-red-200 bg-red-50/40",
                badgeColor: "bg-red-50 text-red-700 border-red-200",
                icon: AlertTriangle,
                desc: "Demonstrates high sulphur and low proof stress in structural construction steel.",
              },
              {
                id: "sample-concrete-cube",
                title: "M25 Grade Concrete (IS 456)",
                subtitle: "28-Day Hydraulic Compression Cube Test",
                verdict: "PASS",
                accent: "border-emerald-200 bg-emerald-50/40",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle2,
                desc: "Validates 28.4 MPa characteristic strength against 25 MPa requirement.",
              },
              {
                id: "sample-water-pass",
                title: "Packaged Water (IS 14543)",
                subtitle: "Pre-Dispatch Physical, Chemical & Lead Analysis",
                verdict: "PASS",
                accent: "border-emerald-200 bg-emerald-50/40",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle2,
                desc: "Verifies pH, TDS, Turbidity and heavy metal limits for ISI Mark compliance.",
              },
            ].map((s) => {
              const isSelected = selectedSampleId === s.id;
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSampleId(s.id);
                    runInspection(s.id);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${s.accent} ${
                    isSelected
                      ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/40 shadow-sm"
                      : "bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border font-mono ${s.badgeColor}`}>
                        Expected: {s.verdict}
                      </span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{s.title}</h3>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{s.subtitle}</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>{isSelected ? "Currently Auditing ✓" : "Run Audit"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Interactive Parameter Sliders */}
        {activeTab === "custom" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Interactive TMT Rebar Fe 500D (IS 1786:2008) Scrutiny Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust values to observe how the AI flags borderline compliance and critical clause violations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Proof Stress */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">0.2% Proof Stress (Yield)</label>
                  <span className="font-mono font-extrabold text-blue-600">{customParams.yield_strength} MPa</span>
                </div>
                <input
                  type="range"
                  min="460"
                  max="540"
                  step="1"
                  value={customParams.yield_strength}
                  onChange={(e) => setCustomParams({ ...customParams, yield_strength: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-500 block">
                  Mandatory Limit: <strong className="text-slate-800">Min 500 MPa</strong> (Clause 8.1, Table 3)
                </span>
              </div>

              {/* Tensile Strength */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">Tensile Strength (UTS)</label>
                  <span className="font-mono font-extrabold text-blue-600">{customParams.tensile_strength} MPa</span>
                </div>
                <input
                  type="range"
                  min="520"
                  max="620"
                  step="2"
                  value={customParams.tensile_strength}
                  onChange={(e) => setCustomParams({ ...customParams, tensile_strength: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-500 block">
                  Mandatory Limit: <strong className="text-slate-800">Min 565 MPa</strong>
                </span>
              </div>

              {/* Elongation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">Total Elongation</label>
                  <span className="font-mono font-extrabold text-blue-600">{customParams.elongation}%</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="22"
                  step="0.5"
                  value={customParams.elongation}
                  onChange={(e) => setCustomParams({ ...customParams, elongation: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-500 block">
                  Mandatory Limit: <strong className="text-slate-800">Min 16.0%</strong>
                </span>
              </div>

              {/* Carbon */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">Carbon Content (C)</label>
                  <span className="font-mono font-extrabold text-blue-600">{customParams.carbon}%</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.32"
                  step="0.01"
                  value={customParams.carbon}
                  onChange={(e) => setCustomParams({ ...customParams, carbon: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-500 block">
                  Mandatory Limit: <strong className="text-slate-800">Max 0.25%</strong> (Clause 4.2)
                </span>
              </div>

              {/* Sulphur */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">Sulphur Content (S)</label>
                  <span className="font-mono font-extrabold text-blue-600">{customParams.sulphur}%</span>
                </div>
                <input
                  type="range"
                  min="0.020"
                  max="0.060"
                  step="0.001"
                  value={customParams.sulphur}
                  onChange={(e) => setCustomParams({ ...customParams, sulphur: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-500 block">
                  Mandatory Limit: <strong className="text-slate-800">Max 0.040%</strong>
                </span>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCustomSubmit}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>Execute Parameter Audit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Raw Text & File Upload */}
        {activeTab === "upload" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Paste Mill Certificate or Lab Report Text</h3>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Mill Test Certificate No: MTC-8891. Grade: Fe 500D. Yield Strength: 494 MPa. Tensile: 570 MPa. Carbon: 0.24%..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-[11px] text-slate-500">
                The AI text parser will automatically extract parameters and match with IS 1786 / IS 456 limits.
              </span>
              <button
                onClick={handleRawTextSubmit}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Parse & Evaluate Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Audit Scorecard & Executive Decision Dashboard */}
        {evalData && (
          <div className="space-y-6">
            
            {/* Top Verdict Banner */}
            <div
              className={`rounded-3xl p-6 border-2 transition-all shadow-sm ${
                isPassed
                  ? "bg-emerald-50 text-slate-900 border-emerald-300"
                  : "bg-red-50 text-slate-900 border-red-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Verdict Status */}
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isPassed
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider ${
                          isPassed ? "bg-emerald-600 text-white" : "bg-red-600 text-white animate-pulse"
                        }`}
                      >
                        {evalData.overall_verdict === "PASS" ? "CONFORMING (PASS)" : "NON-CONFORMING (REJECTED)"}
                      </span>
                      <span className="text-xs text-slate-600 font-mono">
                        Standard: <strong className="text-slate-800">{evalData.standard_code}</strong> ({evalData.grade})
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 text-slate-900">
                      {isPassed
                        ? "Sample Satisfies All Mandatory Indian Standard Clauses"
                        : `Critical Non-Conformance Detected: ${evalData.failed_count} Parameters Failed`}
                    </h2>

                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                      {isPassed
                        ? "Batch conforms with the Scheme of Testing & Inspection (STI). Lot is approved for ISI Mark stamping."
                        : "Sub-standard test results violate statutory limits under Bureau of Indian Standards Act, 2016. Do NOT dispatch."}
                    </p>
                  </div>
                </div>

                {/* Right: Key Audit Metrics Grid */}
                <div className="flex items-center gap-4 sm:gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs shrink-0 self-stretch sm:self-auto justify-around">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Score</span>
                    <span
                      className={`text-2xl font-black font-mono ${
                        evalData.compliance_score >= 80 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {evalData.compliance_score}%
                    </span>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Audited</span>
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {evalData.total_parameters_audited}
                    </span>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Failed</span>
                    <span className="text-2xl font-black font-mono text-red-600">
                      {evalData.failed_count}
                    </span>
                  </div>
                </div>

              </div>

              {/* Sample Meta Ribbon */}
              {metaData && (
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>Facility:</strong> {metaData.manufacturer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>Heat/Batch:</strong> {metaData.heat_no}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>Test Date:</strong> {metaData.test_date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Critical Legal Warning if Failed */}
            {!isPassed && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-900 flex items-start gap-3.5 text-xs shadow-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-red-950">
                    Statutory Compliance Warning (Section 29, BIS Act, 2016)
                  </h4>
                  <p className="text-red-800 leading-relaxed">
                    Applying an ISI Mark to non-conforming goods is a cognizable legal offence punishable with imprisonment up to 2 years or fine not less than ₹2,00,000. Immediate lot quarantine and recalibration of in-house testing equipment is required.
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Parameter Scrutiny Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Comprehensive Clause-by-Clause Scrutiny</h3>
                  <p className="text-xs text-slate-500">Every parameter cross-referenced with official standard tolerances</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {evalData.passed_count} Passed • {evalData.failed_count} Failed • {evalData.warning_count} Warning
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Parameter & Test Method</th>
                      <th className="py-3 px-4">Measured Value</th>
                      <th className="py-3 px-4">Mandatory IS Limit</th>
                      <th className="py-3 px-4">Standard Clause Ref</th>
                      <th className="py-3 px-4">Deviation</th>
                      <th className="py-3 px-4">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evalData.parameters.map((param: any, idx: number) => {
                      const isFail = param.status === "FAIL";
                      const isWarn = param.status === "WARNING";
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            isFail ? "bg-red-50/50" : isWarn ? "bg-amber-50/50" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              {param.critical && (
                                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" title="Critical Parameter" />
                              )}
                              <span>{param.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                              Method: {param.test_method}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                            {param.measured_value} {param.unit}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {param.required_limit}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-blue-700 text-[11px] font-medium">
                            {param.clause}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {param.deviation_pct !== 0 ? (
                              <span className={param.deviation_pct < 0 ? "text-red-600 font-bold" : "text-amber-600 font-bold"}>
                                {param.deviation_pct > 0 ? `+${param.deviation_pct}%` : `${param.deviation_pct}%`}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                                isFail
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : isWarn
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {isFail ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {param.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actionable Engineering & Corrective Guidance */}
            {evalData.corrective_actions && evalData.corrective_actions.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Recommended Engineering & Corrective Protocol</h3>
                    <p className="text-[11px] text-slate-500">Action items for factory Quality Control Manager</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {evalData.corrective_actions.map((action: string, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 leading-relaxed font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Official BIS Audit Dossier Export Modal */}
        <AuditDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          dossierType="inspector"
          title="Official MTC Lab Test Report Scrutiny Record"
          data={auditResult}
        />

      </div>
    </div>
  );
}
