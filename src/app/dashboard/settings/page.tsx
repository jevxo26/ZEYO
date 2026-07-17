import { Save, Sliders, Lock, Plus, Edit2, ShieldAlert } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Toggle from "../../../components/ui/Toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", transform: "translate(40%,-40%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">System Configuration</h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">Manage platform rules, pricing parameters, and administrative controls.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-purple-700 cursor-pointer shrink-0"
            style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
          >
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-5">
          {/* Platform Rules */}
          <div
            className="rounded-2xl p-6 space-y-5"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <div className="flex gap-3 items-start pb-4" style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}
              >
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Global Platform Rules</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Configure core financial parameters and platform-wide defaults.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Platform Commission (%)" defaultValue="15.0" suffix="%" />
              <InputField label="Standard VAT (%)" defaultValue="5.0" suffix="%" />
              <InputField label="Min. Advance Payment (%)" defaultValue="30.0" icon={<Lock size={12} />} disabled />
            </div>
          </div>

          {/* Zone Pricing */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <div className="p-5 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Zone Pricing Multipliers</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Adjust base pricing across various metropolitan sectors.</p>
              </div>
              <button
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                style={{ background: "rgba(124,58,237,0.08)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                <Plus size={13} /> Add Zone
              </button>
            </div>

            <table className="w-full text-left text-xs">
              <thead
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(124,58,237,0.04)", borderBottom: "1px solid rgba(124,58,237,0.08)", color: "#6b7280" }}
              >
                <tr>
                  <th className="p-4 pl-6">Zone Name</th>
                  <th className="p-4">Multiplier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium text-gray-700" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
                {[
                  { name: "🟢 Dhaka Metro (Core)", mult: "1.00 x Base", active: true },
                  { name: "🟡 Chittagong Metro", mult: "1.15 x Base", active: true },
                  { name: "🔵 Sylhet Region", mult: "1.20 x Base", active: false },
                ].map((z, i) => (
                  <tr key={i} className="transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-800">{z.name}</td>
                    <td className="p-4 text-gray-500 font-semibold">{z.mult}</td>
                    <td className="p-4">
                      <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                        style={
                          z.active
                            ? { background: "rgba(16,185,129,0.1)", color: "#059669" }
                            : { background: "rgba(156,163,175,0.1)", color: "#9ca3af" }
                        }
                      >
                        {z.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-1.5 rounded-lg cursor-pointer" style={{ color: "#7c3aed", background: "rgba(124,58,237,0.08)" }}>
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Toggles */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124,58,237,0.1)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
          }}
        >
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
            <ShieldAlert size={16} style={{ color: "#7c3aed" }} />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Feature Toggles</h3>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
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
