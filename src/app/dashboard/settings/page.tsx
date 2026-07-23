"use client";

import { Save, Sliders, Lock, Plus, Edit2, ShieldAlert } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleAddZone = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "add-zone" }));
  };

  const handleSave = () => {
    toast.success("System configurations saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">Manage platform rules, pricing parameters, and administrative controls.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Rules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex gap-3 items-center pb-4 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Global Platform Rules</h2>
                <p className="text-xs text-slate-500">Configure core financial parameters and platform-wide defaults.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Platform Commission (%)" defaultValue="15.0" suffix="%" />
              <InputField label="Standard VAT (%)" defaultValue="5.0" suffix="%" />
              <InputField label="Min. Advance Payment (%)" defaultValue="30.0" icon={<Lock className="w-3.5 h-3.5" />} disabled />
            </div>
          </div>

          {/* Zone Pricing */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Zone Pricing Multipliers</h2>
                <p className="text-xs text-slate-500">Adjust base pricing across various metropolitan sectors.</p>
              </div>
              <button
                onClick={handleAddZone}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Zone
              </button>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Zone Name</th>
                  <th className="p-4">Multiplier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {[
                  { name: "Dhaka Metro (Core)", mult: "1.00 x Base", active: true },
                  { name: "Chittagong Metro", mult: "1.15 x Base", active: true },
                  { name: "Sylhet Region", mult: "1.20 x Base", active: false },
                ].map((z, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">{z.name}</td>
                    <td className="p-4 text-slate-600">{z.mult}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        z.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {z.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button onClick={handleAddZone} className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors">
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
            <ShieldAlert className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Feature Toggles</h2>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3">
              <Toggle
                label="Smart Calculator"
                description="Enable automated budget estimator widgets."
                initialChecked={true}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Vendor Auto-Approval"
                description="Bypass manual admin onboarding reviews."
                initialChecked={false}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Real-time Alerts"
                description="Send immediate phone notifications on status changes."
                initialChecked={true}
              />
            </div>
            <div className="py-3">
              <Toggle
                label="Analytics Dashboard"
                description="Enable advanced analytics and reporting tools."
                initialChecked={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
