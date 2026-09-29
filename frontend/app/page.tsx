"use client";

import React, { useState } from "react";
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  Calculator,
  Layers,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LandingHero } from "../components/LandingHero";
import { ChatView } from "../components/ChatView";
import { StandardFinderView } from "../components/StandardFinderView";
import { ServicesHubView } from "../components/ServicesHubView";
import { LaboratoriesView } from "../components/LaboratoriesView";
import { AdminPortalView } from "../components/AdminPortalView";
import { FeeCalculatorView } from "../components/FeeCalculatorView";
import { VerifyMarkView } from "../components/VerifyMarkView";
import { CommandPalette } from "../components/CommandPalette";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [chatInitialQuery, setChatInitialQuery] = useState<string>("");
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
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
          onClick={() => setActiveTab("calculator")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "calculator" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === "calculator" ? "text-[#0B2545]" : "text-slate-400"}`} />
          <span>Fees</span>
          {activeTab === "calculator" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab("services")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === "services" ? "text-[#0B2545] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className={`w-5 h-5 mb-0.5 ${activeTab === "services" ? "text-[#0B2545]" : "text-slate-400"}`} />
          <span>Schemes</span>
          {activeTab === "services" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
        </button>
      </nav>

      {/* Global Cmd+K / Ctrl+K Spotlight Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setChatInitialQuery("");
          setActiveTab(tab);
        }}
        onStartChat={handleStartChat}
      />
    </div>
  );
}
