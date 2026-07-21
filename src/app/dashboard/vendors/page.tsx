"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownWideNarrow,
  UserCheck,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Briefcase,
  MoreVertical,
} from "lucide-react";

interface VendorItemType {
  name: string;
  id: string;
  category: string;
  zone: string;
  rating: string;
  jobs: number;
  verified: boolean;
}

const initialDefaultVendors: VendorItemType[] = [
  { name: "Epicurean Delights", id: "V-4029", category: "Catering", zone: "Central Hub", rating: "4.9", jobs: 3, verified: true },
  { name: "Lumina AV Systems", id: "V-1102", category: "Audio/Visual", zone: "North District", rating: "4.7", jobs: 1, verified: true },
  { name: "Grandeur Events Decor", id: "V-8831", category: "Decor & Design", zone: "South District", rating: "4.5", jobs: 0, verified: false },
  { name: "Royal Floral Studio", id: "V-3344", category: "Floristry", zone: "West End", rating: "4.8", jobs: 2, verified: true },
];

const categoryColor = (cat: string) => {
  if (cat === "Catering") return { bg: "rgba(124,58,237,0.1)", color: "#7c3aed" };
  if (cat === "Audio/Visual") return { bg: "rgba(37,99,235,0.1)", color: "#2563eb" };
  if (cat === "Decor & Design") return { bg: "rgba(236,72,153,0.1)", color: "#db2777" };
  return { bg: "rgba(16,185,129,0.1)", color: "#059669" };
};

export default function VendorsPage() {
  const [vendorsList, setVendorsList] = useState<VendorItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const loadVendors = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_vendors");
      if (stored) {
        setVendorsList(JSON.parse(stored));
      } else {
        localStorage.setItem("dashboard_vendors", JSON.stringify(initialDefaultVendors));
        setVendorsList(initialDefaultVendors);
      }
    }
  };

  useEffect(() => {
    loadVendors();

    const handleUpdate = () => {
      loadVendors();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  const filteredVendors = vendorsList.filter((v) => {
    if (selectedCategory !== "All Categories" && v.category !== selectedCategory) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.zone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenOnboardModal = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-vendor" }));
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header Banner */}
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
            <h1 className="text-2xl font-black tracking-tight text-white">Vendor Management</h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">Monitor and manage your ecosystem service partner performance metrics.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <ArrowDownWideNarrow size={13} /> Export
            </button>
            <button
              onClick={handleOpenOnboardModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
            >
              <UserCheck size={13} /> Onboard Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div
        className="rounded-2xl p-4 flex flex-col md:flex-row gap-3"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 15px rgba(124,58,237,0.05)",
        }}
      >
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.1)" }}
        >
          <Search size={14} className="text-purple-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, service or ID..."
            className="bg-transparent text-xs outline-none w-full font-medium text-gray-700 placeholder-purple-300"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl text-xs font-bold px-3 py-2 outline-none cursor-pointer"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)", color: "#7c3aed" }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Catering">Catering</option>
            <option value="Audio/Visual">Audio/Visual</option>
            <option value="Decor & Design">Decor & Design</option>
            <option value="Floristry">Floristry</option>
          </select>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)", color: "#7c3aed" }}
          >
            <SlidersHorizontal size={13} /> Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(124,58,237,0.04)", borderBottom: "1px solid rgba(124,58,237,0.08)", color: "#6b7280" }}
            >
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Active Jobs</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((v, idx) => {
                  const cs = categoryColor(v.category);
                  return (
                    <tr key={idx} className="transition-all" style={{ cursor: "pointer" }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                          >
                            {v.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-gray-900">{v.name}</p>
                              {v.verified && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>✓</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">ID: {v.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"
                          style={{ background: cs.bg, color: cs.color }}
                        >
                          <Briefcase size={9} /> {v.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 flex items-center gap-1">
                          <MapPin size={10} className="text-purple-300" /> {v.zone}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400" fill="#fbbf24" />
                          <span className="font-bold text-gray-800">{v.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: v.jobs > 0 ? "rgba(124,58,237,0.1)" : "rgba(156,163,175,0.1)",
                            color: v.jobs > 0 ? "#7c3aed" : "#9ca3af",
                          }}
                        >
                          {v.jobs} active {v.jobs === 1 ? "job" : "jobs"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                            style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}
                          >
                            View Profile
                          </button>
                          <button className="p-1 rounded-lg cursor-pointer" style={{ color: "#9ca3af" }}>
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 font-semibold">No vendors found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="p-4 flex justify-between items-center text-xs font-semibold"
          style={{ borderTop: "1px solid rgba(124,58,237,0.08)", color: "#9ca3af" }}
        >
          <span>Showing 1–{filteredVendors.length} of {vendorsList.length} vendors</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="w-7 h-7 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                style={
                  n === 1
                    ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", boxShadow: "0 2px 8px rgba(124,58,237,0.25)" }
                    : { background: "rgba(124,58,237,0.06)", color: "#6b7280", border: "1px solid rgba(124,58,237,0.1)" }
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
