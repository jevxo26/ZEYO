"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { BANGLADESH_ZONES, EVENT_TYPES } from "@/lib/calculatorData";

export function Hero() {
  const [selectedZone, setSelectedZone] = useState("dhaka");
  const [selectedEvent, setSelectedEvent] = useState("wedding");

  return (
    <section className="relative flex min-h-[620px] w-full items-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/hero-bg.jpg"
        alt="ZEYO Grand Celebration"
        fill
        priority
        className="object-cover"
      />

      {/* Black gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-slate-900/75" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Managed Multi-Vendor Event Operating System</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Plan, Customize & Calculate Your{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Dream Event
              </span>{" "}
              in Minutes.
            </h1>

            <p className="mt-4 text-base text-slate-300 sm:text-lg max-w-xl leading-relaxed">
              No calling dozens of vendors. Select your city and celebration type,
              customize individual services, and get instant transparent BDT pricing.
              ZEYO manages all professional background vendors for guaranteed quality.
            </p>

            {/* Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Zone-Based Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Live Real-Time Budget
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Zero Vendor Haggling
              </span>
            </div>
          </div>

          {/* Right Hero Interactive Selector Card — desktop/tablet only, mobile uses the inline calculator in CustomBudgetBanner */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-200 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Start Planning Now</span>
              </div>

              <div className="space-y-4">
                {/* Zone Select */}
                <div>
                  <label
                    htmlFor="hero-zone"
                    className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    Select Event Zone (City)
                  </label>
                  <select
                    id="hero-zone"
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                  >
                    {BANGLADESH_ZONES.map((zone) => (
                      <option
                        key={zone.id}
                        value={zone.id}
                        className="bg-black text-white font-medium"
                      >
                        {zone.name} (
                        {zone.priceMultiplier === 1.0
                          ? "Standard Rate"
                          : `${zone.priceMultiplier > 1 ? "+" : ""}${Math.round(
                              (zone.priceMultiplier - 1) * 100
                            )}% Rate`}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Type Select */}
                <div>
                  <label
                    htmlFor="hero-event"
                    className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Select Event Type
                  </label>
                  <select
                    id="hero-event"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                  >
                    {EVENT_TYPES.map((evt) => (
                      <option
                        key={evt.id}
                        value={evt.id}
                        className="bg-black text-white font-medium"
                      >
                        {evt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CTAs */}
                <div className="pt-2 space-y-3">
                  <Link
                    href={`/calculator?zone=${selectedZone}&event=${selectedEvent}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-black/50 transition-all"
                  >
                    <Calculator className="h-4 w-4" />
                    Try Smart Event Calculator
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>

                  <Link
                    href={`/packages?zone=${selectedZone}&event=${selectedEvent}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    Browse Pre-Made Packages
                  </Link>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-center text-slate-300">
                ⚡ Over 1,200+ events successfully managed in Bangladesh
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}