"use client";

import React, { useMemo } from "react";
import { useDynamicServices } from "@/hooks/useDynamicServices";
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
  activeZoneId: string;
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
  activeZoneId,
  onToggleService,
  onSelectAll,
  onClearAll,
}: ServiceSelectorProps) {
  const dynamicServices = useDynamicServices();

  const availableServices = useMemo(() => {
    return dynamicServices.filter((srv) => {
      if (!srv.availableZones || srv.availableZones === "all") return true;
      if (Array.isArray(srv.availableZones) && srv.availableZones.includes(activeZoneId)) return true;
      return false;
    });
  }, [dynamicServices, activeZoneId]);

  const isAllSelected = selectedKeys.length === availableServices.length && availableServices.length > 0;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {availableServices.map((srv) => {
            const isChecked = selectedKeys.includes(srv.key);
            return (
              <button
                key={srv.key}
                type="button"
                onClick={() => onToggleService(srv.key)}
                className={`group relative flex flex-col min-h-[160px] w-full p-5 rounded-xl border text-left transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:duration-100 ${
                  isChecked
                    ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/40 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Icon + checkbox row — fixed-size elements, never squeezed by text */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 transition-all duration-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/60 group-hover:scale-105">
                    {serviceIcons[srv.iconName] || (
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border shrink-0 transition-all duration-200 ${
                      isChecked
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-600"
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Text block — full card width, wraps safely, never touches icon/checkbox */}
                <div className="mt-4 min-w-0">
                  <span className="block font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-snug break-words transition-colors duration-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                    {srv.name}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed break-words line-clamp-3">
                    {srv.description}
                  </p>
                </div>

                {/* Subtle top accent line that reveals on hover for a premium touch */}
                <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/0 to-transparent group-hover:via-indigo-400/60 transition-all duration-300" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}