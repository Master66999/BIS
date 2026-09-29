"use client";

import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Building,
  Shield,
  Layers,
} from "lucide-react";
import { fetchLaboratories } from "../lib/api";
import { Laboratory } from "../types";

export const LaboratoriesView: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  useEffect(() => {
    loadLabs();
  }, [selectedState]);

  const loadLabs = async () => {
    try {
      const data = await fetchLaboratories(searchTerm, selectedState);
      setLaboratories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLabs();
  };

  const indianStates = [
    "All",
    "Uttar Pradesh",
    "Maharashtra",
    "Tamil Nadu",
    "West Bengal",
    "Punjab",
    "Delhi",
    "Karnataka",
    "Gujarat",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
          <span>Laboratory Recognition Scheme (LRS) & BIS Testing Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          BIS Recognized Testing Laboratories Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Search accredited central, regional, and recognized commercial laboratories across India authorized to conduct compliance testing for Indian Standards.
        </p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search laboratory name, city, or standard (e.g. IS 269, Cement, Water, Fan)..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="sm:w-56">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            {indianStates.map((st) => (
              <option key={st} value={st}>
                {st === "All" ? "All States / Regions" : st}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-[#0B2545] hover:bg-[#133E68] text-amber-300 font-semibold rounded-lg text-xs shadow transition-colors"
        >
          Search Laboratories
        </button>
      </form>

      {/* Laboratories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {laboratories.map((lab) => (
          <div
            key={lab.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{lab.lab_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{lab.city}, {lab.state}</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {lab.status}
                </span>
              </div>

              {lab.address && (
                <p className="text-[11px] text-slate-600 pl-1 leading-relaxed">
                  <strong>Address:</strong> {lab.address}
                </p>
              )}

              {lab.contact && (
                <p className="text-[11px] text-slate-600 pl-1">
                  <strong>Contact:</strong> {lab.contact}
                </p>
              )}

              {/* Scope */}
              {lab.accredited_scope && (
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Accredited Testing Disciplines:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {lab.accredited_scope}
                  </p>
                </div>
              )}

              {/* Standards */}
              {lab.recognized_standards && (
                <div className="pt-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Recognized Indian Standards:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {lab.recognized_standards.split(",").map((s, si) => (
                      <span
                        key={si}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-mono text-[10px] border border-blue-200"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
