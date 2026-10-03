"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  UserCheck,
  Menu,
  X,
  Calculator,
  ShieldCheck,
  Home,
  FileCheck2,
  Compass,
  ShieldAlert,
  BookOpen,
  FlaskConical,
  BarChart3,
  Building2,
} from "lucide-react";
import { demoLogin } from "../lib/api";
import { MANAKAI_LANGS, ManakaiLang, getManakaiDict } from "../lib/manakaiI18n";

interface NavItem {
  id: string;
  label: string;
  labelHi: string;
  labelMr: string;
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
  onOpenLogin?: () => void;
  currentUser?: any;
  onLogout?: () => void;
  onOpenInfo?: (topic: "about" | "help" | "privacy" | "terms" | "accessibility") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang = "en",
  onLanguageChange,
  activeTab = "home",
  setActiveTab,
  onOpenSpotlight,
  onOpenLogin,
  currentUser: parentUser,
  onLogout,
  onOpenInfo,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(parentUser || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const centerPillRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const langWrapperRef = useRef<HTMLDivElement>(null);
  const userWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentUser !== undefined) {
      setCurrentUser(parentUser);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bis_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [parentUser]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userWrapperRef.current && !userWrapperRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("manakai_theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const handleDemoSwitch = async (role: string) => {
    try {
      const res = await demoLogin(role);
      setCurrentUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langWrapperRef.current && !langWrapperRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const t = getManakaiDict(currentLang);

  // Grouped Navigation Items aligned with MANAKAI architecture
  const navTabs: NavItem[] = [
    { id: "home", label: "Home", labelHi: "मुख्य", labelMr: "मुख्य", icon: Home },
    {
      id: "chat",
      label: "Ask MANAKAI",
      labelHi: "मानकई से पूछें",
      labelMr: "मानकईला विचारा",
      icon: Sparkles,
      badge: "AI",
      badgeColor: "bg-[#FF9933] text-[#0A2540] font-black",
    },
    { id: "finder", label: "Standards", labelHi: "मानक", labelMr: "मानके", icon: Search },
    {
      id: "inspector",
      label: "MTC Audit",
      labelHi: "एमटीसी जांच",
      labelMr: "एमटीसी तपासणी",
      icon: FileCheck2,
      badge: "MTC",
      badgeColor: "bg-amber-400 text-slate-950 font-bold",
    },
    {
      id: "verify",
      label: "Verify Mark",
      labelHi: "सत्यापन",
      labelMr: "पडताळणी",
      icon: ShieldCheck,
      badge: "ISI",
      badgeColor: "bg-rose-500 text-white font-bold",
    },
    { id: "journey", label: "MSME Roadmap", labelHi: "रोडमैप", labelMr: "रोडमॅप", icon: Compass },
    {
      id: "qco",
      label: "QCO Radar",
      labelHi: "क्यूसीओ",
      labelMr: "क्यूसीओ",
      icon: ShieldAlert,
      badge: "LIVE",
      badgeColor: "bg-red-500 text-white animate-pulse font-bold",
    },
    { id: "calculator", label: "Fees", labelHi: "शुल्क", labelMr: "शुल्क", icon: Calculator },
    { id: "labs", label: "Labs", labelHi: "लैब्स", labelMr: "प्रयोगशाळा", icon: FlaskConical },
    { id: "services", label: "Schemes", labelHi: "योजनाएं", labelMr: "योजना", icon: BookOpen },
    { id: "admin", label: "Admin", labelHi: "प्रशासन", labelMr: "प्रशासन", icon: BarChart3 },
  ];

  const getLabel = (item: NavItem) => {
    if (currentLang === "hi") return item.labelHi;
    if (currentLang === "mr") return item.labelMr;
    return item.label;
  };

  const handleTabClick = (tabId: string) => {
    if (setActiveTab) setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Saffron-White-Green Sovereign Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Primary Brand & Utility Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: MANAKAI Brand Logo & Tagline */}
            <div
              onClick={() => handleTabClick("home")}
              className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
              title="MANAKAI Home"
            >
              <img
                src="/images/Manakai_AI_Tech_Logo_on_Navy_Gradient-removebg-preview.png"
                alt="MANAKAI"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    MANAK<span className="text-blue-600">AI</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    SIH26107
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                  भारतीय मानक ब्यूरो &bull; Bureau of Indian Standards
                </p>
              </div>
            </div>

            {/* Right Controls Pill: Search, Persona, Lang, Theme, Login */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Cmd+K Spotlight Search */}
              {onOpenSpotlight && (
                <button
                  onClick={onOpenSpotlight}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 transition shadow-xs"
                  title="Search Standards & Modules (Cmd+K)"
                >
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">Search</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[9px] font-bold text-slate-600">
                    ⌘K
                  </kbd>
                </button>
              )}

              {/* Persona Switcher */}
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
                <button
                  onClick={() => handleDemoSwitch("user")}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    currentUser?.role !== "admin"
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="MSME Applicant Role"
                >
                  MSME
                </button>
                <button
                  onClick={() => handleDemoSwitch("admin")}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    currentUser?.role === "admin"
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="BIS Officer Role"
                >
                  Officer
                </button>
              </div>

              {/* Language Dropdown */}
              <div className="relative" ref={langWrapperRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200 font-medium transition"
                  title="Change Language"
                >
                  <i className="fa-solid fa-globe text-blue-600 text-xs"></i>
                  <span>{MANAKAI_LANGS.find((l) => l.code === currentLang)?.sub || "EN"}</span>
                  <i className="fa-solid fa-chevron-down text-[9px] opacity-60"></i>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 flex flex-col gap-0.5">
                    {MANAKAI_LANGS.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          if (onLanguageChange) onLanguageChange(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                          currentLang === item.code
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] opacity-60 font-mono">{item.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle (Yin/Yang) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center transition"
                title="Toggle Yin/Yang Mode"
              >
                <i className="fa-solid fa-yin-yang text-xs"></i>
              </button>

              {/* Company / About Button */}
              {onOpenInfo && (
                <button
                  type="button"
                  onClick={() => onOpenInfo("about")}
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    activeTab === "info"
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                  title="About MANAKAI & Bureau of Indian Standards"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Company</span>
                </button>
              )}

              {/* Login / Profile Button */}
              {currentUser ? (
                <div className="relative" ref={userWrapperRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                    title={`Signed in as ${currentUser.full_name || currentUser.email}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="max-w-[100px] truncate">
                      {currentUser.full_name?.split(" ")[0] || "Profile"}
                    </span>
                    <i className={`fa-solid fa-chevron-${userDropdownOpen ? "up" : "down"} text-[9px] opacity-80`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-fadeIn text-left text-slate-800">
                      <div className="pb-2.5 mb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.full_name || "Authorized Citizen"}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                          {currentUser.email || "user@bis.gov.in"}
                        </div>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{currentUser.role === "admin" ? "BIS Nodal Officer" : "Industry MSME"}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setActiveTab?.("chat");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 transition"
                        >
                          <i className="fa-solid fa-comments text-blue-600 text-xs w-4" />
                          <span>AI Chat Assistant</span>
                        </button>

                        {currentUser.role === "admin" && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setActiveTab?.("admin");
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 transition"
                          >
                            <i className="fa-solid fa-shield-halved text-blue-600 text-xs w-4" />
                            <span>Officer Telemetry</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onLogout) {
                              onLogout();
                            } else if (typeof window !== "undefined") {
                              localStorage.removeItem("bis_token");
                              localStorage.removeItem("bis_user");
                            }
                            setCurrentUser(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 transition border-t border-slate-100 mt-1 pt-2"
                        >
                          <i className="fa-solid fa-right-from-bracket text-red-600 text-xs w-4" />
                          <span>Sign Out / Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : onOpenLogin ? (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                    activeTab === "login"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  title="Sign In / Open MANAKAI Portal"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Login</span>
                </button>
              ) : null}

              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Center Pill Navigation Strip */}
      <nav className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 overflow-hidden">
            <div
              className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar w-full"
              ref={centerPillRef}
            >
              {navTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-all duration-150 ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-sm"
                        : "text-slate-600 hover:text-blue-700 hover:bg-white border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-white" : "text-blue-600"
                      }`}
                    />
                    <span>{getLabel(item)}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-white text-blue-700 font-black"
                            : item.badgeColor || "bg-emerald-600 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Company pill tab */}
              {onOpenInfo && (
                <button
                  type="button"
                  onClick={() => onOpenInfo("about")}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-all duration-150 ${
                    activeTab === "info"
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "text-slate-600 hover:text-blue-700 hover:bg-white border border-transparent"
                  }`}
                  title="About MANAKAI Consortium"
                >
                  <Building2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      activeTab === "info" ? "text-white" : "text-blue-600"
                    }`}
                  />
                  <span>{currentLang === "hi" ? "कंपनी" : currentLang === "mr" ? "कंपनी" : "Company"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu (< 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Mobile Persona Switcher */}
          <div className="p-2.5 bg-slate-100 rounded-xl flex items-center justify-between border border-slate-200 text-xs">
            <span className="font-medium text-slate-600">Portal Persona:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  handleDemoSwitch("user");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentUser?.role !== "admin"
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "text-slate-600"
                }`}
              >
                MSME
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch("admin");
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentUser?.role === "admin"
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-slate-600"
                }`}
              >
                Officer
              </button>
            </div>
          </div>

          {/* Module Links */}
          <div className="grid grid-cols-2 gap-2">
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-blue-600"}`} />
                    <span>{getLabel(item)}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-black ${
                        isActive ? "bg-white text-blue-700" : item.badgeColor || "bg-emerald-600 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Company Button in mobile */}
            {onOpenInfo && (
              <button
                type="button"
                onClick={() => {
                  onOpenInfo("about");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition border ${
                  activeTab === "info"
                    ? "bg-blue-600 text-white border-blue-600 font-bold"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2
                    className={`w-3.5 h-3.5 ${activeTab === "info" ? "text-white" : "text-blue-600"}`}
                  />
                  <span>Company</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
