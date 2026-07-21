"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Plus, ShoppingBag, Clock, MapPin, Calendar } from "lucide-react";

interface BookingItemType {
  id: string;
  event: string;
  date: string;
  client: string;
  zone: string;
  budget: string;
  pending: number;
  status: string;
}

const initialDefaultBookings: BookingItemType[] = [
  {
    id: "#EVT-8924",
    event: "Corporate Gala",
    date: "Oct 15, 2024",
    client: "Acme Corp Ltd.",
    zone: "Dhaka - Gulshan (Zone A)",
    budget: "৳ 1,250,000",
    pending: 2,
    status: "Pending",
  },
  {
    id: "#EVT-4912",
    event: "Anniversary Dinner",
    date: "Nov 02, 2024",
    client: "Dr. Fahim Rahman",
    zone: "Dhaka - Dhanmondi (Zone B)",
    budget: "৳ 350,000",
    pending: 1,
    status: "Confirmed",
  },
  {
    id: "#EVT-3401",
    event: "Grand Wedding Reception",
    date: "Dec 20, 2024",
    client: "Karim Family",
    zone: "Chittagong Metro (Zone C)",
    budget: "৳ 2,800,000",
    pending: 5,
    status: "Active",
  },
  {
    id: "#EVT-2198",
    event: "Startup Product Launch",
    date: "Nov 18, 2024",
    client: "TechVenture BD",
    zone: "Dhaka - Banani (Zone A)",
    budget: "৳ 550,000",
    pending: 0,
    status: "Completed",
  },
];

const statusStyle = (status: string) => {
  if (status === "Confirmed") return { bg: "rgba(124,58,237,0.1)", color: "#7c3aed" };
  if (status === "Pending") return { bg: "rgba(245,158,11,0.1)", color: "#d97706" };
  if (status === "Active") return { bg: "rgba(37,99,235,0.1)", color: "#2563eb" };
  return { bg: "rgba(16,185,129,0.1)", color: "#059669" };
};

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<BookingItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Bookings");

  const loadBookings = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_bookings");
      if (stored) {
        setBookingsList(JSON.parse(stored));
      } else {
        localStorage.setItem("dashboard_bookings", JSON.stringify(initialDefaultBookings));
        setBookingsList(initialDefaultBookings);
      }
    }
  };

  useEffect(() => {
    loadBookings();

    const handleUpdate = () => {
      loadBookings();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  const filteredBookings = bookingsList.filter((b) => {
    if (activeTab === "Pending" && b.status !== "Pending") return false;
    if (activeTab === "Confirmed" && b.status !== "Confirmed") return false;
    if (activeTab === "Active" && b.status !== "Active") return false;
    if (activeTab === "Completed" && b.status !== "Completed") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.event.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.client.toLowerCase().includes(q) ||
        b.zone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPending = bookingsList.reduce((acc, curr) => acc + (curr.pending || 0), 0);

  const handleOpenNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", transform: "translate(40%,-40%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Booking Management</h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">Review confirmed bookings and assign vendors to pending services.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Clock size={13} />
              <span>{totalPending} Pending</span>
            </div>
            <button
              onClick={handleOpenNewBooking}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 flex items-center gap-2 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
            >
              <Plus size={13} /> New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-3 items-center"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 15px rgba(124,58,237,0.05)",
        }}
      >
        {["All Bookings", "Pending", "Confirmed", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            style={
              activeTab === tab
                ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", boxShadow: "0 3px 10px rgba(124,58,237,0.25)" }
                : { background: "rgba(124,58,237,0.06)", color: "#6b7280", border: "1px solid rgba(124,58,237,0.1)" }
            }
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="px-3 py-1.5 text-xs rounded-lg border border-purple-100 outline-none text-gray-700 bg-white"
          />
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
            style={{ background: "rgba(124,58,237,0.06)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.12)" }}
          >
            <SlidersHorizontal size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => {
            const st = statusStyle(b.status);
            return (
              <div
                key={b.id}
                className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(124,58,237,0.1)",
                  boxShadow: "0 4px 15px rgba(124,58,237,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Left: ID + Event Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))", color: "#7c3aed" }}
                  >
                    <ShoppingBag size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold" style={{ color: "#7c3aed" }}>{b.id}</span>
                      {b.pending > 0 && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.15)", color: "#d97706" }}
                        >
                          {b.pending} vendors needed
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{b.event}</p>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar size={10} className="text-purple-400" /> {b.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-400" /> {b.zone}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Budget + Status + Actions */}
                <div className="flex items-center gap-4 shrink-0 flex-wrap sm:flex-nowrap">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-medium">Budget</p>
                    <p className="text-sm font-black text-gray-900">{b.budget}</p>
                    <p className="text-[10px] text-gray-400">{b.client}</p>
                  </div>

                  <span
                    className="text-[9px] font-bold px-3 py-1 rounded-full"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {b.status}
                  </span>

                  <button
                    className="px-4 py-2 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 3px 10px rgba(124,58,237,0.2)" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-purple-100">
            <p className="text-sm font-semibold text-gray-500">No bookings found matching filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
