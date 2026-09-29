"use client";

import React, { useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-slate-800">
        <div className="bg-[#0A2540] text-white p-4 flex items-center justify-between">
          <h3 className="font-bold text-sm">Feedback on AI Response</h3>
          <button onClick={onClose} className="p-1 rounded text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-slate-800 text-sm">Thank You!</h4>
            <p className="text-xs text-slate-500">Your feedback helps improve BIS SmartAssist retrieval accuracy.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-2">Was this answer accurate & helpful?</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRating(1)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                    rating === 1
                      ? "bg-emerald-50 text-emerald-800 border-emerald-500 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes, Helpful</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRating(-1)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                    rating === -1
                      ? "bg-rose-50 text-rose-800 border-rose-500 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Needs Improvement</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Additional Comments or Specific Clause Correction (Optional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention any missing standard, inaccurate clause, or improvement suggestion..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
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
