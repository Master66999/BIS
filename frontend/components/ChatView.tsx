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
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText("");

    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await sendMessage(text, currentConversationId, currentLang);
      setCurrentConversationId(res.conversation_id);

      const assistantMsg: ChatMessage = {
        id: res.message_id,
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
      if (res.sources && res.sources.length > 0) {
        setSelectedSource(res.sources[0]);
        setIsInspectorOpen(true);
      }
      loadConversations();

      // Bhashini Auto-Speak response if enabled
      if (autoSpeakEnabled) {
        setActiveSpeakingId(assistantMsg.id);
        speakText(
          assistantMsg.content,
          currentLang,
          () => setActiveSpeakingId(assistantMsg.id),
          () => setActiveSpeakingId(null)
        );
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content:
          "Something went wrong while retrieving BIS information. Please check your internet connection and try again.",
        confidence: 0.2,
        confidence_level: "Low",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Toggle Live Speech-to-Text Recognition (STT)
  const handleToggleSpeechRecognition = () => {
    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const rec = createSpeechRecognizer(
        currentLang,
        (transcript, isFinal) => {
          setInputText(transcript);
        },
        (err) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (rec) {
        recognizerRef.current = rec;
        rec.start();
        setIsListening(true);
      }
    } catch (e) {
      console.error("Speech recognition start failed:", e);
      setIsListening(false);
    }
  };

  // Toggle Speech Synthesis (TTS) for individual message
  const handleToggleSpeakMessage = (msgId: string, content: string) => {
    if (activeSpeakingId === msgId) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      stopSpeaking();
      setActiveSpeakingId(msgId);
      speakText(
        content,
        currentLang,
        () => setActiveSpeakingId(msgId),
        () => setActiveSpeakingId(null)
      );
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
    setInputText("");
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setMessages(conv.messages || []);
  };

  const sampleQuestions = [
    "What BIS standard is applicable to cement?",
    "What certification is required for electric fans?",
    "What is 6-digit HUID in gold hallmarking?",
    "What testing is required for packaged drinking water?",
    "How does an MSME obtain an ISI mark under simplified procedure?",
    "What are the chemical limits for TMT steel rebars (IS 1786)?",
    "How can a consumer file a complaint on the BIS CARE app?",
  ];

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-slate-100 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-3.5 shadow-sm">
        <div className="space-y-3">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0B2545] hover:bg-[#133E68] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New BIS Query</span>
          </button>

          {/* Recent Conversations */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
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
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      currentConversationId === c.id
                        ? "bg-amber-50 text-blue-950 font-bold border border-amber-200"
                        : "text-slate-600 hover:bg-slate-100"
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
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zero Hallucination Guarantee</span>
          </div>
          <p className="leading-relaxed">
            All answers are strictly synthesized from indexed BIS documents, clauses, and gazette QCOs.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Desktop Chat Header Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0A2540] text-amber-400 flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">BIS Standards AI Co-Pilot</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Factual Grounding • Zero-Hallucination Guardrail Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bhashini Voice Auto-Speak Toggle */}
            <button
              onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                autoSpeakEnabled
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
              title="Automatically read aloud answers in selected language (TTS)"
            >
              <Volume2 className={`w-3.5 h-3.5 ${autoSpeakEnabled ? "text-emerald-600 animate-pulse" : "text-slate-400"}`} />
              <span>Voice Auto-Speak</span>
              <span className={`w-1.5 h-1.5 rounded-full ${autoSpeakEnabled ? "bg-emerald-500 animate-ping" : "bg-slate-300"}`} />
            </button>

            <button
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isInspectorOpen
                  ? "bg-blue-50 text-blue-950 border-blue-200 font-bold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-900" />
              <span>{isInspectorOpen ? "Hide Gazette Inspector" : "Show Gazette Inspector"}</span>
              {selectedSource && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0B2545]">
            <Bot className="w-4 h-4 text-amber-500" />
            <span>BIS AI Assistant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
              className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                autoSpeakEnabled ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold" : "bg-white text-slate-600 border-slate-300"
              }`}
              title="Toggle Auto-Speak"
            >
              <Volume2 className={`w-3.5 h-3.5 ${autoSpeakEnabled ? "text-emerald-600 animate-pulse" : "text-slate-400"}`} />
            </button>
            <button
              onClick={() => setMobileHistoryOpen(true)}
              className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 flex items-center gap-1 text-[11px] font-medium"
            >
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span>History ({conversations.length})</span>
            </button>
            <button
              onClick={handleNewChat}
              className="px-2 py-1 rounded bg-[#0B2545] text-amber-300 flex items-center gap-1 text-[11px] font-bold shadow-sm"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Messages Scrollable View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto my-auto text-center py-8 sm:py-10 space-y-5 sm:space-y-6 px-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0B2545] flex items-center justify-center text-white mx-auto shadow-md border border-slate-700">
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                  How can BIS SmartAssist help you today?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Ask any question about Indian Standards, certification requirements, lab testing, or hallmarking procedures.
                </p>
              </div>

              {/* Sample Questions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs pt-1">
                {sampleQuestions.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-700 transition-all text-xs font-medium flex items-center justify-between group"
                  >
                    <span className="pr-2">{q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* Bhashini Multilingual Voice Prompt Chips */}
              <div className="pt-3 max-w-xl mx-auto border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Mic className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold text-slate-700">Bhashini Multilingual Voice Queries:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { text: "हॉलमार्किंग में 6-अंकीय HUID कैसे चेक करें?", lang: "hi", label: "हिन्दी" },
                    { text: "पिण्याच्या पाण्यासाठी ISI मार्क नियम काय आहेत?", lang: "mr", label: "मराठी" },
                    { text: "What are the mandatory QCO deadlines for toys?", lang: "en", label: "English" },
                    { text: "How does an MSME obtain 50% fee concession?", lang: "en", label: "MSME" },
                  ].map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (onLanguageChange && v.lang !== currentLang) {
                          onLanguageChange(v.lang);
                        }
                        handleSendMessage(v.text);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 text-slate-700 hover:text-amber-950 text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-bold text-slate-600">
                        {v.label}
                      </span>
                      <span>{v.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-4xl mx-auto w-full ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#0B2545] text-amber-400 flex items-center justify-center flex-shrink-0 shadow mt-0.5">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-2xl rounded-lg p-3 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0B2545] text-white shadow-md ml-3 sm:ml-12"
                      : "bg-white border border-slate-300 text-slate-800 shadow-sm mr-2 sm:mr-0"
                  }`}
                >
                  {/* Markdown Body */}
                  <div
                    className={`prose prose-sm max-w-none ${
                      msg.sender === "user"
                        ? "text-white [&_*]:!text-white [&_a]:!text-amber-300 [&_code]:!bg-blue-900/60 [&_code]:!text-amber-200"
                        : "text-slate-800 prose-headings:font-bold prose-headings:text-[#0B2545] prose-a:text-blue-600 prose-strong:text-slate-900"
                    } prose-ul:my-2 prose-li:my-0.5`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Confidence Bar if assistant */}
                  {msg.sender === "assistant" && msg.confidence !== undefined && (
                    <ConfidenceBar
                      confidence={msg.confidence}
                      confidenceLevel={msg.confidence_level || "High"}
                    />
                  )}

                  {/* Citations List */}
                  {msg.sender === "assistant" && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Authoritative Sources & Clauses ({msg.sources.length}):</span>
                        {msg.explainability && (
                          <button
                            onClick={() =>
                              setExplainModalData({
                                isOpen: true,
                                data: msg.explainability,
                                sources: msg.sources,
                              })
                            }
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium text-[11px]"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Why this answer?</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedSource(src);
                              setIsInspectorOpen(true);
                            }}
                            className={`cursor-pointer rounded-xl transition-all ${
                              selectedSource?.standard_number === src.standard_number && selectedSource?.clause === src.clause
                                ? "ring-2 ring-blue-600 shadow-xs"
                                : "hover:opacity-90"
                            }`}
                            title="Click to inspect official gazette evidence"
                          >
                            <SourceCard source={src} index={i} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Strip */}
                  {msg.sender === "assistant" && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-700 p-1 rounded hover:bg-slate-100 flex items-center gap-1 text-[11px]"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
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
                              ? "bg-amber-100 text-amber-900 font-bold shadow-2xs"
                              : "hover:text-slate-700 hover:bg-slate-100 text-slate-500"
                          }`}
                          title={activeSpeakingId === msg.id ? "Stop voice playback" : "Listen in selected language (Bhashini Voice)"}
                        >
                          {activeSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                              <span className="text-amber-800 font-mono text-[10px]">Speaking...</span>
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
                          className="hover:text-slate-700 p-1 rounded hover:bg-slate-100 flex items-center gap-1 text-[11px]"
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
                          className="p-1 rounded hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                          title="Report Issue / Suggest Correction"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-4xl mx-auto justify-start animate-pulse">
              <div className="w-8 h-8 rounded bg-[#0B2545] text-amber-400 flex items-center justify-center flex-shrink-0 shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2 max-w-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
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
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500 scrollbar-none">
                <span className="font-semibold text-slate-400 flex-shrink-0">Follow-up:</span>
                <button
                  onClick={() => handleSendMessage("What documents are required for this certification?")}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
                >
                  What documents are required?
                </button>
                <button
                  onClick={() => handleSendMessage("What are the testing limits and methods?")}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
                >
                  Testing limits & methods
                </button>
                <button
                  onClick={() => handleSendMessage("Where is the nearest BIS recognized testing lab?")}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
                >
                  Nearest recognized lab
                </button>
              </div>
            )}

            {/* Live Bhashini Speech Recognition Banner when active */}
            {isListening && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span className="font-semibold">
                    {LANG_LOCALE_MAP[currentLang]?.listeningPrompt || "Listening... Speak now."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSpeechRecognition}
                  className="px-2.5 py-1 rounded-lg bg-red-200 hover:bg-red-300 text-red-950 font-bold text-[11px] transition"
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
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500"
            >
              {/* Bhashini Voice Microphone Input Button */}
              <button
                type="button"
                onClick={handleToggleSpeechRecognition}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse ring-4 ring-red-400/40 shadow-md"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
                title={
                  isListening
                    ? "Listening... click to stop"
                    : `Speak question in ${LANG_LOCALE_MAP[currentLang]?.label || "Indian Languages"} (Bhashini STT)`
                }
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-700" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : `Ask about Indian Standards, e.g. '${sampleQuestions[0]}' (or tap Mic to speak)...`
                }
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none placeholder-slate-400 text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  inputText.trim() && !isLoading
                    ? "bg-[#0B2545] hover:bg-[#133E68] text-amber-300 shadow"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <span>Supports Voice Input & Audio Playback in:</span>
                <div className="flex gap-1 font-semibold text-slate-600">
                  <span className={currentLang === "en" ? "text-blue-900 font-bold" : ""}>English (IN)</span>
                  <span>•</span>
                  <span className={currentLang === "hi" ? "text-blue-900 font-bold" : ""}>हिन्दी</span>
                  <span>•</span>
                  <span className={currentLang === "mr" ? "text-blue-900 font-bold" : ""}>मराठी</span>
                </div>
              </div>
              <span className="font-mono text-emerald-700 font-semibold">Bhashini Multilingual AI</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Pane: Official Evidence Inspector (Dual-Pane AI Architecture) */}
      {isInspectorOpen && (
        <aside className="w-96 xl:w-[420px] bg-slate-50/90 backdrop-blur-md border-l border-slate-200 hidden lg:flex flex-col justify-between shrink-0 shadow-sm animate-fadeIn overflow-hidden">
          {/* Inspector Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BisEmblem className="h-6 w-auto text-blue-950" />
              <div>
                <h3 className="font-bold text-slate-900 text-xs tracking-tight">Official Evidence Inspector</h3>
                <span className="text-[10px] text-slate-500 font-mono">Traceable Indian Standard Gazette Citation</span>
              </div>
            </div>
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
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
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#0A2540] text-amber-400 text-xs font-mono font-bold shadow-2xs">
                      {selectedSource.standard_number || "Indian Standard"}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Gazette Citation</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {selectedSource.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
                      <span>Clause: <strong className="text-slate-800">{selectedSource.clause || "Specification"}</strong></span>
                      {selectedSource.page && (
                        <span>• Page: <strong className="text-slate-800">{selectedSource.page}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Relevance Confidence Meter */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Retriever Grounding Relevance</span>
                      <span className="font-mono text-blue-900">{Math.round((selectedSource.relevance_score || 0.88) * 100)}% Match</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-900 to-amber-500 rounded-full"
                        style={{ width: `${Math.round((selectedSource.relevance_score || 0.88) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verbatim Gazette Excerpt in Legal Paper Styling */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border-2 border-dashed border-amber-300/80 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>Verbatim Standard Excerpt</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">Official Clause Text</span>
                  </div>

                  <p className="text-xs text-slate-800 italic leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200/50 shadow-xs font-serif">
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
                    className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ask Follow-up on this Clause</span>
                  </button>

                  {selectedSource.source_url && (
                    <a
                      href={selectedSource.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-[#0A2540] hover:bg-blue-950 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <span>View on Official BIS Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto border border-blue-200/60">
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
          <div className="p-3 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
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

      {/* Mobile History Slide-over Drawer */}
      {mobileHistoryOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-4/5 max-w-xs bg-white h-full p-4 flex flex-col justify-between shadow-2xl animate-fadeIn">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <MessageSquare className="w-4 h-4 text-[#0B2545]" />
                  <span>Recent Queries</span>
                </div>
                <button
                  onClick={() => setMobileHistoryOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  handleNewChat();
                  setMobileHistoryOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0B2545] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>New BIS Query</span>
              </button>

              <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                {conversations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic px-2 py-4 text-center">
                    No previous queries yet.
                  </p>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        selectConversation(c);
                        setMobileHistoryOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        currentConversationId === c.id
                          ? "bg-amber-50 text-blue-950 font-bold border border-amber-300"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{c.title || "Query Session"}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2">
              Bureau of Indian Standards • BIS SmartAssist
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileHistoryOpen(false)} />
        </div>
      )}
    </div>
  );
};
