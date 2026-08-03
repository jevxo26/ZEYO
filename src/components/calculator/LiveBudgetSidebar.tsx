"use client";

import React, { useState } from "react";
import {
  ConfiguredServiceState,
} from "@/types/calculator";
import {
  Calculator,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface LiveBudgetSidebarProps {
  zoneName: string;
  zoneMultiplier: number;
  eventTypeName: string;
  configurations: Record<string, ConfiguredServiceState>;
  onProceed: () => void;
  canProceed: boolean;
  proceedLabel?: string;
}

export default function LiveBudgetSidebar({
  zoneName,
  zoneMultiplier,
  eventTypeName,
  configurations,
  onProceed,
  canProceed,
  proceedLabel = "Proceed to Booking",
}: LiveBudgetSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const configList = Object.values(configurations);
  const totalEstimatedCost = configList.reduce(
    (sum, c) => sum + (c.calculatedPrice || 0),
    0
  );

  return (
    <>
      {/* 1. Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative bg-black p-6 text-white overflow-hidden">
            <div
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.35), rgba(251,146,60,0.35))",
              }}
            />
            <div className="relative flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm border border-amber-500/20">
                <Calculator className="w-3.5 h-3.5" />
                Live Budget
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                {zoneName}
              </span>
            </div>

            <p className="relative text-xs text-slate-300">{eventTypeName} Event</p>
            <div className="relative mt-3">
              <span className="block text-xs font-medium text-slate-300">
                Estimated Total
              </span>
              <span className="text-3xl font-extrabold tracking-tight">
                ৳{totalEstimatedCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Itemized Services Breakdown */}
          <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
            {configList.length === 0 ? (
              <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-sm">
                No services configured yet. Select services to see your live estimate.
              </div>
            ) : (
              configList.map((cfg) => (
                <div
                  key={cfg.serviceKey}
                  className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {cfg.serviceName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {cfg.tierName} •{" "}
                      {cfg.guestCount > 1
                        ? `${cfg.guestCount} guests`
                        : cfg.coverageName}
                    </p>
                    {cfg.selectedAddons.length > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        +{cfg.selectedAddons.length} Add-ons
                      </p>
                    )}
                  </div>

                  <span className="font-bold text-sm text-slate-900 dark:text-white shrink-0">
                    ৳{cfg.calculatedPrice.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Managed Event OS Assurance */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Managed quality. No vendor haggle.</span>
          </div>

          {/* Action CTA */}
          <div className="p-5 border-t border-slate-200/60 dark:border-white/10 bg-white dark:bg-black/40">
            <button
              type="button"
              disabled={!canProceed}
              onClick={onProceed}
              className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all ${
                canProceed
                  ? "text-black hover:opacity-90 shadow-amber-500/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
              style={
                canProceed
                  ? { background: "linear-gradient(135deg, #F59E0B, #FB923C)" }
                  : undefined
              }
            >
              {proceedLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mobile Collapsible Floating Bar */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 shadow-2xl">
        {mobileExpanded && (
          <div className="p-4 max-h-72 overflow-y-auto border-b border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Itemized Breakdown ({configList.length})</span>
              <span>{zoneName} Rate</span>
            </div>

            {configList.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">
                No services selected yet.
              </p>
            ) : (
              configList.map((cfg) => (
                <div
                  key={cfg.serviceKey}
                  className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-white/10 last:border-0"
                >
                  <span className="font-semibold truncate pr-2 text-slate-800 dark:text-slate-200">
                    {cfg.serviceName}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ৳{cfg.calculatedPrice.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex items-center gap-2 text-left min-w-0"
          >
            <div>
              <span className="block text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Total Budget
                {mobileExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                ৳{totalEstimatedCost.toLocaleString()}
              </span>
            </div>
          </button>

          <button
            type="button"
            disabled={!canProceed}
            onClick={onProceed}
            className={`inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm shadow-md shrink-0 transition-all ${
              canProceed
                ? "text-black"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
            style={
              canProceed
                ? { background: "linear-gradient(135deg, #F59E0B, #FB923C)" }
                : undefined
            }
          >
            {proceedLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}