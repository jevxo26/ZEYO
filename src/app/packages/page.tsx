"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ImageOff,
  PackageSearch,
  ShieldCheck,
  Receipt,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useDynamicPackages } from "@/hooks/useDynamicPackages";
import { EventPackage } from "@/types/package";
import { EVENT_TYPES } from "@/lib/calculatorData";

function PackageCard({ pkg }: { pkg: EventPackage }) {
  const eventType = EVENT_TYPES.find(e => e.id === pkg.eventTypeId);
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
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
        
        {pkg.popular && (
          <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            Most Popular
          </div>
        )}
        {pkg.discountPercentage > 0 && (
          <div className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            Save {pkg.discountPercentage}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4" /> {eventType?.name || "Event Package"}
          </p>
          <h3 className="font-display-evento text-2xl font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p className="mt-2.5 line-clamp-3 text-sm text-slate-500 leading-relaxed">
              {pkg.subtitle}
            </p>
          )}
        </div>

        <div className="mb-8 flex-1 space-y-2.5">
          {pkg.configuredServices.slice(0, 4).map((cs, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="line-clamp-1 capitalize">{cs.serviceKey.replace("-", " ")}</span>
            </div>
          ))}
          {pkg.configuredServices.length > 4 && (
            <div className="flex items-center gap-3 text-sm text-slate-400 italic">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              <span>+ {pkg.configuredServices.length - 4} more premium services</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Starting From
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  BDT {pkg.basePrice.toLocaleString()}
                </span>
              </div>
            </div>
            
            <Link
              href={`/calculator?packageId=${pkg.id}`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const packages = useDynamicPackages();
  const [selectedEventType, setSelectedEventType] = useState<string>("all");

  const filteredPackages = selectedEventType === "all" 
    ? packages 
    : packages.filter(p => p.eventTypeId === selectedEventType);

  return (
    <>
      <Navbar />

      <section className="bg-slate-50 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display-evento text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Curated Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Packages</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Explore our expertly curated event bundles. Select a package to customize guest counts, add-ons, and finalize your booking instantly.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800">
              <ShieldCheck className="h-4 w-4" />
              100% Escrow Protected
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-800">
              <BadgeCheck className="h-4 w-4" />
              Pre-vetted EVENTO Vendors
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              <Receipt className="h-4 w-4" />
              Transparent Pricing
            </span>
          </div>

          <div className="mt-16 flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-indigo-600" /> Filter by Event
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedEventType("all")}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      selectedEventType === "all" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All Events
                  </button>
                  {EVENT_TYPES.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => setSelectedEventType(evt.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        selectedEventType === evt.id ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {evt.name}
                    </button>
                  ))}
                </div>
              </div>
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
                  {filteredPackages.map((pkg) => (
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