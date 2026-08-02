"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, MapPin, Sparkles } from "lucide-react";
import { BANGLADESH_ZONES, EVENT_TYPES } from "@/lib/calculatorData";

interface CustomBudgetBannerProps {
  onOpenCalculator?: () => void;
}

export default function CustomBudgetBanner({
  onOpenCalculator,
}: CustomBudgetBannerProps) {
  const [selectedZone, setSelectedZone] = useState("dhaka");
  const [selectedEvent, setSelectedEvent] = useState("wedding");

  return (
    <Card className="mx-4 my-6 sm:mx-8 sm:my-8 border-0 bg-gradient-to-br from-black via-slate-900 to-black text-card-foreground ring-1 ring-white/10 shadow-lg shadow-black/40">
      <CardContent className="flex flex-col gap-6">
        {/* Top row: copy + desktop CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              Need a custom budget?
            </CardTitle>
            <CardDescription className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Use our Smart Event Calculator to get an instant estimate for
              your specific guest count, menu preferences, and decor
              requirements.
            </CardDescription>
          </div>

          {/* Desktop / tablet CTA — hidden on mobile since the inline calculator below replaces it */}
          <CardAction className="hidden sm:block">
            <Link href="/calculator">
              <Button
                size="lg"
                onClick={onOpenCalculator}
                className="bg-amber-500 text-black hover:bg-amber-400 font-bold focus-visible:ring-amber-400/50 shadow-md"
              >
                Open Smart Calculator
              </Button>
            </Link>
          </CardAction>
        </div>

        {/* Mobile-only inline calculator, mirrors the Hero selector */}
        <div className="block sm:hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Start Planning Now</span>
          </div>

          <div className="space-y-4">
            {/* Zone Select */}
            <div>
              <label
                htmlFor="banner-zone"
                className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-300"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                Select Event Zone (City)
              </label>
              <select
                id="banner-zone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                htmlFor="banner-event"
                className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Select Event Type
              </label>
              <select
                id="banner-event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400"
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

            {/* CTA */}
            <Link
              href={`/calculator?zone=${selectedZone}&event=${selectedEvent}`}
              onClick={onOpenCalculator}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-black/50 transition-all hover:bg-amber-400"
            >
              <Calculator className="h-4 w-4" />
              Open Smart Calculator
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}