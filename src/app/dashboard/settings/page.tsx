"use client";

import { useState } from "react";
import { Save, Sliders, Lock, Plus, Edit2, ShieldAlert, MapPin } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";
import { toast } from "sonner";

interface ZonePricingItem {
  name: string;
  mult: string;
  active: boolean;
}

const DEFAULT_BD_ZONES: ZonePricingItem[] = [
  { name: "Dhaka Metro (Core Zone)", mult: "1.00x Base", active: true },
  { name: "Chattogram Region", mult: "1.10x Base", active: true },
  { name: "Sylhet Region", mult: "1.15x Base", active: true },
  { name: "Rajshahi District", mult: "0.95x Base", active: true },
  { name: "Khulna Metro", mult: "0.95x Base", active: true },
  { name: "Rangpur Division", mult: "0.90x Base", active: true },
  { name: "Barishal Coastal Area", mult: "0.90x Base", active: true },
];

export default function SettingsPage() {
  const [zonesList] = useState<ZonePricingItem[]>(DEFAULT_BD_ZONES);

  const handleAddZone = () => {
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", { detail: "add-zone" })
    );
  };

  const handleSave = () => {
    toast.success("✓ Managed Event OS system configurations saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shrink-0 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-fuchsia-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/30">
              Admin Operations Center — Managed Event OS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              System Configuration &amp; Bangladesh Zone Pricing
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1 max-w-2xl leading-relaxed">
              Manage platform-wide pricing multipliers across all 7 Bangladesh
              zones, internal commission margins, and automated customer
              milestone notifications.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4 text-purple-700" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Rules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex gap-3 items-center pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Global Platform Financial Rules
                </h2>
                <p className="text-xs text-slate-500">
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> 7 Bangladesh Zones
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  Zone Pricing Multipliers
                </h2>
                <p className="text-xs text-slate-500">
                  Adjust base pricing multipliers across various metropolitan and
                  regional sectors.
                </p>
              </div>
              <button
                onClick={handleAddZone}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Custom Sector
              </button>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Bangladesh Zone Name</th>
                  <th className="p-4">Price Multiplier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {zonesList.map((z, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      {z.name}
                    </td>
                    <td className="p-4 text-purple-700 font-bold">{z.mult}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          z.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {z.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={handleAddZone}
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-purple-700" />
            <h2 className="text-base font-bold text-slate-900">
              Managed OS Controls
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3">
              <Toggle
                label="Smart Event Calculator"
                description="Enable real-time interactive zone pricing & budget estimator."
                initialChecked={true}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Managed Auto-Dispatch"
                description="Automatically suggest pre-vetted teams for urgent bookings."
                initialChecked={true}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Platform Review Trigger"
                description="Prompt customers to rate EVENTO after event completion."
                initialChecked={true}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Milestone SMS & Email Alerts"
                description="Send immediate updates to customers when coordinators dispatch teams."
                initialChecked={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
