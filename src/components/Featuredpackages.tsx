"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { useDynamicPackages } from "@/hooks/useDynamicPackages";
import type { EventPackage } from "@/types/package";

function FeaturedCard({ pkg }: { pkg: EventPackage }) {
  const price = pkg.price ?? pkg.basePrice ?? 0;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
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
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1 text-xs font-bold text-black shadow-md">
            ⭐ Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{pkg.title}</h3>
        <p className="mt-1.5 text-base font-extrabold text-amber-600">
          ৳{price.toLocaleString("en-BD")}{" "}
          <span className="text-xs font-medium text-slate-400">BDT / Starting</span>
        </p>

        <ul className="mt-4 space-y-2 flex-1">
          {(pkg.included || [
            "Full Event Photography",
            "Cinematic Film",
            "Stage Decor",
          ])
            .slice(0, 4)
            .map((item, index) => (
              <li
                key={`${pkg.id}-${item}-${index}`}
                className="flex items-start gap-2 text-xs font-medium text-slate-600"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
        </ul>

        <Link
          href={`/packages/${pkg.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition-all hover:border-amber-400 hover:bg-amber-500 hover:text-black shadow-sm"
        >
          View Details & Customize
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedPackages() {
  const dynamicPackages = useDynamicPackages();
  const featuredList = dynamicPackages.slice(0, 3);

  return (
    <section className="bg-slate-50/50 py-20 px-6 sm:px-10 border-t border-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured Planning Packages
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              Pre-negotiated rates with top-tier vendors to provide you with the best value without compromising on luxury.
            </p>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
          >
            View All Packages <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredList.map((pkg) => (
            <FeaturedCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}