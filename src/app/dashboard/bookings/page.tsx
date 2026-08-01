"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  ShoppingBag,
  Clock,
  MapPin,
  Calendar,
  Search,
  ChevronRight,
  CheckCircle2,
  Coins,
  Calculator,
  Gift,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

// ─────────────────────────────────────────────────────────────────────────
// Types + fallback data
// ─────────────────────────────────────────────────────────────────────────
type Booking = {
  id?: string;
  bookingNumber?: string;
  eventName?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  bookingStatus?: string;
  status?: string;
  grandTotal?: number;
  budget?: number;
  createdAt?: string;
  notes?: string;
  venue?: { address?: string };
  commission?: number;
};

const DEFAULT_CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: "BKG-2026-001",
    bookingNumber: "BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventType: "Wedding",
    eventDate: "2026-11-15",
    location: "Gulshan Club, Dhaka",
    bookingStatus: "confirmed",
    grandTotal: 380000,
    createdAt: "2026-07-20T10:00:00Z",
    notes: "Wedding Premium Package with Photography, Videography & Catering (400 Guests).",
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
    createdAt: "2026-07-25T14:30:00Z",
    notes: "Holud Special Decor + Stage Lighting & Live DJ.",
  },
];

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

// Figma uses "Complete" as the short label; keep the filter value as
// "Completed" so it still matches booking.bookingStatus === "completed".
const TAB_LABELS: Record<Tab, string> = {
  All: "All",
  Pending: "Pending",
  Confirmed: "Confirmed",
  Completed: "Complete",
  Cancelled: "Cancelled",
};

