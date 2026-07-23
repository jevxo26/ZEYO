"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Plus, ShoppingBag, Clock, MapPin, Calendar, Search } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Bookings");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/bookings/my");
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const list = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
        setBookingsList(list);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleUpdate = () => {
      fetchBookings();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  const filteredBookings = bookingsList.filter((b) => {
    const status = (b.bookingStatus || b.status || "pending").toLowerCase();
    if (activeTab === "Pending" && status !== "pending") return false;
    if (activeTab === "Confirmed" && status !== "confirmed") return false;
    if (activeTab === "Completed" && status !== "completed") return false;
    if (activeTab === "Cancelled" && status !== "cancelled") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (b.eventName || b.notes || "").toLowerCase();
      const id = String(b.bookingNumber || b.id || "").toLowerCase();
      const loc = (b.location || b.venue?.address || "").toLowerCase();
      return name.includes(q) || id.includes(q) || loc.includes(q);
    }
    return true;
  });

  const pendingCount = bookingsList.filter(
    (b) => (b.bookingStatus || b.status || "pending").toLowerCase() === "pending"
  ).length;

  const handleOpenNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-event" }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <NewBookingModal />

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Management</h1>
          <p className="text-sm text-slate-500 mt-1">Review, track, and manage all your event bookings in one place.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingCount} Pending</span>
          </div>
          <button
            onClick={handleOpenNewBooking}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["All Bookings", "Pending", "Confirmed", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading bookings...</div>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              {/* Left: Event Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {b.bookingNumber || `#BKG-${b.id}`}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {b.eventName || b.notes || "Untitled Event"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(b.eventDate || b.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.location || b.venue?.address || "TBD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Budget + Status + Actions */}
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Budget</p>
                  <p className="text-base font-bold text-slate-900">
                    ${Number(b.grandTotal || b.budget || 0).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${getStatusColor(
                    b.bookingStatus || b.status
                  )}`}
                >
                  {b.bookingStatus || b.status || "PENDING"}
                </span>

                <Link
                  href={`/dashboard/bookings/${b.id}`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-slate-500">No bookings match your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
