"use client";

import React, { useState } from "react";
import {
  CALCULATOR_SERVICES,
  calculateServicePrice,
} from "@/lib/calculatorData";
import {
  ConfiguredServiceState,
  CalculatorServiceDefinition,
} from "@/types/calculator";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Clock,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";

interface ServiceConfiguratorProps {
  selectedKeys: string[];
  configurations: Record<string, ConfiguredServiceState>;
  onUpdateConfiguration: (
    serviceKey: string,
    updates: Partial<ConfiguredServiceState>
  ) => void;
  zoneMultiplier: number;
  globalGuestCount: number;
}

export default function ServiceConfigurator({
  selectedKeys,
  configurations,
  onUpdateConfiguration,
  zoneMultiplier,
  globalGuestCount,
}: ServiceConfiguratorProps) {
  // By default, open the first selected service
  const [openServiceKey, setOpenServiceKey] = useState<string | null>(
    selectedKeys[0] || null
  );

  const selectedServices = CALCULATOR_SERVICES.filter((srv) =>
    selectedKeys.includes(srv.key)
  );

  if (selectedServices.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800/80 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No services selected yet. Please go back to Step 2 and choose at least
          one service.
        </p>
      </div>
    );
  }

  const handleTierSelect = (
    srv: CalculatorServiceDefinition,
    tierId: string
  ) => {
    const tier = srv.tiers.find((t) => t.id === tierId) || srv.tiers[0];
    const currentConfig = configurations[srv.key];
    const guestCount =
      currentConfig?.guestCount || (srv.isPerGuest ? globalGuestCount : 1);
    const coverageId = currentConfig?.selectedCoverageId || srv.coverages[0].id;
    const addonIds = currentConfig?.selectedAddons.map((a) => a.id) || [];

    const newPrice = calculateServicePrice(
      srv,
      tier.id,
      coverageId,
      guestCount,
      addonIds,
      zoneMultiplier
    );

    onUpdateConfiguration(srv.key, {
      selectedTierId: tier.id,
      tierName: tier.name,
      tierPrice: tier.price,
      calculatedPrice: newPrice,
    });
  };

  const handleCoverageSelect = (
    srv: CalculatorServiceDefinition,
    coverageId: string
  ) => {
    const coverage =
      srv.coverages.find((c) => c.id === coverageId) || srv.coverages[0];
    const currentConfig = configurations[srv.key];
    const tierId = currentConfig?.selectedTierId || srv.tiers[0].id;
    const guestCount =
      currentConfig?.guestCount || (srv.isPerGuest ? globalGuestCount : 1);
    const addonIds = currentConfig?.selectedAddons.map((a) => a.id) || [];

    const newPrice = calculateServicePrice(
      srv,
      tierId,
      coverage.id,
      guestCount,
      addonIds,
      zoneMultiplier
    );

    onUpdateConfiguration(srv.key, {
      selectedCoverageId: coverage.id,
      coverageName: coverage.name,
      coverageMultiplier: coverage.multiplier,
      calculatedPrice: newPrice,
    });
  };

  const handleGuestCountChange = (
    srv: CalculatorServiceDefinition,
    guestCount: number
  ) => {
    const currentConfig = configurations[srv.key];
    const tierId = currentConfig?.selectedTierId || srv.tiers[0].id;
    const coverageId = currentConfig?.selectedCoverageId || srv.coverages[0].id;
    const addonIds = currentConfig?.selectedAddons.map((a) => a.id) || [];

    const newPrice = calculateServicePrice(
      srv,
      tierId,
      coverageId,
      guestCount,
      addonIds,
      zoneMultiplier
    );

    onUpdateConfiguration(srv.key, {
      guestCount,
      calculatedPrice: newPrice,
    });
  };

  const handleToggleAddon = (
    srv: CalculatorServiceDefinition,
    addonId: string
  ) => {
    const currentConfig = configurations[srv.key];
    const tierId = currentConfig?.selectedTierId || srv.tiers[0].id;
    const coverageId = currentConfig?.selectedCoverageId || srv.coverages[0].id;
    const guestCount =
      currentConfig?.guestCount || (srv.isPerGuest ? globalGuestCount : 1);
    const currentAddonIds = currentConfig?.selectedAddons.map((a) => a.id) || [];

    const isExisting = currentAddonIds.includes(addonId);
    const newAddonIds = isExisting
      ? currentAddonIds.filter((id) => id !== addonId)
      : [...currentAddonIds, addonId];

    const selectedAddons = srv.addons
      .filter((a) => newAddonIds.includes(a.id))
      .map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        isPerGuest: a.isPerGuest,
      }));

    const newPrice = calculateServicePrice(
      srv,
      tierId,
      coverageId,
      guestCount,
      newAddonIds,
      zoneMultiplier
    );

    onUpdateConfiguration(srv.key, {
      selectedAddons,
      calculatedPrice: newPrice,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {selectedServices.map((srv, idx) => {
        const config = configurations[srv.key];
        const isOpen = openServiceKey === srv.key;

        const currentTierId = config?.selectedTierId || srv.tiers[0].id;
        const currentCoverageId =
          config?.selectedCoverageId || srv.coverages[0].id;
        const currentGuestCount =
          config?.guestCount || (srv.isPerGuest ? globalGuestCount : 1);
        const selectedAddonIds = config?.selectedAddons.map((a) => a.id) || [];
        const servicePrice =
          config?.calculatedPrice ||
          calculateServicePrice(
            srv,
            currentTierId,
            currentCoverageId,
            currentGuestCount,
            selectedAddonIds,
            zoneMultiplier
          );

        return (
          <div
            key={srv.key}
            className={`group/card bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
              isOpen
                ? "border-indigo-200 dark:border-indigo-900/60 shadow-lg shadow-indigo-500/5"
                : "border-slate-200/80 dark:border-slate-800/80 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {/* Header / Accordion trigger */}
            <button
              type="button"
              onClick={() =>
                setOpenServiceKey(isOpen ? null : srv.key)
              }
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shrink-0 shadow-sm shadow-indigo-500/30 transition-transform duration-300 group-hover/card:scale-105">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                      {srv.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Configured
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {config?.tierName || srv.tiers[0].name} •{" "}
                    {srv.isPerGuest
                      ? `${currentGuestCount} Guests`
                      : config?.coverageName || srv.coverages[0].name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                <div className="text-right">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Estimated Cost
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    ৳{servicePrice.toLocaleString()}
                  </span>
                </div>
                <div
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isOpen
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rotate-180"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Body */}
            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-8 border-t border-slate-200/60 dark:border-slate-800/60 pt-6 space-y-8 animate-fadeIn">
                {/* 1. Select Tier */}
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Select Service Tier
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {srv.tiers.map((t) => {
                      const isSelected = currentTierId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleTierSelect(srv, t.id)}
                          className={`group relative flex flex-col justify-between min-h-[136px] p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/40 shadow-md hover:shadow-lg ring-2 ring-indigo-500/20"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-base leading-snug break-words transition-colors group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                                {t.name}
                              </span>
                              {isSelected && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed break-words">
                              {t.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-baseline justify-between gap-2">
                            <span className="text-xs text-slate-400">
                              {srv.isPerGuest ? "Base per guest" : "Base rate"}
                            </span>
                            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                              ৳{t.price.toLocaleString()}
                              {srv.isPerGuest && " / guest"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Coverage or Guest Count */}
                {srv.isPerGuest ? (
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      Guest Count
                    </h5>
                    <div className="flex items-center gap-4 max-w-sm">
                      <input
                        type="number"
                        min={10}
                        max={10000}
                        step={10}
                        value={currentGuestCount}
                        onChange={(e) =>
                          handleGuestCountChange(
                            srv,
                            Math.max(10, Number(e.target.value) || 50)
                          )
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-300 dark:hover:border-purple-700"
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                        Total Guests
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Select Coverage / Duration
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {srv.coverages.map((c) => {
                        const isSelected = currentCoverageId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleCoverageSelect(srv, c.id)}
                            className={`px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white shadow-md hover:shadow-lg hover:bg-indigo-700"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
                            }`}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Add-ons */}
                {srv.addons.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-500" />
                      Optional Add-ons
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {srv.addons.map((a) => {
                        const isChecked = selectedAddonIds.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => handleToggleAddon(srv, a.id)}
                            className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                              isChecked
                                ? "border-emerald-600 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold shadow-sm hover:shadow-md"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm"
                            }`}
                          >
                            <span className="flex items-center gap-2 text-sm font-medium min-w-0">
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded-full shrink-0 transition-colors duration-200 ${
                                  isChecked
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-transparent"
                                }`}
                              >
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                              <span className="truncate">{a.name}</span>
                            </span>
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0 tabular-nums">
                              +৳{a.price.toLocaleString()}
                              {a.isPerGuest ? " / guest" : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}