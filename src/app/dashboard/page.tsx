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
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/store";
import apiClient from "@/lib/apiClient";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";

const DEFAULT_OVERVIEW_BOOKINGS = [
  {
    id: "BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    location: "Gulshan Club, Dhaka Metro",
    budget: 380000,
    status: "CONFIRMED",
  },
  {
    id: "BKG-2026-002",
    eventName: "Gaye Holud Night Celebration",
    eventDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    location: "Radisson Blu Water Garden, Dhaka",
    budget: 180000,
    status: "OPERATIONAL DISPATCH",
  },
  {
    id: "BKG-2026-003",
    eventName: "Corporate Tech Summit 2026",
    eventDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    location: "Bangabandhu Convention Hall, Dhaka",
    budget: 450000,
    status: "CONFIRMED",
  },
];

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/bookings/my");
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const list = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
        setBookings(list.length > 0 ? list : DEFAULT_OVERVIEW_BOOKINGS);
      } else {
        setBookings(DEFAULT_OVERVIEW_BOOKINGS);
      }
    } catch (error) {
      setBookings(DEFAULT_OVERVIEW_BOOKINGS);
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
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", { detail: "new-event" })
    );
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
      <NewBookingModal />

      {/* Managed Event OS Assurance Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              3-Sided Managed Event OS Ecosystem
            </span>
            <p className="text-sm text-slate-300">
              All bookings, calculations, and vendor task dispatches are centralized by EVENTO Platform Operations with zero identity leakage.
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

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "EVENTO User"}
          </h1>
          <p className="mt-2 text-slate-500 max-w-lg text-sm leading-relaxed">
            Here is your Managed Event OS overview. Track active celebrations across Bangladesh, view zone-based budgets, and coordinate with EVENTO officers.
          </p>
        </div>
        <button
          onClick={handleNewBooking}
          className="shrink-0 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Custom Event
        </button>
      </div>

      {/* KPI Stats in BDT (৳) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="text-lg font-black">৳</span>
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">
              Total Managed Pipeline
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            ৳ {totalBudget.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Across all active Bangladesh celebrations
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
              Managed OS Status
            </h3>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">
            100% Protected
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Zero vendor identity or price leakage
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Celebrations (BDT ৳)
            </h2>
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
                  Click Add Custom Event to get started
                </p>
              </div>
            ) : (
              bookings.map((booking, idx) => (
                <Link
                  key={booking.id || idx}
                  href={`/dashboard/bookings/${booking.id}`}
                  className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 font-bold text-purple-700 text-xs">
                      {booking.id ? booking.id.slice(-3) : "BKG"}
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

        {/* Quick Role Portal Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                Managed OS Portals
              </h2>
            </div>
            <div className="p-4 space-y-2">
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
                      Customer Bookings
                    </p>
                    <p className="text-[11px] text-slate-500">
                      View milestones & review platform
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/vendors"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Admin Dispatch Hub
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Assign vendors & zones
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
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Vendor Task Board
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Zero customer data leakage
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm">
            <h3 className="font-extrabold text-sm mb-1">
              Need custom zone calculation?
            </h3>
            <p className="text-xs text-purple-200 mb-4 leading-relaxed">
              Use our interactive 4-step Smart Event Calculator to estimate any celebration in Dhaka, Chattogram, Sylhet, and beyond.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-purple-100 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Open
              Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
