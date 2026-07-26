"use client";

import React from "react";
import { Plus, Check, Sparkles } from "lucide-react";

export interface PackageAddonItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPerGuest?: boolean;
}

interface PackageAddonSelectorProps {
  addons: PackageAddonItem[];
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string) => void;
  guestCount?: number;
}

export default function PackageAddonSelector({
  addons,
  selectedAddonIds,
  onToggleAddon,
  guestCount = 1,
}: PackageAddonSelectorProps) {
  if (!addons || addons.length === 0) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            Customize Package with Add-ons
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Optional services you can add to your package booking
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addons.map((item) => {
          const isSelected = selectedAddonIds.includes(item.id);
          const calculatedPrice = item.isPerGuest
            ? item.price * guestCount
            : item.price;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleAddon(item.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/40 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </span>
                  {isSelected && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  +৳{calculatedPrice.toLocaleString()}
                </span>
                {item.isPerGuest && (
                  <span className="block text-[10px] text-slate-400">
                    (৳{item.price}/guest)
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
