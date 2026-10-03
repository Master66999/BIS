"use client";

import React, { useState, useEffect, useRef } from "react";
import "../app/footer.css";
import { ManakaiLang, MANAKAI_LANGS, getManakaiDict } from "../lib/manakaiI18n";

interface ManakaiLandingProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
  onStartChat: (initialQuery?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenLogin: () => void;
  currentUser?: any;
  onLogout?: () => void;
  onOpenInfo?: (topic: "about" | "help" | "privacy" | "terms" | "accessibility") => void;
}

export const ManakaiLanding: React.FC<ManakaiLandingProps> = ({
  currentLang = "en",
  onLanguageChange,
  onStartChat,
  onNavigateTab,
  onOpenLogin,
  currentUser,
  onLogout,
  onOpenInfo,
}) => {
  const [lang, setLang] = useState<ManakaiLang>((currentLang as ManakaiLang) || "en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState<any>(currentUser || null);

  const langWrapperRef = useRef<HTMLDivElement>(null);
  const centerPillRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Sync internal user state with parent prop or localStorage
  useEffect(() => {
    if (currentUser !== undefined) {
      setLocalUser(currentUser);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bis_user");
      if (stored) {
        try {
          setLocalUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [currentUser]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sync internal lang state with parent prop
  useEffect(() => {
    if (currentLang && (currentLang === "en" || currentLang === "hi" || currentLang === "mr")) {
      setLang(currentLang as ManakaiLang);
    }
  }, [currentLang]);

  // Load saved theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("manakai_theme") || "light") as "light" | "dark";
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("manakai_theme", next);
    }
  };

  const handleSelectLang = (newLang: ManakaiLang) => {
    setLang(newLang);
    setLangDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("manakai_lang", newLang);
    }
  };

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langWrapperRef.current && !langWrapperRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Parallax footer reveal calculation
  useEffect(() => {
    const updateFooterReveal = () => {
      if (footerRef.current && mainRef.current) {
        mainRef.current.style.marginBottom = `${footerRef.current.offsetHeight}px`;
      }
    };
    updateFooterReveal();
    window.addEventListener("resize", updateFooterReveal);
    const observer = new ResizeObserver(updateFooterReveal);
    if (document.body) observer.observe(document.body);
    return () => {
      window.removeEventListener("resize", updateFooterReveal);
      observer.disconnect();
    };
  }, []);

  // Center pill indicator hover animation
  useEffect(() => {
    const pill = centerPillRef.current;
    const indicator = indicatorRef.current;
    if (!pill || !indicator) return;

    const navItems = pill.querySelectorAll<HTMLAnchorElement>(".nav-link:not(.btn-login)");
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const parentRect = pill.getBoundingClientRect();
      indicator.style.width = `${rect.width}px`;
      indicator.style.left = `${rect.left - parentRect.left}px`;
      indicator.style.opacity = "1";
    };
    const handleMouseLeave = () => {
      indicator.style.opacity = "0";
    };

    navItems.forEach((item) => item.addEventListener("mouseenter", handleMouseEnter));
    pill.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      navItems.forEach((item) => item.removeEventListener("mouseenter", handleMouseEnter));
      pill.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Glow wrapper mouse tracking
  const handleGlowMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  const t = getManakaiDict(lang);

  // Helper to safely render dictionary HTML (e.g. linebreaks & arrows)
  const renderHtml = (key: string, fallback?: string) => {
    const val = t[key] ?? fallback ?? "";
    return <span dangerouslySetInnerHTML={{ __html: val }} />;
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mk-root" data-theme={theme}>
      {/* Top Floating Pill Navigation */}
      <header className="top-nav-container">
        {/* Brand Logo Pill */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="pill-nav logo-pill"
          title="MANAKAI Home"
        >
          <img
            src="/images/Manakai_AI_Tech_Logo_on_Navy_Gradient-removebg-preview.png"
            alt="MANAKAI"
            className="navbar-logo-img"
          />
        </a>

        {/* Center Pill Menu */}
        <nav className="pill-nav center-pill" ref={centerPillRef}>
          <ul className="nav-links">
            <li>
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="nav-link"
              >
                {t["nav.features"] || "Features"}
              </a>
            </li>
            <li>
              <a
                href="#major-categories"
                onClick={(e) => scrollToSection(e, "major-categories")}
                className="nav-link"
              >
                {t["nav.standards"] || "Standards"}
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateTab("labs")}
                className="nav-link"
                style={{ background: "none", border: "none" }}
              >
                {t["nav.labs"] || "Labs"}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenInfo && onOpenInfo("about")}
                className="nav-link"
                style={{ background: "none", border: "none" }}
                title="About Bureau of Indian Standards & MANAKAI Consortium"
              >
                {t["nav.company"] || "Company"}
              </button>
            </li>
            <li>
              {localUser ? (
                <div className="relative inline-block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="btn btn-login flex items-center gap-1.5"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                      padding: "0.55rem 1.25rem",
                    }}
                    title={`Logged in as ${localUser.full_name || localUser.email}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="max-w-[100px] truncate">
                      {localUser.full_name?.split(" ")[0] || localUser.username || "Officer"}
                    </span>
                    <i className={`fa-solid fa-chevron-${userMenuOpen ? "up" : "down"} text-[10px] ml-1 opacity-80`} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-72 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-left bg-white border border-slate-200"
                      style={{
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {/* User Profile Header */}
                      <div className="pb-3 mb-3 border-b border-slate-100 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {(localUser.full_name || localUser.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-slate-900 truncate">
                            {localUser.full_name || "Authorized Citizen"}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                            {localUser.email || "user@bis.gov.in"}
                          </div>
                          <div
                            className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono tracking-wide"
                            style={{
                              backgroundColor: localUser.role === "admin" ? "#ecfdf5" : "#eff6ff",
                              color: localUser.role === "admin" ? "#065f46" : "#1e40af",
                              borderColor: localUser.role === "admin" ? "#a7f3d0" : "#bfdbfe",
                            }}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                localUser.role === "admin" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                              }`}
                            />
                            <span>{localUser.role === "admin" ? "BIS Nodal Officer" : "Industry MSME"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation & Action Links */}
                      <div className="space-y-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigateTab("chat");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-semibold flex items-center justify-between transition border border-slate-100 hover:border-blue-200 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <i className="fa-solid fa-comments text-blue-600 text-xs w-4" />
                            <span>MANAKAI AI Assistant</span>
                          </div>
                          <i className="fa-solid fa-arrow-right text-[10px] text-slate-400 group-hover:text-blue-600 transition" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigateTab("finder");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-2.5 transition"
                        >
                          <i className="fa-solid fa-magnifying-glass text-blue-600 text-xs w-4" />
                          <span>Standards Catalog</span>
                        </button>

                        {localUser.role === "admin" && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              onNavigateTab("admin");
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-2.5 transition"
                          >
                            <i className="fa-solid fa-shield-halved text-blue-600 text-xs w-4" />
                            <span>Officer RAG Telemetry</span>
                          </button>
                        )}

                        <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              if (onLogout) {
                                onLogout();
                              } else if (typeof window !== "undefined") {
                                localStorage.removeItem("bis_token");
                                localStorage.removeItem("bis_user");
                              }
                              setLocalUser(null);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold flex items-center gap-2.5 transition"
                          >
                            <i className="fa-solid fa-right-from-bracket text-red-500 text-xs w-4" />
                            <span>Sign Out / Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="btn btn-login"
                >
                  {t["nav.login"] || "Login"}
                </button>
              )}
            </li>
          </ul>
          <div className="pill-indicator" ref={indicatorRef}></div>
        </nav>

        {/* Right Controls Pill (Language + Theme Toggle) */}
        <div className="pill-nav top-controls-pill">
          <div className="lang-dropdown-wrapper" ref={langWrapperRef} id="langDropdownWrapper">
            <button
              className="btn-lang"
              type="button"
              aria-haspopup="true"
              aria-expanded={langDropdownOpen}
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Change Language"
            >
              <i className="fa-solid fa-globe"></i>
              <span id="currentLangLabel">
                {MANAKAI_LANGS.find((l) => l.code === lang)?.name || "English"}
              </span>
              <i className="fa-solid fa-chevron-down lang-chevron"></i>
            </button>
            <div className={`lang-menu ${langDropdownOpen ? "show" : ""}`} id="langMenu">
              {MANAKAI_LANGS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`lang-option ${lang === item.code ? "active" : ""}`}
                  onClick={() => handleSelectLang(item.code)}
                >
                  <span className="lang-name">{item.name}</span>
                  <span className="lang-sub">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="nav-divider"></div>
          <button
            id="theme-toggle"
            className="btn-theme"
            type="button"
            onClick={toggleTheme}
            title={t["nav.themeToggle"] || "Toggle Yin/Yang Mode"}
          >
            <i className="fa-solid fa-yin-yang"></i>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mk-main" ref={mainRef} id="top">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>{renderHtml("hero.title", "Instant BIS Label<br>Verification.")}</h1>
            <p className="hero-subtext">
              {t["hero.subtext"] ||
                "Scan ISI marks to check product authenticity and ensure standards compliance in seconds."}
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onStartChat()}
              >
                {renderHtml("hero.btnAsk", "Ask MANAKAI &rarr;")}
              </button>
              <a
                href="#major-categories"
                onClick={(e) => scrollToSection(e, "major-categories")}
                className="btn btn-outline"
              >
                {t["hero.btnExplore"] || "Explore Standards"}
              </a>
            </div>

            <div className="hero-trust">
              {renderHtml(
                "hero.trust",
                "23,866+ Standards &bull; Clause-Level Sources &bull; English &bull; हिन्दी &bull; मराठी"
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works">
          <h2 className="section-title">{t["how.title"] || "How MANAKAI Works"}</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-num">01</div>
              <h3 className="step-title">{t["how.step1.title"] || "Ask"}</h3>
              <p className="step-desc">
                {t["how.step1.desc"] || "Ask your BIS-related question in English, Hindi, or Marathi."}
              </p>
            </div>
            <div className="step-item">
              <div className="step-num">02</div>
              <h3 className="step-title">{t["how.step2.title"] || "Search"}</h3>
              <p className="step-desc">
                {t["how.step2.desc"] ||
                  "We search across 23,866+ Indian Standards to find relevant information."}
              </p>
            </div>
            <div className="step-item">
              <div className="step-num">03</div>
              <h3 className="step-title">{t["how.step3.title"] || "Verify"}</h3>
              <p className="step-desc">
                {t["how.step3.desc"] ||
                  "MANAKAI identifies the relevant standard, clause, and requirements."}
              </p>
            </div>
            <div className="step-item">
              <div className="step-num">04</div>
              <h3 className="step-title">{t["how.step4.title"] || "Understand"}</h3>
              <p className="step-desc">
                {t["how.step4.desc"] ||
                  "Get a simple AI-generated answer with source citations and confidence."}
              </p>
            </div>
            <div className="step-item">
              <div className="step-num">05</div>
              <h3 className="step-title">{t["how.step5.title"] || "Take Action"}</h3>
              <p className="step-desc">
                {t["how.step5.desc"] ||
                  "Explore certification, QCOs, testing labs, hallmarking, and applicable standards."}
              </p>
            </div>
          </div>
        </section>

        {/* Major Categories Section */}
        <section id="major-categories" className="major-categories">
          <h2 className="section-title">{t["cat.sectionTitle"] || "Major Categories"}</h2>
          <p className="section-subtitle">
            {t["cat.sectionSubtitle"] ||
              "Explore key Indian Standards across industry sectors, certification schemes, and mandatory QCOs."}
          </p>

          <div className="categories-grid">
            {/* 1. Automobiles & EV */}
            <div className="category-card">
              <div className="category-num">01</div>
              <div className="category-header">
                <span className="category-icon">🚗</span>
                <h3 className="category-title">{renderHtml("cat1.title", "Automobiles &amp; EV")}</h3>
              </div>
              <p className="category-subtitle">{t["cat.exploreBis"] || "Explore BIS standards for:"}</p>
              <ul className="category-features">
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat1.f1"] || "Electric vehicles"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat1.f2"] || "EV charging equipment"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat1.f3"] || "Batteries"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat1.f4"] || "Automotive components"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  <span>{t["cat1.f5"] || "Safety and testing requirements"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  <span>{t["cat1.f6"] || "Applicable certification schemes"}</span>
                </li>
              </ul>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onStartChat("What are the mandatory BIS standards for Electric Vehicles, EV charging, and automotive batteries in India?")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                >
                  <span>{t["cat1.cta"] || "Explore Automotive Standards"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* 2. Home & Electrical Products */}
            <div className="category-card">
              <div className="category-num">02</div>
              <div className="category-header">
                <span className="category-icon">🏠</span>
                <h3 className="category-title">{renderHtml("cat2.title", "Home &amp; Electrical Products")}</h3>
              </div>
              <p className="category-subtitle">{t["cat.explore"] || "Explore standards for:"}</p>
              <ul className="category-features">
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f1"] || "Electrical appliances"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f2"] || "Fans"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f3"] || "Cables and wires"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f4"] || "Switches"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f5"] || "Batteries"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat2.f6"] || "Household equipment"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  <span>{t["cat2.f7"] || "Safety and energy requirements"}</span>
                </li>
              </ul>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onStartChat("Which Indian Standards apply to home electrical appliances, cables, and switches under BIS Scheme I?")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                >
                  <span>{t["cat2.cta"] || "Find Product Standards"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* 3. Food, Water & Consumer Products */}
            <div className="category-card">
              <div className="category-num">03</div>
              <div className="category-header">
                <span className="category-icon">🥤</span>
                <h3 className="category-title">{renderHtml("cat3.title", "Food, Water &amp; Consumer Products")}</h3>
              </div>
              <p className="category-subtitle">{t["cat.explore"] || "Explore standards for:"}</p>
              <ul className="category-features">
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat3.f1"] || "Packaged drinking water"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat3.f2"] || "Food-related products"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat3.f3"] || "Consumer goods"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat3.f4"] || "Packaging"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  <span>{t["cat3.f5"] || "Quality and safety requirements"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat3.f6"] || "Testing requirements"}</span>
                </li>
              </ul>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onStartChat("Explain IS 14543 packaged drinking water and IS 10500 drinking water quality and testing requirements.")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                >
                  <span>{t["cat3.cta"] || "Check Safety Standards"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* 4. Gold, Silver & Jewellery */}
            <div className="category-card">
              <div className="category-num">04</div>
              <div className="category-header">
                <span className="category-icon">💍</span>
                <h3 className="category-title">{renderHtml("cat4.title", "Gold, Silver &amp; Jewellery")}</h3>
              </div>
              <div className="category-badge">{renderHtml("cat4.badge", "Dedicated Hallmarking &amp; HUID")}</div>
              <p className="category-subtitle">{t["cat4.explore"] || "Explore:"}</p>
              <ul className="category-features">
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f1"] || "Gold hallmarking"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f2"] || "Silver hallmarking"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f3"] || "HUID verification"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f4"] || "Purity / grades"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f5"] || "Hallmarking requirements"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat4.f6"] || "BIS CARE verification"}</span>
                </li>
              </ul>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onNavigateTab("verify")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                  title="Open BIS Hallmarking & Mark Verification"
                >
                  <span>{t["cat4.cta"] || "Verify Hallmarking"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* 5. Construction & Industrial Materials */}
            <div className="category-card">
              <div className="category-num">05</div>
              <div className="category-header">
                <span className="category-icon">🏗️</span>
                <h3 className="category-title">{renderHtml("cat5.title", "Construction &amp; Industrial Materials")}</h3>
              </div>
              <p className="category-subtitle">{t["cat.explore"] || "Explore standards for:"}</p>
              <ul className="category-features">
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f1"] || "Cement"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f2"] || "Steel and TMT bars"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f3"] || "Building materials"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f4"] || "Construction products"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f5"] || "Chemical requirements"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  <span>{t["cat5.f6"] || "Physical / testing requirements"}</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> <span>{t["cat5.f7"] || "Applicable QCOs"}</span>
                </li>
              </ul>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onStartChat("What are the mandatory Quality Control Orders (QCO) for Cement (IS 269) and TMT Steel Bars (IS 1786)?")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                >
                  <span>{t["cat5.cta"] || "Explore Construction Standards"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* 6. Others */}
            <div className="category-card category-card-others">
              <div className="category-num">06</div>
              <div className="category-header">
                <span className="category-icon">📦</span>
                <h3 className="category-title">{t["cat6.title"] || "Others"}</h3>
              </div>
              <p className="category-desc">
                {t["cat6.desc"] ||
                  "Don't see your product? Explore standards across other categories and search directly by product, keyword, or standard number."}
              </p>
              <div className="category-others-box">
                <div className="search-hint">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>{t["cat6.hint"] || "Search 23,866+ Indian Standards across all scopes"}</span>
                </div>
              </div>
              <div className="category-footer">
                <button
                  type="button"
                  onClick={() => onNavigateTab("finder")}
                  className="category-cta"
                  style={{ background: "none", border: "none" }}
                >
                  <span>{t["cat6.cta"] || "Search All Standards"}</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2 className="section-title">
            {t["feat.sectionTitle"] || "Comprehensive Standards Intelligence"}
          </h2>
          <div className="features-grid">
            <div
              className="feature-glow-wrapper"
              onMouseMove={handleGlowMouseMove}
              onClick={() => onStartChat()}
              title="Click to start interactive AI Assist"
            >
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3 className="feature-title">{t["feat1.title"] || "AI-Powered Assistance"}</h3>
                <div className="feature-content-wrapper">
                  <p className="feature-overview">{t["feat1.overview"] || "Intelligent QA Engine"}</p>
                  <p className="feature-desc">
                    {t["feat1.desc"] ||
                      "Ask complex questions about standards and compliance in natural language and get precise, instant answers from our intelligent engine."}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="feature-glow-wrapper"
              onMouseMove={handleGlowMouseMove}
              onClick={() => onNavigateTab("finder")}
              title="Click to open Standards Discovery"
            >
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fa-solid fa-magnifying-glass-chart"></i>
                </div>
                <h3 className="feature-title">
                  {t["feat2.title"] || "Indian Standards Discovery"}
                </h3>
                <div className="feature-content-wrapper">
                  <p className="feature-overview">{t["feat2.overview"] || "IS Code Search"}</p>
                  <p className="feature-desc">
                    {t["feat2.desc"] ||
                      "Quickly search and discover relevant Indian Standards (IS) across various domains, materials, and specialized industries."}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="feature-glow-wrapper"
              onMouseMove={handleGlowMouseMove}
              onClick={() => onNavigateTab("journey")}
              title="Click to open MSME Certification Journey"
            >
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <h3 className="feature-title">{t["feat3.title"] || "Certification Guidance"}</h3>
                <div className="feature-content-wrapper">
                  <p className="feature-overview">{t["feat3.overview"] || "Compliance Rules"}</p>
                  <p className="feature-desc">
                    {t["feat3.desc"] ||
                      "Receive step-by-step guidance on BIS certification processes, required documentation, and overarching compliance frameworks."}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="feature-glow-wrapper"
              onMouseMove={handleGlowMouseMove}
              onClick={() => onNavigateTab("labs")}
              title="Click to explore Testing Laboratories Directory"
            >
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fa-solid fa-flask-vial"></i>
                </div>
                <h3 className="feature-title">{t["feat4.title"] || "Testing Laboratories"}</h3>
                <div className="feature-content-wrapper">
                  <p className="feature-overview">{t["feat4.overview"] || "Find Lab Facilities"}</p>
                  <p className="feature-desc">
                    {t["feat4.desc"] ||
                      "Easily locate BIS recognized and accredited testing laboratories for your specific product categories nationwide."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Landing Page Parallax Sovereign Footer */}
      <footer className="footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-brand">
            <h2>
              <i className="fa-solid fa-shield-halved"></i> <span className="reactbits-blur">MANAKAI</span>
            </h2>
            <p className="reactbits-blur" data-i18n="footer.brandDesc">
              {t["footer.brandDesc"] ||
                "Empowering industries, manufacturers, and consumers with intelligent access to Bureau of Indian Standards information."}
            </p>
          </div>
          <div className="footer-links">
            <h3 className="reactbits-blur" data-i18n="footer.quickLinks">
              {t["footer.quickLinks"] || "Quick Links"}
            </h3>
            <ul>
              <li>
                <a
                  href="#standards"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTab("finder");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.searchStandards"
                >
                  {t["footer.searchStandards"] || "Search Standards"}
                </a>
              </li>
              <li>
                <a
                  href="#schemes"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTab("journey");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.certificationSchemes"
                >
                  {t["footer.certificationSchemes"] || "Certification Schemes"}
                </a>
              </li>
              <li>
                <a
                  href="#labs"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateTab("labs");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.labDirectory"
                >
                  {t["footer.labDirectory"] || "Lab Directory"}
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenInfo?.("help");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.helpCenter"
                >
                  {t["footer.helpCenter"] || "Help Center"}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h3 className="reactbits-blur" data-i18n="footer.legal">
              {t["footer.legal"] || "Legal"}
            </h3>
            <ul>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenInfo?.("privacy");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.privacy"
                >
                  {t["footer.privacy"] || "Privacy Policy"}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenInfo?.("terms");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.terms"
                >
                  {t["footer.terms"] || "Terms of Service"}
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenInfo?.("accessibility");
                  }}
                  className="reactbits-blur"
                  data-i18n="footer.accessibility"
                >
                  {t["footer.accessibility"] || "Accessibility"}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="reactbits-blur" data-i18n="footer.copyright">
            {t["footer.copyright"] || "© 2026 SIH Project - MANAKAI. All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
};
