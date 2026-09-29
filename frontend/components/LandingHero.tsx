"use client";

import React, { useState } from "react";
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
  HelpCircle,
  Calculator,
  Shield,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Compass,
  Cpu,
  Wheat,
  Hammer,
  Zap,
  TestTube2,
  HeartPulse,
} from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";

interface LandingHeroProps {
  onStartChat: (initialQuery?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartChat,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = selectedCategory !== "All"
        ? `${searchQuery.trim()} in category ${selectedCategory}`
        : searchQuery.trim();
      onStartChat(q);
    }
  };

  const quickCards = [
    {
      title: "Fee & Timeline Calculator",
      titleHi: "शुल्क एवं समय-सीमा गणक",
      icon: Calculator,
      query: "How much does a BIS licence cost for my product?",
      desc: "Estimate statutory application fees, marking fees, lab testing costs & 20% MSME concession.",
      tab: "calculator",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "Scheme I / MSME",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    {
      title: "Verify ISI Mark & HUID",
      titleHi: "आईएसआई और हॉलमार्क सत्यापन",
      icon: ShieldCheck,
      query: "How can I verify if an ISI mark or gold hallmark is genuine?",
      desc: "Verify CM/L 7-digit licence numbers and 6-digit alphanumeric Gold HUIDs in real-time.",
      tab: "verify",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "Real-Time Verification",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-300",
    },
    {
      title: "Product Standard Finder",
      titleHi: "उत्पाद मानक खोज",
      icon: Search,
      query: "Which BIS standard applies to cement?",
      desc: "Instant discovery of Indian Standards (IS), mandatory QCO status, and applicable certification schemes.",
      tab: "finder",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "23,866 Standards",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-300",
    },
    {
      title: "Scheme I: Product Certification",
      titleHi: "उत्पाद प्रमाणन (आईएसआई मार्क)",
      icon: Award,
      query: "How do I obtain BIS certification and ISI mark?",
      desc: "Step-by-step guidance for domestic manufacturers, factory audits, and testing protocols.",
      tab: "chat",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "Scheme I (ISI Mark)",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
    },
    {
      title: "Scheme II: Compulsory Registration",
      titleHi: "अनिवार्य पंजीकरण योजना (सीआरएस)",
      icon: Cpu,
      query: "Which electronics and IT goods fall under compulsory CRS registration?",
      desc: "Self-declaration of conformity for electronics, laptops, solar inverters, and battery packs.",
      tab: "chat",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "Scheme II (CRS)",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-300",
    },
    {
      title: "Gold & Silver Hallmarking",
      titleHi: "स्वर्ण एवं रजत हॉलमार्किंग",
      icon: Gem,
      query: "What are the hallmarking requirements and 6-digit HUID for gold?",
      desc: "Mandatory hallmarking in 256 districts, 6-digit HUID tracking, and Assay & Hallmarking Centers.",
      tab: "chat",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "6-Digit HUID",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-300",
    },
    {
      title: "MSME Fast-Track Procedure",
      titleHi: "सूक्ष्म, लघु एवं मध्यम उद्योग",
      icon: Factory,
      query: "How can an MSME obtain a BIS licence under simplified procedure?",
      desc: "Fast-track 30-day licensing procedure with 20% concession on application and annual fees.",
      tab: "chat",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "30-Day Fast Track",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    {
      title: "Recognized Testing Laboratories",
      titleHi: "मान्यता प्राप्त परीक्षण प्रयोगशालाएं",
      icon: FlaskConical,
      query: "Find BIS-recognized laboratories across India",
      desc: "Search testing labs accredited by BIS under the Laboratory Recognition Scheme (LRS).",
      tab: "labs",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "LRS Directory",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-300",
    },
    {
      title: "Consumer Rights & BIS CARE",
      titleHi: "उपभोक्ता अधिकार एवं बीआईएस केयर",
      icon: Shield,
      query: "How do I report fake ISI mark or sub-standard goods on BIS CARE?",
      desc: "Verify licences, check authenticity, and lodge complaints against counterfeit ISI goods.",
      tab: "services",
      color: "border-slate-300 hover:border-[#0B2545] bg-white",
      badge: "BIS CARE App",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-300",
    },
  ];

  const standardDivisions = [
    { code: "CED", name: "Civil Engineering", icon: Hammer, stds: "3,200+ Standards", query: "Civil engineering and construction standards" },
    { code: "ETD", name: "Electrotechnical", icon: Zap, stds: "2,800+ Standards", query: "Electrotechnical and electrical equipment standards" },
    { code: "FAD", name: "Food & Agriculture", icon: Wheat, stds: "2,100+ Standards", query: "Food and agriculture standards and testing" },
    { code: "CHD", name: "Chemical & Polymers", icon: TestTube2, stds: "4,500+ Standards", query: "Chemical products and polymers standards" },
    { code: "MED", name: "Mechanical Engineering", icon: Compass, stds: "3,900+ Standards", query: "Mechanical engineering and machinery standards" },
    { code: "MHD", name: "Medical Equipment", icon: HeartPulse, stds: "850+ Standards", query: "Medical equipment and healthcare standards" },
  ];

  return (
    <div className="space-y-10 pb-16 bg-slate-50 font-sans">
      {/* 1. Official Government Hero Section */}
      <section className="relative overflow-hidden bg-[#0B2545] text-white border-b-4 border-amber-500 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle Ashoka Chakra / Geometric Background */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-5">
          {/* Government Crest Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold tracking-wide">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>भारतीय मानक ब्यूरो • BUREAU OF INDIAN STANDARDS</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-slate-200">राष्ट्रीय नियामक अनुपालन पोर्टल</span>
          </div>

          {/* Main Dignified Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
              राष्ट्रीय मानक एवं बीआईएस सेवा पोर्टल
            </h1>
            <p className="text-base sm:text-xl text-slate-200 font-sans font-medium">
              National Standards Information & AI-Assisted Regulatory Portal
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Search <strong>23,866 Indian Standards (IS)</strong>, verify mandatory Quality Control Orders (QCOs), calculate statutory certification fees, check Gold HUID authenticity, and receive <span className="text-amber-300 font-semibold">zero-hallucination, clause-traceable answers</span>.
          </p>

          {/* Central Government Search Console */}
          <div className="max-w-3xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-lg shadow-xl p-1.5 flex flex-col sm:flex-row items-center border border-slate-300 focus-within:border-[#0B2545] focus-within:ring-2 focus-within:ring-amber-400/50 transition-all text-slate-900"
            >
              {/* Category Dropdown */}
              <div className="w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-slate-200 px-3 py-1.5 flex items-center text-xs font-medium text-slate-700 flex-shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer py-1"
                >
                  <option value="All">All Standards (सभी श्रेणियां)</option>
                  <option value="Civil & Construction">Civil & Construction</option>
                  <option value="Food & Agriculture">Food & Agriculture</option>
                  <option value="Electrical">Electrotechnical</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Chemical">Chemical & Polymers</option>
                  <option value="Medical Equipment">Medical Equipment</option>
                  <option value="Hallmarking">Gold & Silver Hallmarking</option>
                </select>
              </div>

              {/* Main Search Input */}
              <div className="flex-1 flex items-center w-full px-3 py-1">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search standard number (e.g. IS 10500, IS 14543, IS 1786), product, or clause..."
                  className="w-full py-1.5 text-xs sm:text-sm focus:outline-none placeholder-slate-400 font-medium text-slate-900"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full sm:w-auto mt-1 sm:mt-0 bg-[#0B2545] hover:bg-[#133E68] text-amber-300 hover:text-white px-5 py-2.5 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors flex-shrink-0 shadow"
              >
                <span>खोजें / Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Keyword Query Tags */}
            <div className="flex items-center justify-center flex-wrap gap-1.5 pt-3 text-[11px] text-slate-300">
              <span className="text-slate-400 font-semibold">Popular Standards:</span>
              {[
                { label: "IS 10500 (Drinking Water)", q: "What are the requirements of IS 10500 drinking water?" },
                { label: "IS 14543 (Packaged Water)", q: "What is IS 14543 for packaged drinking water and is it mandatory?" },
                { label: "IS 1786 (TMT Steel Bars)", q: "What is IS 1786 specification for high strength TMT bars?" },
                { label: "IS 2347 (Pressure Cookers)", q: "Is IS 2347 certification mandatory for pressure cookers under QCO?" },
                { label: "Gold 6-Digit HUID", q: "How to verify 6-digit HUID in gold jewellery?" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onStartChat(item.q)}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 px-2 py-0.5 rounded border border-white/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onStartChat()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm"
            >
              <Compass className="w-4 h-4 text-slate-950 font-bold" />
              <span>Launch Interactive Assistant</span>
            </button>
            <button
              onClick={() => onNavigateTab("finder")}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded border border-white/20 transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Explore Product Standard Finder</span>
            </button>
            <button
              onClick={() => onNavigateTab("calculator")}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded border border-white/20 transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Fee & Timeline Calculator</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Official National Metric Dashboard Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-lg shadow-md border border-slate-300 p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-serif">23,866</div>
            <div className="text-xs text-slate-700 font-semibold mt-0.5">Published Indian Standards</div>
            <div className="text-[10px] text-slate-500">Harmonized with ISO / IEC</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-serif">600+</div>
            <div className="text-xs text-slate-700 font-semibold mt-0.5">Mandatory QCO Products</div>
            <div className="text-[10px] text-slate-500">Compulsory ISI Mark Enforced</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-serif">8 Schemes</div>
            <div className="text-xs text-slate-700 font-semibold mt-0.5">Conformity Assessment</div>
            <div className="text-[10px] text-slate-500">ISI Mark, CRS, FMCS, Hallmarking</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-800 font-serif">100%</div>
            <div className="text-xs text-slate-700 font-semibold mt-0.5">Factual Grounding</div>
            <div className="text-[10px] text-slate-500">Exact Clause & Gazette Citation</div>
          </div>
        </div>
      </section>

      {/* 3. Essential Citizen & Industry Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              मानक सेवाएं • BIS Regulatory Services
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Core Standards & Compliance Services
            </h2>
            <p className="text-xs text-slate-600">
              Select an official service branch to access statutory guidelines, fee schedules, or AI enquiry
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("services")}
            className="text-xs font-semibold text-[#0B2545] hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All BIS Schemes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => {
                  if (card.tab === "labs") onNavigateTab("labs");
                  else if (card.tab === "calculator") onNavigateTab("calculator");
                  else if (card.tab === "verify") onNavigateTab("verify");
                  else if (card.tab === "finder") onNavigateTab("finder");
                  else if (card.tab === "services") onNavigateTab("services");
                  else onStartChat(card.query);
                }}
                className={`gov-card p-4 rounded border transition-all duration-150 cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded bg-[#0B2545] text-amber-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0B2545] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                    {card.titleHi}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#0B2545] font-semibold group-hover:underline flex items-center gap-1">
                    Open Service <ArrowRight className="w-3 h-3 text-amber-600" />
                  </span>
                  <span className="text-slate-400 text-[10px]">Gov.in Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Standards Technical Divisions Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            मानक प्रभाग • Technical Divisions
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Browse Standards by National Technical Division
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {standardDivisions.map((div, i) => {
            const Icon = div.icon;
            return (
              <div
                key={i}
                onClick={() => onStartChat(div.query)}
                className="bg-white p-3 rounded border border-slate-200 hover:border-[#0B2545] hover:shadow-sm cursor-pointer transition-all text-center group flex flex-col items-center justify-between"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#0B2545] text-[#0B2545] group-hover:text-amber-300 flex items-center justify-center transition-colors mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mb-1">
                  {div.code}
                </div>
                <div className="text-xs font-bold text-slate-800 leading-tight mb-1">
                  {div.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {div.stds}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Official Government Traceability & Security Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B2545] text-white rounded-lg p-6 sm:p-8 border border-[#133E68] shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>सत्यमेव जयते • Factual Grounding Framework</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Strict Factual Traceability & Zero-Hallucination Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike general chatbots, BIS SmartAssist operates under strict regulatory constraints: every factual answer cites the exact Indian Standard number, clause, publication date, and official BIS portal reference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 p-3.5 rounded border border-white/10 space-y-1.5">
              <div className="text-amber-400 font-bold text-xs">01 • Legal Intent Parsing</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Identifies product categories, standard numbers, testing limits, and certification schemes in English, Hindi, and Marathi.
              </p>
            </div>
            <div className="bg-white/5 p-3.5 rounded border border-white/10 space-y-1.5">
              <div className="text-amber-400 font-bold text-xs">02 • Hybrid Neural Search</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Combines dense vector embeddings with BM25 keyword matching across all 23,866 published Indian Standards.
              </p>
            </div>
            <div className="bg-white/5 p-3.5 rounded border border-white/10 space-y-1.5">
              <div className="text-amber-400 font-bold text-xs">03 • Clause Grounding</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Validates retrieved clauses against official Gazette Quality Control Orders (QCOs) and technical requirements.
              </p>
            </div>
            <div className="bg-white/5 p-3.5 rounded border border-white/10 space-y-1.5">
              <div className="text-amber-400 font-bold text-xs">04 • Transparent Audit</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Provides a Confidence Gauge and "Why this answer?" Explainability Drawer disclosing all retrieved evidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
