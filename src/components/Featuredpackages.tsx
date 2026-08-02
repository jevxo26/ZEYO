"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ImageOff, PackageSearch, Sparkles } from "lucide-react";
import type { EventPackage } from "@/types/package";

// TODO: point this at your real endpoint if it differs, e.g.
// `${process.env.NEXT_PUBLIC_API_URL}/api/packages?featured=true&limit=3`
const FEATURED_PACKAGES_ENDPOINT = "/api/packages?featured=true&limit=3";

function normalizePackageItem(raw: Record<string, unknown>): EventPackage {
  const packageCategory = raw.packageCategory as { name?: unknown } | undefined;
  const packageSubCategory = raw.packageSubCategory as
    | { name?: unknown }
    | undefined;
  const event = raw.event as { name?: unknown } | undefined;
  const pricings = raw.pricings as
    | Array<{
        finalPrice?: unknown;
        currency?: unknown;
      }>
    | undefined;
  const setting = raw.setting as { isFeatured?: unknown } | undefined;

  const included = Array.from(
    new Set(
      Array.isArray(raw.included)
        ? raw.included.filter(
            (item): item is string => typeof item === "string",
          )
        : [
            typeof packageCategory?.name === "string"
              ? String(packageCategory.name)
              : undefined,
            typeof packageSubCategory?.name === "string"
              ? String(packageSubCategory.name)
              : undefined,
            typeof event?.name === "string" ? String(event.name) : undefined,
          ].filter((item): item is string => Boolean(item)),
    ),
  );

  const price = Number(
    raw.activePrice ??
      raw.startingPrice ??
      raw.price ??
      pricings?.[0]?.finalPrice ??
      0,
  );

  return {
    id: Number(raw.id ?? 0),
    title: String(raw.name ?? raw.title ?? `Package ${raw.id ?? ""}`),
    subtitle: typeof raw.description === "string" ? raw.description : undefined,
    price: Number.isFinite(price) ? price : 0,
    currency:
      typeof pricings?.[0]?.currency === "string"
        ? String(pricings[0].currency)
        : typeof raw.currency === "string"
          ? raw.currency
          : "BDT",
    imageUrl:
      typeof raw.thumbnail === "string"
        ? raw.thumbnail
        : typeof raw.banner === "string"
          ? raw.banner
          : typeof raw.imageUrl === "string"
            ? raw.imageUrl
            : undefined,
    included,
    popular: Boolean(setting?.isFeatured ?? raw.popular),
    tier: typeof raw.tier === "string" ? raw.tier : undefined,
    maxGuests: typeof raw.maxGuests === "number" ? raw.maxGuests : undefined,
  };
}

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="h-52 w-full bg-slate-100" />
      <div className="space-y-3 p-7">
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
        <div className="h-11 w-full rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

function FeaturedCard({ pkg }: { pkg: EventPackage }) {
  const title = pkg.title ?? "Package";
  const price = pkg.price ?? 0;
  const currency = pkg.currency ?? "BDT";
  const included = pkg.included ?? [];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-100">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {pkg.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {/* subtle gradient at image bottom for depth */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {pkg.popular && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-amber-400 shadow-lg shadow-black/30">
            <Sparkles className="h-3 w-3" />
            Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        <p className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            {price.toLocaleString("en-BD")}
          </span>
          <span className="text-xs font-semibold text-amber-600">
            {currency}
          </span>
          <span className="text-xs font-medium text-slate-400">Starting</span>
        </p>

        <div className="mt-1 h-px w-full bg-slate-100" />

        <ul className="mt-4 space-y-2.5">
          {included.slice(0, 4).map((item, index) => (
            <li
              key={`${pkg.id}-${item}-${index}`}
              className="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Check className="h-2.5 w-2.5 text-amber-700" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/packages/${pkg.id}`}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-black group-hover:gap-3"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export function FeaturedPackages() {
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
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
        const rawList = Array.isArray(payload) ? payload : (payload.data ?? []);
        const list: EventPackage[] = Array.isArray(rawList)
          ? rawList.map((item) =>
              normalizePackageItem(item as Record<string, unknown>),
            )
          : [];

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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Curated for You
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured Planning Packages
            </h2>
            <p className="mt-2 max-w-lg text-slate-500">
              Pre-negotiated rates with top-tier vendors to provide you with the
              best value without compromising on luxury.
            </p>
          </div>

          <Link
            href="/packages"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors hover:text-amber-700"
          >
            View All Packages
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
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
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
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