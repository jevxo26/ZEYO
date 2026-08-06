"use client";

import { useEffect, useState, useCallback } from "react";
import { SlidersHorizontal, Plus, ShoppingBag, Clock, MapPin, Calendar, Search } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";
import { useAppSelector } from "@/store/store";

const DEFAULT_CUSTOMER_BOOKINGS: any[] = [];

export default function BookingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    let apiList: any[] = [];
    try {
      const endpoint = user?.role === "admin" ? "/admin/bookings" : "/bookings/my";
      const response = await apiClient.get(endpoint).catch(() => null);
      if (response && response.data && response.data.success !== false) {
        const rawData = response.data.data;
        apiList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
      }
    } catch (error) {}

    const uniqueBookings = apiList.filter(
      (b, idx, self) =>
        idx ===
        self.findIndex(
          (item) =>
            String(item.id || item.bookingNumber) ===
            String(b.id || b.bookingNumber)
        )
    );

    // Strict Newest First Order (Latest created booking / highest timestamp first)
    uniqueBookings.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.eventDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.eventDate || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return String(b.id || "").localeCompare(String(a.id || ""));
    });

    setBookingsList(uniqueBookings);
    setIsLoading(false);
    setLastRefreshed(new Date());
  }, [user?.email]);

  useEffect(() => {
    fetchBookings();

    const handleUpdate = () => {
      fetchBookings();
    };

    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
      clearInterval(interval);
    };
  }, [user?.email]);

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
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
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

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    setIsCancelling(true);
    
    const booking = bookingsList.find(b => b.id === cancelBookingId || b.bookingNumber === cancelBookingId);
    if (!booking) {
      setIsCancelling(false);
      setCancelBookingId(null);
      return;
    }
    
    try {
      await apiClient.post(`/bookings/${booking.id}/cancel`, { reason: "Customer cancelled from portal" });
    } catch (e) {
      console.warn("API cancel fallback:", e);
    }
    
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
        if (stored) {
          let list = JSON.parse(stored);
          const index = list.findIndex(
            (b: any) => String(b.id) === String(booking.id) || String(b.bookingNumber) === String(booking.id)
          );
          if (index >= 0) {
            list[index].bookingStatus = "cancelled";
            list[index].status = "CANCELLED";
            localStorage.setItem("customBookings", JSON.stringify(list));
            window.dispatchEvent(new CustomEvent("dashboard-data-update"));
          }
        }
      } catch(e) {}
    }
    
    setBookingsList(prev => prev.map(b => 
      b.id === booking.id ? { ...b, bookingStatus: "cancelled", status: "CANCELLED" } : b
    ));
    
    setIsCancelling(false);
    setCancelBookingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Management</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
            {lastRefreshed && (
              <span className="text-[10px] text-slate-400 font-medium">
                Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Review, track, and manage all your event bookings in one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2 transition-colors duration-200 hover:bg-amber-100">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingCount} Pending</span>
          </div>
          <Link
            href="/calculator"
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Smart Calculator
          </Link>
          <Link
            href="/packages"
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse Packages
          </Link>
          <button
            onClick={handleOpenNewBooking}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["All Bookings", "Pending", "Confirmed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
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
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-300 focus:bg-white text-slate-900 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading bookings...</div>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((b, idx) => (
            <div
              key={b.id ? `${b.id}-${idx}` : idx}
              className="group p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors duration-200"
            >
              {/* Left: Event Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-200 group-hover:bg-purple-50 group-hover:text-purple-600">
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
                    ৳{Number(b.grandTotal || b.budget || 0).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${getStatusColor(
                    b.bookingStatus || b.status
                  )}`}
                >
                  {b.bookingStatus || b.status || "PENDING"}
                </span>

                <div className="flex items-center gap-2">
                  {(b.bookingStatus || b.status || "pending").toLowerCase() !== "cancelled" && 
                   (b.bookingStatus || b.status || "pending").toLowerCase() !== "completed" && (
                    <button
                      onClick={() => setCancelBookingId(b.id || b.bookingNumber)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    href={`/dashboard/bookings/${b.bookingNumber ? b.bookingNumber.replace("#", "") : b.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-slate-500">No bookings match your current filter.</p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200 p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Booking</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCancelBookingId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
                disabled={isCancelling}
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center min-w-[100px]"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}