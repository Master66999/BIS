"use client";

import React, { useState, useEffect } from "react";
import "../app/footer.css";
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Globe,
  Gem,
  FlaskConical,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
} from "lucide-react";
import { fetchServices } from "../lib/api";
import { BisService } from "../types";

const ICON_MAP: Record<string, any> = {
  BookOpen: BookOpen,
  ShieldCheck: ShieldCheck,
  Cpu: Cpu,
  Globe: Globe,
  Gem: Gem,
  FlaskConical: FlaskConical,
  Smartphone: Smartphone,
};

export const ServicesHubView: React.FC = () => {
  const [services, setServices] = useState<BisService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    fetchServices().then((data) => setServices(data));
  }, []);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Bureau of Indian Standards — Core Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            BIS Services & Schemes Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Explore the official certification schemes, licensing procedures, hallmarking regulations, and laboratory infrastructure provided by the National Standards Body of India.
          </p>
        </div>

        {/* Filter / Search */}
        <div className="max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter services by keyword (e.g. ISI, HUID, CRS, Lab, Consumer)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-slate-900 placeholder-slate-400 shadow-xs transition"
          />
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-3" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((service) => {
            const Icon = ICON_MAP[service.icon] || BookOpen;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <a
                      href={service.portal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition shadow-xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{service.title}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{service.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Features */}
                  <div className="pt-2">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Key Features & Mandates:
                    </h4>
                    <ul className="space-y-1.5">
                      {service.key_features.map((feat, fi) => (
                        <li key={fi} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* FAQs Accordion */}
                  {service.faqs && service.faqs.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-900 block">Frequently Asked Questions:</span>
                      {service.faqs.map((faq, fqi) => {
                        const faqKey = `${service.id}-${fqi}`;
                        const isOpened = expandedFaq === faqKey;
                        return (
                          <div key={fqi} className="bg-slate-50 rounded-xl p-3 text-xs border border-slate-200">
                            <button
                              onClick={() => setExpandedFaq(isOpened ? null : faqKey)}
                              className="w-full text-left font-semibold text-slate-800 hover:text-blue-700 flex items-center justify-between gap-2"
                            >
                              <span>{faq.q}</span>
                              {isOpened ? (
                                <ChevronUp className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              )}
                            </button>
                            {isOpened && (
                              <p className="mt-2 text-slate-600 text-[11px] leading-relaxed pt-2 border-t border-slate-200">
                                {faq.a}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
