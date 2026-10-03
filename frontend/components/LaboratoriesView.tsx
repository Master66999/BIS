"use client";

import React, { useState, useEffect } from "react";
import "../app/footer.css";
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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
            <span>Laboratory Recognition Scheme (LRS) & BIS Testing Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            BIS Recognized Testing Laboratories Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Search accredited central, regional, and recognized commercial laboratories across India authorized to conduct compliance testing for Indian Standards.
          </p>
        </div>

        {/* Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3.5"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search laboratory name, city, or standard (e.g. IS 269, Cement, Water, Fan)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-3.5" />
          </div>

          <div className="sm:w-60">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
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
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
          >
            Search Laboratories
          </button>
        </form>

        {/* Laboratories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {laboratories.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{lab.lab_name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{lab.city}, {lab.state}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    {lab.status}
                  </span>
                </div>

                {lab.address && (
                  <p className="text-[11px] text-slate-600 pl-1 leading-relaxed">
                    <strong className="text-slate-800">Address:</strong> {lab.address}
                  </p>
                )}

                {lab.contact && (
                  <p className="text-[11px] text-slate-600 pl-1">
                    <strong className="text-slate-800">Contact:</strong> {lab.contact}
                  </p>
                )}

                {/* Scope */}
                {lab.accredited_scope && (
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">
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
                    <span className="text-[11px] font-bold text-blue-700 block mb-1.5">
                      Recognized Indian Standards:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.recognized_standards.split(",").map((s, si) => (
                        <span
                          key={si}
                          className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold border border-blue-200"
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
    </div>
  );
};
