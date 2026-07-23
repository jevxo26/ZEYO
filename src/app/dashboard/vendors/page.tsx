"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Search,
  Star,
  MapPin,
  Briefcase,
  MoreVertical,
  Plus
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface VendorItemType {
  id: string;
  name: string;
  category: string;
  zone: string;
  rating: string;
  jobs: number;
  verified: boolean;
}

const defaultVendors: VendorItemType[] = [
  { name: "Epicurean Delights", id: "V-4029", category: "Catering", zone: "Central Hub", rating: "4.9", jobs: 3, verified: true },
  { name: "Lumina AV Systems", id: "V-1102", category: "Audio/Visual", zone: "North District", rating: "4.7", jobs: 1, verified: true },
  { name: "Grandeur Events Decor", id: "V-8831", category: "Decor & Design", zone: "South District", rating: "4.5", jobs: 0, verified: false },
  { name: "Royal Floral Studio", id: "V-3344", category: "Floristry", zone: "West End", rating: "4.8", jobs: 2, verified: true },
];

export default function VendorsPage() {
  const [vendorsList, setVendorsList] = useState<VendorItemType[]>(defaultVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedVendor, setSelectedVendor] = useState<VendorItemType | null>(null);

  const handleOnboardVendor = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-vendor" }));
  };

  const handleViewProfile = (vendor: VendorItemType) => {
    setSelectedVendor(vendor);
  };

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Management</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage your ecosystem service partner performance metrics.</p>
        </div>
        <button
          onClick={handleOnboardVendor}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <UserCheck className="w-4 h-4" /> Onboard Vendor
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, category or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 outline-none text-slate-700 w-full sm:w-auto"
        >
          <option value="All Categories">All Categories</option>
          <option value="Catering">Catering</option>
          <option value="Audio/Visual">Audio/Visual</option>
          <option value="Decor & Design">Decor & Design</option>
          <option value="Floristry">Floristry</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Active Jobs</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {v.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{v.name}</p>
                            {v.verified && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-600 rounded-full">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">ID: {v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {v.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{v.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        v.jobs > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {v.jobs} active {v.jobs === 1 ? "job" : "jobs"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewProfile(v)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">No vendors found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Profile Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center">
                  {selectedVendor.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedVendor.name}</h2>
                    {selectedVendor.verified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                        Verified Partner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Vendor ID: {selectedVendor.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</p>
                <p className="font-bold text-slate-900 mt-1">{selectedVendor.category}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zone Sector</p>
                <p className="font-bold text-slate-900 mt-1">{selectedVendor.zone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</p>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1">
                  ⭐ {selectedVendor.rating} / 5.0
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Assignments</p>
                <p className="font-bold text-slate-900 mt-1">{selectedVendor.jobs} Active Jobs</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedVendor.name} is a verified {selectedVendor.category} specialist serving the {selectedVendor.zone} area with an average rating of {selectedVendor.rating}.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success(`Contact request sent to ${selectedVendor.name}`);
                  setSelectedVendor(null);
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                Contact Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
