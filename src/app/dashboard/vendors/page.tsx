"use client";

import { useState } from "react";
import {
  UserCheck,
  Search,
  Star,
  MapPin,
  Briefcase,
  ShieldAlert,
  Send,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface VendorItemType {
  id: string;
  name: string;
  category: string;
  zone: string;
  rating: string;
  jobs: number;
  verified: boolean;
  payoutRate: string;
}

const defaultVendors: VendorItemType[] = [
  {
    name: "Dhaka Royal Photography Studio",
    id: "V-4029",
    category: "Photography",
    zone: "Dhaka Zone",
    rating: "4.9",
    jobs: 3,
    verified: true,
    payoutRate: "৳32,000 / Event",
  },
  {
    name: "Cinematic Beats Videography",
    id: "V-1102",
    category: "Videography",
    zone: "Dhaka Zone",
    rating: "4.8",
    jobs: 2,
    verified: true,
    payoutRate: "৳36,000 / Event",
  },
  {
    name: "Grand Kacchi Caterers Bangladesh",
    id: "V-8831",
    category: "Catering",
    zone: "Dhaka Zone",
    rating: "4.9",
    jobs: 4,
    verified: true,
    payoutRate: "৳650 / Plate",
  },
  {
    name: "Sylhet Garden Floral & Decor",
    id: "V-3344",
    category: "Decoration",
    zone: "Sylhet Zone",
    rating: "4.7",
    jobs: 1,
    verified: true,
    payoutRate: "৳42,000 / Event",
  },
  {
    name: "Chattogram Stage & Sound Systems",
    id: "V-5510",
    category: "Stage & Lighting",
    zone: "Chattogram Zone",
    rating: "4.6",
    jobs: 2,
    verified: true,
    payoutRate: "৳38,000 / Event",
  },
  {
    name: "Rajshahi Imperial Sound & DJ",
    id: "V-7712",
    category: "Sound System",
    zone: "Rajshahi Zone",
    rating: "4.8",
    jobs: 1,
    verified: true,
    payoutRate: "৳28,000 / Event",
  },
];

const ACTIVE_CUSTOMER_BOOKINGS = [
  {
    id: "BKG-2026-001",
    label: "#BKG-2026-001 - Royal Wedding Ceremony (Gulshan Club, Dhaka Zone)",
    date: "2026-11-15",
  },
  {
    id: "BKG-2026-002",
    label: "#BKG-2026-002 - Gaye Holud Night (Banani Hall, Dhaka Zone)",
    date: "2026-11-13",
  },
  {
    id: "BKG-2026-003",
    label: "#BKG-2026-003 - Corporate Annual Summit (Radisson Blu, Chattogram Zone)",
    date: "2026-12-01",
  },
];

export default function VendorsPage() {
  const [vendorsList] = useState<VendorItemType[]>(defaultVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedVendor, setSelectedVendor] = useState<VendorItemType | null>(
    null
  );

  // Dispatch Form State inside Modal
  const [targetBookingId, setTargetBookingId] = useState("BKG-2026-001");
  const [targetService, setTargetService] = useState("Photography");
  const [dispatchNotes, setDispatchNotes] = useState("");

  const handleOnboardVendor = () => {
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", { detail: "new-vendor" })
    );
  };

  const handleOpenDispatch = (vendor: VendorItemType) => {
    setSelectedVendor(vendor);
    setTargetService(vendor.category);
  };

  const handleAssignVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    toast.success(
      `✓ Dispatched ${selectedVendor.name} to #${targetBookingId} for ${targetService}. Customer booking updated to Operational Dispatch!`,
      { duration: 4000 }
    );
    setSelectedVendor(null);
    setDispatchNotes("");
  };

  const filteredVendors = vendorsList.filter((v) => {
    if (
      selectedCategory !== "All Categories" &&
      v.category !== selectedCategory
    )
      return false;
    if (selectedZone !== "All Zones" && v.zone !== selectedZone) return false;

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
      {/* Admin Notice Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shrink-0 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-fuchsia-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/30">
              Admin Operations Center — Managed Event OS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              Managed Vendor Pool &amp; Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1 max-w-2xl leading-relaxed">
              Customers never see individual vendor names, ratings, or payout
              rates. As an EVENTO Admin Coordinator, use this panel to assign
              vetted background vendor teams to customer bookings and oversee
              service quality.
            </p>
          </div>
        </div>
        <button
          onClick={handleOnboardVendor}
          className="px-4 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 shrink-0"
        >
          <UserCheck className="w-4 h-4 text-purple-700" /> Onboard Vendor Team
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, category or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-slate-900 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 outline-none text-slate-700"
          >
            <option value="All Categories">All Categories</option>
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Catering">Catering</option>
            <option value="Decoration">Decoration</option>
            <option value="Stage & Lighting">Stage &amp; Lighting</option>
            <option value="Sound System">Sound System</option>
          </select>

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 outline-none text-slate-700"
          >
            <option value="All Zones">All Zones</option>
            <option value="Dhaka Zone">Dhaka Zone</option>
            <option value="Chattogram Zone">Chattogram Zone</option>
            <option value="Rajshahi Zone">Rajshahi Zone</option>
            <option value="Sylhet Zone">Sylhet Zone</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[750px]">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Vendor Partner</th>
                <th className="px-6 py-4">Service Category</th>
                <th className="px-6 py-4">Coverage Zone</th>
                <th className="px-6 py-4">Internal Payout Rate</th>
                <th className="px-6 py-4">Admin Rating</th>
                <th className="px-6 py-4">Active Jobs</th>
                <th className="px-6 py-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
                          {v.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{v.name}</p>
                            {v.verified && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                                title="Verified EVENTO Partner"
                              >
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-slate-400">
                            ID: {v.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {v.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 text-xs">
                        {v.payoutRate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{v.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          v.jobs > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {v.jobs} active {v.jobs === 1 ? "job" : "jobs"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDispatch(v)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Dispatch to Booking
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No vendor partners match your search or zone filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Vendor Dispatch Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Managed Event OS Dispatch
                </span>
                <h2 className="text-lg font-extrabold mt-1">
                  Assign Vendor to Customer Booking
                </h2>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignVendor} className="p-6 space-y-5">
              {/* Selected Vendor Summary Card */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                    Selected Vendor Team
                  </p>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">
                    {selectedVendor.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedVendor.category} • {selectedVendor.zone} • ID:{" "}
                    {selectedVendor.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 block">
                    {selectedVendor.payoutRate}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    ★ {selectedVendor.rating}
                  </span>
                </div>
              </div>

              {/* Select Customer Booking */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  Target Customer Booking
                </label>
                <select
                  value={targetBookingId}
                  onChange={(e) => setTargetBookingId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {ACTIVE_CUSTOMER_BOOKINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Assignment Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Service Line Item to Assign
                </label>
                <input
                  type="text"
                  value={targetService}
                  onChange={(e) => setTargetService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Special Dispatch Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Coordinator Instructions for Vendor Team
                </label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Ensure 2 Senior Photographers arrive at Gulshan Club by 5:30 PM. Reference customer theme colours (Royal Purple & Gold)."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Assurance note */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                🔒 <strong>Zero Customer Exposure:</strong> The customer will be
                notified that their event service is <em>Operational Dispatched</em>{" "}
                without revealing vendor contact information or payout rates.
              </p>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Vendor Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
