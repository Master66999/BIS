"use client";

import React, { useState } from "react";
import {
  Calculator,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
  Tag,
  ShieldCheck,
  TrendingDown,
  FileText,
  AlertTriangle
} from "lucide-react";

interface ProductPreset {
  id: string;
  name: string;
  category: string;
  standard: string;
  scheme: "scheme1_normal" | "scheme1_simplified" | "crs" | "fmcs";
  baseAppFee: number;
  baseAuditFee: number;
  labTestFee: number;
  annualFee: number;
  minMarkingFee: number;
  normalDays: string;
  simplifiedDays: string;
}

const PRODUCT_PRESETS: ProductPreset[] = [
  {
    id: "pressure_cooker",
    name: "Domestic Pressure Cooker",
    category: "Kitchenware",
    standard: "IS 2347:2023",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 14500,
    annualFee: 1000,
    minMarkingFee: 48000,
    normalDays: "60-75 days",
    simplifiedDays: "30 days"
  },
  {
    id: "gas_stove",
    name: "Domestic LPG Gas Stove",
    category: "Kitchenware",
    standard: "IS 4246:2025",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 18000,
    annualFee: 1000,
    minMarkingFee: 52000,
    normalDays: "60-80 days",
    simplifiedDays: "30 days"
  },
  {
    id: "electric_fan",
    name: "Electric Ceiling Fan",
    category: "Electrical Appliances",
    standard: "IS 374:2019",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 16000,
    annualFee: 1000,
    minMarkingFee: 42000,
    normalDays: "60-75 days",
    simplifiedDays: "30 days"
  },
  {
    id: "cement",
    name: "Ordinary Portland Cement (OPC)",
    category: "Civil & Construction",
    standard: "IS 269:2015",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 14000,
    labTestFee: 28000,
    annualFee: 1000,
    minMarkingFee: 92000,
    normalDays: "75-90 days",
    simplifiedDays: "45 days"
  },
  {
    id: "steel_rebar",
    name: "High Strength Deformed TMT Bars",
    category: "Steel & Metallurgy",
    standard: "IS 1786:2008",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 14000,
    labTestFee: 25000,
    annualFee: 1000,
    minMarkingFee: 85000,
    normalDays: "75-90 days",
    simplifiedDays: "45 days"
  },
  {
    id: "packaged_water",
    name: "Packaged Drinking Water",
    category: "Food & Beverage",
    standard: "IS 14543:2024",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 32000,
    annualFee: 1000,
    minMarkingFee: 84000,
    normalDays: "60-90 days",
    simplifiedDays: "30 days"
  },
  {
    id: "laptop_tablet",
    name: "Laptops, Notebooks & Tablets",
    category: "Electronics (CRS)",
    standard: "IS 13252 (Part 1)",
    scheme: "crs",
    baseAppFee: 1000,
    baseAuditFee: 0,
    labTestFee: 45000,
    annualFee: 1000,
    minMarkingFee: 0,
    normalDays: "15-20 days",
    simplifiedDays: "15 days"
  },
  {
    id: "helmets",
    name: "Protective Helmets for Two-Wheelers",
    category: "Safety Equipment",
    standard: "IS 4151:2020",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 22000,
    annualFee: 1000,
    minMarkingFee: 45000,
    normalDays: "60-75 days",
    simplifiedDays: "30 days"
  }
];

interface EnterpriseType {
  id: string;
  name: string;
  discountPct: number;
  description: string;
  badge: string;
}

