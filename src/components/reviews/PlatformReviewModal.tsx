"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, CheckCircle2, MessageSquare, X, HeartHandshake } from "lucide-react";

interface PlatformReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference?: string;
  eventName?: string;
  onSubmitted?: () => void;
}

export default function PlatformReviewModal({
  isOpen,
  onClose,
  bookingReference = "EVENTO-2026",
  eventName = "Your Celebrated Event",
  onSubmitted,
}: PlatformReviewModalProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [bookingProcessRating, setBookingProcessRating] = useState(5);
  const [serviceQualityRating, setServiceQualityRating] = useState(5);
  const [supportTeamRating, setSupportTeamRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Post to our reviews / audit endpoint
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference,
          eventName,
          overallRating,
          bookingProcessRating,
          serviceQualityRating,
          supportTeamRating,
          comment,
          reviewTarget: "EVENTO_PLATFORM", // explicitly platform review
        }),
      }).catch(() => null);

      setIsSuccess(true);
      if (onSubmitted) onSubmitted();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-indigo-100">
              <HeartHandshake className="w-3.5 h-3.5" />
              EVENTO Platform Review
            </span>
            <h3 className="text-lg font-extrabold mt-1">
              How was your EVENTO experience?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your review helps EVENTO continually elevate our managed multi-vendor
              operating standards across Bangladesh.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Managed Event OS reminder */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-indigo-950 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>You are reviewing the EVENTO Platform.</strong> Customers
                do not rate individual vendors. Your rating evaluates EVENTO&apos;s
                booking transparency, supervision, and end-to-end service quality.
              </span>
            </div>

            {/* Rating sliders / stars */}
            <div className="space-y-3">
              <RatingRow
                label="Overall Platform Experience"
                rating={overallRating}
                onChange={setOverallRating}
              />
              <RatingRow
                label="Booking & Calculation Process"
                rating={bookingProcessRating}
                onChange={setBookingProcessRating}
              />
              <RatingRow
                label="Managed Service Quality"
                rating={serviceQualityRating}
                onChange={setServiceQualityRating}
              />
              <RatingRow
                label="EVENTO Support & Coordination"
                rating={supportTeamRating}
                onChange={setSupportTeamRating}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                Additional Comments or Suggestions
              </label>
              <textarea
                rows={3}
                placeholder="Share details about how EVENTO managed your event celebration..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Platform Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function RatingRow({
  label,
  rating,
  onChange,
}: {
  label: string;
  rating: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-4 h-4 ${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
