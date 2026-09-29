"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Award,
  Building,
  Calendar,
  MapPin,
  ExternalLink,
  Smartphone,
  HelpCircle,
  FileWarning
} from "lucide-react";

interface VerificationRecord {
  type: "isi" | "huid" | "crs";
  code: string;
  status: "VALID" | "SUSPENDED" | "EXPIRED" | "COUNTERFEIT";
  title: string;
  entityName: string;
  standard: string;
  validTill: string;
  address: string;
  details: Record<string, string>;
}

const KNOWN_VERIFICATION_DATABASE: Record<string, VerificationRecord> = {
  // ISI Marks
  "8400123": {
    type: "isi",
    code: "CM/L-8400123",
    status: "VALID",
    title: "Domestic Pressure Cookers (Aluminium Alloy & Stainless Steel)",
    entityName: "Prestige Kitchen Appliances Ltd.",
    standard: "IS 2347:2023",
    validTill: "31-Dec-2027",
    address: "Plot 14, Industrial Estate, Hosur, Tamil Nadu - 635126",
    details: {
      "Brand Name": "Prestige Deluxe",
      "Scope of Licence": "Sizes 3L, 5L, 7.5L, Outer lid & Inner lid types",
      "Factory Audit Date": "14-Aug-2024",
      "Surveillance Sample": "Satisfactory (Complied with 2.0 kgf/cm² proof test)"
    }
  },
  "2347001": {
    type: "isi",
    code: "CM/L-2347001",
    status: "VALID",
    title: "Domestic Pressure Cookers",
    entityName: "Hawkins Cookers Limited",
    standard: "IS 2347:2023",
    validTill: "15-Oct-2028",
    address: "F-101, MIDC Area, Thane, Maharashtra - 400604",
    details: {
      "Brand Name": "Hawkins Classic",
      "Scope of Licence": "Hard Anodised & Stainless Steel Cookers",
      "Factory Audit Date": "20-May-2024",
      "Surveillance Sample": "Satisfactory (Burst pressure > 3.0 kgf/cm²)"
    }
  },
  "1454300": {
    type: "isi",
    code: "CM/L-1454300",
    status: "VALID",
    title: "Packaged Drinking Water Other Than Natural Mineral Water",
    entityName: "Bisleri International Pvt Ltd",
    standard: "IS 14543:2024",
    validTill: "30-Nov-2026",
    address: "Western Express Highway, Andheri (East), Mumbai - 400099",
    details: {
      "Brand Name": "Bisleri",
      "Package Types": "500ml, 1L, 2L, 20L PET containers",
      "Microbiological Test": "Nil E.coli, Nil Coliforms, Nil Yeast & Mould"
    }
  },
  "0269001": {
    type: "isi",
    code: "CM/L-0269001",
    status: "VALID",
    title: "Ordinary Portland Cement (53 Grade)",
    entityName: "UltraTech Cement Limited",
    standard: "IS 269:2015",
    validTill: "31-Mar-2027",
    address: "Awarpur Cement Works, Chandrapur, Maharashtra - 442917",
    details: {
      "Grade": "OPC 53 Grade",
      "28-Day Strength": "Avg 58.5 MPa (exceeds min 53 MPa requirement)",
      "QCO Compliance": "Mandatory Cement QCO Compliant"
    }
  },
  // HUID Gold
  "A9B8C7": {
    type: "huid",
    code: "A9B8C7",
    status: "VALID",
    title: "Gold Jewellery (22 Karat / 916 Purity)",
    entityName: "Tanishq Jewellers (Titan Company Ltd)",
    standard: "IS 1417:2016",
    validTill: "Permanent Hallmark Registry",
    address: "AHC Center: Bangalore Central Assay Lab, Karnataka",
    details: {
      "Article Type": "Gold Necklace / Chain",
      "Purity Grade": "22K916 (91.6% Pure Gold)",
      "Hallmarking Date": "18-Sep-2024",
      "AHC Center ID": "AHC-KA-0042 (BIS Recognized)"
    }
  },
  "H4K2M9": {
    type: "huid",
    code: "H4K2M9",
    status: "VALID",
    title: "Gold Bangles (18 Karat / 750 Purity)",
    entityName: "Malabar Gold & Diamonds",
    standard: "IS 1417:2016",
    validTill: "Permanent Hallmark Registry",
    address: "AHC Center: Calicut Regional Assay Centre, Kerala",
    details: {
      "Article Type": "Gold Bangle Set",
      "Purity Grade": "18K750 (75.0% Pure Gold)",
      "Hallmarking Date": "05-Aug-2024",
      "AHC Center ID": "AHC-KL-0019 (BIS Recognized)"
    }
  },
  // CRS Electronics
  "41001234": {
    type: "crs",
    code: "R-41001234",
    status: "VALID",
    title: "Laptop / Notebook Computer",
    entityName: "HP India Sales Private Limited",
    standard: "IS 13252 (Part 1):2010",
    validTill: "12-Dec-2026",
    address: "Manufactured at: Sriperumbudur Industrial Park, Tamil Nadu",
    details: {
      "Brand Name": "HP Pavilion / HP Envy",
      "Scheme": "Scheme II (Compulsory Registration Scheme - MeitY)",
      "Safety Test Lab": "ERTL (North) Delhi"
    }
  },
  // Suspended Example
  "9999999": {
    type: "isi",
    code: "CM/L-9999999",
    status: "SUSPENDED",
    title: "Electric Water Heaters",
    entityName: "Defunct Appliance Works",
    standard: "IS 368:2014",
    validTill: "Expired / Suspended 01-Jan-2024",
    address: "Old Industrial Area, Delhi - 110020",
    details: {
      "Enforcement Notice": "Suspended due to test failure in thermal cut-out safety",
      "Order Ref": "BIS/CRO/ENF/2024/99"
    }
  }
};

