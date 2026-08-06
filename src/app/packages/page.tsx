"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ImageOff,
  PackageSearch,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useDynamicPackages } from "@/hooks/useDynamicPackages";
import { EventPackage } from "@/types/package";
import { EVENT_TYPES } from "@/lib/calculatorData";

function PackageCard({ pkg }: { pkg: EventPackage }) {
  const isPopular = pkg.popular;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isPopular
          ? "border-transparent shadow-md ring-2 ring-violet-400/60"
          : "border-slate-200 shadow-sm hover:border-violet-200"
      }`}
    >
      {/* Shorter, fixed-ratio image so the card never stretches tall */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {pkg.imageUrl ? (
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-12 w-12 opacity-50" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        {isPopular && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Most Popular
          </span>
        )}
        {pkg.discountPercentage > 0 && (
          <div className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            Save {pkg.discountPercentage}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-semibold leading-snug text-slate-900">
          {pkg.title}
        </h3>
        {pkg.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
            {pkg.subtitle}
          </p>
        )}

        <div className="mt-2.5 flex items-end justify-between">
          <p className="flex items-baseline gap-1">
            <span className="bg-gradient-to-r from-violet-700 to-blue-700 bg-clip-text text-xl font-bold text-transparent">
              {(pkg.price ?? pkg.basePrice ?? 0).toLocaleString("en-BD")}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {pkg.currency || "BDT"}
            </span>
          </p>
          {pkg.maxGuests && (
            <span className="text-[11px] font-medium text-slate-400">
              Up to {pkg.maxGuests} guests
            </span>
          )}
        </div>

        {(pkg.included || []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(pkg.included || []).slice(0, 3).map((item, index) => (
              <span
                key={`${pkg.id}-${item}-${index}`}
                className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50/70 px-2 py-0.5 text-[10.5px] font-medium text-violet-700"
              >
                <BadgeCheck className="h-3 w-3 shrink-0" />
                <span className="max-w-[9rem] truncate">{item}</span>
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/packages/${pkg.id}`}
          className={`mt-3.5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            isPopular
              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm hover:from-violet-700 hover:to-blue-700"
              : "border border-slate-300 text-slate-800 hover:border-violet-400 hover:text-violet-800"
          }`}
        >
          {isPopular ? "View Details & Customize" : "View Details"}
        </Link>
      </div>
    </div>
  );
}

const MIN_GUESTS = 0;
const MAX_GUESTS = 500;

export default function PackagesPage() {
  const packages = useDynamicPackages();
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [guestCount, setGuestCount] = useState<number>(MAX_GUESTS);

  const filteredPackages = useMemo(() => {
    return packages.filter((p: EventPackage) => {
      const pEventType = p.eventTypeId?.replace("evt-type-", "") || "";
      const matchesEventType =
        selectedEventType === "all" || pEventType === selectedEventType;
      const matchesGuests = !p.maxGuests || p.maxGuests >= guestCount || guestCount === MAX_GUESTS;
      return matchesEventType && matchesGuests;
    });
  }, [packages, selectedEventType, guestCount]);

  function resetFilters() {
    setSelectedEventType("all");
    setGuestCount(MAX_GUESTS);
  }

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-slate-50/60 px-6 py-16 sm:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute -top-10 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <h1 className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Available Packages for Your Event
          </h1>
          <p className="mt-2 text-slate-500">
            Curated wedding experiences in Dhaka.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-800">
              <ShieldCheck className="h-4 w-4" />
              100% Escrow Protected
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-800">
              <BadgeCheck className="h-4 w-4" />
              Pre-vetted EVENTO Vendors
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-800">
              <Receipt className="h-4 w-4" />
              Transparent Pricing
            </span>
          </div>

          {/* Content: filters + grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            {/* Filters */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">
                Filters
              </h2>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Event Type
                </p>
                <div className="mt-3 space-y-2.5">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="eventType"
                      checked={selectedEventType === "all"}
                      onChange={() => setSelectedEventType("all")}
                      className="h-4 w-4 border-slate-300 text-violet-700 focus:ring-violet-600"
                    />
                    All Events
                  </label>
                  {EVENT_TYPES.map((eventType) => (
                    <label
                      key={eventType.id}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="eventType"
                        checked={selectedEventType === eventType.id}
                        onChange={() => setSelectedEventType(eventType.id)}
                        className="h-4 w-4 border-slate-300 text-violet-700 focus:ring-violet-600"
                      />
                      {eventType.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Guest Count
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{MIN_GUESTS}</span>
                  <span>{MAX_GUESTS}+</span>
                </div>
                <input
                  type="range"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  step={50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="mt-1 w-full accent-violet-700"
                />
                <div className="mt-3 rounded-md bg-gradient-to-r from-violet-50 to-blue-50 px-3 py-2 text-center text-sm font-medium text-violet-800">
                  Selected: ~{guestCount} Guests
                </div>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 w-full rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
              >
                Reset Filters
              </button>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {filteredPackages.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-24 text-center">
                  <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-lg font-bold text-slate-900">
                    No packages match your filters
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try selecting a different event type.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {filteredPackages.map((pkg: EventPackage) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}