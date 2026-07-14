"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ImageOff, PackageSearch } from "lucide-react";
import type { EventPackage } from "@/types/package";

// TODO: point this at your real endpoint if it differs, e.g.
// `${process.env.NEXT_PUBLIC_API_URL}/api/packages?featured=true&limit=3`
const FEATURED_PACKAGES_ENDPOINT = "/api/packages?featured=true&limit=3";

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-48 w-full bg-slate-100" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-9 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

function FeaturedCard({ pkg }: { pkg: EventPackage }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full bg-slate-100">
        {pkg.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {pkg.popular && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-slate-900">{pkg.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {pkg.price.toLocaleString("en-BD")}{" "}
          <span className="font-normal text-slate-400">
            {pkg.currency} / Starting
          </span>
        </p>

        <ul className="mt-4 space-y-1.5">
          {pkg.included.slice(0, 4).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/packages/${pkg.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-violet-300 hover:text-violet-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export function FeaturedPackages() {
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      setStatus("loading");
      try {
        const res = await fetch(FEATURED_PACKAGES_ENDPOINT, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        const list: EventPackage[] = Array.isArray(payload)
          ? payload
          : (payload.data ?? []);

        if (!cancelled) {
          setPackages(list);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load featured packages", err);
        if (!cancelled) setStatus("error");
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured Planning Packages
            </h2>
            <p className="mt-2 max-w-lg text-slate-500">
              Pre-negotiated rates with top-tier vendors to provide you with
              the best value without compromising on luxury.
            </p>
          </div>

          <Link
            href="/packages"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            View All Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12">
          {status === "loading" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
              <PackageSearch className="mb-3 h-9 w-9 text-slate-300" />
              <p className="font-semibold text-slate-900">
                Couldn&apos;t load packages
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Please refresh or try again shortly.
              </p>
            </div>
          )}

          {status === "ready" && packages.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
              <PackageSearch className="mb-3 h-9 w-9 text-slate-300" />
              <p className="font-semibold text-slate-900">No packages yet</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Featured packages will show up here as soon as they&apos;re
                added.
              </p>
            </div>
          )}

          {status === "ready" && packages.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <FeaturedCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}