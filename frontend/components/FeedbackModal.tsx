"use client";

import React, { useState } from "react";
import "../app/footer.css";
import { ThumbsUp, ThumbsDown, CheckCircle, AlertCircle, X } from "lucide-react";
import { submitFeedback } from "../lib/api";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  query?: string;
  answer?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  messageId,
  query,
  answer,
}) => {
  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback(messageId, rating, comment, query, answer);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800">
        <div className="bg-slate-50 text-slate-900 p-5 flex items-center justify-between border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Feedback on AI Response</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Thank You!</h4>
            <p className="text-xs text-slate-500">Your feedback helps improve MANAKAI retrieval accuracy.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Rating</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRating(1)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition ${
                    rating === 1
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Accurate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRating(-1)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition ${
                    rating === -1
                      ? "bg-red-50 border-red-300 text-red-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                  <span>Needs Fix</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Technical Feedback / Discrepancy details
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention any missing clauses, incorrect tolerances, or citation mismatches..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

