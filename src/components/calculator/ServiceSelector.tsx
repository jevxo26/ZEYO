"use client";

import React from "react";
import { CALCULATOR_SERVICES } from "@/lib/calculatorData";
import {
  Camera,
  Video,
  Utensils,
  Sparkles,
  Layers,
  Sun,
  Volume2,
  Home,
  Zap,
  Car,
  Shield,
  Cake,
  Music,
  Radio,
  Mail,
  CheckSquare,
  Square,
  Check,
} from "lucide-react";

interface ServiceSelectorProps {
  selectedKeys: string[];
  onToggleService: (serviceKey: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-5 h-5 text-indigo-500" />,
  Video: <Video className="w-5 h-5 text-purple-500" />,
  Utensils: <Utensils className="w-5 h-5 text-amber-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-pink-500" />,
  Layers: <Layers className="w-5 h-5 text-blue-500" />,
  Sun: <Sun className="w-5 h-5 text-yellow-500" />,
  Volume2: <Volume2 className="w-5 h-5 text-emerald-500" />,
  Home: <Home className="w-5 h-5 text-cyan-500" />,
  Zap: <Zap className="w-5 h-5 text-orange-500" />,
  Car: <Car className="w-5 h-5 text-rose-500" />,
  Shield: <Shield className="w-5 h-5 text-teal-500" />,
  Cake: <Cake className="w-5 h-5 text-fuchsia-500" />,
  Music: <Music className="w-5 h-5 text-violet-500" />,
  Radio: <Radio className="w-5 h-5 text-red-500" />,
  Mail: <Mail className="w-5 h-5 text-sky-500" />,
};

export default function ServiceSelector({
  selectedKeys,
  onToggleService,
  onSelectAll,
  onClearAll,
}: ServiceSelectorProps) {
  const isAllSelected = selectedKeys.length === CALCULATOR_SERVICES.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Which services do you need for your event?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select only what you need. You will configure options and see live pricing in the next step.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={isAllSelected ? onClearAll : onSelectAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {isAllSelected ? (
                <>
                  <Square className="w-4 h-4 text-slate-400" />
                  Clear All
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  Select All Services
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CALCULATOR_SERVICES.map((srv) => {
            const isChecked = selectedKeys.includes(srv.key);
            return (
              <button
                key={srv.key}
                type="button"
                onClick={() => onToggleService(srv.key)}
                className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 ${
                  isChecked
                    ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {serviceIcons[srv.iconName] || (
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                      {srv.name}
                    </span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {srv.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
