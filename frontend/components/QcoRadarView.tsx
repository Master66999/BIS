"use client";

import React, { useState, useEffect } from "react";
import "../app/footer.css";
import {
  ShieldAlert,
  Search,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Printer,
  Hash,
  Scale
} from "lucide-react";
import { fetchQcoRadar } from "../lib/api";

interface QcoRadarViewProps {
  onAskAI?: (query: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export function QcoRadarView({ onAskAI, onNavigateTab }: QcoRadarViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ministryFilter, setMinistryFilter] = useState<string>("all");
  const [qcoData, setQcoData] = useState<any>({ total_qco_indexed: 0, orders: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadQco();
  }, [statusFilter, ministryFilter]);

  const loadQco = async (queryText = searchQuery) => {
    setLoading(true);
    try {
      const res = await fetchQcoRadar({
        query: queryText || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        ministry: ministryFilter !== "all" ? ministryFilter : undefined,
      });
      setQcoData(res);
      if (res.orders && res.orders.length > 0 && !selectedOrder) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadQco(searchQuery);
  };

  const handleHsnQuickClick = (hsn: string) => {
    setSearchQuery(hsn);
    loadQco(hsn);
  };

  const orders = qcoData.orders || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                Live Regulatory Radar
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Official Gazette Orders issued under Section 16 of BIS Act, 2016
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quality Control Orders (QCO) & Gazette Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Track mandatory ISI Mark enforcement deadlines across India. Search by product name, Indian Standard, or 4-digit HSN customs classification to verify statutory deadlines and legal penalties.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Bulletin</span>
            </button>
            {onAskAI && (
              <button
                onClick={() =>
                  onAskAI(
                    "What are the newly notified Quality Control Orders (QCOs) in 2026 and what are the penalties for selling non-ISI goods under Section 29?"
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Co-Pilot</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Omni-Search Bar & Quick HSN Chips */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Product (Footwear, Steel, Plywood), Standard (IS 15844), or HSN Code (6403, 7214)..."
              className="w-full pl-12 pr-32 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 placeholder-slate-400 transition"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-sm active:scale-95"
            >
              Search Radar
            </button>
          </form>

          {/* Quick Clickable HSN Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-2 font-medium">
              <Hash className="w-3.5 h-3.5 text-blue-600" />
              <span>Quick HSN Customs Classification Lookup:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { hsn: "7214", label: "HSN 7214: TMT Steel", status: "Enforced", color: "bg-red-50 text-red-700 border-red-200" },
                { hsn: "6403", label: "HSN 6403: Footwear", status: "Imminent", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { hsn: "9503", label: "HSN 9503: Toys", status: "Enforced", color: "bg-red-50 text-red-700 border-red-200" },
                { hsn: "8504", label: "HSN 8504: Solar Inverters", status: "Imminent", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { hsn: "4412", label: "HSN 4412: Plywood", status: "Imminent", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { hsn: "7318", label: "HSN 7318: Fasteners & Bolts", status: "Upcoming", color: "bg-blue-50 text-blue-700 border-blue-200" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHsnQuickClick(chip.hsn)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition hover:scale-105 ${chip.color}`}
                >
                  <span>{chip.label}</span>
                  <span className="ml-1.5 opacity-75 font-normal text-[10px]">({chip.status})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Status:
              </span>
              {[
                { id: "all", label: "All QCOs" },
                { id: "enforced", label: "🔴 Enforced (Mandatory)" },
                { id: "imminent", label: "🟡 Imminent Countdown" },
                { id: "upcoming", label: "🔵 Upcoming Transition" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                    statusFilter === st.id
                      ? "bg-blue-600 text-white shadow-xs font-extrabold"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Ministry:</span>
              <select
                value={ministryFilter}
                onChange={(e) => setMinistryFilter(e.target.value)}
                className="bg-slate-50 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none border border-slate-200 focus:border-blue-600"
              >
                <option value="all">All Ministries</option>
                <option value="DPIIT">DPIIT (Commerce & Industry)</option>
                <option value="Steel">Ministry of Steel</option>
                <option value="MNRE">MNRE (Renewable Energy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Statutory Legal Warning Banner */}
        <div className="p-5 rounded-2xl bg-red-50 text-slate-900 border-2 border-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-red-950 flex items-center gap-1.5">
                <span>Statutory Mandate under Section 16 & Section 29 (BIS Act, 2016)</span>
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Manufacturing, importing, storing, or selling goods without mandatory Standard Mark (ISI) after the notification date constitutes a criminal offence. Penalties include seizure of entire consignment and fine up to <strong>₹5,00,000</strong> or value of goods.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full border border-red-300">
              Strict Liability Enforced
            </span>
          </div>
        </div>

        {/* 3. The QCO Radar Order Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Active Gazette Notifications ({orders.length} Orders Found)
            </h2>
            <span className="text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Live Enforcement Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {orders.map((qco: any) => {
              const isCrit = qco.urgency === "critical";
              const isHigh = qco.urgency === "high";
              return (
                <div
                  key={qco.id}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm flex flex-col justify-between hover:border-blue-400 ${
                    isCrit
                      ? "border-red-300"
                      : isHigh
                      ? "border-amber-300"
                      : "border-slate-200"
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Top Status & Urgency Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider uppercase border flex items-center gap-1.5 ${
                            isCrit
                              ? "bg-red-50 text-red-700 border-red-200"
                              : isHigh
                              ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{qco.countdown_display}</span>
                        </span>

                        <span className="text-xs text-slate-600 font-mono font-bold">
                          Order: {qco.order_number}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-blue-700 font-mono bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
                        {qco.ministry}
                      </span>
                    </div>

                    {/* Title & Category */}
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                        Category: {qco.product_categories}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{qco.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{qco.description}</p>
                    </div>

                    {/* HSN Codes & Standards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      
                      {/* Covered Standards */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                          Mandated Indian Standards:
                        </span>
                        <div className="space-y-1.5 pt-0.5">
                          {qco.standards.map((s: any, idx: number) => (
                            <div key={idx} className="text-xs flex items-center justify-between text-slate-700">
                              <span className="font-mono font-bold text-blue-700">{s.code}</span>
                              <span className="text-slate-500 text-[11px] truncate max-w-[200px]">{s.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* HSN Codes & MSME Special Grace */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                            Covered HSN Codes:
                          </span>
                          <span className="text-[10px] font-mono font-bold text-blue-700">
                            Customs Classification
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {qco.hsn_codes.map((h: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-800">
                              {h}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 text-[11px] text-emerald-700 font-medium">
                          <strong>MSME Transition:</strong> {qco.msme_provisions}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Actions Strip */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 font-mono text-[11px]">
                      Enforcement Date: <strong className="text-slate-800">{qco.enforcement_date}</strong> • MSME Grace: <strong className="text-blue-600">{qco.msme_grace_date}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={qco.gazette_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition flex items-center gap-1.5"
                      >
                        <span>Official Gazette</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>

                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab("journey")}
                          className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Generate MSME Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      )}

                      {onAskAI && (
                        <button
                          onClick={() =>
                            onAskAI(
                              `Explain the mandatory requirements, test protocols and transition deadlines under the ${qco.title} (${qco.order_number}).`
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
