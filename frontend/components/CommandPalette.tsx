"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Command,
  FileText,
  Calculator,
  ShieldCheck,
  FlaskConical,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  ExternalLink,
  BookOpen,
  Activity
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onStartChat: (query: string) => void;
}

interface PaletteItem {
  id: string;
  category: "Standards" | "Tools" | "Schemes" | "System";
  title: string;
  subtitle: string;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onStartChat,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  // Global shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const allItems: PaletteItem[] = [
    // Standards
    {
      id: "std-1786",
      category: "Standards",
      title: "IS 1786:2008",
      subtitle: "High Strength Deformed Steel Bars & Wires (Fe 500D) • Mandatory QCO",
      badge: "Mandatory QCO",
      action: () => {
        onStartChat("What are the chemical tolerances and test limits for Fe 500D steel rebars under IS 1786?");
        onClose();
      }
    },
    {
      id: "std-14543",
      category: "Standards",
      title: "IS 14543:2016",
      subtitle: "Packaged Drinking Water (Other than Natural Mineral Water)",
      badge: "Mandatory QCO",
      action: () => {
        onStartChat("What are the testing parameters and licensing steps for packaged drinking water under IS 14543?");
        onClose();
      }
    },
    {
      id: "std-456",
      category: "Standards",
      title: "IS 456:2000",
      subtitle: "Plain and Reinforced Concrete - Code of Practice (Fourth Revision)",
      badge: "National Code",
      action: () => {
        onStartChat("Explain minimum cement content and 28-day compressive strength under IS 456.");
        onClose();
      }
    },
    {
      id: "std-1293",
      category: "Standards",
      title: "IS 1293:2019",
      subtitle: "Plugs and Socket-Outlets of Rated Voltage up to 250V",
      badge: "Electrical QCO",
      action: () => {
        onStartChat("What are the safety requirements and insulation limits under IS 1293 for plugs and socket outlets?");
        onClose();
      }
    },
    {
      id: "std-10500",
      category: "Standards",
      title: "IS 10500:2012",
      subtitle: "Drinking Water Specifications (Physical, Chemical & Toxic Limits)",
      badge: "Health & Safety",
      action: () => {
        onStartChat("What are the acceptable and permissible limits for drinking water under IS 10500?");
        onClose();
      }
    },
    // Tools
    {
      id: "tool-verify",
      category: "Tools",
      title: "Verify 6-Digit HUID & ISI Mark",
      subtitle: "Instant authenticity verification for gold hallmarking and CM/L licence numbers",
      badge: "Live Verification",
      action: () => {
        onNavigateTab("verify");
        onClose();
      }
    },
    {
      id: "tool-calc",
      category: "Tools",
      title: "Fee & Timeline Calculator",
      subtitle: "Calculate marking fees, testing costs, and 50% MSME subsidies",
      badge: "MSME Concessions",
      action: () => {
        onNavigateTab("calculator");
        onClose();
      }
    },
    {
      id: "tool-finder",
      category: "Tools",
      title: "Product Standards Catalog Finder",
      subtitle: "Explore 23,866 Indian Standards across 14 industry sectors",
      badge: "Catalog Explorer",
      action: () => {
        onNavigateTab("finder");
        onClose();
      }
    },
    {
      id: "tool-labs",
      category: "Tools",
      title: "BIS Testing Laboratories Network",
      subtitle: "Find Central, Regional, and recognized private testing scopes",
      badge: "Lab Directory",
      action: () => {
        onNavigateTab("labs");
        onClose();
      }
    },
    // Schemes
    {
      id: "scheme-1",
      category: "Schemes",
      title: "Scheme I: Product ISI Mark",
      subtitle: "Domestic manufacturer certification with factory audits and sample draws",
      action: () => {
        onStartChat("How do I obtain an ISI mark under Scheme I?");
        onClose();
      }
    },
    {
      id: "scheme-2",
      category: "Schemes",
      title: "Scheme II: Compulsory Registration (CRS)",
      subtitle: "Self-declaration of conformity for electronics, IT, and solar products",
      action: () => {
        onStartChat("What is the process for Compulsory Registration Scheme (CRS) for electronics?");
        onClose();
      }
    },
    // System
    {
      id: "sys-telemetry",
      category: "System",
      title: "Enterprise System Design Dashboard",
      subtitle: "Inspect Multi-Tier Caching, Circuit Breaker, and Rate Limiting telemetry",
      badge: "SIH Architecture",
      action: () => {
        onNavigateTab("admin");
        onClose();
      }
    }
  ];

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      {/* Spotlight Window */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-950 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type standard (e.g. IS 1786), product, scheme, or tool..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No matching standard or tool found.</p>
              <button
                onClick={() => {
                  onStartChat(query);
                  onClose();
                }}
                className="text-xs text-blue-900 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Ask AI Co-Pilot: "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? "bg-[#0A2540] text-white shadow-xs" : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? "bg-white/20 text-amber-300" : "bg-blue-50 text-blue-950"
                      }`}
                    >
                      {item.category === "Standards" && <FileText className="w-4 h-4" />}
                      {item.category === "Tools" && <Calculator className="w-4 h-4" />}
                      {item.category === "Schemes" && <BookOpen className="w-4 h-4" />}
                      {item.category === "System" && <Activity className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold font-mono ${isSelected ? "text-amber-300" : "text-slate-900"}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              isSelected
                                ? "bg-white/10 text-white border-white/20"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition ${isSelected ? "text-amber-400 translate-x-1" : "text-slate-300"}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="hidden sm:inline text-blue-950 font-bold">23,866 Indian Standards Spotlight</span>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