// ─────────────────────────────────────────────────────────────────────────
// Status styling — shared by mobile + desktop
// ─────────────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { badge: string; dot: string; bar: string }> = {
  confirmed: { badge: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500", bar: "bg-blue-500" },
  pending: { badge: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500", bar: "bg-amber-500" },
  completed: { badge: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  cancelled: { badge: "bg-rose-50 text-rose-600 border-rose-200", dot: "bg-rose-500", bar: "bg-rose-500" },
};

function statusStyle(status: string) {
  return (
    STATUS_STYLES[status?.toLowerCase()] ?? {
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
      bar: "bg-slate-300",
    }
  );
}

function formatMoney(n: number) {
  return `৳${Number(n || 0).toLocaleString()}`;
}

function formatDate(d?: string) {
  if (!d) return "TBD";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Commission isn't part of the booking payload yet — display an estimated
// platform commission (15%) so the UI has something to show, same as Figma.
function estimateCommission(b: Booking) {
  if (typeof b.commission === "number") return b.commission;
  return Math.round((b.grandTotal || b.budget || 0) * 0.15);
}

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const fetchBookings = async () => {
    setIsLoading(true);
    let localCustom: Booking[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
        if (stored) localCustom = JSON.parse(stored);
      } catch (e) {}
    }

    try {
      const response = await apiClient.get("/bookings/my");
      let apiList: Booking[] = [];
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        apiList = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
      }
      const combined = [...localCustom, ...apiList];
      setBookingsList(combined.length > 0 ? combined : DEFAULT_CUSTOMER_BOOKINGS);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      setBookingsList([...localCustom, ...DEFAULT_CUSTOMER_BOOKINGS]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const handleUpdate = () => fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      const status = (b.bookingStatus || b.status || "pending").toLowerCase();
      if (activeTab !== "All" && status !== activeTab.toLowerCase()) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = (b.eventName || b.notes || "").toLowerCase();
        const id = String(b.bookingNumber || b.id || "").toLowerCase();
        const loc = (b.location || b.venue?.address || "").toLowerCase();
        return name.includes(q) || id.includes(q) || loc.includes(q);
      }
      return true;
    });
  }, [bookingsList, activeTab, searchQuery]);

  const pendingCount = bookingsList.filter(
    (b) => (b.bookingStatus || b.status || "pending").toLowerCase() === "pending"
  ).length;

  const desktopStats = useMemo(() => {
    const confirmedValue = bookingsList
      .filter((b) => (b.bookingStatus || b.status || "").toLowerCase() === "confirmed")
      .reduce((sum, b) => sum + (b.grandTotal || b.budget || 0), 0);
    const totalCommission = bookingsList.reduce((sum, b) => sum + estimateCommission(b), 0);
    return { confirmedValue, totalCommission };
  }, [bookingsList]);

  const handleOpenNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============================= MOBILE (Figma) ============================= */}
      <div className="lg:hidden -m-6 lg:m-0 px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-slate-900">My Bookings</h1>
          {/* Search toggles inline — keeps the Figma header clean (title only)
              while still letting people filter a long list. */}
          <button
            onClick={() => setSearchOpen((p) => !p)}
            aria-label="Search bookings"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              searchOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Search size={16} />
          </button>
        </div>

        {searchOpen && (
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
            />
          </div>
        )}

        {/* Filter pills — horizontally scrollable */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Card list */}
        <div className="flex flex-col gap-3 pb-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-slate-100 animate-pulse" />
            ))
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm font-semibold text-slate-500">No bookings match your filter.</p>
            </div>
          ) : (
            filteredBookings.map((b, idx) => {
              const status = (b.bookingStatus || b.status || "pending").toLowerCase();
              const style = statusStyle(status);
              const total = b.grandTotal || b.budget || 0;
              const shortId = (b.bookingNumber || b.id || "").toString().replace("BKG-2026-", "BK-");

              return (
                <Link
                  key={b.id ? `${b.id}-${idx}` : idx}
                  href={`/dashboard/bookings/${b.bookingNumber ? b.bookingNumber.replace("#", "") : b.id}`}
                  className="block rounded-2xl bg-white border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {b.eventName || b.notes || "Untitled Event"}
                    </h3>
                    <span className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-100 rounded-md px-1.5 py-0.5">
                      {shortId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400 font-medium truncate">
                      {b.eventType || "Event"} • {b.location || b.venue?.address || "TBD"}
                    </p>
                    <span className="shrink-0 text-[10px] text-slate-400 font-medium ml-2">
                      {formatDate(b.eventDate || b.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                        ৳
                      </span>
                      <span className="text-base font-extrabold text-slate-900">{formatMoney(total)}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${style.badge}`}>
                      {status}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-amber-600 mt-1.5">
                    Commission: {formatMoney(estimateCommission(b))}
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* ============================= DESKTOP / TABLET (own design) ============================= */}
      <div className="hidden lg:block space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Management</h1>
            <p className="text-sm text-slate-500 mt-1">Review, track, and manage all your event bookings in one place.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/calculator"
              className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" /> Smart Calculator
            </Link>
            <Link
              href="/packages"
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 hover:border-amber-300 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5" /> Browse Packages
            </Link>
            <button
              onClick={handleOpenNewBooking}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Booking
            </button>
          </div>
        </div>

        {/* KPI stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
              <p className="text-xl font-extrabold text-slate-900">{bookingsList.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
              <p className="text-xl font-extrabold text-slate-900">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirmed Value</p>
              <p className="text-xl font-extrabold text-slate-900 truncate">{formatMoney(desktopStats.confirmedValue)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Commission</p>
              <p className="text-xl font-extrabold text-slate-900 truncate">{formatMoney(desktopStats.totalCommission)}</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-black text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-300 focus:bg-white text-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Data table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[3px_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span />
            <span className="flex items-center gap-1.5"><ListChecks className="w-3 h-3" /> Event</span>
            <span>Date</span>
            <span>Location</span>
            <span>Budget</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 font-medium">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-semibold text-slate-500">No bookings match your current filter.</p>
              </div>
            ) : (
              filteredBookings.map((b, idx) => {
                const status = (b.bookingStatus || b.status || "pending").toLowerCase();
                const style = statusStyle(status);
                const total = b.grandTotal || b.budget || 0;

                return (
                  <div
                    key={b.id ? `${b.id}-${idx}` : idx}
                    className="group grid grid-cols-[3px_2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center py-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* Status accent bar */}
                    <span className={`self-stretch rounded-full ${style.bar}`} />

                    <div className="flex items-center gap-3 min-w-0 pl-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-slate-400">
                          {b.bookingNumber || `#BKG-${b.id}`}
                        </p>
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {b.eventName || b.notes || "Untitled Event"}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {formatDate(b.eventDate || b.createdAt)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.location || b.venue?.address || "TBD"}</span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">{formatMoney(total)}</p>
                      <p className="text-[10px] font-semibold text-amber-600">
                        Comm. {formatMoney(estimateCommission(b))}
                      </p>
                    </div>

                    <span className={`w-fit text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${style.badge} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {status}
                    </span>

                    <Link
                      href={`/dashboard/bookings/${b.bookingNumber ? b.bookingNumber.replace("#", "") : b.id}`}
                      className="justify-self-end mr-6 flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}