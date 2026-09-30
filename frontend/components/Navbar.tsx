"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  BookOpen,
  FlaskConical,
  BarChart3,
  Globe,
  UserCheck,
  Menu,
  X,
  Calculator,
  ShieldCheck,
  Home,
  Sparkles,
  Command,
  ChevronRight,
  Shield,
  FileCheck2,
  Compass,
  ShieldAlert,
  Flame,
  ScanLine
} from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";
import { demoLogin } from "../lib/api";

interface NavItem {
  id: string;
  label: string;
  labelHi: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  desc?: string;
}

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

  // Grouped Navigation Items for Superior Alignment & Information Architecture
  const coreItems: NavItem[] = [
    { id: "home", label: "Home", labelHi: "मुख्य", icon: Home },
    { id: "chat", label: "AI Co-Pilot", labelHi: "एआई सहायक", icon: Sparkles, badge: "AI", badgeColor: "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950" },
    { id: "finder", label: "Standards", labelHi: "मानक खोज", icon: Search },
  ];

  const innovationItems: NavItem[] = [
    { id: "inspector", label: "MTC Inspector", labelHi: "एमटीसी जांच", icon: FileCheck2, badge: "NEW", badgeColor: "bg-amber-400 text-slate-950", desc: "Automated Lab Scrutiny" },
    { id: "verify", label: "Fake Mark Scanner", labelHi: "सत्यापन", icon: ShieldCheck, badge: "SCAN", badgeColor: "bg-rose-500 text-white", desc: "Counterfeit Detector" },
    { id: "journey", label: "MSME Roadmap", labelHi: "रोडमैप", icon: Compass, badge: "50%", badgeColor: "bg-blue-500 text-white", desc: "30-Day Certification" },
    { id: "qco", label: "QCO Radar", labelHi: "क्यूसीओ", icon: ShieldAlert, badge: "LIVE", badgeColor: "bg-red-500 text-white animate-pulse", desc: "Gazette Timeline" },
  ];

  const serviceItems: NavItem[] = [
    { id: "calculator", label: "Fees", labelHi: "शुल्क", icon: Calculator },
    { id: "services", label: "Schemes", labelHi: "योजनाएं", icon: BookOpen },
    { id: "labs", label: "Labs", labelHi: "लैब्स", icon: FlaskConical },
    { id: "admin", label: "Admin", labelHi: "प्रशासन", icon: BarChart3 },
  ];

  const allItems = [...coreItems, ...innovationItems, ...serviceItems];

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  const renderTabButton = (item: any) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab && setActiveTab(item.id)}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all duration-150 ${
          isActive
            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs after:absolute after:-bottom-[7px] after:left-2 after:right-2 after:h-[2px] after:bg-amber-400 after:rounded-full"
            : "text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent"
        }`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
        <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
        {item.badge && (
          <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded ${item.badgeColor || "bg-amber-400 text-slate-950"}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg text-white">
      {/* 1. Sovereign Tricolor Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Primary Brand & Utility Bar */}
      <div className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Official Government Brand Crests & Title */}
            <div
              onClick={() => setActiveTab && setActiveTab("home")}
              className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
            >
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-amber-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform shadow-xs">
                  <BisEmblem className="h-8 w-auto text-amber-400" />
                </div>
                <div className="hidden sm:block h-7 w-[1px] bg-slate-800 mx-1" />
                <EmblemOfIndia className="hidden sm:block h-8 w-auto text-slate-300 group-hover:text-amber-200 transition-colors" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                    BIS SmartAssist
                  </span>
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                    SIH26107
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden xs:block">
                  भारतीय मानक ब्यूरो • Bureau of Indian Standards • Govt. of India
                </p>
              </div>
            </div>

            {/* Right: Quick Search + Persona Switcher + Language Selector */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              
              {/* Quick Spotlight Trigger (Cmd+K) */}
              {onOpenSpotlight && (
                <button
                  onClick={onOpenSpotlight}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition shadow-xs group"
                  title="Search 23,866 Indian Standards & Modules (Cmd+K)"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline font-medium">Search Standards</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold text-slate-400">
                    ⌘K
                  </kbd>
                </button>
              )}

              {/* Persona Switcher Pill */}
              <div className="hidden sm:flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => handleDemoSwitch("user")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentUser?.role !== "admin"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Industry / MSME Applicant Role"
                >
                  <UserCheck className="w-3 h-3 text-amber-300" />
                  <span>MSME</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch("admin")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currentUser?.role === "admin"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="BIS Nodal Officer (Admin) Role"
                >
                  Officer
                </button>
              </div>

              {/* Language Selector Pill */}
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange && onLanguageChange(l.code)}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      currentLang === l.code
                        ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 3. Reconstructed Module & Tab Navigation Strip (All screens >= 640px) */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 overflow-hidden">
            
            {/* Scrollable Container with Aligned Clusters */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar w-full">
              
              {/* Cluster 1: Core Navigation */}
              <div className="flex items-center space-x-1 shrink-0">
                {coreItems.map(renderTabButton)}
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-slate-800 shrink-0 mx-1 hidden sm:block" />

              {/* Cluster 2: SIH26107 AI Innovations */}
              <div className="flex items-center space-x-1 shrink-0 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800/80">
                {innovationItems.map(renderTabButton)}
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-slate-800 shrink-0 mx-1 hidden sm:block" />

              {/* Cluster 3: Bureau Services & Administration */}
              <div className="flex items-center space-x-1 shrink-0">
                {serviceItems.map(renderTabButton)}
              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* 4. Responsive Mobile Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Mobile Persona Switcher */}
          <div className="p-3 bg-slate-900/80 rounded-xl flex items-center justify-between border border-slate-800 text-xs">
            <span className="font-medium text-slate-400">Portal Persona:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  handleDemoSwitch("user");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentUser?.role !== "admin"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400"
                }`}
              >
                MSME Applicant
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch("admin");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentUser?.role === "admin"
                    ? "bg-amber-600 text-white font-bold"
                    : "text-slate-400"
                }`}
              >
                BIS Officer
              </button>
            </div>
          </div>

          {/* Section A: AI Innovations */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2 px-1">
              ⚡ SIH26107 AI Innovations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {innovationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab && setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs"
                        : "bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                      <div className="text-left">
                        <span className="block font-bold">{currentLang === "hi" ? item.labelHi : item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black ${item.badgeColor || "bg-amber-400 text-slate-950"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Core Tools & Services */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2 px-1">
              🏛️ Standards & Services
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[...coreItems, ...serviceItems].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab && setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs"
                        : "bg-slate-900/50 text-slate-300 border-slate-800/80 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                      <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-mono px-1 rounded font-black ${item.badgeColor || "bg-amber-400 text-slate-950"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </header>
  );
};
