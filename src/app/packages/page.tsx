"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { EventPackage } from "@/types/package";
import apiClient from "@/lib/apiClient";

// TODO: point this at your real endpoint if it differs
const PACKAGES_ENDPOINT = "/packages";

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

const TIERS = ["Basic", "Standard", "Premium", "Luxury"] as const;
type Tier = (typeof TIERS)[number];

const MIN_GUESTS = 100;
const MAX_GUESTS = 1000;

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-44 w-full bg-slate-100" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-9 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: EventPackage }) {
  const isPopular = !!pkg.popular;
  const title = pkg.title ?? "Package";
  const price = pkg.price ?? 0;
  const currency = pkg.currency ?? "BDT";
  const included = pkg.included ?? [];

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isPopular
          ? "border-transparent shadow-md ring-2 ring-violet-400/60 bg-gradient-to-b from-violet-50/40 to-white"
          : "border-slate-200 shadow-sm"
      }`}
    >
      <div className="relative h-44 w-full bg-slate-100">
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
        {isPopular && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Most Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {pkg.subtitle && (
          <p className="mt-1 text-sm text-violet-700">{pkg.subtitle}</p>
        )}

        <p className="mt-3 flex items-baseline gap-1.5">
          <span className="bg-gradient-to-r from-violet-700 to-blue-700 bg-clip-text text-2xl font-bold text-transparent">
            {price.toLocaleString("en-BD")}
          </span>
          <span className="text-sm font-medium text-slate-400">{currency}</span>
        </p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          What&apos;s Included
        </p>
        <ul className="mt-2 space-y-1.5">
          {included.slice(0, 4).map((item, index) => (
            <li
              key={`${pkg.id}-${item}-${index}`}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/packages/${pkg.id}`}
          className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
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

const Page = () => {
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  const [selectedTiers, setSelectedTiers] = useState<Tier[]>([
    "Basic",
    "Standard",
    "Premium",
  ]);
  const [guestCount, setGuestCount] = useState(500);

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setStatus("loading");
      try {
        const res = await apiClient.get(PACKAGES_ENDPOINT);
        const payload = res.data;
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
        console.error("Failed to load packages", err);
        if (!cancelled) setStatus("error");
      }
    }

    loadPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTier = (tier: Tier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier],
    );
  };

  const resetFilters = () => {
    setSelectedTiers(["Basic", "Standard", "Premium"]);
    setGuestCount(500);
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const tierOk = pkg.tier ? selectedTiers.includes(pkg.tier as Tier) : true;
      const guestsOk = pkg.maxGuests ? pkg.maxGuests >= guestCount : true;
      return tierOk && guestsOk;
    });
  }, [packages, selectedTiers, guestCount]);

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
              Pre-vetted Vendors
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
                  Package Tier
                </p>
                <div className="mt-3 space-y-2.5">
                  {TIERS.map((tier) => (
                    <label
                      key={tier}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTiers.includes(tier)}
                        onChange={() => toggleTier(tier)}
                        className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
                      />
                      {tier}
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

            {/* Package Grid */}
            <div>
              {status === "loading" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                  <PackageSearch className="mb-3 h-9 w-9 text-slate-300" />
                  <p className="font-semibold text-slate-900">
                    Couldn&apos;t load packages
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Please refresh or try again shortly.
                  </p>
                </div>
              )}

              {status === "ready" && filteredPackages.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                  <PackageSearch className="mb-3 h-9 w-9 text-slate-300" />
                  <p className="font-semibold text-slate-900">
                    No packages match your filters
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-slate-500">
                    Try adjusting the tier or guest count on the left.
                  </p>
                </div>
              )}

              {status === "ready" && filteredPackages.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
};

export default Page;
