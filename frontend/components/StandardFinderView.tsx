"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  BookOpen,
  Scale,
} from "lucide-react";
import { findProductStandards, fetchCategories } from "../lib/api";
import { ProductFinderResult } from "../types";

interface StandardFinderViewProps {
  onAskAboutStandard: (stdNum: string) => void;
}

export const StandardFinderView: React.FC<StandardFinderViewProps> = ({
  onAskAboutStandard,
}) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("All");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<string | null>(null);
  const [results, setResults] = useState<ProductFinderResult[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<ProductFinderResult | null>(null);
  const [compareList, setCompareList] = useState<ProductFinderResult[]>([]);

  useEffect(() => {
    loadCategories();
    // Default initial search
    handleSearch("Cement");
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (overrideProduct?: string) => {
    const prod = (overrideProduct || productName).trim();
    if (!prod) return;

    setLoading(true);
    try {
      const data = await findProductStandards(prod, category, description);
      setOverview(data.overview);
      setResults(data.standards);
      if (data.standards.length > 0) {
        setSelectedStandard(data.standards[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (item: ProductFinderResult) => {
    if (compareList.find((c) => c.standard_number === item.standard_number)) {
      setCompareList(compareList.filter((c) => c.standard_number !== item.standard_number));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], item]);
      } else {
        setCompareList([...compareList, item]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Product Standards Discovery Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Product Standard Finder & Compliance Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Enter any product name or technical description to identify applicable Indian Standards (IS), mandatory Quality Control Order (QCO) status, certification schemes, and testing criteria.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name / Commodity
            </label>
            <div className="relative">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Electric Fan, Packaged Drinking Water, Cement, Steel Rebar, Motorcycle Helmet..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Division / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="All">All BIS Technical Divisions</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Quick categories:</span>
            {["Cement", "Electric Fan", "Steel Rebar", "Helmet", "Packaged Water", "Gold Jewellery"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    setProductName(item);
                    handleSearch(item);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-[11px] transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-2 bg-[#0A2540] hover:bg-[#16385C] text-amber-400 font-semibold rounded-lg text-xs flex items-center gap-2 shadow transition-colors"
          >
            {loading ? "Analyzing Standards..." : "Find Applicable Standards"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Alert */}
      {overview && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-0.5">Regulatory Overview</h4>
            <p className="leading-relaxed text-blue-800">{overview}</p>
          </div>
        </div>
      )}

      {/* Comparison Drawer if 2 selected */}
      {compareList.length > 0 && (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Standards Comparison ({compareList.length} of 2 selected)</span>
            </div>
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-amber-700 hover:underline"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compareList.map((c, i) => (
              <div key={i} className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-sm text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                    {c.standard_number}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_mandatory ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}>
                    {c.is_mandatory ? "Mandatory QCO" : "Voluntary"}
                  </span>
                </div>
                <h5 className="font-semibold text-slate-800 text-[12px]">{c.title}</h5>
                <p className="text-slate-600 text-[11px]"><strong>Scheme:</strong> {c.certification_scheme}</p>
                <div>
                  <strong className="text-slate-700 text-[11px]">Key Requirements:</strong>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600 space-y-0.5">
                    {c.key_requirements.map((r, ri) => (
                      <li key={ri}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Matching Indian Standards ({results.length})
          </h3>
          <span className="text-xs text-slate-400">Click a card to inspect technical clauses</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-semibold text-slate-700 text-sm">No standards found</h4>
            <p className="text-xs text-slate-400">
              Try searching with generic terms like "Cement", "Steel", "Fan", or "Water".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, idx) => {
              const isSelected = selectedStandard?.standard_number === item.standard_number;
              const isComparing = compareList.some((c) => c.standard_number === item.standard_number);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedStandard(item)}
                  className={`bg-white rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-amber-500 ring-2 ring-amber-400/20 bg-amber-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top badging */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                        {item.standard_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.is_mandatory
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {item.is_mandatory ? "Mandatory QCO" : "Scheme I"}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Metadata tags */}
                    <div className="text-[11px] space-y-1.5 pt-1 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span><strong>Scheme:</strong> {item.certification_scheme}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                        <span><strong>Testing:</strong> Required by BIS</span>
                      </div>
                    </div>

                    {/* Requirements Preview */}
                    {item.key_requirements && item.key_requirements.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <p className="font-semibold text-slate-700 mb-1">Key Specifications:</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                          {item.key_requirements.slice(0, 2).map((r, ri) => (
                            <li key={ri} className="line-clamp-1">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(item);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                        isComparing
                          ? "bg-amber-500 text-slate-950 border-amber-600"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                      }`}
                    >
                      {isComparing ? "Comparing" : "+ Compare"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAboutStandard(`What are the key requirements and clauses of ${item.standard_number}?`);
                      }}
                      className="text-blue-700 hover:text-amber-600 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
