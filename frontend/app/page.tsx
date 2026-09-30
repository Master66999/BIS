"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  Calculator,
  Layers,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LandingHero } from "../components/LandingHero";

// Lightweight loading skeleton for dynamically imported heavy tabs
const ViewLoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
    <span className="text-xs font-mono text-slate-500 tracking-wide">
      Loading BIS Module...
    </span>
  </div>
);

// Code-split heavy views with next/dynamic to slash initial bundle size and optimize Lighthouse FCP/TBT
const ChatView = dynamic(
  () => import("../components/ChatView").then((m) => m.ChatView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const StandardFinderView = dynamic(
  () => import("../components/StandardFinderView").then((m) => m.StandardFinderView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const FeeCalculatorView = dynamic(
  () => import("../components/FeeCalculatorView").then((m) => m.FeeCalculatorView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const VerifyMarkView = dynamic(
  () => import("../components/VerifyMarkView").then((m) => m.VerifyMarkView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const ServicesHubView = dynamic(
  () => import("../components/ServicesHubView").then((m) => m.ServicesHubView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const LaboratoriesView = dynamic(
  () => import("../components/LaboratoriesView").then((m) => m.LaboratoriesView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const AdminPortalView = dynamic(
  () => import("../components/AdminPortalView").then((m) => m.AdminPortalView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const ReportInspectorView = dynamic(
  () => import("../components/ReportInspectorView").then((m) => m.ReportInspectorView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const ComplianceJourneyView = dynamic(
  () => import("../components/ComplianceJourneyView").then((m) => m.ComplianceJourneyView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const QcoRadarView = dynamic(
  () => import("../components/QcoRadarView").then((m) => m.QcoRadarView),
  { loading: ViewLoadingSkeleton, ssr: false }
);

const CommandPalette = dynamic(
  () => import("../components/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [chatInitialQuery, setChatInitialQuery] = useState<string>("");
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStartChat = (query?: string) => {
    if (query) {
      setChatInitialQuery(query);
    }
    setActiveTab("chat");
  };

  const handleAskAboutStandard = (query: string) => {
    setChatInitialQuery(query);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Gov-Tech Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
        activeTab={activeTab}
        onOpenSpotlight={() => setIsPaletteOpen(true)}
        setActiveTab={(tab) => {
          if (tab !== "chat") setChatInitialQuery("");
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area based on Active Tab */}
      <main className={`flex-1 ${activeTab === "chat" ? "" : "pb-16 lg:pb-0"}`}>
        {activeTab === "home" && (
          <LandingHero
            onStartChat={handleStartChat}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "chat" && (
          <ChatView
            initialQuery={chatInitialQuery}
            currentLang={currentLang}
            onLanguageChange={(lang) => setCurrentLang(lang)}
          />
        )}

        {activeTab === "finder" && (
          <StandardFinderView onAskAboutStandard={handleAskAboutStandard} />
        )}

        {activeTab === "calculator" && (
          <FeeCalculatorView onAskAI={handleStartChat} />
        )}

        {activeTab === "verify" && (
          <VerifyMarkView onAskAI={handleStartChat} />
        )}

        {activeTab === "services" && <ServicesHubView />}

        {activeTab === "labs" && <LaboratoriesView />}

        {activeTab === "admin" && <AdminPortalView />}

        {activeTab === "inspector" && (
          <ReportInspectorView onAskAI={handleStartChat} />
        )}

        {activeTab === "journey" && (
          <ComplianceJourneyView onAskAI={handleStartChat} />
        )}

        {activeTab === "qco" && (
          <QcoRadarView
            onAskAI={handleStartChat}
            onNavigateTab={(tab) => {
              setChatInitialQuery("");
              setActiveTab(tab);
            }}
          />
        )}
      </main>

      {/* Official Government Footer */}
      {activeTab !== "chat" && <Footer />}

      {/* Native-Style Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "home" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <HomeIcon className={`w-5 h-5 mb-0.5 ${activeTab === "home" ? "text-[#0B2545]" : "text-slate-400"}`} />
          <span>Home</span>
          {activeTab === "home" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "chat" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 mb-0.5 ${activeTab === "chat" ? "text-amber-500" : "text-slate-400"}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>AI Assist</span>
          {activeTab === "chat" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("finder")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "finder" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 ${activeTab === "finder" ? "text-[#0B2545]" : "text-slate-400"}`} />
          <span>Standards</span>
          {activeTab === "finder" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("inspector")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "inspector" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className="relative">
            <FileCheck2 className={`w-5 h-5 mb-0.5 ${activeTab === "inspector" ? "text-amber-500" : "text-slate-400"}`} />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>
          <span>MTC Audit</span>
          {activeTab === "inspector" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("verify")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "verify" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className={`w-5 h-5 mb-0.5 ${activeTab === "verify" ? "text-[#0B2545]" : "text-slate-400"}`} />
          <span>Scanner</span>
          {activeTab === "verify" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>
      </nav>

      {/* Global Cmd+K / Ctrl+K Spotlight Command Palette (Dynamically loaded) */}
      {isPaletteOpen && (
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          onNavigateTab={(tab) => {
            setChatInitialQuery("");
            setActiveTab(tab);
          }}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  );
}
