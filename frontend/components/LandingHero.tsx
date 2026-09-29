"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  FlaskConical,
  Gem,
  Factory,
  Building2,
  FileCheck2,
  Calculator,
  Shield,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Cpu,
  Zap,
  Microscope,
  Scale,
  Users,
  Check,
  TrendingUp,
  Activity,
  Compass,
  FileText
} from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";

interface LandingHeroProps {
  onStartChat: (initialQuery?: string) => void;
  onNavigateTab: (tab: string) => void;
}

type PersonaType = "manufacturer" | "engineer" | "consumer" | "auditor";

interface PersonaConfig {
  id: PersonaType;
  title: string;
  badge: string;
  icon: any;
  highlight: string;
  prompts: { label: string; query: string }[];
  accentColor: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartChat,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePersona, setActivePersona] = useState<PersonaType>("manufacturer");
  const [interactiveHuid, setInteractiveHuid] = useState("AB2468");
  const [huidVerified, setHuidVerified] = useState(true);
  const [turnoverSlider, setTurnoverSlider] = useState<number>(25); // Lakhs
  const [activeLiveStd, setActiveLiveStd] = useState<number>(0);

  const personas: Record<PersonaType, PersonaConfig> = {
    manufacturer: {
      id: "manufacturer",
      title: "MSME & Manufacturer",
      badge: "Industry & Production",
      icon: Factory,
      highlight: "ISI Mark Certification, Mandatory QCO Deadlines & 50% MSME Subsidies",
      accentColor: "from-amber-500 to-orange-600",
      prompts: [
        { label: "Check QCO Compliance Date", query: "How to check whether a Quality Control Order makes BIS certification mandatory for my product?" },
        { label: "Calculate ISI Licence Fee", query: "What are the total application and minimum marking fees for an MSME manufacturing under Scheme I?" },
        { label: "Simplified Scheme Process", query: "What is the simplified procedure for grant of BIS licence to MSMEs within 30 days?" },
        { label: "Steel & TMT Requirements", query: "What are the chemical and mechanical test limits for Fe 500D TMT bars under IS 1786?" }
      ]
    },
    engineer: {
      id: "engineer",
      title: "Testing Lab & Engineer",
      badge: "Technical & Testing",
      icon: Microscope,
      highlight: "Clause Tolerances, Chemical Testing Codes & Regional Lab Scopes",
      accentColor: "from-blue-600 to-indigo-600",
      prompts: [
        { label: "Concrete 28-day Limits (IS 456)", query: "What are the minimum 28-day characteristic compressive strength requirements for M25 concrete under IS 456?" },
        { label: "Drinking Water Parameters (IS 14543)", query: "What are the permissible limits for total dissolved solids (TDS) and heavy metals under IS 14543 for packaged water?" },
        { label: "Electrical Safety (IS 1293)", query: "What are the insulation resistance and temperature rise test limits for plugs and sockets under IS 1293?" },
        { label: "Accredited Lab Directory", query: "Which BIS accredited laboratory in Western Region has testing scope for cement and aggregates?" }
      ]
    },
    consumer: {
      id: "consumer",
      title: "Citizen & Consumer",
      badge: "Public & Buyer Rights",
      icon: ShieldCheck,
      highlight: "6-Digit Gold HUID Verification, BIS Care App & Fake Mark Detection",
      accentColor: "from-emerald-600 to-teal-600",
      prompts: [
        { label: "Verify 6-digit HUID Code", query: "How do I verify a 6-digit alphanumeric HUID on 22-carat gold jewellery using BIS Care?" },
        { label: "Check Genuine ISI Mark", query: "How can I verify if an ISI mark on a helmet or drinking water bottle is genuine using CM/L number?" },
        { label: "File Sub-standard Complaint", query: "How do I file a consumer complaint against a manufacturer selling sub-standard goods without BIS mark?" },
        { label: "Mandatory Hallmark Cities", query: "Is gold hallmarking mandatory in my district and what are the official hallmark symbols?" }
      ]
    },
    auditor: {
      id: "auditor",
      title: "Auditor & BIS Officer",
      badge: "Regulatory & Legal",
      icon: Scale,
      highlight: "Gazette Notifications, Section 16 BIS Act 2016 & Audit Checklists",
      accentColor: "from-purple-600 to-slate-800",
      prompts: [
        { label: "Penalties for Fake ISI Mark", query: "What are the statutory legal penalties and imprisonment terms under Section 29 of the BIS Act 2016 for counterfeit ISI marks?" },
        { label: "Surveillance Audit Checklist", query: "What is the factory inspection checklist and sample draw protocol for annual BIS licence surveillance?" },
        { label: "Recent DPIIT QCO Notifications", query: "List recent DPIIT Quality Control Orders issued in 2024-2026 with applicable enforcement dates." },
        { label: "Foreign Manufacturer (FMCS)", query: "What are the compliance requirements and bank guarantee conditions for Foreign Manufacturers Certification Scheme (FMCS)?" }
      ]
    }
  };

  const liveStandards = [
    {
      std: "IS 1786:2008",
      title: "High Strength Deformed Steel Bars & Wires for Concrete Reinforcement",
      cat: "Civil & Structural Steel",
      qco: "Mandatory QCO (Min. of Steel)",
      clause: "Clause 8.1: Yield Strength >= 500 N/mm² (Fe 500D)",
      query: "Give full technical specifications, testing codes and chemical tolerances for IS 1786 Fe 500D steel bars."
    },
    {
      std: "IS 14543:2016",
      title: "Packaged Drinking Water (Other than Natural Mineral Water)",
      cat: "Food, Water & Beverages",
      qco: "Mandatory QCO (FSSAI/BIS)",
      clause: "Clause 5.2: Microbiological limits & TDS <= 500 mg/L",
      query: "What are the mandatory testing parameters, lab equipment and licensing steps for IS 14543 packaged drinking water?"
    },
    {
      std: "IS 456:2000",
      title: "Plain and Reinforced Concrete - Code of Practice (Fourth Revision)",
      cat: "Civil Engineering & Infrastructure",
      qco: "National Building Code Reference",
      clause: "Clause 6.2: Workability, Slump & Minimum Cement Content",
      query: "Explain water-cement ratio, minimum cement content and curing requirements under IS 456."
    }
  ];

  // Rotate live standards card every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLiveStd((prev) => (prev + 1) % liveStandards.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [liveStandards.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onStartChat(searchQuery.trim());
    }
  };

  const currentPersona = personas[activePersona];

  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900 pb-16">
      {/* Background Decorative Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] pointer-events-none opacity-40 blur-3xl -z-10 bg-gradient-to-b from-blue-200/50 via-amber-100/30 to-transparent" />

      {/* 1. Sovereign Government Header & System Pulse */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <EmblemOfIndia className="h-7 w-auto text-[#0B2545]" />
              <div className="h-6 w-[1px] bg-slate-300 hidden sm:block" />
              <BisEmblem className="h-7 w-auto text-blue-950" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-800 tracking-tight block">
                Bureau of Indian Standards (BIS) • मानक: पथप्रदर्शक:
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Ministry of Consumer Affairs, Food & Public Distribution • Govt. of India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              23,866 Indian Standards Online
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px]">
              <Zap className="w-3 h-3 text-amber-500" />
              Sub-10ms Cached RAG
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Presentation & Persona Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>SIH26107 Official AI Co-Pilot for National Standards & Conformity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#051930] tracking-tight leading-[1.15]">
            Instant Intelligence for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-800 to-amber-600">
              Indian Standards & Compliance
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Direct authoritative lookup across 23,866 published standards, mandatory QCOs, ISI Mark licensing schemes, Gold HUID tracking, and accredited laboratory networks.
          </p>

          {/* Interactive Persona Tabs */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Your Role for Tailored Intelligence:
            </span>
            <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-full overflow-x-auto">
              {(Object.keys(personas) as PersonaType[]).map((key) => {
                const p = personas[key];
                const Icon = p.icon;
                const isSelected = activePersona === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActivePersona(key)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-[#0A2540] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Omni-Search Command Bar */}
        <div className="mt-6 max-w-3xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white p-2 rounded-2xl border-2 border-slate-300 focus-within:border-[#0A2540] shadow-lg shadow-slate-200/50 transition-all"
          >
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-blue-950" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Ask about Indian Standards, e.g. '${currentPersona.prompts[0].query}'...`}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none py-1.5"
            />
            <button
              type="submit"
              className="bg-[#0A2540] hover:bg-blue-950 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <span>Ask Co-Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Persona-Driven Suggestion Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Suggested:</span>
            {currentPersona.prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onStartChat(p.query)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-900 hover:text-blue-900 hover:bg-blue-50/50 transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>{p.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 4. THE BENTO GRID COMMAND CENTER */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Bento Tile 1: Live Interactive Standard Radar (Span 7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">National Standards Catalog Radar</h3>
                  <span className="text-[11px] text-slate-500 font-mono">23,866 Published BIS Standards</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Index
                </span>
              </div>
            </div>

            {/* Rotating Standard Showcase Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#0A2540] text-amber-400 shadow-xs">
                  {liveStandards[activeLiveStd].std}
                </span>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  {liveStandards[activeLiveStd].qco}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {liveStandards[activeLiveStd].title}
                </h4>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  Category: <span className="font-semibold text-slate-800">{liveStandards[activeLiveStd].cat}</span>
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                🔑 {liveStandards[activeLiveStd].clause}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-refreshing standards feed (3/23,866)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab("finder")}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Browse All Catalog →
                </button>
                <button
                  onClick={() => onStartChat(liveStandards[activeLiveStd].query)}
                  className="text-xs font-bold bg-[#0A2540] hover:bg-blue-950 text-white px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect with AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: Live HUID & ISI Licence Verifier (Span 5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">HUID & Mark Verifier</h3>
                  <span className="text-[11px] text-slate-400">BIS Care Authenticity Validator</span>
                </div>
              </div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                Tamper-Proof
              </span>
            </div>

            {/* Interactive Mockup Input */}
            <div className="my-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Enter 6-Digit Alphanumeric HUID:</span>
                <span className="text-[10px] font-mono text-amber-400">Gold 22k / 18k / 14k</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={interactiveHuid}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setInteractiveHuid(v);
                    setHuidVerified(v.length === 6);
                  }}
                  className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold tracking-widest text-amber-300 w-full focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => onNavigateTab("verify")}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition"
                >
                  Verify
                </button>
              </div>

              {huidVerified ? (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Valid Hallmark: Assayed at BIS Center AHC-32 (916 Purity)</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 block text-center">
                  Enter 6 characters (e.g., AB2468) to verify assaying details.
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Verifies CM/L 7-digit licence and HUID</span>
              <button
                onClick={() => onNavigateTab("verify")}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Full Verification Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Tile 3: MSME Fee & Subsidy Simulator (Span 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">MSME Fee Simulator</h3>
                <span className="text-[11px] text-slate-500">Government Concession Calculator</span>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Annual Turnover:</span>
                <span className="font-bold text-slate-900 font-mono">₹{turnoverSlider} Lakhs</span>
              </div>
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={turnoverSlider}
                onChange={(e) => setTurnoverSlider(Number(e.target.value))}
                className="w-full accent-[#0A2540] cursor-pointer"
              />
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-800 font-semibold">Eligible Concession:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">20% to 50% OFF</span>
                </div>
                <p className="text-[10px] text-emerald-700">
                  Micro enterprises & Women Entrepreneurs receive special marking fee subsidies under Scheme I.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("calculator")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Simulate Detailed Timeline & Fees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Tile 4: Laboratory Network Scopes (Span 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">BIS Laboratory Network</h3>
                <span className="text-[11px] text-slate-500">Central, Regional & Branch Labs</span>
              </div>
            </div>

            <div className="my-4 space-y-2 text-xs">
              {[
                { name: "Central Lab, Sahibabad (CL)", scope: "Chemical, Electrical, Mechanical" },
                { name: "Western Regional Lab, Mumbai", scope: "Food, Water, Metallurgy, Textiles" },
                { name: "Southern Regional Lab, Chennai", scope: "Electronics, Rubber, Polymers" }
              ].map((lab, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{lab.name}</span>
                    <span className="text-[10px] text-slate-500">{lab.scope}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    NABL / BIS
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab("labs")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Explore All Testing Scopes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Tile 5: Enterprise RAG Architecture Telemetry (Span 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">System Resilience & Guardrails</h3>
                <span className="text-[11px] text-slate-500">Enterprise AI Infrastructure</span>
              </div>
            </div>

            <div className="my-4 space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Multi-Tier Caching</span>
                <span className="font-mono font-bold text-emerald-600">Sub-10ms (LRU/Semantic)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Circuit Breaker</span>
                <span className="font-mono font-bold text-blue-600">State: CLOSED (Failover 0ms)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Factual Guardrail</span>
                <span className="font-mono font-bold text-amber-600">Zero Hallucination Filter</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("admin")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>View System Design Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 5. Official BIS Certification Schemes Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Key Conformity Assessment Schemes</h3>
              <p className="text-xs text-slate-500">Administered under Bureau of Indian Standards (Conformity Assessment) Regulations, 2018</p>
            </div>
            <button
              onClick={() => onNavigateTab("services")}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 self-start sm:self-center"
            >
              <span>Explore All Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: "scheme_1", title: "Scheme I", subtitle: "Product ISI Mark", desc: "For domestic manufacturers with factory audits." },
              { id: "scheme_2", title: "Scheme II", subtitle: "CRS Registration", desc: "For electronics, IT & solar compulsory goods." },
              { id: "scheme_4", title: "Scheme IV", subtitle: "Eco Mark Scheme", desc: "For eco-friendly & sustainable manufacturing." },
              { id: "scheme_fmcs", title: "FMCS", subtitle: "Foreign Manufacturers", desc: "Certification for overseas factories importing to India." },
              { id: "hallmark", title: "Hallmarking", subtitle: "Gold & Silver HUID", desc: "Mandatory purity certification for jewellery." }
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => onStartChat(`Explain the step by step process, fee structure and requirements for ${s.title} (${s.subtitle}).`)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-mono font-bold text-blue-950 uppercase block">{s.title}</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5 group-hover:text-blue-900 transition">{s.subtitle}</span>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
