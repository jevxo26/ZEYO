"use client";

import { useEffect, useState } from "react";
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
import apiClient from "@/lib/apiClient";
import { createNotification } from "@/lib/notifications";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";
import { Plus } from "lucide-react";

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

const DEFAULT_VENDORS: VendorItemType[] = [
  {
    name: "Dhaka Royal Photo Team",
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

const DEFAULT_CUSTOMER_BOOKINGS = [
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
  const [vendorsList, setVendorsList] = useState<VendorItemType[]>(DEFAULT_VENDORS);
  const [activeBookings, setActiveBookings] = useState<any[]>(DEFAULT_CUSTOMER_BOOKINGS);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedVendor, setSelectedVendor] = useState<VendorItemType | null>(null);

  // Dispatch Form State inside Modal
  const [targetBookingId, setTargetBookingId] = useState("BKG-2026-001");
  const [targetService, setTargetService] = useState("Photography");
  const [dispatchNotes, setDispatchNotes] = useState("");

  const fetchVendorsAndBookings = async () => {
    let customBookingsMapped: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        if (stored) {
          const list = JSON.parse(stored);
          customBookingsMapped = list.map((b: any, i: number) => ({
            id: b.id || `CUSTOM-${i}`,
            label: `${b.bookingNumber || `#${b.id}`} - ${b.eventName || b.notes || "Celebration"} (${b.location || "Location TBD"})`,
            date: b.eventDate ? new Date(b.eventDate).toISOString().split("T")[0] : "Upcoming",
          }));
        }
      } catch (e) {}
    }

    const mergedBookings = [...customBookingsMapped, ...DEFAULT_CUSTOMER_BOOKINGS];
    const uniqueBookings = mergedBookings.filter(
      (item, idx, self) => idx === self.findIndex((t) => String(t.id) === String(item.id))
    );
    setActiveBookings(uniqueBookings);
    if (uniqueBookings.length > 0) {
      setTargetBookingId(uniqueBookings[0].id);
    }

    let localCustomVendors: any[] = [];
    let loggedInVendorList: any[] = [];

    if (typeof window !== "undefined") {
      try {
        const storedVendors = localStorage.getItem("customVendors");
        if (storedVendors) {
          localCustomVendors = JSON.parse(storedVendors);
        }
      } catch (e) {}

      try {
        const uStr = localStorage.getItem("user");
        if (uStr) {
          const u = JSON.parse(uStr);
          const userRole = (u.role || "").toLowerCase();
          const fullName = `${u.firstName || u.name || ""} ${u.lastName || ""}`.trim() || u.email;
          if (fullName && (userRole === "vendor" || userRole === "partner")) {
            loggedInVendorList.push({
              name: `${fullName} (Logged-in Partner)`,
              id: u.id || `V-USER-${u.email?.slice(0, 4) || "LIVE"}`,
              category: u.category || u.vendorCategory || u.companyName || "Verified Event Service",
              zone: u.zone || "Dhaka Zone",
              rating: "5.0",
              jobs: u.jobsCount || 2,
              verified: true,
              payoutRate: "৳35,000 / Event",
            });
          }
        }
      } catch (e) {}
    }

    let rawVendorsList = [...loggedInVendorList, ...localCustomVendors, ...DEFAULT_VENDORS];

    try {
      const res = await apiClient.get("/vendors");
      if (res.data && res.data.success !== false && Array.isArray(res.data.data) && res.data.data.length > 0) {
        rawVendorsList = [...loggedInVendorList, ...localCustomVendors, ...res.data.data];
      }
    } catch (e) {}

    const sanitizedVendors = rawVendorsList.map((v) => {
      if (v.name && v.name.includes("Dhaka Royal Photography Studio")) {
        return { ...v, name: "Dhaka Royal Photo Team" };
      }
      return v;
    });

    const uniqueVendors = sanitizedVendors.filter(
      (v, idx, self) => idx === self.findIndex((t) => String(t.id) === String(v.id) || String(t.name) === String(v.name))
    );
    setVendorsList(uniqueVendors);
  };

  useEffect(() => {
    fetchVendorsAndBookings();
    const handleUpdate = () => fetchVendorsAndBookings();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const handleOnboardVendor = () => {
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", { detail: "new-vendor" })
    );
  };

  const handleOpenDispatch = (vendor: VendorItemType) => {
    setSelectedVendor(vendor);
    setTargetService(vendor.category);
  };

  const handleAssignVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    const updatedVendorId = selectedVendor.id;
    const bookingRefStr = String(targetBookingId).startsWith("#") ? String(targetBookingId) : `#${targetBookingId}`;

    // 1. Try Backend API assignment
    try {
      await apiClient.post("/vendors/assign", {
        vendorId: selectedVendor.id,
        bookingId: targetBookingId,
        service: targetService,
        notes: dispatchNotes,
      });
    } catch (err) {}

    // 2. Update vendor active jobs count locally
    setVendorsList((prev) => {
      const updated = prev.map((v) =>
        v.id === updatedVendorId ? { ...v, jobs: (v.jobs || 0) + 1 } : v
      );
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("customVendors", JSON.stringify(updated));
        } catch (err) {}
      }
      return updated;
    });

    // 3. Update customer booking status & assigned vendor info
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        if (stored) {
          let list = JSON.parse(stored);
          list = list.map((b: any) => {
            if (
              String(b.id) === String(targetBookingId) ||
              String(b.bookingNumber) === String(targetBookingId) ||
              String(b.bookingNumber).endsWith(String(targetBookingId))
            ) {
              return {
                ...b,
                bookingStatus: "confirmed",
                status: "CONFIRMED",
                assignedVendor: selectedVendor.name,
                assignedVendorId: selectedVendor.id,
                assignedService: targetService,
              };
            }
            return b;
          });
          localStorage.setItem("customBookings", JSON.stringify(list));
        }
      } catch (err) {}
    }

    // 4. Create explicit Task entry in customVendorTasks for Vendor Task Board
    if (typeof window !== "undefined") {
      try {
        const storedTasks = localStorage.getItem("customVendorTasks");
        const tasksList = storedTasks ? JSON.parse(storedTasks) : [];
        const newTask = {
          id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingRef: bookingRefStr,
          title: `Dispatched ${targetService} Execution`,
          category: targetService,
          zone: selectedVendor.zone,
          venue: `Assigned Venue for ${bookingRefStr}`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          duration: "Full Event Duration",
          payout: `${selectedVendor.payoutRate} (Protected Escrow)`,
          status: "Confirmed",
          requirements: [
            {
              title: `${targetService} Service Delivery`,
              desc: dispatchNotes || "Execute assigned service line item according to EVENTO specifications.",
            },
            {
              title: "Quality Assurance & Deliverables Upload",
              desc: "Upload media files / work completion proof for EVENTO QA inspection upon event finish.",
            },
          ],
          coordinatorNotes: dispatchNotes || "Coordinate with EVENTO Dispatch Officer upon arrival.",
          assignedVendorId: selectedVendor.id,
          assignedVendorName: selectedVendor.name,
        };
        tasksList.unshift(newTask);
        localStorage.setItem("customVendorTasks", JSON.stringify(tasksList));
      } catch (err) {}
    }

    // 5. Create live real-time notification
    createNotification(
      "Vendor Dispatched to Booking",
      `Assigned ${selectedVendor.name} (${targetService}) to ${bookingRefStr}.`,
      "📦"
    );

    window.dispatchEvent(new CustomEvent("dashboard-data-update"));

    toast.success(
      `✓ Dispatched ${selectedVendor.name} to booking ${bookingRefStr} for ${targetService}!`,
      { duration: 5000 }
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
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 shrink-0 border border-white/10">
            <ShieldAlert className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-200 border border-purple-400/20">
              Admin Operations Center — Managed Event OS
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Managed Vendor Pool &amp; Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Customers never see individual vendor names or payout rates. As an EVENTO Admin Coordinator, use this panel to assign vetted background vendor teams to customer bookings and oversee service quality.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-dashboard-modal", { detail: "new-booking" })
              )
            }
            className="px-4 py-2.5 bg-purple-600 text-white hover:bg-purple-500 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" /> Add Custom Booking
          </button>
          <button
            onClick={handleOnboardVendor}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-purple-700" /> Onboard Vendor Team
          </button>
        </div>
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
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
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
                  <tr key={v.id ? `${v.id}-${idx}` : idx} className="hover:bg-slate-50 transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assign Vendor to Customer Booking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  EVENTO Operational Dispatch
                </p>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignVendor} className="p-6 space-y-4">
              {/* Selected Vendor Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Selected Partner
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedVendor.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedVendor.category} • {selectedVendor.zone} • ID: {selectedVendor.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedVendor.payoutRate}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    ★ {selectedVendor.rating}
                  </span>
                </div>
              </div>

              {/* Select Customer Booking */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target Customer Booking
                </label>
                <select
                  value={targetBookingId}
                  onChange={(e) => setTargetBookingId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {activeBookings.map((b, idx) => (
                    <option key={b.id ? `booking-opt-${b.id}-${idx}` : `opt-idx-${idx}`} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Assignment Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Service Line Item to Assign
                </label>
                <input
                  type="text"
                  value={targetService}
                  onChange={(e) => setTargetService(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Special Dispatch Instructions */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Instructions for Vendor Team
                </label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Ensure senior photographers arrive at venue by 4:00 PM for equipment check."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
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