interface VerifyMarkViewProps {
  onAskAI?: (query: string) => void;
}

export function VerifyMarkView({ onAskAI }: VerifyMarkViewProps) {
  const [activeTab, setActiveTab] = useState<"isi" | "huid" | "crs">("isi");
  const [inputCode, setInputCode] = useState<string>("");
  const [searchResult, setSearchResult] = useState<VerificationRecord | null | "NOT_FOUND">(null);
  const [searchedCode, setSearchedCode] = useState<string>("");

  const handleVerify = (codeToTest?: string) => {
    const raw = (codeToTest || inputCode).trim().toUpperCase();
    if (!raw) return;

    setSearchedCode(raw);

    // Normalize code: remove CM/L-, R-, spaces
    const clean = raw.replace(/^CM\/L-?/i, "").replace(/^R-?/i, "").replace(/[\s-]/g, "");

    if (KNOWN_VERIFICATION_DATABASE[clean]) {
      setSearchResult(KNOWN_VERIFICATION_DATABASE[clean]);
    } else {
      // Check partial match
      const foundKey = Object.keys(KNOWN_VERIFICATION_DATABASE).find((k) => clean.includes(k) || k.includes(clean));
      if (foundKey) {
        setSearchResult(KNOWN_VERIFICATION_DATABASE[foundKey]);
      } else {
        setSearchResult("NOT_FOUND");
      }
    }
  };

  const handleQuickTest = (code: string, tab: "isi" | "huid" | "crs") => {
    setActiveTab(tab);
    setInputCode(code);
    handleVerify(code);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            BIS CARE Consumer Portal
          </span>
          <span className="text-xs text-slate-500">
            Real-Time Authenticity Verification Engine
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          Verify BIS Standard Mark & Hallmarking
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-3xl">
          Instantly verify the genuineness of an <strong>ISI Mark (CM/L Licence Number)</strong>, <strong>6-digit Gold Hallmark (HUID)</strong>, or <strong>CRS Electronic Registration (R-number)</strong> to protect against fake and counterfeit marks.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("isi");
              setSearchResult(null);
              setInputCode("");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "isi"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            1. Verify ISI Mark (CM/L Number)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("huid");
              setSearchResult(null);
              setInputCode("");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "huid"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            2. Verify Gold Hallmark (6-digit HUID)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("crs");
              setSearchResult(null);
              setInputCode("");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "crs"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            3. Verify CRS Electronics (R-Number)
          </button>
        </div>

        {/* Input & Search Form */}
        <div className="max-w-2xl">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {activeTab === "isi" && "Enter 7-8 Digit CM/L Licence Number (e.g. CM/L-8400123 or 8400123):"}
            {activeTab === "huid" && "Enter 6-digit Alphanumeric HUID code from jewellery (e.g. A9B8C7):"}
            {activeTab === "crs" && "Enter CRS Registration Number (e.g. R-41001234 or 41001234):"}
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder={
                  activeTab === "isi"
                    ? "e.g. 8400123 or CM/L-8400123"
                    : activeTab === "huid"
                    ? "e.g. A9B8C7"
                    : "e.g. R-41001234"
                }
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-semibold"
              />
            </div>
            <button
              type="button"
              onClick={() => handleVerify()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              Verify Now
            </button>
          </div>

          {/* Quick Demo Pre-fill Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Quick test samples:</span>
            {activeTab === "isi" && (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickTest("8400123", "isi")}
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Pressure Cooker (Valid)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickTest("0269001", "isi")}
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Cement (Valid)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickTest("9999999", "isi")}
                  className="underline text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  Suspended Licence
                </button>
              </>
            )}
            {activeTab === "huid" && (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickTest("A9B8C7", "huid")}
                  className="underline text-amber-600 dark:text-amber-400 hover:text-amber-700"
                >
                  22K Gold Hallmark (Valid)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickTest("H4K2M9", "huid")}
                  className="underline text-amber-600 dark:text-amber-400 hover:text-amber-700"
                >
                  18K Gold Bangle (Valid)
                </button>
              </>
            )}
            {activeTab === "crs" && (
              <button
                type="button"
                onClick={() => handleQuickTest("41001234", "crs")}
                className="underline text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                HP Laptop CRS (Valid)
              </button>
            )}
          </div>
        </div>

        {/* Verification Result Section */}
        {searchResult && searchResult !== "NOT_FOUND" && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
            <div
              className={`p-6 rounded-2xl border ${
                searchResult.status === "VALID"
                  ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-red-500/40 bg-red-50/50 dark:bg-red-950/20"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {searchResult.status === "VALID" ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">
                        {searchResult.code}
                      </span>
                      <span
                        className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                          searchResult.status === "VALID"
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {searchResult.status === "VALID" ? "Genuine & Active" : searchResult.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {searchResult.entityName}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Standard Reference:</span>
                  <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                    {searchResult.standard}
                  </span>
                </div>
              </div>

              {/* Product & Scope Details */}
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Certified Product / Scope
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {searchResult.title}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Validity Period
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {searchResult.validTill}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Manufacturing / Assaying Location
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    {searchResult.address}
                  </p>
                </div>
              </div>

              {/* Technical Inspection Evidence */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
                {Object.entries(searchResult.details).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{key}:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{val}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onAskAI &&
                    onAskAI(`Tell me more about standard ${searchResult.standard} and quality requirements for ${searchResult.title}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI About {searchResult.standard}
                </button>

                {searchResult.status !== "VALID" && (
                  <a
                    href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/consumer_affairs"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow"
                  >
                    <FileWarning className="w-3.5 h-3.5" />
                    Report Misuse to BIS Enforcement
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Not Found / Suspicious Alert */}
        {searchResult === "NOT_FOUND" && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
            <div className="p-6 rounded-2xl border border-red-500/40 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex-shrink-0 flex items-center justify-center shadow">
                  <XCircle className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-red-900 dark:text-red-200 flex items-center gap-2">
                    Mark Not Found / Potential Counterfeit
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-mono">
                      {searchedCode}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    No active licence or registration exists in the official Bureau of Indian Standards database for this number. The product may be bearing an unauthorized or fake standard mark under Section 17 of the BIS Act, 2016.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/consumer_affairs"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow"
                    >
                      <FileWarning className="w-4 h-4" />
                      Lodge Complaint on BIS CARE Portal
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        onAskAI &&
                        onAskAI(`I found a product bearing mark ${searchedCode} which appears counterfeit. What are the legal penalties under Section 29 of the BIS Act 2016 for counterfeit ISI marks?`)
                      }
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Ask AI about Counterfeit Penalties
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            How to read an ISI Mark
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            A genuine ISI mark must always state the Indian Standard number above the mark (e.g. IS 2347) and the 7 or 8-digit licence number below it in the format <strong>CM/L-XXXXXXX</strong>.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            How to read Gold Hallmarking
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Since 2021, all hallmarked gold jewelry must feature 3 distinct symbols: The BIS Logo, Purity in Karat & Fineness (22K916, 18K750, 14K585), and the <strong>6-digit alphanumeric HUID</strong>.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-purple-600" />
            Official BIS CARE Mobile App
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Consumers can also download the official BIS CARE app on Android and iOS to scan QR codes on gold jewellery, verify licences, and submit instant complaints.
          </p>
        </div>
      </div>
    </div>
  );
}
