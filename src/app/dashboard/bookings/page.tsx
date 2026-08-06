"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Plus, ShoppingBag, Clock, MapPin, Calendar, Search } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";

const DEFAULT_CUSTOMER_BOOKINGS = [
  {
    id: "BKG-2026-NUSRAT",
    bookingNumber: "BKG-2026-NUSRAT",
    eventName: "Nusrat & Fahim Grand Reception",
    eventType: "Reception",
    eventDate: "2026-12-30",
    location: "Chattogram Grand Ballroom",
    bookingStatus: "pending",
    grandTotal: 285000,
    subtotal: 285000,
    tax: 0,
    discount: 0,
    customerName: "Nusrat Jahan",
    customerPhone: "+880 1819 776655",
    customerEmail: "nusrat.reception@gmail.com",
    createdAt: "2026-08-06T10:09:00Z",
    notes: "Nusrat & Fahim Grand Reception - Chattogram (300 Guests). Smart Calculator Custom Booking.",
    services: [
      { name: "Photography", tier: "Premium Candid Team", price: 15000 },
      { name: "Videography", tier: "4K Cinematic Teaser & Film", price: 45000 },
      { name: "Catering", tier: "Royal Reception Banquet", price: 175000 },
      { name: "Decoration", tier: "Floral Stage & Entry Arch", price: 50000 },
    ],
  },
  {
    id: "BKG-2026-AHMED",
    bookingNumber: "BKG-2026-AHMED",
    eventName: "Ahmed Wedding Gala",
    eventType: "Wedding",
    eventDate: "2026-12-24",
    location: "Radisson Blu, Dhaka North",
    bookingStatus: "pending",
    grandTotal: 350000,
    subtotal: 350000,
    tax: 0,
    discount: 0,
    customerName: "Ahmed Tanvir",
    customerPhone: "+880 1711 009988",
    customerEmail: "ahmed.wedding@gmail.com",
    createdAt: "2026-08-06T10:06:00Z",
    notes: "Ahmed Wedding - Dhaka North (350 Guests). Calculated & Booked via Smart Calculator.",
    services: [
      { name: "Photography", tier: "Luxury Master Team", price: 18000 },
      { name: "Videography", tier: "4K Cinematic & Drone", price: 40000 },
      { name: "Catering", tier: "Imperial Grand Menu", price: 220000 },
      { name: "Decoration", tier: "Royal Floral Stage", price: 72000 },
    ],
  },
  {
    id: "BKG-2026-001",
    bookingNumber: "BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventType: "Wedding",
    eventDate: "2026-11-15",
    location: "Gulshan Club, Dhaka",
    bookingStatus: "confirmed",
    grandTotal: 380000,
    subtotal: 360000,
    tax: 20000,
    discount: 0,
    createdAt: "2026-07-20T10:00:00Z",
    notes: "Wedding Premium Package with Photography, Videography & Catering (400 Guests). Managed by EVENTO Operations.",
    services: [
      { name: "Photography", tier: "Premium", price: 35000 },
      { name: "Videography", tier: "Premium", price: 40000 },
      { name: "Catering", tier: "Premium", price: 240000 },
      { name: "Decoration", tier: "Standard", price: 45000 },
    ],
  },
  {
    id: "BKG-2026-002",
    bookingNumber: "BKG-2026-002",
    eventName: "Gaye Holud Night Celebration",
    eventType: "Gaye Holud",
    eventDate: "2026-11-13",
    location: "Banani Convention Hall, Dhaka",
    bookingStatus: "pending",
    grandTotal: 180000,
    subtotal: 170000,
    tax: 10000,
    discount: 0,
    createdAt: "2026-07-25T14:30:00Z",
    notes: "Holud Special Decor + Stage Lighting & Live DJ. Managed by EVENTO Coordinator.",
    services: [
      { name: "Decoration", tier: "Premium", price: 65000 },
      { name: "Stage & Lighting", tier: "Standard", price: 45000 },
      { name: "DJ & Sound System", tier: "Basic", price: 30000 },
      { name: "Photography", tier: "Basic", price: 25000 },
    ],
  },
];

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    let localCustom: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem("customBookings") ||
          localStorage.getItem("custom_bookings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localCustom = parsed;
          }
        }
      } catch (e) {}
    }

    let apiList: any[] = [];
    try {
      const response = await apiClient.get("/bookings/my").catch(() => null);
      if (response && response.data && response.data.success !== false) {
        const rawData = response.data.data;
        apiList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
      }
    } catch (error) {}

    const combinedPool = [...localCustom, ...apiList, ...DEFAULT_CUSTOMER_BOOKINGS];
    const uniqueBookings = combinedPool.filter(
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
  };

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
          {["All Bookings", "Pending", "Confirmed", "Completed", "Cancelled"].map((tab) => (
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

                <Link
                  href={`/dashboard/bookings/${b.bookingNumber ? b.bookingNumber.replace("#", "") : b.id}`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
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