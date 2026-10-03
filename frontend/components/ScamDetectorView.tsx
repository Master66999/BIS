"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Search,
  ScanLine,
  FileCheck2,
  FileText,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Award,
  Layers,
  Scale,
  Zap,
  Info,
  Sliders,
  PhoneCall,
  Flame,
  ArrowRight
} from "lucide-react";
import { fetchVerifySamples, inspectProductLabel } from "../lib/api";
import { AuditDossierModal } from "./AuditDossierModal";

interface ScamDetectorViewProps {
  onAskAI?: (query: string) => void;
}

export function ScamDetectorView({ onAskAI }: ScamDetectorViewProps) {
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-helmet-fake");
  const [activeTab, setActiveTab] = useState<"preset" | "manual" | "ocr">("preset");
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Manual inspector state
  const [markType, setMarkType] = useState<string>("isi");
  const [productName, setProductName] = useState<string>("Motorcycle Helmet");
  const [isNumber, setIsNumber] = useState<string>("IS 4151");
  const [cmlNumber, setCmlNumber] = useState<string>("");
  const [huidCode, setHuidCode] = useState<string>("");
  const [rawText, setRawText] = useState<string>("");

  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await fetchVerifySamples();
        if (data && data.length > 0) {
          setSamples(data);
          runVerification("sample-helmet-fake");
        } else {
          runVerification("sample-helmet-fake");
        }
      } catch (e) {
        runVerification("sample-helmet-fake");
      }
    }
    loadPresets();
  }, []);

  const runVerification = async (sampleId?: string) => {
    setLoading(true);
    try {
      const res = await inspectProductLabel({
        sample_id: sampleId || selectedSampleId,
      });
      setScanResult(res);
    } catch (e) {
      console.error("Verification error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setLoading(true);
    try {
      const res = await inspectProductLabel({
        mark_type: markType,
        product_name: productName,
        is_number: isNumber,
        cml_number: cmlNumber,
        huid_code: huidCode,
      });
      setScanResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOcrSubmit = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const res = await inspectProductLabel({
        mark_type: markType,
        raw_label_text: rawText,
      });
      setScanResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isGenuine = scanResult?.is_genuine;
  const isFake = scanResult?.verdict?.includes("COUNTERFEIT") || scanResult?.verdict?.includes("SUB-STANDARD");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                Anti-Counterfeiting & Enforcement Engine
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Bureau of Indian Standards Act 2016 Enforcement
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              BIS Spurious Mark & Scam Detector
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Verify the authenticity of ISI marks, 6-digit Gold Hallmarking HUID codes, and CRS electronics marks. Detect fraudulent stamps, missing licence numbers, and illegal markings in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDossierOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Export Official Scam Dossier</span>
            </button>
            {onAskAI && scanResult && (
              <button
                onClick={() =>
                  onAskAI(
                    `Explain why this product mark for ${scanResult.product_name} was classified as ${scanResult.verdict} and detail the legal penalties under BIS Act Section 29.`
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition flex items-center gap-2 shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ask AI Assistant</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Inspection Educational Blueprint */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-blue-600" />
                <span>Regulatory Blueprint: Anatomy of a Legitimate BIS Mark</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every authentic mark must possess 3 mandatory geometric elements. Missing any of these is an immediate counterfeit indicator.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Traceable
              </span>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                Sec 29 Protected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Visual Blueprint A: ISI Mark Anatomy */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Scheme I: ISI Standard Mark
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Mandatory on 600+ Products
                </span>
              </div>

              {/* Graphic Mock of ISI Mark */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs space-y-2.5">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 text-xs font-mono font-bold">
                  ▲ 1. Indian Standard Number (e.g. IS 14543 or IS 4151)
                </div>
                
                {/* SVG ISI Monogram */}
                <div className="w-24 h-16 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-center p-1 font-black text-slate-900 font-serif leading-none shadow-xs">
                  <span className="text-2xl tracking-tighter text-blue-700">ISI</span>
                  <div className="w-16 h-[1.5px] bg-slate-900 my-0.5" />
                  <span className="text-[8px] font-mono tracking-widest uppercase text-slate-600">STANDARD</span>
                </div>

                <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-300 text-xs font-mono font-bold">
                  ▼ 2. Licence Number (CM/L-XXXXXXXX, 7 or 8 digits)
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Top:</strong> Published standard number matching exact product type.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bottom:</strong> Traceable factory CM/L licence code.</span>
                </div>
                <div className="flex items-start gap-2 text-red-700">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Counterfeit Clue:</strong> Stamping "ISI APPROVED" without CM/L or IS number.</span>
                </div>
              </div>
            </div>

            {/* Visual Blueprint B: Gold Hallmarking 3-Symbol Rule */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Scheme II: Gold Hallmarking (3-Symbol Rule)
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Mandatory Since April 2023
                </span>
              </div>

              {/* Graphic Mock of Hallmark Tri-Symbol */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-around text-center shadow-xs">
                
                {/* 1. BIS Triangle */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg shadow-xs">
                    ▲
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1">1. BIS Triangle</span>
                </div>

                <span className="text-slate-400 font-bold text-lg">+</span>

                {/* 2. Purity */}
                <div className="flex flex-col items-center">
                  <div className="px-3 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-bold text-amber-800 text-xs shadow-xs">
                    22K916
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1">2. Purity Grade</span>
                </div>

                <span className="text-slate-400 font-bold text-lg">+</span>

                {/* 3. 6-Digit HUID */}
                <div className="flex flex-col items-center">
                  <div className="px-3 h-11 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center font-mono font-black text-emerald-800 text-xs tracking-wider shadow-xs">
                    AB12CD
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-1">3. 6-Digit HUID</span>
                </div>

              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Unique HUID:</strong> 6-character laser engraving assigned by certified AHC lab.</span>
                </div>
                <div className="flex items-start gap-2 text-red-700">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Counterfeit Clue:</strong> Stamping obsolete "KDM" (toxic cadmium, banned since 2017).</span>
                </div>
                <div className="flex items-start gap-2 text-red-700">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Counterfeit Clue:</strong> Traditional 4-symbol stamping without 6-digit alphanumeric code.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Input & Evaluation Control Deck */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("preset")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "preset"
                    ? "bg-blue-600 text-white shadow-xs font-extrabold"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>1-Click Presets & Scam Cases</span>
              </button>
              
              <button
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "manual"
                    ? "bg-blue-600 text-white shadow-xs font-extrabold"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Manual Label Scanner</span>
              </button>

              <button
                onClick={() => setActiveTab("ocr")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === "ocr"
                    ? "bg-blue-600 text-white shadow-xs font-extrabold"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Text / OCR Analyzer</span>
              </button>
            </div>

            <span className="text-xs text-blue-700 font-mono font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              MODE: {activeTab.toUpperCase()}
            </span>
          </div>

          {/* TAB 1: PRESET SELECTION */}
          {activeTab === "preset" && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select a Real-World Inspection Case:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSampleId(s.id);
                      runVerification(s.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      selectedSampleId === s.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm text-slate-900"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{s.title}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        s.is_genuine
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {s.verdict}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{s.label_text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-500">
                      <span>Standard: {s.claimed_standard}</span>
                      {s.cml_number && <span>CM/L: {s.cml_number}</span>}
                      {s.huid_code && <span>HUID: {s.huid_code}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL LABEL SCANNER */}
          {activeTab === "manual" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">Certification Scheme</label>
                  <select
                    value={markType}
                    onChange={(e) => setMarkType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="isi">Scheme I: ISI Standard Mark</option>
                    <option value="hallmark">Scheme II: Gold Hallmarking (HUID)</option>
                    <option value="crs">Scheme III: CRS Electronics (R-XXXXXXXX)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Motorcycle Helmet, Packaged Water..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">Claimed Standard</label>
                  <input
                    type="text"
                    value={isNumber}
                    onChange={(e) => setIsNumber(e.target.value)}
                    placeholder="e.g. IS 4151, IS 14543..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {markType === "isi" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                      CM/L Licence Number (7 or 8 digits)
                    </label>
                    <input
                      type="text"
                      value={cmlNumber}
                      onChange={(e) => setCmlNumber(e.target.value)}
                      placeholder="e.g. CM/L-8400192 (Leave blank to test missing CM/L detection)"
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                )}

                {markType === "hallmark" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Laser Engraved HUID (6-Character Alphanumeric)
                    </label>
                    <input
                      type="text"
                      value={huidCode}
                      onChange={(e) => setHuidCode(e.target.value)}
                      placeholder="e.g. AB12CD or K9M4P2"
                      maxLength={6}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono uppercase bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={handleManualSubmit}
                    disabled={loading}
                    className="w-full px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Run Authenticity Scan</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OCR / RAW TEXT */}
          {activeTab === "ocr" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Paste Product Packaging Text</h3>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="e.g. ISI APPROVED - CERTIFIED UNDER IS 4151 CML-9128374..."
                className="w-full p-3.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-[11px] text-slate-500">
                  AI extracts CM/L licences, HUID codes, and standard numbers automatically.
                </span>
                <button
                  onClick={handleOcrSubmit}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Label Text</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* VERIFICATION VERDICT & LEGAL SCORECARD */}
        {scanResult && (
          <div className="space-y-6">
            
            {/* Top Verdict Banner */}
            <div
              className={`rounded-3xl p-6 border-2 transition-all shadow-sm ${
                isGenuine
                  ? "bg-emerald-50 text-slate-900 border-emerald-300"
                  : isFake
                  ? "bg-red-50 text-slate-900 border-red-300"
                  : "bg-amber-50 text-slate-900 border-amber-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isGenuine
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : isFake
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-amber-100 text-amber-700 border-amber-300"
                    }`}
                  >
                    {isGenuine ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                        Official BIS Regulatory Assessment:
                      </span>
                      <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-white text-slate-800 border border-slate-200">
                        Hash: {scanResult.verification_hash}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-slate-900">
                      {scanResult.verdict}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      {scanResult.product_name} • Claimed Standard: <strong className="text-slate-800">{scanResult.standard_applied}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 shrink-0 bg-white p-4 rounded-2xl shadow-xs">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Confidence</span>
                    <span className="text-2xl font-black font-mono text-blue-600">
                      {scanResult.confidence_score}%
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Status</span>
                    <span className={`text-xs font-black font-mono px-3 py-1 rounded-full ${
                      isGenuine ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {isGenuine ? "AUTHORIZED" : "UNLAWFUL"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Red Alert Violations Callout (if counterfeit) */}
            {scanResult.anomalies && scanResult.anomalies.length > 0 && (
              <div className="bg-red-50 rounded-3xl p-6 border border-red-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Detected Regulatory Infractions & Counterfeiting Flags:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scanResult.anomalies.map((anom: string, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-red-200 flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-red-800 font-semibold">{anom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Checks Audit Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Rule-by-Rule Scrutiny Evidence</h3>
                    <p className="text-[11px] text-slate-500">Cross-examined against BIS Conformity Assessment Regulations</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Inspection Parameter</th>
                      <th className="py-3 px-4">Findings & Measured Markings</th>
                      <th className="py-3 px-4">Governing Legal Clause</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scanResult.detailed_checks?.map((chk: any, idx: number) => {
                      const isFail = chk.status === "FAIL";
                      const isWarn = chk.status === "WARNING";
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {chk.check_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-md">
                            {chk.details}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700 font-medium">
                            {chk.law_clause || "—"}
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
                              {chk.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Criminal Legal Liability Notice (Section 29) */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border-l-4 border-red-600 space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm text-red-400">
                  {scanResult.legal_warning?.act_title || "Section 29, Bureau of Indian Standards Act, 2016"}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                "{scanResult.legal_warning?.penalty_description}"
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Enforcement Body: <strong className="text-white">{scanResult.legal_warning?.jurisdiction}</strong></span>
                <span className="text-red-400 font-bold">Cognizable Criminal Offence</span>
              </div>
            </div>

            {/* Consumer Protection Next Steps & BIS Care Link */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-emerald-900">Immediate Consumer Protection Actions</h3>
                </div>
                <a
                  href="https://www.bis.gov.in/consumer-affairs/complaints/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                >
                  <span>File Complaint on BIS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {scanResult.consumer_action_steps?.map((step: string, i: number) => (
                  <div key={i} className="p-3.5 bg-white rounded-xl border border-emerald-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Official BIS Audit Dossier Export Modal */}
        <AuditDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          dossierType="verify"
          title="Official Spurious Mark & Counterfeit Inspection Record"
          data={scanResult}
        />

      </div>
    </div>
  );
}
