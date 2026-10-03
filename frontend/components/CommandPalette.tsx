"use client";

import React, { useState, useEffect, useRef } from "react";
import "../app/footer.css";
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      {/* Spotlight Window */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
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
            className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching standards or tools found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isMandatory = item.badge?.includes("Mandatory");
              const isVerified = item.badge?.includes("Verification") || item.badge?.includes("MSME");
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-blue-50/80 border border-blue-200 text-slate-900 shadow-sm"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isMandatory
                            ? "bg-red-50 text-red-700 border-red-200"
                            : isVerified
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-[10px] font-mono font-bold text-blue-600">{item.category}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-4 font-mono">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span className="text-blue-600 font-bold">MANAKAI Spotlight</span>
        </div>
      </div>
    </div>
  );
};

