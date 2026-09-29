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
} from "lucide-react";
import { sendMessage, fetchConversations } from "../lib/api";
import { ChatMessage, Conversation, SourceCitation } from "../types";
import { ConfidenceBar } from "./ConfidenceBar";
import { SourceCard } from "./SourceCard";
import { ExplainabilityModal } from "./ExplainabilityModal";
import { FeedbackModal } from "./FeedbackModal";

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
      loadConversations();
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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0A2540] hover:bg-[#16385C] text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
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
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Messages Scrollable View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto my-auto text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#0A2540] flex items-center justify-center text-white mx-auto shadow-xl">
                <Bot className="w-8 h-8 text-amber-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  How can BIS SmartAssist help you today?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                  Ask any question about Indian Standards, certification requirements, lab testing, or hallmarking procedures.
                </p>
              </div>

              {/* Sample Questions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left text-xs pt-2">
                {sampleQuestions.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-700 transition-all text-xs font-medium flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 flex-shrink-0" />
                  </button>
                ))}
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
                  <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-amber-400 flex items-center justify-center flex-shrink-0 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0A2540] text-white shadow-md ml-12"
                      : "bg-white border border-slate-200/90 text-slate-800 shadow-sm"
                  }`}
                >
                  {/* Markdown Body */}
                  <div className="prose prose-sm max-w-none text-slate-800 prose-headings:font-bold prose-headings:text-blue-950 prose-a:text-blue-600 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5">
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
                          <SourceCard key={i} source={src} index={i} />
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
              <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-amber-400 flex items-center justify-center flex-shrink-0 shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 max-w-md">
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about Indian Standards, certification, testing, hallmarking or BIS services..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none placeholder-slate-400 text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  inputText.trim() && !isLoading
                    ? "bg-[#0A2540] hover:bg-[#16385C] text-amber-400 shadow"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to send. Supports English, हिन्दी, and मराठी.</span>
              <span className="font-mono">SIH26107 Grounded Prototype</span>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
};
