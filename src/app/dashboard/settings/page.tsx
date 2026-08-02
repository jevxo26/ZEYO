"use client";

import { useState, useEffect } from "react";
import { Save, Sliders, Lock, Plus, Edit2, ShieldAlert, MapPin } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";
import { toast } from "sonner";
import { createNotification } from "@/lib/notifications";
import { useAppSelector } from "@/store/store";
import Link from "next/link";
import EventTypeCatalogManager from "@/components/dashboard/EventTypeCatalogManager";

interface ZonePricingItem {
  name: string;
  mult: string;
  active: boolean;
}

const DEFAULT_BD_ZONES: ZonePricingItem[] = [
  { name: "Dhaka North", mult: "1.00x Base", active: true },
  { name: "Dhaka South", mult: "1.00x Base", active: true },
  { name: "Chattogram Region", mult: "1.10x Base", active: true },
  { name: "Sylhet Region", mult: "1.15x Base", active: true },
  { name: "Rajshahi District", mult: "0.95x Base", active: true },
  { name: "Khulna Metro", mult: "0.95x Base", active: true },
  { name: "Dhaka Metro (Core Zone)", mult: "1.00x Base", active: true },
];

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"catalog" | "zones">("catalog");
  const [zonesList, setZonesList] = useState<ZonePricingItem[]>(DEFAULT_BD_ZONES);
  const [osControls, setOsControls] = useState({
    smartCalculator: true,
    autoDispatch: true,
    reviewTrigger: true,
    milestoneAlerts: true,
  });

  const fetchZones = () => {
    let custom: ZonePricingItem[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customZones");
        if (stored) custom = JSON.parse(stored);
      } catch (e) {}
    }
    const merged = [...custom, ...DEFAULT_BD_ZONES];
    const unique = merged.filter(
      (z, idx, self) => idx === self.findIndex((t) => t.name.toLowerCase() === z.name.toLowerCase())
    );
    setZonesList(unique);
  };

  useEffect(() => {
    fetchZones();

    if (typeof window !== "undefined") {
      try {
        const storedControls = localStorage.getItem("managed_os_controls");
        if (storedControls) {
          setOsControls(JSON.parse(storedControls));
        }
      } catch (e) {}
    }

    const handleUpdate = () => fetchZones();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const handleToggleOSControl = (key: string, label: string, value: boolean) => {
    const updated = { ...osControls, [key]: value };
    setOsControls(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("managed_os_controls", JSON.stringify(updated));
      } catch (e) {}
    }

    createNotification(
      "Managed OS Setting Changed",
      `Updated '${label}' status to ${value ? "Active" : "Disabled"}.`,
      "⚙️"
    );
    window.dispatchEvent(new CustomEvent("dashboard-data-update"));
    toast.success(`✓ Managed OS Control '${label}' is now ${value ? "Active" : "Disabled"}!`);
  };

  const handleAddZone = (zone?: ZonePricingItem) => {
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", {
        detail: zone ? { type: "add-zone", zone } : "add-zone",
      })
    );
  };

  const handleToggleZoneActive = (zoneName: string) => {
    const updated = zonesList.map((z) => {
      if (z.name === zoneName) {
        return { ...z, active: !z.active };
      }
      return z;
    });
    setZonesList(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("customZones", JSON.stringify(updated));
      } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent("dashboard-data-update"));
    toast.success(`✓ Zone '${zoneName}' status toggled!`);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("managed_os_controls", JSON.stringify(osControls));
      } catch (e) {}
    }
    toast.success("✓ Managed Event OS system configurations saved successfully!");
  };

  const parseMult = (mult: string) => parseFloat(mult) || 0;
  const activeZoneCount = zonesList.filter((z) => z.active).length;
  const avgMultiplier =
    zonesList.length > 0
      ? (zonesList.reduce((sum, z) => sum + parseMult(z.mult), 0) / zonesList.length).toFixed(2)
      : "0.00";
  const topZone = zonesList.reduce(
    (top, z) => (parseMult(z.mult) > parseMult(top.mult) ? z : top),
    zonesList[0] || { name: "—", mult: "0.00x", active: false }
  );

  if (user && user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Admin Access Required
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            System Settings, Bangladesh Zone Pricing Multipliers, and Managed Event OS Control Flags are restricted to <strong>EVENTO Admin Coordinators</strong> only.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-colors"
          >
            Return to Dashboard Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans-evento text-[#211E3D]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-sans-evento {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }
        .font-display-evento {
          font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
        }
        .gradient-text-evento {
          background: linear-gradient(90deg, #4f46e5, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .lift-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .lift-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -12px rgba(109, 40, 217, 0.18);
          border-color: #d9d3f7;
        }
      `}</style>

      {/* Admin Notice Banner — light lavender base, gradient reserved for accents */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-gradient-to-br from-[#F5F3FF] via-white to-[#F0F5FF] border border-[#E5E1F5]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#C084FC]" />
        <div className="absolute -right-10 -top-14 w-52 h-52 rounded-full bg-[#8B5CF6]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-14 bottom-0 w-40 h-40 rounded-full bg-[#6366F1]/10 blur-3xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-[#E5E1F5] shrink-0 hover:scale-105 hover:shadow-md transition-all duration-200">
            <ShieldAlert className="w-6 h-6 text-[#6D28D9]" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white text-[#6D28D9] border border-[#E5E1F5] shadow-sm">
              Admin Dashboard
            </span>
            <h1 className="font-display-evento text-xl sm:text-2xl font-bold mt-2 text-[#211E3D]">
              System Configuration &amp; <span className="gradient-text-evento">Bangladesh Zone Pricing</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6890] mt-1.5 max-w-2xl leading-relaxed">
              Manage platform-wide pricing multipliers across all 7 Bangladesh
              zones, internal commission margins, and automated customer
              milestone notifications.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md shadow-[#8B5CF6]/20 hover:shadow-lg hover:shadow-[#8B5CF6]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 shrink-0 relative"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {/* Top Tab Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === "catalog"
              ? "bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Event Types &amp; Platform Catalog
        </button>
        <button
          onClick={() => setActiveTab("zones")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === "zones"
              ? "bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MapPin className="w-4 h-4" />
          7 Bangladesh Zones &amp; Financial Rules
        </button>
      </div>

      {activeTab === "catalog" ? (
        <EventTypeCatalogManager />
      ) : (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] p-4 cursor-default">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9691B8]">Total Zones</p>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] text-[#6D28D9] group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display-evento text-2xl font-bold text-[#211E3D] mt-1.5">{zonesList.length}</p>
        </div>
        <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] p-4 cursor-default">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9691B8]">Active Zones</p>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#E7F7EE] to-[#F0FBF5] text-[#1F9D5C] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display-evento text-2xl font-bold text-[#211E3D] mt-1.5">{activeZoneCount}</p>
        </div>
        <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] p-4 cursor-default">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9691B8]">Avg. Multiplier</p>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] text-[#6D28D9] group-hover:scale-110 transition-transform">
              <Sliders className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display-evento text-2xl font-bold text-[#211E3D] mt-1.5">{avgMultiplier}x</p>
        </div>
        <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] p-4 cursor-default">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9691B8]">Highest Priced</p>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#FFF1F5] to-[#FDF2F8] text-[#C026D3] group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-display-evento text-sm font-bold text-[#211E3D] mt-2.5 truncate" title={topZone.name}>
            {topZone.name.replace(/\s*\(.*?\)/, "")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Rules */}
          <div className="group lift-card bg-white p-6 rounded-3xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] space-y-6">
            <div className="flex gap-3 items-center pb-4 border-b border-[#F3F1FA]">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] text-[#6D28D9] group-hover:scale-110 group-hover:from-[#E0E7FF] group-hover:to-[#EDE9FE] transition-all">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display-evento text-base font-bold text-[#211E3D]">
                  Global Platform Financial Rules
                </h2>
                <p className="text-xs text-[#8B87AD]">
                  Configure core management margin parameters and standard VAT
                  rates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Platform Commission (%)"
                defaultValue="15.0"
                suffix="%"
              />
              <InputField
                label="Standard VAT (BDT Tax)"
                defaultValue="5.0"
                suffix="%"
              />
              <InputField
                label="Min. Advance Payment (%)"
                defaultValue="30.0"
                icon={<Lock className="w-3.5 h-3.5" />}
                disabled
              />
            </div>
          </div>

          {/* Bangladesh Zone Pricing */}
          <div className="lift-card bg-white rounded-3xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] overflow-hidden">
            <div className="p-6 border-b border-[#F3F1FA] flex justify-between items-center gap-4 flex-wrap">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> 7 Bangladesh Zones
                </span>
                <h2 className="font-display-evento text-base font-bold text-[#211E3D] mt-1">
                  Zone Pricing Multipliers
                </h2>
                <p className="text-xs text-[#8B87AD]">
                  Adjust base pricing multipliers across various metropolitan and
                  regional sectors.
                </p>
              </div>
              <button
                onClick={() => handleAddZone()}
                className="px-3.5 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md hover:shadow-[#8B5CF6]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Custom Sector
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9FE] text-[#9691B8] text-[10px] font-bold uppercase tracking-wider border-b border-[#F3F1FA]">
                  <tr>
                    <th className="p-4 pl-6">Bangladesh Zone Name</th>
                    <th className="p-4">Price Multiplier</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F1FA] font-semibold text-[#413D63]">
                  {zonesList.map((z, i) => {
                    const pct = Math.min(100, Math.max(8, parseMult(z.mult) * 70));
                    return (
                      <tr
                        key={`zone-${i}`}
                        className="group/row relative hover:bg-[#FAF9FE] transition-all duration-200"
                      >
                        <td className="p-4 pl-6 font-bold text-[#211E3D] relative">
                          <span className="absolute left-0 top-0 bottom-0 w-0 group-hover/row:w-1 bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] rounded-r transition-all duration-200" />
                          {z.name}
                        </td>
                        <td className="p-4 text-[#6D28D9] font-bold">
                          <div className="flex items-center gap-2">
                            <span className="w-12 shrink-0">{z.mult.replace(" Base", "")}</span>
                            <span className="hidden sm:block flex-1 max-w-[80px] h-1.5 rounded-full bg-[#F0EDFA] overflow-hidden">
                              <span
                                className="block h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-300 group-hover/row:brightness-110"
                                style={{ width: `${pct}%` }}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleZoneActive(z.name)}
                            title="Click to toggle status"
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              z.active
                                ? "bg-[#E7F7EE] text-[#1F9D5C] hover:bg-[#DAF3E5]"
                                : "bg-[#F3F1FA] text-[#9691B8] hover:bg-[#E5E2F2]"
                            }`}
                          >
                            {z.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleAddZone(z)}
                            className="p-1.5 text-[#B2AECF] hover:text-[#6D28D9] hover:scale-110 rounded-lg hover:bg-[#F5F3FF] transition-all"
                            title="Edit Zone"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="group lift-card bg-white p-6 rounded-3xl border border-[#EDEAF9] shadow-[0_1px_3px_rgba(109,40,217,0.06)] space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F1FA]">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] text-[#6D28D9] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="font-display-evento text-base font-bold text-[#211E3D]">
              Managed OS Controls
            </h2>
          </div>

          <div className="divide-y divide-[#F3F1FA]">
            <div className="py-3 px-2 -mx-2 rounded-xl hover:bg-[#FAF9FE] transition-colors">
              <Toggle
                label="Smart Event Calculator"
                description="Enable real-time interactive zone pricing & budget estimator."
                initialChecked={osControls.smartCalculator}
                onChange={(val) => handleToggleOSControl("smartCalculator", "Smart Event Calculator", val)}
              />
            </div>
            <div className="py-3 px-2 -mx-2 rounded-xl hover:bg-[#FAF9FE] transition-colors">
              <Toggle
                label="Managed Auto-Dispatch"
                description="Automatically suggest pre-vetted teams for urgent bookings."
                initialChecked={osControls.autoDispatch}
                onChange={(val) => handleToggleOSControl("autoDispatch", "Managed Auto-Dispatch", val)}
              />
            </div>
            <div className="py-3 px-2 -mx-2 rounded-xl hover:bg-[#FAF9FE] transition-colors">
              <Toggle
                label="Platform Review Trigger"
                description="Prompt customers to rate EVENTO after event completion."
                initialChecked={osControls.reviewTrigger}
                onChange={(val) => handleToggleOSControl("reviewTrigger", "Platform Review Trigger", val)}
              />
            </div>
            <div className="py-3 px-2 -mx-2 rounded-xl hover:bg-[#FAF9FE] transition-colors">
              <Toggle
                label="Milestone SMS & Email Alerts"
                description="Send immediate updates to customers when coordinators dispatch teams."
                initialChecked={osControls.milestoneAlerts}
                onChange={(val) => handleToggleOSControl("milestoneAlerts", "Milestone SMS & Email Alerts", val)}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}