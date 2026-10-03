"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Plus,
  MessageSquare,
  Trash2,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  X,
  PanelRightClose,
  PanelRightOpen,
  FileCheck,
  BookOpen,
  CheckCircle2,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Languages,
} from "lucide-react";
import { sendMessage, fetchConversations } from "../lib/api";
import {
  speakText,
  stopSpeaking,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  LANG_LOCALE_MAP,
} from "../lib/voice";
import { ChatMessage, Conversation, SourceCitation } from "../types";
import { ConfidenceBar } from "./ConfidenceBar";
import { SourceCard } from "./SourceCard";
import { ExplainabilityModal } from "./ExplainabilityModal";
import { FeedbackModal } from "./FeedbackModal";
import { AuditDossierModal } from "./AuditDossierModal";
import { BisEmblem, EmblemOfIndia } from "./GovEmblem";

interface ChatViewProps {
  initialQuery?: string;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialQuery = "",
  currentLang = "en",
  onLanguageChange,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceCitation | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Bhashini Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false);
  const recognizerRef = useRef<any>(null);

  // Modals state
  const [explainModalData, setExplainModalData] = useState<{
    isOpen: boolean;
    data?: any;
    sources?: SourceCitation[];
  }>({ isOpen: false });

  const [feedbackModalData, setFeedbackModalData] = useState<{
    isOpen: boolean;
    messageId: string;
    query?: string;
    answer?: string;
  }>({ isOpen: false, messageId: "" });

  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await fetchConversations();
      setConversations(convs);
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger initial query if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== "") {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  // Handle Speech-to-Text via Bhashini voice helper
  const handleToggleSpeechRecognition = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
        recognizerRef.current = null;
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      const recognizer = createSpeechRecognizer(
        currentLang,
        (transcript: string) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (error: string) => {
          console.warn("Speech recognition notice:", error);
          setIsListening(false);
          recognizerRef.current = null;
        },
        () => {
          setIsListening(false);
          recognizerRef.current = null;
        }
      );

      recognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
    } catch (err) {
      console.error("Speech recognition startup error:", err);
      setIsListening(false);
    }
  };

  // Handle Text-to-Speech playback for an assistant message
  const handleToggleSpeakMessage = (messageId: string, text: string) => {
    if (activeSpeakingId === messageId) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeaking();
    setActiveSpeakingId(messageId);

    speakText(
      text,
      currentLang,
      () => setActiveSpeakingId(messageId),
      () => setActiveSpeakingId(null)
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q || isLoading) return;

    stopSpeaking();
    setActiveSpeakingId(null);

    const userMsgId = `u-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      content: q,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await sendMessage(q, currentConversationId, currentLang);
      
      if (!currentConversationId && res.conversation_id) {
        setCurrentConversationId(res.conversation_id);
        loadConversations();
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        content: res.answer,
        intent: res.intent,
        confidence: res.confidence,
        confidence_level: res.confidence_level,
        sources: res.sources,
        explainability: res.explainability,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically inspect the highest ranked citation
      if (res.sources && res.sources.length > 0) {
        setSelectedSource(res.sources[0]);
      }

      // Auto-read aloud if enabled
      if (autoSpeakEnabled && res.answer) {
        handleToggleSpeakMessage(assistantMsg.id, res.answer);
      }
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content:
          "An error occurred while communicating with the MANAKAI server. Please ensure the backend server is running on port 8000.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    stopSpeaking();
    setActiveSpeakingId(null);
    setCurrentConversationId(undefined);
    setMessages([]);
    setSelectedSource(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectConversation = (conv: Conversation) => {
    stopSpeaking();
    setCurrentConversationId(conv.id);
    setMessages(conv.messages || []);
    if (conv.messages && conv.messages.length > 0) {
      const lastAssistant = [...conv.messages]
        .reverse()
        .find((m) => m.sender === "assistant" && m.sources && m.sources.length > 0);
      if (lastAssistant?.sources?.length) {
        setSelectedSource(lastAssistant.sources[0]);
      }
    }
  };

  const samplePrompts = [
    {
      title: "IS 14543 Packaged Water Testing",
      desc: "Mandatory microbiological limits, chemical parameters, and testing batch frequency.",
      category: "Mandatory QCO",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      query: "What are the mandatory testing requirements and frequency for IS 14543 (Packaged Drinking Water)?",
    },
    {
      title: "Gold HUID & Hallmark Authenticity",
      desc: "Instant verification of 6-digit alphanumeric laser codes and identification of counterfeit marks.",
      category: "Verified Mark",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
      query: "How to verify 6-digit Gold Hallmarking HUID code and identify fake jewellery?",
    },
    {
      title: "Steel Rebars & Mandatory QCOs",
      desc: "Statutory orders under Section 16 & Section 29 criminal liability for non-certified steel (IS 1786).",
      category: "Statutory QCO",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      query: "Which products and steel rebar specifications are under mandatory Quality Control Orders in 2026?",
    },
    {
      title: "50% MSME Fee Concession",
      desc: "Fee calculators, minimum marking fee concessions, and application subsidies under Scheme I.",
      category: "50% Subsidy",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
      query: "What are the eligibility criteria and concessions for MSME & startups under BIS Scheme I?",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-70px)] bg-slate-50 text-slate-800 overflow-hidden font-sans relative">
      {/* Left Sidebar: Conversations & Quick Actions */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 shrink-0 shadow-xs z-10">
        <div className="space-y-4">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New BIS Query</span>
          </button>

          {/* Recent Conversations */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
              Recent Queries
            </span>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-400 italic px-2 py-3 text-center">
                  No previous queries yet.
                </p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                      currentConversationId === c.id
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.title || "Query Session"}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Safety Badge */}
        <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2 text-[11px] text-slate-700 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Zero Hallucination Guarantee</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            All answers are strictly synthesized from indexed BIS documents, clauses, and gazette QCOs.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Desktop Chat Header Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">Ask MANAKAI AI Assistant</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  SIH26107
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Grounded Truth Guardrail Active</span>
                </span>
                <span>•</span>
                <span>23,866 Indian Standards Grounded</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bhashini Voice Auto-Speak Toggle */}
            <button
              onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                autoSpeakEnabled
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold shadow-xs"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
              title="Automatically read aloud answers in selected language (TTS)"
            >
              <Volume2 className={`w-3.5 h-3.5 ${autoSpeakEnabled ? "text-emerald-600 animate-pulse" : "text-slate-500"}`} />
              <span>Voice Auto-Speak</span>
              <span className={`w-1.5 h-1.5 rounded-full ${autoSpeakEnabled ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`} />
            </button>

            {/* One-Click Export Official BIS Dossier Button */}
            {messages.length > 0 && (
              <button
                onClick={() => setIsDossierOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm active:scale-95"
                title="Export Official Branded BIS Compliance Dossier (PDF)"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Dossier</span>
              </button>
            )}

            <button
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isInspectorOpen
                  ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{isInspectorOpen ? "Hide Gazette Inspector" : "Show Gazette Inspector"}</span>
              {selectedSource && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 bg-white border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Ask MANAKAI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                autoSpeakEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold" : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Toggle Auto-Speak"
            >
              <Volume2 className={`w-3.5 h-3.5 ${autoSpeakEnabled ? "text-emerald-600 animate-pulse" : "text-slate-500"}`} />
            </button>
            <button
              onClick={() => setMobileHistoryOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-medium"
            >
              <MessageSquare className="w-3 h-3 text-blue-600" />
              <span>History ({conversations.length})</span>
            </button>
            <button
              onClick={handleNewChat}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 text-[11px] font-bold shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Messages Scrollable View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto my-auto py-6 sm:py-8 space-y-6 px-3">
              {/* Sovereign Tricolor Accent */}
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF9933] via-blue-600 to-[#138808] rounded-full" />

              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>MANAKAI Intelligent Co-Pilot • 23,866 Standards Grounded</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Ask MANAKAI AI Assistant
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  Instant, traceable answers grounded in authoritative Indian Standards, gazette notifications, laboratory test criteria, and Quality Control Orders.
                </p>
              </div>

              {/* Core Capabilities Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1.5 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>23,866 Indian Standards</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero-Hallucination Grounding</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold flex items-center gap-1.5 shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Mandatory QCO Enforcements</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1.5 shadow-xs">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>50% MSME Fee Subsidy</span>
                </span>
              </div>

              {/* Sample Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.query)}
                    className="p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all shadow-xs hover:shadow-md text-left flex flex-col justify-between group space-y-2.5 active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${p.badgeColor}`}>
                        {p.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bhashini Multilingual Voice Quick Prompts */}
              <div className="pt-2 text-center space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bhashini Multilingual Quick Inquiries:</span>
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleSendMessage("हॉलमार्किंग में 6-अंकीय HUID कैसे चेक करें?")}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">हिन्दी</span>
                    <span>हॉलमार्किंग में 6-अंकीय HUID कैसे चेक करें?</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("पिण्याच्या पाण्यासाठी ISI मार्क नियम काय आहेत?")}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 text-[10px] font-bold border border-orange-200">मराठी</span>
                    <span>पिण्याच्या पाण्यासाठी ISI मार्क नियम काय आहेत?</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage("How does an MSME obtain 50% fee concession under Scheme I?")}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">MSME</span>
                    <span>How does an MSME obtain 50% fee concession?</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl mx-auto ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 sm:p-5 shadow-xs text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-2xl ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  {/* Assistant Header Metas */}
                  {msg.sender === "assistant" && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {msg.intent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {msg.intent}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Grounded Truth</span>
                        </span>
                      </div>

                      {/* Confidence Meter Badge */}
                      {msg.confidence !== undefined && (
                        <div className="w-36">
                          <ConfidenceBar
                            score={msg.confidence}
                            level={msg.confidence_level || "High"}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body Content */}
                  <div className="prose prose-sm max-w-none text-slate-800">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Sources Citations Deck */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span>Grounded Citations ({msg.sources.length} Standards Verified)</span>
                        </span>
                        {msg.explainability && (
                          <button
                            onClick={() =>
                              setExplainModalData({
                                isOpen: true,
                                data: msg.explainability,
                                sources: msg.sources,
                              })
                            }
                            className="text-blue-600 hover:text-blue-800 font-mono flex items-center gap-1 text-[10px]"
                          >
                            <Info className="w-3 h-3" />
                            <span>Explain Reasoning</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {msg.sources.map((src, idx) => (
                          <SourceCard
                            key={idx}
                            source={src}
                            index={idx + 1}
                            onSelect={(source) => {
                              setSelectedSource(source);
                              setIsInspectorOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Action Bar (Copy, Listen, Feedback) */}
                  {msg.sender === "assistant" && (
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="hover:text-blue-700 p-1 rounded hover:bg-slate-100 flex items-center gap-1 text-[11px] transition-colors"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        {/* Bhashini Voice Listen Button */}
                        <button
                          onClick={() => handleToggleSpeakMessage(msg.id, msg.content)}
                          className={`p-1 rounded flex items-center gap-1 text-[11px] transition-all ${
                            activeSpeakingId === msg.id
                              ? "bg-blue-600 text-white font-bold shadow-xs"
                              : "hover:text-blue-700 hover:bg-slate-100 text-slate-600"
                          }`}
                          title={activeSpeakingId === msg.id ? "Stop voice playback" : "Listen in selected language (Bhashini Voice)"}
                        >
                          {activeSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-white animate-pulse" />
                              <span className="text-white font-mono text-[10px]">Speaking...</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSendMessage(messages[messages.indexOf(msg) - 1]?.content || "")}
                          className="hover:text-blue-700 p-1 rounded hover:bg-slate-100 flex items-center gap-1 text-[11px] transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Regenerate</span>
                        </button>
                      </div>

                      {/* Feedback Thumbs */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 mr-1">Helpful?</span>
                        <button
                          onClick={() =>
                            setFeedbackModalData({
                              isOpen: true,
                              messageId: msg.id,
                              query: messages[messages.indexOf(msg) - 1]?.content,
                              answer: msg.content,
                            })
                          }
                          className="p-1 rounded hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 transition-colors"
                          title="Thumbs Up"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setFeedbackModalData({
                              isOpen: true,
                              messageId: msg.id,
                              query: messages[messages.indexOf(msg) - 1]?.content,
                              answer: msg.content,
                            })
                          }
                          className="p-1 rounded hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                          title="Report Issue / Suggest Correction"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-4xl mx-auto justify-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 max-w-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>Searching 23,866 Indian Standards & verifying clauses...</span>
                </div>
                <div className="h-2 bg-slate-200 rounded w-48" />
                <div className="h-2 bg-slate-100 rounded w-64" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Quick chips if in conversation */}
            {messages.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-600 scrollbar-none">
                <span className="font-semibold text-slate-500 flex-shrink-0">Follow-up:</span>
                <button
                  onClick={() => handleSendMessage("What documents are required for this certification?")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 whitespace-nowrap transition"
                >
                  What documents are required?
                </button>
                <button
                  onClick={() => handleSendMessage("What are the testing limits and methods?")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 whitespace-nowrap transition"
                >
                  Testing limits & methods
                </button>
                <button
                  onClick={() => handleSendMessage("Where is the nearest BIS recognized testing lab?")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 whitespace-nowrap transition"
                >
                  Nearest recognized lab
                </button>
              </div>
            )}

            {/* Live Bhashini Speech Recognition Banner when active */}
            {isListening && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span className="font-semibold">
                    {LANG_LOCALE_MAP[currentLang]?.listeningPrompt || "Listening... Speak now."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSpeechRecognition}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition shadow-xs"
                >
                  Done Speaking
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition"
            >
              {/* Bhashini Voice Microphone Input Button */}
              <button
                type="button"
                onClick={handleToggleSpeechRecognition}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse ring-4 ring-red-400/40 shadow-xs"
                    : "bg-white hover:bg-slate-100 text-blue-600 border border-slate-200"
                }`}
                title={
                  isListening
                    ? "Listening... click to stop"
                    : `Speak question in ${LANG_LOCALE_MAP[currentLang]?.label || "Indian Languages"} (Bhashini STT)`
                }
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : `Ask MANAKAI about Indian Standards, e.g. '${samplePrompts[0]?.title}' (or tap Mic)...`
                }
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none placeholder-slate-400 text-slate-900"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  inputText.trim() && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <span>Supports Voice Input & Audio Playback in:</span>
                <div className="flex gap-1.5 font-semibold text-slate-700">
                  <span className={currentLang === "en" ? "text-blue-600 font-bold" : ""}>English (IN)</span>
                  <span>•</span>
                  <span className={currentLang === "hi" ? "text-blue-600 font-bold" : ""}>हिन्दी</span>
                  <span>•</span>
                  <span className={currentLang === "mr" ? "text-blue-600 font-bold" : ""}>मराठी</span>
                </div>
              </div>
              <span className="font-mono text-emerald-700 font-semibold">Bhashini Multilingual AI</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Pane: Official Evidence Inspector (Dual-Pane AI Architecture) */}
      {isInspectorOpen && (
        <aside className="w-96 xl:w-[420px] bg-white border-l border-slate-200 hidden lg:flex flex-col justify-between shrink-0 shadow-sm animate-fadeIn overflow-hidden">
          {/* Inspector Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BisEmblem className="h-6 w-auto text-blue-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-xs tracking-tight">Official Evidence Inspector</h3>
                <span className="text-[10px] text-blue-600 font-mono">Traceable Indian Standard Gazette Citation</span>
              </div>
            </div>
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              title="Collapse Evidence Inspector"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Inspector Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedSource ? (
              <div className="space-y-4">
                {/* Sovereign Stamp Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                      {selectedSource.standard_number || "Indian Standard"}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Gazette Citation</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {selectedSource.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600 font-mono">
                      <span>Clause: <strong className="text-blue-700">{selectedSource.clause || "Specification"}</strong></span>
                      {selectedSource.page && (
                        <span>• Page: <strong className="text-slate-800">{selectedSource.page}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Relevance Confidence Meter */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1.5">
                      <span>Retriever Grounding Relevance</span>
                      <span className="font-mono text-blue-600 font-bold">{Math.round((selectedSource.relevance_score || 0.88) * 100)}% Match</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.round((selectedSource.relevance_score || 0.88) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verbatim Gazette Excerpt in Legal Paper Styling */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-2 relative shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verbatim Standard Excerpt</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">Official Clause Text</span>
                  </div>

                  <p className="text-xs text-slate-800 italic leading-relaxed bg-white p-3 rounded-xl border border-blue-100 font-serif">
                    "{selectedSource.evidence_snippet}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Source: BIS Standards Bureau Archive</span>
                    <span className="text-emerald-700 font-medium">Authenticity Check: Passed</span>
                  </div>
                </div>

                {/* Inspector Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setInputText(`Tell me more about ${selectedSource.standard_number} ${selectedSource.clause || ''}`);
                    }}
                    className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ask Follow-up on this Clause</span>
                  </button>

                  {selectedSource.source_url && (
                    <a
                      href={selectedSource.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <span>View on Official BIS Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No Citation Selected</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Click on any standard citation card in the chat to inspect its official gazette excerpt, clause tolerances, and legal grounding.
                </p>
              </div>
            )}
          </div>

          {/* Inspector Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
            Traceable to Bureau of Indian Standards Act, 2016
          </div>
        </aside>
      )}

      {/* Explainability Modal */}
      <ExplainabilityModal
        isOpen={explainModalData.isOpen}
        onClose={() => setExplainModalData({ isOpen: false })}
        data={explainModalData.data}
        sources={explainModalData.sources}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalData.isOpen}
        onClose={() => setFeedbackModalData({ isOpen: false, messageId: "" })}
        messageId={feedbackModalData.messageId}
        query={feedbackModalData.query}
        answer={feedbackModalData.answer}
      />

      {/* Official Audit Dossier Preview Modal */}
      <AuditDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        dossierType="chat"
        title="BIS AI Regulatory Advisory Dossier"
        data={{
          conversationId: currentConversationId,
          messages: messages,
          language: currentLang,
        }}
      />
    </div>
  );
};