const ENTERPRISE_TYPES: EnterpriseType[] = [
  {
    id: "micro",
    name: "Micro Enterprise",
    discountPct: 20,
    description: "Investment in P&M ≤ ₹1 Cr & Annual Turnover ≤ ₹5 Cr (Udyam Certificate required)",
    badge: "20% Concession"
  },
  {
    id: "startup",
    name: "DPIIT Recognized Startup",
    discountPct: 20,
    description: "Startup registered with DPIIT within 10 years of incorporation",
    badge: "20% Concession"
  },
  {
    id: "small",
    name: "Small Enterprise",
    discountPct: 10,
    description: "Investment in P&M ≤ ₹10 Cr & Annual Turnover ≤ ₹50 Cr",
    badge: "10% Concession"
  },
  {
    id: "women_ne",
    name: "Women-led Unit / North Eastern Region",
    discountPct: 50,
    description: "Micro enterprises operated by women entrepreneurs or located in North Eastern Region",
    badge: "50% Special Concession"
  },
  {
    id: "medium_large",
    name: "Medium / Large Enterprise",
    discountPct: 0,
    description: "Standard statutory fees per Bureau of Indian Standards Regulations",
    badge: "Standard Rates"
  }
];

interface FeeCalculatorViewProps {
  onAskAI?: (query: string) => void;
}

