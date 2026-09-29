"use client";

import React, { useState, useEffect } from "react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Bureau of Indian Standards — Core Operations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          BIS Services & Schemes Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
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
          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((service) => {
          const Icon = ICON_MAP[service.icon] || BookOpen;
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-amber-300 flex items-center justify-center shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <a
                    href={service.portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-amber-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{service.title}</h3>
                  <p className="text-xs font-semibold text-amber-700">{service.subtitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Features */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Key Features & Mandates:
                  </h4>
                  <ul className="space-y-1">
                    {service.key_features.map((feat, fi) => (
                      <li key={fi} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQs Accordion */}
                {service.faqs && service.faqs.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Frequently Asked:</span>
                    {service.faqs.map((faq, fqi) => {
                      const faqKey = `${service.id}-${fqi}`;
                      const isOpened = expandedFaq === faqKey;
                      return (
                        <div key={fqi} className="bg-slate-50 rounded-lg p-2.5 text-xs border border-slate-200">
                          <button
                            onClick={() => setExpandedFaq(isOpened ? null : faqKey)}
                            className="w-full text-left font-semibold text-slate-800 flex items-center justify-between gap-2"
                          >
                            <span>{faq.q}</span>
                            {isOpened ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpened && (
                            <p className="mt-2 text-slate-600 text-[11px] leading-relaxed pt-1.5 border-t border-slate-200/80">
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
  );
};
