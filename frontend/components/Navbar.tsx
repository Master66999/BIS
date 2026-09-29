"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  MessageSquare,
  BookOpen,
  FlaskConical,
  BarChart3,
  Globe,
  UserCheck,
  ExternalLink,
  Menu,
  X,
  Calculator,
  ShieldCheck,
  Home,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Command,
  FileCheck
} from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";
import { demoLogin } from "../lib/api";

interface NavbarProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenSpotlight?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang = "en",
  onLanguageChange,
  activeTab = "home",
  setActiveTab,
  onOpenSpotlight,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bis_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleDemoSwitch = async (role: string) => {
    try {
      const res = await demoLogin(role);
      setCurrentUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: "home", label: "Home", labelHi: "मुखपृष्ठ", icon: Home },
    { id: "chat", label: "AI Co-Pilot", labelHi: "एआई सहायक", icon: MessageSquare, badge: "AI" },
    { id: "finder", label: "Standards", labelHi: "मानक खोज", icon: Search },
    { id: "calculator", label: "Fees", labelHi: "शुल्क गणक", icon: Calculator },
    { id: "verify", label: "Verify Mark", labelHi: "सत्यापन", icon: ShieldCheck },
    { id: "services", label: "Schemes", labelHi: "योजनाएं", icon: BookOpen },
    { id: "labs", label: "Labs", labelHi: "प्रयोगशालाएं", icon: FlaskConical },
    { id: "admin", label: "Admin & Architecture", labelHi: "प्रशासन", icon: BarChart3, badge: "SIH" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-slate-200">
      {/* 1. Tricolor Saffron/White/Green Sovereign Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Accessibility & Government Identification Bar */}
      <div className="bg-slate-100/90 text-slate-700 text-xs border-b border-slate-200/80 px-4 py-1 font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government of India Hierarchical Breadcrumb */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-bold text-slate-900 tracking-wide">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="font-bold text-slate-800">GOVERNMENT OF INDIA</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-600 truncate max-w-md font-medium">
              उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय • Ministry of Consumer Affairs
            </span>
          </div>

          {/* Accessibility & Official Direct Portals */}
          <div className="flex items-center space-x-3 text-[11px]">
            {/* Font Sizer Controls */}
            <div className="hidden sm:flex items-center space-x-0.5 bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px] font-bold">
              <button
                onClick={() => setFontSize("sm")}
                className={`px-1 rounded ${fontSize === "sm" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("base")}
                className={`px-1 rounded ${fontSize === "base" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                title="Default font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize("lg")}
                className={`px-1 rounded ${fontSize === "lg" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden text-[10px] shadow-2xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange && onLanguageChange(l.code)}
                  className={`px-2 py-0.5 font-medium transition-colors ${
                    currentLang === l.code
                      ? "bg-[#0A2540] text-amber-300 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Official Portals Deep Links */}
            <div className="hidden xl:flex items-center space-x-2.5 pl-2 border-l border-slate-300 text-[10px]">
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-blue-900 flex items-center gap-1 font-medium"
              >
                Manakonline <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
              <a
                href="https://www.services.bis.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-blue-900 flex items-center gap-1 font-medium"
              >
                e-BIS Services <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Brand Header with Dual Emblems */}
      <div className="bg-white py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: National Emblem + BIS Official Seal + Titles */}
          <div
            onClick={() => setActiveTab && setActiveTab("home")}
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group min-w-0"
          >
            {/* National Emblem of India */}
            <div className="text-slate-800 hover:text-[#0A2540] transition-colors flex-shrink-0">
              <EmblemOfIndia className="h-10 sm:h-12 w-auto" />
            </div>

            <div className="h-9 w-[1px] bg-slate-300 hidden sm:block flex-shrink-0" />

            {/* BIS Official Seal */}
            <div className="flex-shrink-0">
              <BisEmblem className="h-9 sm:h-11 w-auto" />
            </div>

            {/* Official Typography */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-[#0A2540] font-serif leading-none">
                  भारतीय मानक ब्यूरो
                </h1>
                <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide font-sans truncate">
                  BUREAU OF INDIAN STANDARDS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                राष्ट्रीय मानक निकाय • National Standards Body of India • मानक: पथप्रदर्शक:
              </p>
            </div>
          </div>

          {/* Right: Quick Spotlight Trigger + Persona Switcher */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Quick Spotlight Trigger (Cmd+K) */}
            {onOpenSpotlight && (
              <button
                onClick={onOpenSpotlight}
                className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700 transition shadow-2xs group"
                title="Search 23,866 Indian Standards & Tools (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-blue-950 group-hover:scale-110 transition-transform" />
                <span>Search 23k Standards...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] font-bold text-slate-500 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Persona Switcher Pill */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-300 text-xs">
              <button
                onClick={() => handleDemoSwitch("user")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentUser?.role !== "admin"
                    ? "bg-[#0A2540] text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="Switch to Industry / MSME Applicant"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Industry / MSME</span>
              </button>
              <button
                onClick={() => handleDemoSwitch("admin")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentUser?.role === "admin"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="Switch to BIS Nodal Officer (Admin)"
              >
                <span>BIS Officer</span>
              </button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Official Government Navigation Bar (Deep Sovereign Navy #0A2540) */}
      <nav className="bg-[#0A2540] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between h-11">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab && setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-all rounded-lg ${
                      isActive
                        ? "bg-white/15 text-amber-300 shadow-inner"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-mono px-1 rounded ${
                        item.badge === "AI" ? "bg-amber-400 text-slate-950 font-extrabold" : "bg-blue-600 text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-bold">23,866 Standards Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Official Breaking News & Gazette Ticker */}
      <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-1 flex items-center overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <div className="flex-shrink-0 bg-red-700 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            नवीन / LATEST
          </div>
          <div className="relative overflow-hidden w-full ml-3 h-5">
            <div className="gov-ticker-track text-slate-800 text-[11px] font-medium space-x-8">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                <strong>Quality Control Orders (QCOs) 2026:</strong> Mandatory ISI Mark compliance enforced for 600+ industrial & consumer products.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
                <strong>Zero-Hallucination AI:</strong> Every response is ground-truthed against published Indian Standards with clause & page numbers.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600 inline" />
                <strong>Gold Hallmarking:</strong> 6-Digit HUID verification is mandatory across all 256 notified districts of India.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2540] border-t border-slate-700 px-4 pt-3 pb-6 space-y-3 text-white max-h-[85vh] overflow-y-auto">
          {/* Mobile Persona Switcher */}
          <div className="p-2.5 bg-white/10 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Active Persona:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  handleDemoSwitch("user");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  currentUser?.role !== "admin" ? "bg-amber-400 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                MSME
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch("admin");
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  currentUser?.role === "admin" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                BIS Officer
              </button>
            </div>
          </div>

          {/* Mobile Spotlight Button */}
          {onOpenSpotlight && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpotlight();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-amber-300 border border-white/10"
            >
              <Search className="w-4 h-4" />
              <span>Search 23k Standards (Spotlight)</span>
            </button>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab && setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive ? "bg-white/20 text-amber-300 font-bold" : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
