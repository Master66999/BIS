"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  FlaskConical,
  Award,
  Zap,
  CheckCircle2,
  FileCheck2,
  Printer,
  ChevronRight,
  AlertTriangle,
  Clock,
  Coins,
  ShieldAlert,
  Percent,
  Check,
  TrendingDown
} from "lucide-react";
import { fetchJourneyProducts, generateComplianceJourney } from "../lib/api";
import { AuditDossierModal } from "./AuditDossierModal";

interface ComplianceJourneyViewProps {
  onAskAI?: (query: string) => void;
}

export function ComplianceJourneyView({ onAskAI }: ComplianceJourneyViewProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("packaged-water");
  const [enterpriseType, setEnterpriseType] = useState<string>("micro");
  const [isWomenOwned, setIsWomenOwned] = useState<boolean>(true);
  const [procedureType, setProcedureType] = useState<string>("simplified");
  const [journeyData, setJourneyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [activeStageTab, setActiveStageTab] = useState<number>(1);

  // Load products on mount
  useEffect(() => {
    async function loadData() {
      try {
        const prods = await fetchJourneyProducts();
        if (prods && prods.length > 0) {
          setProducts(prods);
        }
      } catch (e) {
        console.error(e);
      }
      loadJourney("packaged-water", "micro", true, "simplified");
    }
    loadData();
  }, []);

  const loadJourney = async (
    pId = selectedProductId,
    eType = enterpriseType,
    women = isWomenOwned,
    proc = procedureType
  ) => {
    setLoading(true);
    try {
      const res = await generateComplianceJourney({
        product_id: pId,
        enterprise_type: eType,
        is_women_owned: women,
        procedure_type: proc,
      });
      setJourneyData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    loadJourney(id, enterpriseType, isWomenOwned, procedureType);
  };

  const handleEnterpriseChange = (type: string) => {
    setEnterpriseType(type);
    loadJourney(selectedProductId, type, isWomenOwned, procedureType);
  };

  const handleWomenToggle = () => {
    const nextVal = !isWomenOwned;
    setIsWomenOwned(nextVal);
    loadJourney(selectedProductId, enterpriseType, nextVal, procedureType);
  };

  const handleProcedureChange = (type: string) => {
    setProcedureType(type);
    loadJourney(selectedProductId, enterpriseType, isWomenOwned, type);
  };

  const prod = journeyData?.product;
  const ctx = journeyData?.enterprise_context;
  const fees = journeyData?.fee_breakdown;
  const timeline = journeyData?.timeline;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-500/10 text-blue-800 border border-blue-500/30 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                SIH26107 MSME Innovation
              </span>
              <span className="text-xs text-slate-500 font-medium">
                End-to-End BIS Certification Roadmap
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
              MSME Product Compliance Journey Generator
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Select your product and enterprise scale to generate an instant 5-stage regulatory roadmap. Unlocks 50% MSME subsidies, mandatory in-house testing equipment (STI) checklists, and a fast-track 30-day timeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDossierOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Export Official Dossier</span>
            </button>
            {onAskAI && prod && (
              <button
                onClick={() =>
                  onAskAI(
                    `Explain the step-by-step procedure and mandatory in-house testing apparatus for BIS certification of ${prod.name} (${prod.standard_code}).`
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Co-Pilot</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Step 1: Product & Enterprise Scale Selector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Configure Your Manufacturing Profile</h2>
              <p className="text-xs text-slate-500">Subsidies and testing scopes are calibrated based on your selections</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Udyam Linked
            </span>
          </div>

          {/* Product Cards Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              1. Select Target Product Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: "packaged-water", name: "Packaged Drinking Water", std: "IS 14543", icon: "💧" },
                { id: "helmets", name: "Two-Wheeler Helmets", std: "IS 4151", icon: "🪖" },
                { id: "tmt-steel", name: "TMT Steel Rebars", std: "IS 1786", icon: "🏗️" },
                { id: "toys", name: "Children's Toys", std: "IS 9873", icon: "🧸" },
                { id: "solar-pv", name: "Solar PV Panels", std: "IS 14286", icon: "☀️" },
              ].map((p) => {
                const isSelected = selectedProductId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProductChange(p.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0B2545] bg-blue-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="text-2xl mb-1.5 block">{p.icon}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                      <span className="text-[10px] font-mono text-blue-800 font-bold block mt-0.5">{p.std}</span>
                    </div>
                    {isSelected && (
                      <span className="mt-2 text-[10px] font-bold text-[#0B2545] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enterprise Scale & Subsidies Configurator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Scale */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                2. Enterprise Scale (Udyam Category)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "micro", label: "Micro", badge: "50% Off" },
                  { id: "small", label: "Small", badge: "20% Off" },
                  { id: "large", label: "Medium / Large", badge: "Standard" },
                ].map((scale) => (
                  <button
                    key={scale.id}
                    onClick={() => handleEnterpriseChange(scale.id)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition border ${
                      enterpriseType === scale.id
                        ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block">{scale.label}</span>
                    <span className="text-[9px] font-mono block opacity-80">{scale.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Women-led Enterprise Bonus */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  3. Women-Led / Startup Concession
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Women-owned units receive priority scheduling and an extra 5% subsidy.
                </p>
              </div>
              <button
                onClick={handleWomenToggle}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                  isWomenOwned
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>Women-Owned (51%+ Equity)</span>
                <span className="text-xs font-mono">{isWomenOwned ? "Active ✓" : "Enable"}</span>
              </button>
            </div>

            {/* Fast-Track Timeline Option */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  4. Licencing Procedure
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simplified Procedure grants licence in 30 days via pre-tested lab reports.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleProcedureChange("simplified")}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition border ${
                    procedureType === "simplified"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ⚡ Simplified (30d)
                </button>
                <button
                  onClick={() => handleProcedureChange("normal")}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition border ${
                    procedureType === "normal"
                      ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Normal (85d)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Executive Subsidy & Savings Banner */}
        {ctx && fees && (
          <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0B2545] via-blue-950 to-slate-900 text-white border-2 border-amber-400/40 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-400 text-slate-950">
                    {ctx.discount_percentage}% Fee Subsidy Applied
                  </span>
                  <span className="text-xs text-amber-300 font-mono">
                    {ctx.subsidy_applied}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mt-1.5">
                  First-Year Licencing Cost: ₹{fees.total_first_year_inr.toLocaleString("en-IN")}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Standard Corporate Fee was ₹{fees.undiscounted_total_inr.toLocaleString("en-IN")}. You save{" "}
                  <strong className="text-emerald-400 font-mono">₹{ctx.total_savings_inr.toLocaleString("en-IN")}</strong>{" "}
                  under official Government of India MSME incentive schemes.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/10 shrink-0">
                <div className="text-center px-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Turnaround</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {timeline.total_estimated_days} Days
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-white/15" />
                <div className="text-center px-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Savings</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ₹{(ctx.total_savings_inr / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. The 5-Stage Interactive Roadmap Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Navigation Sub-Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap gap-2">
            {[
              { id: 1, title: "1. Standard & QCO Mandate", icon: ShieldAlert },
              { id: 2, title: "2. In-House Testing Equipment (STI)", icon: FlaskConical },
              { id: 3, title: "3. Sample Testing & Labs", icon: Building2 },
              { id: 4, title: "4. Itemized Fee Breakdown", icon: Coins },
              { id: 5, title: "5. Milestone Timeline", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStageTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStageTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#0B2545] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            
            {/* Stage 1: Standard & QCO Mandate */}
            {activeStageTab === 1 && prod && (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {prod.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1.5">{prod.name}</h3>
                    <p className="text-sm font-semibold text-blue-900 font-mono mt-0.5">
                      {prod.standard_code} — {prod.standard_title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-red-100 text-red-800 border border-red-300">
                      🚨 Mandatory QCO Enforced
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Notifying Ministry & Order</span>
                    </h4>
                    <p className="text-xs text-slate-600">{prod.qco_notification}</p>
                    <span className="text-[11px] text-slate-500 font-mono block mt-1">
                      Enforcing Ministry: <strong>{prod.ministry}</strong>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-1.5">
                    <h4 className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Statutory Penalty for Non-Compliance</span>
                    </h4>
                    <p className="text-xs text-red-800 leading-relaxed">{prod.penalty_clause}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Scheme: {prod.scheme}</span>
                  <button
                    onClick={() => setActiveStageTab(2)}
                    className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Proceed to In-House Testing Equipment (Stage 2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2: In-House Testing Equipment (STI) */}
            {activeStageTab === 2 && prod && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mandatory In-House Testing Laboratory Setup (Scheme of Testing & Inspection - STI)
                  </h3>
                  <p className="text-xs text-slate-500">
                    The BIS Auditor will inspect this equipment inside your factory before granting an ISI Mark licence.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Required Testing Equipment</th>
                        <th className="py-3 px-4">Standard Testing Purpose</th>
                        <th className="py-3 px-4">Est. Equipment Cost</th>
                        <th className="py-3 px-4">Calibration Cycle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prod.testing_equipment.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>{item.name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{item.purpose}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.estimated_cost}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{item.calibration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>STI Tip:</strong> All instruments must have valid calibration certificates traceable to National Physical Laboratory (NPL) or NABL-accredited calibration labs.
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveStageTab(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Standard
                  </button>
                  <button
                    onClick={() => setActiveStageTab(3)}
                    className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Proceed to Sample Testing (Stage 3)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3: Sample Testing & Labs */}
            {activeStageTab === 3 && prod && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Sample Drawing Protocols & BIS-Approved Testing Laboratories
                  </h3>
                  <p className="text-xs text-slate-500">
                    Samples must be drawn and tested in accordance with official sampling plans.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1">
                  <h4 className="text-xs font-bold text-blue-950 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-800" />
                    <span>Statutory Sample Lot Size Requirement:</span>
                  </h4>
                  <p className="text-xs text-blue-900 font-mono font-semibold pt-1">{prod.sample_size}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                    Nearby BIS Recognized & Regional Testing Laboratories:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prod.nearby_labs.map((lab: string, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-[#0B2545] shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">{lab}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveStageTab(2)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Testing Equipment
                  </button>
                  <button
                    onClick={() => setActiveStageTab(4)}
                    className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Review Fee Breakdown (Stage 4)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 4: Fee Breakdown */}
            {activeStageTab === 4 && fees && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Transparent Itemized Fee Breakdown (First Year)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Incorporates official subsidies under Gazette notification for MSME manufacturers.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold font-mono">
                    ✓ {ctx.discount_percentage}% Concession Applied
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Fee Head</th>
                        <th className="py-3 px-4">Statutory Description</th>
                        <th className="py-3 px-4">Applicable Fee (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Application Submission Fee</td>
                        <td className="py-3 px-4 text-slate-600">Fixed statutory fee for Form-V portal filing</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.application_fee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Application Processing Fee</td>
                        <td className="py-3 px-4 text-slate-600">Technical scrutiny of application and documents</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.processing_fee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Factory Audit / Inspection Charges</td>
                        <td className="py-3 px-4 text-slate-600">BIS technical auditor per-diem site verification</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.inspection_fee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Annual Licence Fee</td>
                        <td className="py-3 px-4 text-slate-600">Annual statutory licence maintenance</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.annual_licence_fee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Minimum Marking Fee (Advance)</td>
                        <td className="py-3 px-4 text-slate-600">Annual minimum production marking volume advance</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.min_marking_fee.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Independent Lab Sample Testing</td>
                        <td className="py-3 px-4 text-slate-600">Testing of drawn sample in BIS accredited lab</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{fees.sample_test_fee.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-300">
                        <td className="py-3.5 px-4 text-blue-950 font-black">Total Net Payable (First Year)</td>
                        <td className="py-3.5 px-4 text-emerald-700 font-semibold font-mono">
                          (Net of ₹{ctx.total_savings_inr.toLocaleString()} subsidy)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-blue-950 text-sm">
                          ₹{fees.total_first_year_inr.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveStageTab(3)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Labs
                  </button>
                  <button
                    onClick={() => setActiveStageTab(5)}
                    className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>View Milestone Timeline (Stage 5)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 5: Milestone Timeline */}
            {activeStageTab === 5 && timeline && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fast-Track Certification Milestones ({timeline.total_estimated_days} Days Target)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step-by-step progress checklist from Day 1 to final CM/L number issuance.
                  </p>
                </div>

                <div className="relative border-l-2 border-blue-900/30 ml-4 pl-6 space-y-6">
                  {timeline.milestones.map((m: any) => (
                    <div key={m.step} className="relative group">
                      {/* Step Circle */}
                      <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#0B2545] text-amber-300 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                        {m.step}
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-blue-900 transition-all space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900">{m.title}</h4>
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            {m.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-emerald-700">Gate: {m.status}</span>
                          <span className="font-mono text-blue-950 font-bold">{m.action}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Ready to apply? File directly on the official Government portal: <strong>manakonline.in</strong>
                    </span>
                  </div>
                  <a
                    href="https://www.manakonline.in"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                  >
                    Open Manakonline
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Official BIS Audit Dossier Export Modal */}
        <AuditDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          dossierType="roadmap"
          title="Official MSME Product Compliance & STI Roadmap"
          data={journeyData}
        />

      </div>
    </div>
  );
}
