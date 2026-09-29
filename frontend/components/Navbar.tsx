"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
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
  activeTab = "chat",
  setActiveTab,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "calculator", label: "Fee Calculator", icon: Calculator },
    { id: "verify", label: "Verify Mark", icon: ShieldCheck },
    { id: "finder", label: "Product Standard Finder", icon: Search },
    { id: "services", label: "BIS Services Hub", icon: BookOpen },
    { id: "labs", label: "Testing Laboratories", icon: FlaskConical },
    { id: "admin", label: "Admin Portal", icon: BarChart3 },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "mr", label: "मराठी (Marathi)" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A2540] text-white border-b border-[#16385C] shadow-md">
      {/* Top Gov Strip */}
      <div className="bg-[#061526] text-xs text-slate-300 px-4 py-1 flex items-center justify-between border-b border-[#132A45]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-400">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="https://www.manakonline.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            Manakonline <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.services.bis.gov.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            e-BIS Portal <ExternalLink className="w-3 h-3" />
          </a>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/30">
            SIH26107 Final Prototype
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveTab && setActiveTab("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border border-amber-400/40">
              <Shield className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  BIS SmartAssist
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded">
                  AI RAG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                भारतीय मानक ब्यूरो • Bureau of Indian Standards
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-amber-400 border border-amber-400/30 shadow-inner"
                      : "text-slate-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language & Demo User */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#16385C] hover:bg-[#1f4a75] text-xs font-medium border border-[#2a5580] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase">{currentLang}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0F2942] rounded-md shadow-xl border border-slate-700 py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange && onLanguageChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                        currentLang === l.code ? "text-amber-400 font-bold bg-white/5" : "text-slate-200"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Demo Persona Switcher */}
            <div className="flex items-center bg-[#16385C] rounded-lg p-0.5 border border-[#2a5580] text-xs">
              <button
                onClick={() => handleDemoSwitch("user")}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  currentUser?.role === "user"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Switch to Industry Applicant / MSME view"
              >
                <UserCheck className="w-3 h-3" />
                <span>Industry</span>
              </button>
              <button
                onClick={() => handleDemoSwitch("admin")}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  currentUser?.role === "admin"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Switch to BIS Nodal Officer (Admin) view"
              >
                <span>Nodal Officer</span>
              </button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061526] border-b border-slate-700 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab && setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === item.id ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-200"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Language:</span>
            <div className="flex space-x-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onLanguageChange && onLanguageChange(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    currentLang === l.code ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
