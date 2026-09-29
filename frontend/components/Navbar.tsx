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
} from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";
import { demoLogin } from "../lib/api";

interface NavbarProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang = "en",
  onLanguageChange,
  activeTab = "home",
  setActiveTab,
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
    { id: "chat", label: "AI Assistant", labelHi: "एआई सहायक", icon: MessageSquare },
    { id: "finder", label: "Standard Finder", labelHi: "मानक खोज", icon: Search },
    { id: "calculator", label: "Fee Calculator", labelHi: "शुल्क गणक", icon: Calculator },
    { id: "verify", label: "Verify ISI / HUID", labelHi: "सत्यापन", icon: ShieldCheck },
    { id: "services", label: "BIS Schemes Hub", labelHi: "योजनाएं", icon: BookOpen },
    { id: "labs", label: "Testing Labs", labelHi: "प्रयोगशालाएं", icon: FlaskConical },
    { id: "admin", label: "Admin Portal", labelHi: "प्रशासन", icon: BarChart3 },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Tricolor Accent Bar */}
      <div className="tricolor-stripe" />

      {/* 2. Top Accessibility & Ministry Header Bar (Official Gov Format) */}
      <div className="bg-slate-100 text-slate-700 text-xs border-b border-slate-200 px-4 py-1.5 font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry Hierarchy */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="font-semibold text-slate-900 tracking-wide">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-800">GOVERNMENT OF INDIA</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-600 truncate max-w-md">
              उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय • Ministry of Consumer Affairs
            </span>
          </div>

          {/* Right: Accessibility Controls & Gov Links */}
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            {/* Screen Reader & Skip link */}
            <a
              href="#main-content"
              className="hidden lg:inline text-slate-600 hover:text-slate-900 underline text-[11px]"
            >
              Skip to Main Content
            </a>

            {/* Font Sizer (A- / A / A+) */}
            <div className="flex items-center space-x-0.5 bg-white border border-slate-300 rounded px-1 py-0.5 text-[11px] font-bold">
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

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1 rounded border text-[11px] flex items-center gap-1 ${
                highContrast ? "bg-black text-amber-300 border-black" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
              title="Toggle High Contrast"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Contrast</span>
            </button>

            {/* Language Switcher Buttons */}
            <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden text-[11px]">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange && onLanguageChange(l.code)}
                  className={`px-2 py-0.5 font-medium transition-colors ${
                    currentLang === l.code
                      ? "bg-[#0B2545] text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Official Portals */}
            <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-300">
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-blue-900 flex items-center gap-1 font-medium"
              >
                Manakonline <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://www.services.bis.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-blue-900 flex items-center gap-1 font-medium"
              >
                e-BIS <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Brand Header with Dual Emblems */}
      <div className="bg-white border-b border-slate-200 py-2.5 sm:py-3 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Ashoka Lion Capital + BIS Crest + Bilingual Titles */}
          <div
            onClick={() => setActiveTab && setActiveTab("home")}
            className="flex items-center space-x-2 sm:space-x-4 cursor-pointer group min-w-0"
          >
            {/* National Emblem of India (Ashoka Lion) */}
            <div className="text-slate-800 hover:text-[#0B2545] transition-colors flex-shrink-0">
              <EmblemOfIndia className="h-10 sm:h-14 md:h-16 w-auto" />
            </div>

            <div className="h-10 sm:h-12 w-[1px] bg-slate-300 hidden xs:block flex-shrink-0" />

            {/* BIS Official Seal */}
            <div className="flex-shrink-0">
              <BisEmblem className="h-9 sm:h-12 md:h-14 w-auto" />
            </div>

            {/* Official Typography */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-[#0B2545] font-serif leading-none">
                  भारतीय मानक ब्यूरो
                </h1>
                <span className="text-xs sm:text-base md:text-lg font-bold text-slate-700 tracking-wide font-sans truncate">
                  BUREAU OF INDIAN STANDARDS
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
                राष्ट्रीय मानक निकाय • National Standards Body • Govt. of India
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 sm:px-2 py-0.5 rounded truncate">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 flex-shrink-0" />
                  BIS SmartAssist 🇮🇳 • AI Portal
                </span>
                <span className="hidden md:inline-block text-[11px] text-slate-500">
                  SIH26107 Verified Regulatory System
                </span>
              </div>
            </div>
          </div>

          {/* Right: National Badges & Persona Switcher */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Persona Switcher Pill */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                Portal Persona
              </span>
              <div className="flex items-center bg-slate-100 rounded-md p-1 border border-slate-300 text-xs">
                <button
                  onClick={() => handleDemoSwitch("user")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                    currentUser?.role !== "admin"
                      ? "bg-[#0B2545] text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  title="Switch to Industry / MSME Applicant"
                >
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  <span>Industry / MSME</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch("admin")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
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

            {/* Azadi / Make in India badge */}
            <div className="hidden lg:flex items-center justify-center h-12 px-3 border border-slate-200 bg-gradient-to-r from-orange-50/50 via-white to-green-50/50 rounded-md text-center">
              <div className="text-[10px] font-bold text-slate-800 leading-tight">
                <span className="text-[#FF9933]">मानक:</span>{" "}
                <span className="text-[#0B2545]">पथप्रदर्शक:</span>
                <div className="text-[9px] text-slate-500 font-medium">Standards Make India Safer</div>
              </div>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Official Government Navigation Bar (Deep Navy #0B2545) */}
      <nav className="bg-[#0B2545] text-white border-t border-[#133E68] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between h-12">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab && setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-all rounded ${
                      isActive
                        ? "bg-[#163E6E] text-amber-300 border-b-2 border-amber-400 shadow-inner"
                        : "text-slate-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-300"}`} />
                    <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-300">23,866 Standards Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Official Government Breaking Ticker */}
      <div className="bg-[#FFF8E7] border-b border-amber-200 px-3 sm:px-4 py-1.5 flex items-center overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <div className="flex-shrink-0 bg-red-700 text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            नवीन / LATEST
          </div>
          <div className="relative overflow-hidden w-full ml-2 sm:ml-3 h-5">
            <div className="gov-ticker-track text-slate-800 text-[11px] sm:text-xs font-medium space-x-8 sm:space-x-12">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                <strong>Quality Control Orders (QCOs) 2026:</strong> Mandatory ISI Mark compliance enforced for over 600 industrial & consumer product categories.
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
        <div className="lg:hidden bg-[#0B2545] border-t border-slate-700 px-4 pt-3 pb-6 space-y-3 text-white max-h-[85vh] overflow-y-auto">
          {/* Mobile Persona Switcher */}
          <div className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Active Persona:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  handleDemoSwitch("user");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  currentUser?.role !== "admin" ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"
                }`}
              >
                Industry MSME
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch("admin");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  currentUser?.role === "admin" ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"
                }`}
              >
                BIS Officer
              </button>
            </div>
          </div>

          {/* Navigation Items Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab && setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                  activeTab === item.id
                    ? "bg-amber-400 text-slate-950 font-bold shadow"
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{currentLang === "hi" ? item.labelHi : item.label}</span>
              </button>
            ))}
          </div>

          {/* External Gov Portals on Mobile */}
          <div className="pt-3 border-t border-slate-700/80 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Official Indian Standards Portals
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded bg-white/5 text-slate-300 hover:text-white"
              >
                <span>Manakonline</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://www.services.bis.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded bg-white/5 text-slate-300 hover:text-white"
              >
                <span>e-BIS Services</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