export function FeeCalculatorView({ onAskAI }: FeeCalculatorViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("pressure_cooker");
  const [procedureOption, setProcedureOption] = useState<"option1_normal" | "option2_simplified" | "fmcs">("option2_simplified");
  const [enterpriseType, setEnterpriseType] = useState<string>("micro");
  const [unitsPerYear, setUnitsPerYear] = useState<number>(50000);

  const product = PRODUCT_PRESETS.find((p) => p.id === selectedProduct) || PRODUCT_PRESETS[0];
  const enterprise = ENTERPRISE_TYPES.find((e) => e.id === enterpriseType) || ENTERPRISE_TYPES[0];

  // Concession calculation
  const discountMultiplier = 1 - enterprise.discountPct / 100;

  // Base Fees
  const rawAppFee = product.baseAppFee;
  const rawAuditFee = procedureOption === "fmcs" ? product.baseAuditFee * 6 : product.baseAuditFee;
  const rawAnnualFee = product.annualFee;
  const rawMinMarkingFee = procedureOption === "fmcs" ? product.minMarkingFee * 1.5 : product.minMarkingFee;
  const rawLabFee = product.labTestFee;

  // Discount applies to: Application Fee, Annual Licence Fee, Minimum Marking Fee
  const appFee = Math.round(rawAppFee * discountMultiplier);
  const auditFee = rawAuditFee; // Inspection fee not discounted
  const annualFee = Math.round(rawAnnualFee * discountMultiplier);
  const minMarkingFee = Math.round(rawMinMarkingFee * discountMultiplier);
  const labFee = rawLabFee; // Lab testing paid to testing laboratory

  const totalYearOne = appFee + auditFee + annualFee + minMarkingFee + labFee;
  const fullRateTotal = rawAppFee + rawAuditFee + rawAnnualFee + rawMinMarkingFee + rawLabFee;
  const totalSavings = fullRateTotal - totalYearOne;

  // Timeline
  let estimatedTimeline = "";
  if (procedureOption === "option2_simplified") {
    estimatedTimeline = "30 Days (Fast-Track Simplified Option)";
  } else if (procedureOption === "fmcs") {
    estimatedTimeline = "90 - 180 Days (Foreign Inspection & Testing)";
  } else {
    estimatedTimeline = product.normalDays;
  }

  const handleConsultAI = () => {
    if (onAskAI) {
      onAskAI(
        `I am a ${enterprise.name} manufacturing ${product.name} under ${product.standard}. What is the exact step-by-step procedure, required in-house test equipment, and fee concession to get a BIS licence under ${procedureOption === "option2_simplified" ? "Option 2 (Simplified)" : "Scheme I"}?`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Official BIS Fee Estimator
          </span>
          <span className="text-xs text-slate-500">
            Per BIS Conformity Assessment Regulations, 2018
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          BIS Licence Cost & Timeline Calculator
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-3xl">
          Estimate statutory fees, testing expenses, and exact processing timelines for obtaining a BIS ISI Mark or CRS licence, with automatic MSME & Startup concession deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Product Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                1. Select Product Category
              </label>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                Applicable Standard: {product.standard}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedProduct === p.id
                      ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{p.category}</span>
                    <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {p.standard}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Enterprise Classification */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                2. Enterprise Scale & Concession Category
              </label>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">
                {enterprise.badge}
              </span>
            </div>

            <div className="space-y-2.5">
              {ENTERPRISE_TYPES.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setEnterpriseType(e.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    enterpriseType === e.id
                      ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {e.name}
                      {e.discountPct > 0 && (
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          {e.discountPct}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {e.description}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                      enterpriseType === e.id
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {enterpriseType === e.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Procedure Option */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-600" />
              3. Certification Procedure & Timeline
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProcedureOption("option2_simplified")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  procedureOption === "option2_simplified"
                    ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-xs uppercase text-purple-600 dark:text-purple-400">
                  Recommended
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  Option 2 (Simplified)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Licence within <strong>30 days</strong> with pre-test report.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProcedureOption("option1_normal")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  procedureOption === "option1_normal"
                    ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-xs uppercase text-slate-400">
                  Standard
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  Option 1 (Normal)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Preliminary factory inspection first (<strong>60-90 days</strong>).
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProcedureOption("fmcs")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  procedureOption === "fmcs"
                    ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-xs uppercase text-slate-400">
                  Overseas
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  FMCS (Foreign Unit)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  AIR mandatory, foreign plant audit (<strong>3-6 months</strong>).
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cost Breakdown & Timeline Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#0B2545] to-[#133E68] text-white rounded-lg p-6 shadow-xl border border-[#163E6E] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-blue-400/20 pb-4 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    Statutory Fee Estimate (Year 1)
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    ₹{totalYearOne.toLocaleString("en-IN")}
                  </h3>
                </div>

                {totalSavings > 0 && (
                  <div className="text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Save ₹
                      {totalSavings.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-blue-200 block mt-1">
                      {enterprise.name} Concession
                    </span>
                  </div>
                )}
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-blue-100">
                  <span>Application Fee:</span>
                  <div className="text-right">
                    <span className="font-semibold text-white">
                      ₹{appFee.toLocaleString("en-IN")}
                    </span>
                    {rawAppFee > appFee && (
                      <span className="line-through text-xs text-blue-300 ml-2">
                        ₹{rawAppFee}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-blue-100">
                  <span>Preliminary Audit / Inspection:</span>
                  <span className="font-semibold text-white">
                    ₹{auditFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-blue-100">
                  <span>Independent Lab Testing (Est.):</span>
                  <span className="font-semibold text-white">
                    ₹{labFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-blue-100">
                  <span>Annual Licence Fee:</span>
                  <div className="text-right">
                    <span className="font-semibold text-white">
                      ₹{annualFee.toLocaleString("en-IN")}
                    </span>
                    {rawAnnualFee > annualFee && (
                      <span className="line-through text-xs text-blue-300 ml-2">
                        ₹{rawAnnualFee}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-blue-100">
                  <span>Minimum Marking Fee (Year 1):</span>
                  <div className="text-right">
                    <span className="font-semibold text-white">
                      ₹{minMarkingFee.toLocaleString("en-IN")}
                    </span>
                    {rawMinMarkingFee > minMarkingFee && (
                      <span className="line-through text-xs text-blue-300 ml-2">
                        ₹{rawMinMarkingFee.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Strip */}
              <div className="mt-6 pt-4 border-t border-blue-400/20 bg-blue-900/30 -mx-6 -mb-6 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                      Statutory Turnaround
                    </div>
                    <div className="text-base font-bold text-white">
                      {estimatedTimeline}
                    </div>
                  </div>
                </div>

                {/* Consult AI Button */}
                <button
                  type="button"
                  onClick={handleConsultAI}
                  className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Ask AI to Prepare Audit Checklist
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              BIS Licensing Rules & Notes
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>GST Notice:</strong> All BIS fees are subject to 18% GST payable at time of Manakonline submission.
              </li>
              <li>
                <strong>Concession Eligibility:</strong> Valid Udyam Registration Certificate is mandatory to claim MSME concession benefits.
              </li>
              <li>
                <strong>Testing Charges:</strong> Testing charges vary depending on whether testing is conducted at BIS Central Laboratory (Sahibabad) or recognized external NABL labs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
