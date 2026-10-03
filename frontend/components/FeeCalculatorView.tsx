"use client";

import React, { useState } from "react";
import "../app/footer.css";
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
    minMarkingFee: 86000,
    normalDays: "60-80 days",
    simplifiedDays: "30 days"
  },
  {
    id: "helmet",
    name: "Two-Wheeler Protective Helmet",
    category: "Automotive Safety",
    standard: "IS 4151:2020",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 22000,
    annualFee: 1000,
    minMarkingFee: 64000,
    normalDays: "60-75 days",
    simplifiedDays: "30 days"
  },
  {
    id: "toys",
    name: "Safety of Children Toys (Mechanical)",
    category: "Consumer Goods",
    standard: "IS 9873:Part 1:2019",
    scheme: "scheme1_normal",
    baseAppFee: 1000,
    baseAuditFee: 7000,
    labTestFee: 12000,
    annualFee: 1000,
    minMarkingFee: 38000,
    normalDays: "60-75 days",
    simplifiedDays: "30 days"
  }
];

interface EnterpriseType {
  id: string;
  name: string;
  discountPct: number;
  badge: string;
  description: string;
}

const ENTERPRISE_TYPES: EnterpriseType[] = [
  {
    id: "micro",
    name: "Micro Enterprise (Udyam)",
    discountPct: 50,
    badge: "50% Fee Concession",
    description: "Investment < ₹1 Cr & Turnover < ₹5 Cr. 50% concession on Application, Licence & Minimum Marking Fees."
  },
  {
    id: "startup",
    name: "DPIIT Recognized Startup",
    discountPct: 50,
    badge: "50% Startup Incentive",
    description: "Recognized by DPIIT (under 10 years from incorporation). 50% fee concession under Startup India initiative."
  },
  {
    id: "women_led",
    name: "Women-Led MSME",
    discountPct: 50,
    badge: "50% + Fast-Track Priority",
    description: "Enterprise with 51%+ shareholding by women entrepreneurs. Entitled to 50% fee concession and fast-track processing."
  },
  {
    id: "small",
    name: "Small Enterprise",
    discountPct: 20,
    badge: "20% Fee Concession",
    description: "Investment < ₹10 Cr & Turnover < ₹50 Cr. 20% concession on standard BIS fees."
  },
  {
    id: "standard",
    name: "Medium / Large Enterprise",
    discountPct: 0,
    badge: "Standard Rates",
    description: "Investment > ₹10 Cr or Turnover > ₹50 Cr. Standard statutory fees apply in full."
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
  const auditFee = rawAuditFee;
  const annualFee = Math.round(rawAnnualFee * discountMultiplier);
  const minMarkingFee = Math.round(rawMinMarkingFee * discountMultiplier);
  const labFee = rawLabFee;

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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5 shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              Official BIS Fee Estimator
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Per BIS Conformity Assessment Regulations, 2018
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            BIS Licence Cost & Timeline Calculator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Estimate statutory fees, testing expenses, and exact processing timelines for obtaining a BIS ISI Mark or CRS licence, with automatic MSME & Startup concession deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Product Selection */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  1. Select Product Category
                </label>
                <span className="text-xs text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {product.standard}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      selectedProduct === p.id
                        ? "border-blue-600 bg-blue-50/70 text-slate-900 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
                      <span>{p.category}</span>
                      <span className="font-mono text-[11px] font-bold text-blue-600">
                        {p.standard}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card 2: Enterprise Classification */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  2. Enterprise Scale & Concession Category
                </label>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
                  {enterprise.badge}
                </span>
              </div>

              <div className="space-y-3">
                {ENTERPRISE_TYPES.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => setEnterpriseType(e.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      enterpriseType === e.id
                        ? "border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        {e.name}
                        {e.discountPct > 0 && (
                          <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full font-mono">
                            {e.discountPct}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {e.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center shrink-0 ${
                        enterpriseType === e.id
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-slate-400"
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                3. Certification Procedure & Timeline
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProcedureOption("option2_simplified")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    procedureOption === "option2_simplified"
                      ? "border-blue-600 bg-blue-50/70 text-slate-900 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-extrabold text-xs uppercase text-blue-700">
                    Recommended
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    Option 2 (Simplified)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Licence within <strong className="text-slate-900">30 days</strong> with pre-test report.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProcedureOption("option1_normal")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    procedureOption === "option1_normal"
                      ? "border-blue-600 bg-blue-50/70 text-slate-900 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs uppercase text-slate-500">
                    Standard
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    Option 1 (Normal)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Preliminary factory inspection first (<strong className="text-slate-900">60-90 days</strong>).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProcedureOption("fmcs")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    procedureOption === "fmcs"
                      ? "border-blue-600 bg-blue-50/70 text-slate-900 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs uppercase text-slate-500">
                    Overseas
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    FMCS (Foreign Unit)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    AIR mandatory, foreign plant audit (<strong className="text-slate-900">3-6 months</strong>).
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Cost Breakdown & Timeline Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                      Statutory Fee Estimate (Year 1)
                    </span>
                    <h3 className="text-3xl font-black text-blue-700 mt-1 font-mono">
                      ₹{totalYearOne.toLocaleString("en-IN")}
                    </h3>
                  </div>

                  {totalSavings > 0 && (
                    <div className="text-right">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-mono">
                        <TrendingDown className="w-3.5 h-3.5" /> Save ₹
                        {totalSavings.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold block mt-1">
                        {enterprise.name} Concession
                      </span>
                    </div>
                  )}
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Application Fee:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{appFee.toLocaleString("en-IN")}
                      </span>
                      {rawAppFee > appFee && (
                        <span className="line-through text-xs text-slate-400 ml-2 font-mono">
                          ₹{rawAppFee}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>Preliminary Audit / Inspection:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      ₹{auditFee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>Independent Lab Testing (Est.):</span>
                    <span className="font-bold text-slate-900 font-mono">
                      ₹{labFee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>Annual Licence Fee:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{annualFee.toLocaleString("en-IN")}
                      </span>
                      {rawAnnualFee > annualFee && (
                        <span className="line-through text-xs text-slate-400 ml-2 font-mono">
                          ₹{rawAnnualFee}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>Minimum Marking Fee (Year 1):</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{minMarkingFee.toLocaleString("en-IN")}
                      </span>
                      {rawMinMarkingFee > minMarkingFee && (
                        <span className="line-through text-xs text-slate-400 ml-2 font-mono">
                          ₹{rawMinMarkingFee.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Strip */}
                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold text-blue-700 tracking-wider font-mono">
                        Statutory Turnaround
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        {estimatedTimeline}
                      </div>
                    </div>
                  </div>

                  {/* Consult AI Button */}
                  <button
                    type="button"
                    onClick={handleConsultAI}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ask AI to Prepare Audit Checklist
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Guidelines Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-xs text-slate-600 space-y-2.5 shadow-sm">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                BIS Licensing Rules & Notes
              </div>
              <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-600">
                <li>
                  <strong className="text-slate-800">GST Notice:</strong> All BIS fees are subject to 18% GST payable at time of Manakonline submission.
                </li>
                <li>
                  <strong className="text-slate-800">Concession Eligibility:</strong> Valid Udyam Registration Certificate is mandatory to claim MSME concession benefits.
                </li>
                <li>
                  <strong className="text-slate-800">Testing Charges:</strong> Testing charges vary depending on whether testing is conducted at BIS Central Laboratory (Sahibabad) or recognized external NABL labs.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
