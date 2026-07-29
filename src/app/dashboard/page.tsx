"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  Sparkles,
  Users,
  Sliders,
  Wallet,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/store";
import apiClient from "@/lib/apiClient";

const DEFAULT_OVERVIEW_BOOKINGS = [
  {
    id: "BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventType: "Wedding",
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    location: "Gulshan Club, Dhaka Metro",
    budget: 380000,
    status: "CONFIRMED",
  },
  {
    id: "BKG-2026-002",
    eventName: "Gaye Holud Night Celebration",
    eventType: "Gaye Holud",
    eventDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    location: "Radisson Blu Water Garden, Dhaka",
    budget: 180000,
    status: "OPERATIONAL DISPATCH",
  },
  {
    id: "BKG-2026-003",
    eventName: "Corporate Tech Summit 2026",
    eventType: "Corporate",
    eventDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    location: "Bangabandhu Convention Hall, Dhaka",
    budget: 450000,
    status: "CONFIRMED",
  },
];

const DEFAULT_VENDOR_DISPATCHES = [
  {
    id: "TSK-001",
    title: "Royal Wedding Ceremony",
    category: "Photography",
    zone: "Dhaka Zone",
    venue: "Gulshan Club, Hall A",
    date: "Nov 15, 2026",
    payout: "৳35,000",
    status: "In Progress",
  },
  {
    id: "TSK-002",
    title: "Gaye Holud Night Celebration",
    category: "Decoration",
    zone: "Dhaka Zone",
    venue: "Banani Convention Hall",
    date: "Nov 13, 2026",
    payout: "৳65,000",
    status: "Confirmed",
  },
  {
    id: "TSK-003",
    title: "Corporate Annual Summit",
    category: "Audio/Visual & Sound",
    zone: "Chattogram Zone",
    venue: "Radisson Blu, Chattogram",
    date: "Dec 01, 2026",
    payout: "৳38,000",
    status: "Confirmed",
  },
];

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const role = (user?.role || "customer").toLowerCase();

  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Live countdown to nearest event ─────────────────────────────────────────
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const upcoming = bookings
        .map((b) => new Date(b.eventDate || Date.now()).getTime())
        .filter((t) => t > now)
        .sort((a, b) => a - b)[0];
      if (!upcoming) return;
      const diff = upcoming - now;
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [bookings]);

  // ── Auto-refresh every 30 seconds ────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => { fetchBookings(); }, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    let localCustom: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
        if (stored) localCustom = JSON.parse(stored);
      } catch (e) {}
    }

    try {
      const response = await apiClient.get("/bookings/my");
      let apiList: any[] = [];
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        apiList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
      }
      const combined = [...localCustom, ...apiList];
      setBookings(combined.length > 0 ? combined : DEFAULT_OVERVIEW_BOOKINGS);
    } catch (error) {
      const combined = [...localCustom, ...DEFAULT_OVERVIEW_BOOKINGS];
      setBookings(combined);
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

  const handleNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  const handleAddZone = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "add-zone" }));
  };

  const handleAddVendor = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-vendor" }));
  };

  const totalBudget = bookings.reduce(
    (acc, b) => acc + (Number(b.budget || b.grandTotal) || 0),
    0
  );
  const activeCount = bookings.filter(
    (b) => b.status !== "CANCELLED" && b.status !== "COMPLETED"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Role Banner & Header ──────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              {role === "vendor"
                ? "Vendor Partner Operations Portal"
                : role === "admin"
                ? "Admin Operations Center — Managed Event OS"
                : "Customer Celebration Portal"}
            </span>
            <p className="text-sm text-slate-300">
              {role === "vendor"
                ? "Dispatched technical tasks, venue specifications, and protected escrow payouts."
                : role === "admin"
                ? "Platform-wide management across all 7 Bangladesh zones, vendor onboarding, and task dispatches."
                : "All bookings, calculations, and vendor task dispatches are centralized by EVENTO Platform Operations."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/calculator"
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            + Smart Calculator
          </Link>
          <Link
            href="/packages"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            Browse Packages
          </Link>
        </div>
      </div>

      {/* ── Welcome Header per Role ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {role === "vendor"
                ? "Vendor Partner"
                : role === "admin"
                ? "System Administrator"
                : "Customer Portal"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "EVENTO User"}
          </h1>
          <p className="mt-1.5 text-slate-500 max-w-xl text-xs sm:text-sm leading-relaxed">
            {role === "vendor"
              ? "Access your assigned execution specifications, submit progress updates, and track escrow payouts with zero client identity exposure."
              : role === "admin"
              ? "Oversee platform financial margins, coordinate vendor partner dispatches, and manage zone pricing multipliers across Bangladesh."
              : "Track your active celebration milestones across Bangladesh, estimate budgets by zone, and communicate with EVENTO lead coordinators."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {role === "admin" ? (
            <>
              <button
                onClick={handleAddVendor}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Onboard Vendor
              </button>
              <button
                onClick={handleAddZone}
                className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2.5 rounded-xl font-bold transition-colors text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Zone
              </button>
            </>
          ) : role === "vendor" ? (
            <>
              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-xs"
              >
                <ClipboardList className="w-4 h-4" />
                My Task Board
              </Link>
              <Link
                href="/dashboard/earnings"
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold transition-colors text-xs"
              >
                <Wallet className="w-4 h-4" />
                Earnings
              </Link>
            </>
          ) : (
            <button
              onClick={handleNewBooking}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Custom Booking
            </button>
          )}
        </div>
      </div>

      {/* ── Role Specific KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === "vendor" ? (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <span className="text-lg font-black">৳</span>
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Assigned Escrow Payout
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                ৳ 138,000
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Protected in EVENTO Escrow for 3 Active Dispatches
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Active Dispatched Jobs
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                3 Dispatches
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Photography, Decoration & Sound System
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Partner Verified Status
                </h3>
              </div>
              <p className="text-2xl font-extrabold text-amber-600">
                4.9 ★ Verified
              </p>
              <p className="text-xs text-slate-500 mt-1">
                100% Quality & Timely Delivery Score
              </p>
            </div>
          </>
        ) : role === "admin" ? (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <span className="text-lg font-black">৳</span>
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Platform Managed Volume
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                ৳ 1,010,000
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across 7 Bangladesh Metropolitan & Regional Zones
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Active Vendor Partners
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                12 Partners
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Dhaka, Chattogram & Sylhet Coverage
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Platform Commission Rules
                </h3>
              </div>
              <p className="text-2xl font-extrabold text-purple-700">
                15.0% Margin
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Standard 5.0% BDT Tax / VAT Applied
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <span className="text-lg font-black">৳</span>
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Total Celebration Budget
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                ৳ {totalBudget.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across all your active Bangladesh celebrations
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Active Bookings
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {activeCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Coordinated by EVENTO Dispatch Officers
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm">
                  Escrow Guarantee
                </h3>
              </div>
              <p className="text-2xl font-extrabold text-emerald-700">
                100% Protected
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Zero vendor identity or price leakage
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Countdown Banner for Customer ──────────────────────────────────── */}
      {role === "customer" && (countdown.days > 0 || countdown.hours > 0) && (
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30">
              <Clock className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Next Event Countdown</p>
              <p className="text-sm font-bold text-white mt-0.5">Live time until your next celebration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Sec" },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <span className="text-2xl font-black text-white tabular-nums w-12 text-center">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Content Grid per Role ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed based on Role */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {role === "vendor" ? (
            <div>
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assigned Task Dispatches
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Technical event execution specifications assigned to your team
                  </p>
                </div>
                <Link
                  href="/dashboard/tasks"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700"
                >
                  Open Task Board →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {DEFAULT_VENDOR_DISPATCHES.map((task, idx) => (
                  <Link
                    key={task.id ? `dispatch-${task.id}-${idx}` : `dsp-idx-${idx}`}
                    href="/dashboard/tasks"
                    className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 font-bold text-indigo-700 text-xs">
                        {task.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">
                            {task.title}
                          </h3>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                            {task.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" /> {task.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {task.venue} ({task.zone})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="font-extrabold text-emerald-700">{task.payout}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 bg-emerald-100 text-emerald-800">
                          {task.status}
                        </span>
                      </div>
                      <div className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {role === "admin" ? "All Platform Bookings" : "Recent Celebrations (BDT ৳)"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {role === "admin"
                      ? "Track live celebrations and vendor assignments across Bangladesh"
                      : "Overview of your custom and calculated event bookings"}
                  </p>
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700"
                >
                  View All Bookings →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-12 text-center text-slate-400 font-medium">
                    Loading bookings...
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 font-semibold">
                      No bookings yet
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Click Add Custom Booking to get started
                    </p>
                  </div>
                ) : (
                  bookings.map((booking, idx) => (
                    <Link
                      key={booking.id ? `booking-${booking.id}-${idx}` : `idx-${idx}`}
                      href={`/dashboard/bookings/${booking.bookingNumber ? booking.bookingNumber.replace("#", "") : booking.id}`}
                      className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 font-bold text-purple-700 text-xs">
                          {booking.id ? String(booking.id).slice(-3) : "BKG"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {booking.eventName ||
                              booking.notes ||
                              booking.title ||
                              "Untitled Celebration"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-purple-600" />{" "}
                              {new Date(
                                booking.eventDate || Date.now()
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-purple-600" />{" "}
                              {booking.location || "Dhaka Metro"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="font-extrabold text-slate-900">
                            ৳{" "}
                            {Number(
                              booking.budget || booking.grandTotal || 0
                            ).toLocaleString()}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 bg-purple-100 text-purple-700">
                            {booking.bookingStatus ||
                              booking.status ||
                              "CONFIRMED"}
                          </span>
                        </div>
                        <div className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Role Shortcuts & Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {role === "vendor"
                  ? "Vendor Tools"
                  : role === "admin"
                  ? "Admin Control Desk"
                  : "Customer Portals"}
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {role === "vendor" ? (
                <>
                  <Link
                    href="/dashboard/tasks"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Task Execution Board
                        </p>
                        <p className="text-[11px] text-slate-500">
                          View technical requirements & GPS venue map
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/earnings"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Earnings & Escrow
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Track completed jobs & payout transfers
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/messages"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Dispatch Communication
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Coordinate with EVENTO Lead Officers
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </>
              ) : role === "admin" ? (
                <>
                  <Link
                    href="/dashboard/vendors"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Vendor Partner Onboarding
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Onboard & manage technical teams
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Bangladesh Zone Multipliers
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Configure pricing across 7 BD zones
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/dashboard/tasks"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Dispatch Task Monitor
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Monitor live vendor task progress
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          My Event Bookings
                        </p>
                        <p className="text-[11px] text-slate-500">
                          View event milestones & details
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/calculator"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Smart Event Calculator
                        </p>
                        <p className="text-[11px] text-slate-500">
                          4-step estimation for 7 BD zones
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/packages"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Curated Packages
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Explore wedding & corporate sets
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm">
            <h3 className="font-extrabold text-sm mb-1">
              {role === "vendor"
                ? "Need assistance with a dispatch?"
                : role === "admin"
                ? "Zone pricing management"
                : "Need custom zone calculation?"}
            </h3>
            <p className="text-xs text-purple-200 mb-4 leading-relaxed">
              {role === "vendor"
                ? "Contact the EVENTO Dispatch Desk directly from your Task Board or Messaging Hub."
                : role === "admin"
                ? "Adjust pricing multipliers and margin rules across Dhaka, Chattogram, Sylhet, and other BD zones."
                : "Use our interactive 4-step Smart Event Calculator to estimate any celebration in Dhaka, Chattogram, Sylhet, and beyond."}
            </p>
            <Link
              href={role === "vendor" ? "/dashboard/tasks" : role === "admin" ? "/dashboard/settings" : "/calculator"}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-purple-100 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />{" "}
              {role === "vendor" ? "Open Task Board" : role === "admin" ? "Manage Settings" : "Open Calculator"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
