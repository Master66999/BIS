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
  ShieldAlert
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
    { id: "home", label: "Home", labelHi: "मुख्य", icon: Home },
    { id: "chat", label: "AI Co-Pilot", labelHi: "एआई सहायक", icon: Sparkles, badge: "AI" },
    { id: "finder", label: "Standards", labelHi: "मानक खोज", icon: Search },
    { id: "calculator", label: "Fees", labelHi: "शुल्क", icon: Calculator },
    { id: "verify", label: "Verify Mark", labelHi: "सत्यापन", icon: ShieldCheck, badge: "SCAN" },
    { id: "services", label: "Schemes", labelHi: "योजनाएं", icon: BookOpen },
    { id: "labs", label: "Labs", labelHi: "लैब्स", icon: FlaskConical },
    { id: "inspector", label: "MTC Inspector", labelHi: "रिपोर्ट जांच", icon: FileCheck2, badge: "NEW" },
    { id: "journey", label: "MSME Roadmap", labelHi: "रोडमैप", icon: Compass, badge: "50%" },
    { id: "qco", label: "QCO Radar", labelHi: "क्यूसीओ", icon: ShieldAlert, badge: "LIVE" },
    { id: "admin", label: "Admin", labelHi: "प्रशासन", icon: BarChart3 },
  ];

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 text-white transition-all shadow-md">
      {/* Accent sovereign top indicator line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* 1. Brand Identity */}
          <div
            onClick={() => setActiveTab && setActiveTab("home")}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-amber-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform shadow-xs">
              <BisEmblem className="h-8 w-auto text-amber-400" />
            </div>

            <div className="hidden xs:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  BIS SmartAssist
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  23.8k Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Bureau of Indian Standards • Govt. of India
              </p>
            </div>
          </div>

          {/* 2. Main Navigation Bar (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Action Group: Spotlight + Persona + Language */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            
            {/* Quick Spotlight Trigger (Cmd+K) */}
            {onOpenSpotlight && (
              <button
                onClick={onOpenSpotlight}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition shadow-xs group"
                title="Search Indian Standards & Tools (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline font-medium">Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Persona Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => handleDemoSwitch("user")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentUser?.role !== "admin"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Industry / MSME Applicant"
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
                title="BIS Nodal Officer (Admin)"
              >
                Officer
              </button>
            </div>

            {/* Language Selector Pill */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-0.5 text-xs">
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

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Responsive Overlay) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
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

          {/* Navigation Items in Drawer */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
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
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-slate-900/50 text-slate-300 border-slate-800/80 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{currentLang === "hi" ? item.labelHi : item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 rounded bg-amber-400 text-slate-950 font-bold">
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
