"use client";

import React from "react";
import { BANGLADESH_ZONES, EVENT_TYPES } from "@/lib/calculatorData";
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  GlassWater,
  Sparkles,
  Cake,
  Briefcase,
  Sun,
  Award,
  Check,
} from "lucide-react";

interface ZoneAndEventSelectorProps {
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
  selectedEventTypeId: string;
  onSelectEventType: (eventTypeId: string) => void;
  eventDate: string;
  onChangeDate: (date: string) => void;
  guestCount: number;
  onChangeGuestCount: (count: number) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-5 h-5 text-pink-500" />,
  GlassWater: <GlassWater className="w-5 h-5 text-indigo-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Cake: <Cake className="w-5 h-5 text-fuchsia-500" />,
  Briefcase: <Briefcase className="w-5 h-5 text-blue-500" />,
  Users: <Users className="w-5 h-5 text-emerald-500" />,
  Sun: <Sun className="w-5 h-5 text-yellow-500" />,
  Award: <Award className="w-5 h-5 text-purple-500" />,
};

export default function ZoneAndEventSelector({
  selectedZoneId,
  onSelectZone,
  selectedEventTypeId,
  onSelectEventType,
  eventDate,
  onChangeDate,
  guestCount,
  onChangeGuestCount,
}: ZoneAndEventSelectorProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Zone Selection */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Where is your event taking place?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pricing adjusts automatically according to zone-based rates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
          {BANGLADESH_ZONES.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelectZone(zone.id)}
                className={`group relative flex flex-col items-center justify-center gap-2.5 min-h-[108px] px-5 py-5 rounded-xl border text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
                <span className="font-semibold text-sm sm:text-base leading-snug whitespace-nowrap pr-1">
                  {zone.name}
                </span>
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none whitespace-nowrap ${
                    zone.priceMultiplier === 1.0
                      ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      : zone.priceMultiplier > 1
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  }`}
                >
                  {zone.priceMultiplier === 1.0
                    ? "Standard Rate"
                    : `${zone.priceMultiplier > 1 ? "+" : ""}${Math.round(
                        (zone.priceMultiplier - 1) * 100
                      )}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Event Type Selection */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              2. What type of event are you planning?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We&apos;ll tailor recommended services and packages for your celebration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {EVENT_TYPES.map((evt) => {
            const isSelected = selectedEventTypeId === evt.id;
            return (
              <button
                key={evt.id}
                type="button"
                onClick={() => onSelectEventType(evt.id)}
                className={`group flex flex-col min-h-[148px] p-5 sm:p-6 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/90 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Icon + selection indicator row — never collides with text below */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {iconMap[evt.icon] || <Sparkles className="w-5 h-5 text-purple-500" />}
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shrink-0">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Title + description flow naturally underneath, full width */}
                <div className="mt-4 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-snug break-words">
                    {evt.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed break-words">
                    {evt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Event Date & Guest Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <label
              htmlFor="eventDate"
              className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base"
            >
              Tentative Event Date
            </label>
          </div>
          <input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <label
              htmlFor="guestCount"
              className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base"
            >
              Estimated Guest Count
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="guestCount"
              type="number"
              min={10}
              max={10000}
              step={10}
              value={guestCount}
              onChange={(e) => onChangeGuestCount(Math.max(10, Number(e.target.value) || 100))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0">
              Guests
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}