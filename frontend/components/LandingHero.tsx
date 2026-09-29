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
} from "lucide-react";

interface LandingHeroProps {
  onStartChat: (initialQuery?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartChat,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onStartChat(searchQuery.trim());
    }
  };

  const quickCards = [
    {
      title: "Fee & Timeline Calculator",
      icon: Calculator,
      query: "How much does a BIS licence cost for my product?",
      desc: "Calculate statutory fees, lab testing costs & MSME discounts.",
      tab: "calculator",
      color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/50",
      iconColor: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Verify ISI Mark & HUID",
      icon: ShieldCheck,
      query: "How can I verify if an ISI mark or gold hallmark is genuine?",
      desc: "Verify CM/L licence numbers and 6-digit gold HUIDs in real time.",
      tab: "verify",
      color: "border-blue-200 hover:border-blue-400 bg-blue-50/50",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      title: "Find a Standard",
      icon: Search,
      query: "Which BIS standard applies to cement?",
      desc: "Identify Indian Standards for any product or industry.",
      tab: "chat",
      color: "border-blue-200 hover:border-blue-400 bg-blue-50/50",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      title: "Product Certification",
      icon: Award,
      query: "How do I obtain BIS certification and ISI mark?",
      desc: "Learn ISI mark licensing, documentation & audits.",
      tab: "chat",
      color: "border-amber-200 hover:border-amber-400 bg-amber-50/50",
      iconColor: "text-amber-600 bg-amber-100",
    },
    {
      title: "Testing Requirements",
      icon: FlaskConical,
      query: "What testing is required for packaged drinking water?",
      desc: "Discover microbiological & chemical test limits.",
      tab: "chat",
      color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/50",
      iconColor: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Gold Hallmarking",
      icon: Gem,
      query: "What are the hallmarking requirements and 6-digit HUID for gold?",
      desc: "Understand mandatory hallmarking & HUID verification.",
      tab: "chat",
      color: "border-yellow-200 hover:border-yellow-400 bg-yellow-50/50",
      iconColor: "text-yellow-600 bg-yellow-100",
    },
    {
      title: "Licensing for MSMEs",
      icon: Factory,
      query: "How can an MSME obtain a BIS licence under simplified procedure?",
      desc: "Fast-track 30-day licensing procedures for small industries.",
      tab: "chat",
      color: "border-indigo-200 hover:border-indigo-400 bg-indigo-50/50",
      iconColor: "text-indigo-600 bg-indigo-100",
    },
    {
      title: "Recognized Laboratories",
      icon: Building2,
      query: "Find BIS-recognized laboratories across India",
      desc: "Search testing labs accredited by BIS for technical testing.",
      tab: "labs",
      color: "border-purple-200 hover:border-purple-400 bg-purple-50/50",
      iconColor: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A2540] via-[#0F2942] to-[#0A2540] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#16385C]">
        {/* Subtle Decorative Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF9933_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH26107 • AI-powered Intelligent Assistant for Indian Standards</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            BIS SmartAssist
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your Intelligent Assistant for Indian Standards & BIS Services. Ask questions in natural language and receive concise, authoritative, <span className="text-amber-400 font-semibold">source-traceable answers</span>.
          </p>

          {/* Conversational Search Input */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl shadow-2xl p-2 flex items-center border-2 border-amber-400/60 focus-within:border-amber-500 transition-all text-slate-900"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about Indian Standards, certification, testing, hallmarking or BIS services..."
                className="w-full py-2.5 px-2 text-sm focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                className="bg-[#0A2540] hover:bg-[#16385C] text-amber-400 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-md"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-3 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Try asking:</span>
              <button
                onClick={() => onStartChat("What BIS standard is applicable to cement?")}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
              >
                Cement Standard (IS 269)
              </button>
              <button
                onClick={() => onStartChat("What is 6-digit HUID in gold hallmarking?")}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
              >
                Gold Hallmarking & HUID
              </button>
              <button
                onClick={() => onStartChat("What certification is required for electric fans?")}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
              >
                Electric Ceiling Fans (IS 374)
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onStartChat()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <span>Start Interactive Chat</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </button>
            <button
              onClick={() => onNavigateTab("finder")}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Explore Product Standard Finder</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">23,866</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Official Indian Standards Indexed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Clause-Traceable Citations</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">8 Branches</div>
            <div className="text-xs text-slate-500 font-medium mt-1">BIS Schemes & Services Covered</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">3 Languages</div>
            <div className="text-xs text-slate-500 font-medium mt-1">English, हिन्दी & मराठी</div>
          </div>
        </div>
      </section>

      {/* Quick Query Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Explore Essential BIS Services</h2>
          <p className="text-sm text-slate-500">
            Select a common topic to begin instant AI-guided standards discovery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => {
                  if (card.tab === "labs") {
                    onNavigateTab("labs");
                  } else {
                    onStartChat(card.query);
                  }
                }}
                className={`p-5 rounded-xl border ${card.color} transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                      Ask AI <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-900 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-[11px] font-medium text-slate-500 italic">
                  "{card.query}"
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture & Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Verification & Grounding Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Zero Hallucination • Strict Factual Traceability
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Every answer generated by BIS SmartAssist is verified against official published standards, gazette Quality Control Orders (QCOs), and authorized manuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Natural Query</h4>
              <p className="text-slate-300">
                User enters query in English, Hindi, or Marathi. AI extracts intents, products, and clauses.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Hybrid Retrieval</h4>
              <p className="text-slate-300">
                Semantic vector search + full-text keyword matching over 23,866 Indian Standards catalogue.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Clause Verification</h4>
              <p className="text-slate-300">
                Reranker verifies technical requirements, clause numbers, pages, and official source links.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-white text-sm">Citations & Confidence</h4>
              <p className="text-slate-300">
                Returns structured answers, clickable BIS references, confidence percentage, and explainability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
