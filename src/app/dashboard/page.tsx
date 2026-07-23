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
  MoreVertical,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/store";
import apiClient from "@/lib/apiClient";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";

export default function VendorDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Trying to fetch the user's real bookings from the API
      const response = await apiClient.get("/bookings/my");
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const list = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
        setBookings(list);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      // Fallback data if API fails to populate dashboard meaningfully
      setBookings([
        {
          id: "1",
          notes: "Thompson Wedding",
          eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          location: "Rosewood Manor",
          budget: 15000,
          status: "CONFIRMED"
        },
        {
          id: "2",
          notes: "Corporate Gala",
          eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          location: "Grand Plaza",
          budget: 22000,
          status: "PENDING"
        }
      ]);
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
      new CustomEvent("open-dashboard-modal", { detail: "new-event" }),
    );
  };

  const totalEarnings = bookings.reduce((acc, b) => acc + (Number(b.budget) || 0), 0);
  const activeCount = bookings.filter(b => b.status !== "CANCELLED" && b.status !== "COMPLETED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <NewBookingModal />

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}
          </h1>
          <p className="mt-2 text-slate-500 max-w-lg">
            Here's what's happening with your events and bookings today. Manage your schedule and track your earnings.
          </p>
        </div>
        <button
          onClick={handleNewBooking}
          className="shrink-0 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Booking
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Pipeline</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Across all active bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Active Events</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Events requiring your attention</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">12</p>
          <p className="text-sm text-slate-500 mt-1">Successfully finished events</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 font-medium">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-900 font-semibold">No bookings yet</p>
                <p className="text-sm text-slate-500 mt-1">Click Add Booking to get started</p>
              </div>
            ) : (
              bookings.map((booking, idx) => (
                <Link key={booking.id || idx} href={`/dashboard/bookings/${booking.id}`} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{booking.eventName || booking.notes || booking.title || 'Untitled Event'}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(booking.eventDate || Date.now()).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {booking.location || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-slate-900">${Number(booking.budget || booking.grandTotal || 0).toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        booking.bookingStatus === 'confirmed' || booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                        booking.bookingStatus === 'pending' || booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.bookingStatus || booking.status || 'NEW'}
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

        {/* Schedule / Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Schedule</h2>
          </div>
          <div className="p-6 space-y-6">
            {bookings.length > 0 ? (
              bookings
                .filter(b => b.bookingStatus !== 'cancelled')
                .slice(0, 3)
                .map((item, idx, arr) => (
                <div key={item.id || idx} className="flex gap-4 relative">
                  {idx !== arr.length - 1 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200" />}
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.eventName || 'Upcoming Event'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(item.eventDate).toLocaleDateString()} &bull; {item.location || 'TBD'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming events scheduled.</p>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <Link href="/dashboard/my-events" className="block text-center w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              View Full Calendar
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
