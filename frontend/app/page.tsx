"use client";

import React, { useState } from "react";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [chatInitialQuery, setChatInitialQuery] = useState<string>("");

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
        setActiveTab={(tab) => {
          if (tab !== "chat") setChatInitialQuery("");
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
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
    </div>
  );
}
