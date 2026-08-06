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
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { createNotification } from "@/lib/notifications";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";
import { Plus } from "lucide-react";
import { useDynamicZones } from "@/hooks/useDynamicZones";
import { useDynamicServices } from "@/hooks/useDynamicServices";

interface VendorItemType {
  id: string;
  name: string;
  category: string;
  zone: string;
  rating: string;
  jobs: number;
  verified: boolean;
  status?: string;
  payoutRate: string;
  supportedServiceKeys?: string[];
  supportedZoneIds?: string[];
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
    status: "VERIFIED",
    payoutRate: "৳32,000 / Event",
    supportedServiceKeys: ["photography"],
    supportedZoneIds: ["zone-1"],
  },
];

const DEFAULT_CUSTOMER_BOOKINGS = [
  {
    id: "BKG-2026-001",
    label: "#BKG-2026-001 - Royal Wedding Ceremony (Gulshan Club, Dhaka Zone)",
    date: "2026-11-15",
    zoneId: "zone-1", // Dhaka
  },
  {
    id: "BKG-2026-003",
    label: "#BKG-2026-003 - Corporate Annual Summit (Radisson Blu, Chattogram Zone)",
    date: "2026-12-01",
    zoneId: "zone-2", // Chattogram
  },
];

export default function VendorsPage() {
  const dynamicZones = useDynamicZones();
  const dynamicServices = useDynamicServices();

  const [vendorsList, setVendorsList] = useState<VendorItemType[]>(DEFAULT_VENDORS);
  const [activeBookings, setActiveBookings] = useState<any[]>(DEFAULT_CUSTOMER_BOOKINGS);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedVendor, setSelectedVendor] = useState<VendorItemType | null>(null);

  // Dispatch Form State inside Modal
  const [targetBookingId, setTargetBookingId] = useState("BKG-2026-001");
  const [targetService, setTargetService] = useState("photography");
  const [dispatchNotes, setDispatchNotes] = useState("");

  const fetchVendorsAndBookings = async () => {
    let apiBookings: any[] = [];
    try {
      const res = await apiClient.get("/admin/bookings").catch(() => apiClient.get("/bookings/my")).catch(() => null);
      if (res && res.data && (Array.isArray(res.data.data) || Array.isArray(res.data))) {
        const raw = Array.isArray(res.data.data) ? res.data.data : res.data;
        apiBookings = raw.map((b: any, i: number) => ({
          id: String(b.id || `BKG-${i}`),
          label: `${b.bookingNumber || `#${b.id}`} - ${b.eventName || b.title || "Celebration"} (${b.location || "Location TBD"})`,
          date: b.eventDate ? new Date(b.eventDate).toISOString().split("T")[0] : "Upcoming",
          zoneId: b.zoneId || "zone-1",
        }));
      }
    } catch (e) {}

    setActiveBookings(apiBookings);
    if (apiBookings.length > 0) {
      setTargetBookingId(apiBookings[0].id);
    }

    let apiVendors: any[] = [];
    try {
      const res = await apiClient.get("/vendors").catch(() => apiClient.get("/admin/vendors")).catch(() => null);
      if (res && res.data && (Array.isArray(res.data.data) || Array.isArray(res.data))) {
        const raw = Array.isArray(res.data.data) ? res.data.data : res.data;
        apiVendors = raw.map((u: any) => ({
          id: String(u.id),
          name: u.businessName || u.name || "Vendor Partner",
          category: u.supportedServiceKeys?.map((k: string) => k.replace("-", " ")).join(", ") || u.category || "General Service",
          zone: u.zone || "Dhaka Zone",
          rating: u.rating ? String(u.rating) : "5.0",
          jobs: u.jobsCompleted || 0,
          verified: u.status === "VERIFIED" || u.verified,
          status: u.status || "VERIFIED",
          payoutRate: "Dynamic / OS Calculated",
          supportedServiceKeys: u.supportedServiceKeys || [],
          supportedZoneIds: u.supportedZoneIds || [],
        }));
      }
    } catch (e) {}

    setVendorsList(apiVendors);
  };

  useEffect(() => {
    fetchVendorsAndBookings();
    const handleUpdate = () => fetchVendorsAndBookings();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const handleApprove = (vendorId: string) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updated = users.map((u: any) => u.id === vendorId ? { ...u, status: "VERIFIED" } : u);
      localStorage.setItem("users", JSON.stringify(updated));
      fetchVendorsAndBookings();
      toast.success("Vendor Approved!");
    } catch (e) {}
  };

  const handleReject = (vendorId: string) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updated = users.map((u: any) => u.id === vendorId ? { ...u, status: "REJECTED" } : u);
      localStorage.setItem("users", JSON.stringify(updated));
      fetchVendorsAndBookings();
      toast.success("Vendor Rejected!");
    } catch (e) {}
  };

  const filteredVendors = vendorsList.filter((v) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !v.name.toLowerCase().includes(q) &&
        !v.category.toLowerCase().includes(q) &&
        !v.id.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (selectedCategory !== "All Categories" && !v.category.includes(selectedCategory)) {
      return false;
    }
    if (selectedZone !== "All Zones" && v.zone !== selectedZone) {
      return false;
    }
    return true;
  });

  const handleOpenDispatch = (vendor: VendorItemType) => {
    setSelectedVendor(vendor);
  };

  const handleAssignVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    const targetBooking = activeBookings.find(
      (b) => String(b.id) === String(targetBookingId)
    );
    if (!targetBooking) {
      toast.error("Please select a valid booking to dispatch");
      return;
    }

    if (typeof window !== "undefined") {
      try {
        // 1. Update Booking record to store assigned vendor & service
        const storedBookings = localStorage.getItem("customBookings");
        let bookingList = storedBookings ? JSON.parse(storedBookings) : [];
        const bIdx = bookingList.findIndex(
          (b: any) => String(b.id) === String(targetBookingId)
        );
        if (bIdx >= 0) {
          bookingList[bIdx].assignedVendorId = selectedVendor.id;
          bookingList[bIdx].assignedVendor = selectedVendor.name;
          bookingList[bIdx].assignedService = targetService;
          bookingList[bIdx].status = "CONFIRMED";
          bookingList[bIdx].bookingStatus = "confirmed";
          localStorage.setItem("customBookings", JSON.stringify(bookingList));
        }

        // 2. Create Explicit Task for the Vendor in Task Dispatch Hub
        const storedTasks = localStorage.getItem("customVendorTasks");
        let taskList = storedTasks ? JSON.parse(storedTasks) : [];

        const formattedDate = targetBooking.eventDate || targetBooking.date
          ? new Date(targetBooking.eventDate || targetBooking.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Upcoming";

        const newTask = {
          id: `TSK-${Date.now()}`,
          bookingRef: targetBooking.bookingNumber || `#${targetBooking.id}`,
          title: targetBooking.eventName || "Assigned Celebration Service",
          category: targetService.charAt(0).toUpperCase() + targetService.slice(1),
          zone: targetBooking.location || "Dhaka Zone",
          venue: targetBooking.location || "Venue TBD",
          date: formattedDate,
          duration: "Full Event Execution",
          payout: `৳${Number(
            targetBooking.grandTotal || targetBooking.budget || 35000
          ).toLocaleString("en-BD")} (Escrow)`,
          status: "In Progress",
          requirements: [
            {
              title: `${targetService.toUpperCase()} Service Delivery`,
              desc:
                dispatchNotes.trim() ||
                `Deliver high-quality ${targetService} services according to ZEYO platform standards.`,
            },
          ],
          coordinatorNotes:
            dispatchNotes.trim() || "Coordinate with Lead Event Coordinator upon arrival.",
          assignedVendorId: selectedVendor.id,
          assignedVendorName: selectedVendor.name,
          createdAt: new Date().toISOString(),
        };

        taskList.unshift(newTask);
        localStorage.setItem("customVendorTasks", JSON.stringify(taskList));

        // 3. Update Vendor Active Jobs count
        const storedVendors = localStorage.getItem("customVendors");
        let vList = storedVendors ? JSON.parse(storedVendors) : [];
        const vIdx = vList.findIndex((v: any) => String(v.id) === String(selectedVendor.id));
        if (vIdx >= 0) {
          vList[vIdx].jobs = (vList[vIdx].jobs || 0) + 1;
          localStorage.setItem("customVendors", JSON.stringify(vList));
        }

        setVendorsList((prev) =>
          prev.map((v) =>
            v.id === selectedVendor.id ? { ...v, jobs: (v.jobs || 0) + 1 } : v
          )
        );

        // 4. Optional Backend API Call Sync
        try {
          await apiClient.post("/admin/assignments", {
            vendorId: selectedVendor.id,
            bookingId: targetBooking.id,
            notes: dispatchNotes,
          }).catch(() => null);
        } catch (err) {}

        // Notify app components to re-render in real time
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        createNotification(
          "Vendor Assigned",
          `Partner "${selectedVendor.name}" successfully dispatched to ${targetBooking.bookingNumber || targetBooking.id} (${targetService}).`,
          "✅"
        );
      } catch (e) {
        console.warn("Failed to persist vendor dispatch locally", e);
      }
    }

    toast.success(`🚀 Vendor "${selectedVendor.name}" successfully dispatched!`, {
      duration: 4000,
    });
    setDispatchNotes("");
    setSelectedVendor(null);
  };

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
              Admin Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Managed Vendor Pool &amp; Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Customers never see individual vendor names or payout rates. As an EVENTO Admin Coordinator, use this panel to approve verified vendors and assign vetted background vendor teams to customer bookings.
            </p>
          </div>
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
            placeholder="Search vendors by name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[750px]">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Vendor Partner</th>
                <th className="px-6 py-4">Service Coverage</th>
                <th className="px-6 py-4">Status</th>
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
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {v.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{v.name}</p>
                          </div>
                          <p className="text-xs font-mono text-slate-400">
                            ID: {v.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 max-w-[200px] truncate">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {v.category || "None defined"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {v.status === "PENDING_VERIFICATION" ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                            Pending Approval
                          </span>
                          <button onClick={() => handleApprove(v.id)} className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleReject(v.id)} className="p-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200" title="Reject"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : v.status === "REJECTED" ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full">Rejected</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> Verified Partner
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${v.jobs > 0 ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-500"}`}>
                        {v.jobs} active {v.jobs === 1 ? "job" : "jobs"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDispatch(v)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No vendor partners match your search filters.
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
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selected Partner</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedVendor.name}</p>
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
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900"
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
                  Service Key to Fulfill
                </label>
                <select
                  value={targetService}
                  onChange={(e) => setTargetService(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900"
                >
                  {dynamicServices.map(s => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Vendor must have this service and the booking's zone configured in their profile.</p>
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
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center gap-1.5"
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
