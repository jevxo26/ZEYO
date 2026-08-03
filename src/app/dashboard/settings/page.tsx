"use client";

import { useState, useEffect } from "react";
import { Save, Sliders, Lock, Plus, Edit2, ShieldAlert, MapPin, PackagePlus, Gift, CheckCircle2 } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";
import { toast } from "sonner";
import { createNotification } from "@/lib/notifications";
import { useAppSelector } from "@/store/store";
import Link from "next/link";
import EventTypeCatalogManager from "@/components/dashboard/EventTypeCatalogManager";
import ServiceCatalogManager from "@/components/dashboard/ServiceCatalogManager";
import PackageCatalogManager from "@/components/dashboard/PackageCatalogManager";
import VendorProfileManager from "@/components/dashboard/VendorProfileManager";

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
  const [activeTab, setActiveTab] = useState<"catalog" | "services" | "packages" | "zones">("catalog");
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans-evento text-[#211E3D]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-sans-evento { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
        .font-display-evento { font-family: "Sora", ui-sans-serif, system-ui, sans-serif; }
        .gradient-text-evento { background: linear-gradient(90deg, #4f46e5, #8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .lift-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .lift-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -12px rgba(109, 40, 217, 0.18); border-color: #d9d3f7; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {user?.role === "admin" ? "Platform Configuration" : "Settings"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {user?.role === "admin" ? "Manage global pricing, zones, and OS features." : "Manage your profile and preferences."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Operational
          </span>
        </div>
      </div>

      {user?.role === "vendor" || user?.role === "partner" ? (
        <VendorProfileManager />
      ) : (
        <>
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "catalog"
                  ? "bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Event Types &amp; Platform Catalog
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "services"
                  ? "bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <PackagePlus className="w-4 h-4" />
              Service &amp; Resource Catalog
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "packages"
                  ? "bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Gift className="w-4 h-4" />
              Preset Packages
            </button>
            <button
              onClick={() => setActiveTab("zones")}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
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
          ) : activeTab === "services" ? (
            <ServiceCatalogManager />
          ) : activeTab === "packages" ? (
            <PackageCatalogManager />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] p-4">
                  <p className="text-[10px] font-bold uppercase text-[#9691B8]">Total Zones</p>
                  <p className="font-display-evento text-2xl font-bold mt-1.5">{zonesList.length}</p>
                </div>
                <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] p-4">
                  <p className="text-[10px] font-bold uppercase text-[#9691B8]">Active Zones</p>
                  <p className="font-display-evento text-2xl font-bold mt-1.5">{activeZoneCount}</p>
                </div>
                <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] p-4">
                  <p className="text-[10px] font-bold uppercase text-[#9691B8]">Avg. Multiplier</p>
                  <p className="font-display-evento text-2xl font-bold mt-1.5">{avgMultiplier}x</p>
                </div>
                <div className="group lift-card bg-white rounded-2xl border border-[#EDEAF9] p-4">
                  <p className="text-[10px] font-bold uppercase text-[#9691B8]">Highest Priced</p>
                  <p className="font-display-evento text-sm font-bold mt-2.5 truncate">{topZone.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="lift-card bg-white rounded-3xl border border-[#EDEAF9] overflow-hidden">
                    <div className="p-6 border-b border-[#F3F1FA] flex justify-between items-center">
                      <h2 className="font-display-evento text-base font-bold text-[#211E3D]">Zone Pricing Multipliers</h2>
                      <button onClick={() => handleAddZone()} className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Add Custom Sector</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF9FE] text-[#9691B8] uppercase">
                          <tr>
                            <th className="p-4 pl-6">Zone</th>
                            <th className="p-4">Multiplier</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F1FA]">
                          {zonesList.map((z, i) => (
                            <tr key={`zone-${i}`}>
                              <td className="p-4 pl-6 font-bold">{z.name}</td>
                              <td className="p-4 text-[#6D28D9]">{z.mult}</td>
                              <td className="p-4">
                                <button onClick={() => handleToggleZoneActive(z.name)} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F7EE] text-[#1F9D5C]">
                                  {z.active ? "Active" : "Inactive"}
                                </button>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <button onClick={() => handleAddZone(z)} className="p-1.5 text-[#B2AECF] hover:text-[#6D28D9]"><Edit2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="group lift-card bg-white p-6 rounded-3xl border border-[#EDEAF9] space-y-6">
                  <h2 className="font-display-evento text-base font-bold text-[#211E3D]">Managed OS Controls</h2>
                  <div className="divide-y divide-[#F3F1FA]">
                    <div className="py-3"><Toggle label="Smart Event Calculator" description="Enable real-time interactive zone pricing." initialChecked={osControls.smartCalculator} onChange={(val) => handleToggleOSControl("smartCalculator", "Smart Event Calculator", val)} /></div>
                    <div className="py-3"><Toggle label="Managed Auto-Dispatch" description="Automatically suggest pre-vetted teams." initialChecked={osControls.autoDispatch} onChange={(val) => handleToggleOSControl("autoDispatch", "Managed Auto-Dispatch", val)} /></div>
                    <div className="py-3"><Toggle label="Platform Review Trigger" description="Prompt customers to rate EVENTO after event." initialChecked={osControls.reviewTrigger} onChange={(val) => handleToggleOSControl("reviewTrigger", "Platform Review Trigger", val)} /></div>
                    <div className="py-3"><Toggle label="Milestone SMS & Email Alerts" description="Send immediate updates to customers." initialChecked={osControls.milestoneAlerts} onChange={(val) => handleToggleOSControl("milestoneAlerts", "Milestone SMS & Email Alerts", val)} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}