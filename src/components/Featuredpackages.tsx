"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ImageOff, PackageSearch } from "lucide-react";
import { useDynamicPackages } from "@/hooks/useDynamicPackages";
import { EventPackage } from "@/types/package";
import { EVENT_TYPES } from "@/lib/calculatorData";

function FeaturedCard({ pkg }: { pkg: EventPackage }) {
  const eventType = EVENT_TYPES.find(e => e.id === pkg.eventTypeId);
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {pkg.imageUrl ? (
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-10 w-10 opacity-50" />
          </div>
        )}
        
        {pkg.popular && (
          <div className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            Popular
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            {eventType?.name || "Event Package"}
          </p>
          <h3 className="font-display-evento text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 leading-relaxed">
              {pkg.subtitle}
            </p>
          )}
        </div>

        <div className="mb-6 flex-1 space-y-2">
          {pkg.configuredServices.slice(0, 3).map((cs, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span className="line-clamp-1">{cs.serviceKey.replace("-", " ")}</span>
            </div>
          ))}
          {pkg.configuredServices.length > 3 && (
            <div className="flex items-center gap-2 text-sm text-slate-400 italic">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              <span>+ {pkg.configuredServices.length - 3} more services</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Starting From
              </p>
              <div className="flex items-end gap-1">
                <span className="text-lg font-bold text-slate-900">
                  BDT {pkg.basePrice.toLocaleString()}
                </span>
              </div>
            </div>
            
            <Link
              href={`/calculator?packageId=${pkg.id}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedPackages() {
  const allPackages = useDynamicPackages();
  const featured = allPackages.filter(p => p.popular).slice(0, 3);
  const packagesToDisplay = featured.length > 0 ? featured : allPackages.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center p-2 mb-6 rounded-2xl bg-indigo-100/50 text-indigo-600">
            <PackageSearch className="w-6 h-6" />
          </div>
          <h2 className="font-display-evento text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
            Curated Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Packages</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Choose from our expertly crafted, fully customizable event bundles. Everything you need, perfectly orchestrated by the EVENTO team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packagesToDisplay.map((pkg) => (
            <FeaturedCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-md hover:ring-slate-300"
          >
            Explore All Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
