"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays, MapPin, Plus, CheckCircle2, Circle, Star } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import PlatformReviewModal from "@/components/reviews/PlatformReviewModal";
import { NewBookingModal } from "@/components/dashboard/NewBookingModal";
import { useAppSelector } from "@/store/store";

const DEFAULT_MY_EVENTS = [
  {
    id: "EVT-2026-192",
    eventCode: "#EVT-2026-192",
    bookingNumber: "#BKG-2026-192",
    eventName: "Ahmed Weeding",
    eventType: "Wedding",
    eventDate: "2026-07-31",
    location: "Rajshahi District",
    bookingStatus: "confirmed",
    grandTotal: 200000,
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "EVT-2026-967",
    eventCode: "#EVT-2026-967",
    bookingNumber: "#BKG-2026-967",
    eventName: "Reception Celebration (Chattogram)",
    eventType: "Reception",
    eventDate: "2026-07-30",
    location: "Chattogram Metro",
    bookingStatus: "confirmed",
    grandTotal: 266225,
    createdAt: "2026-07-18T14:30:00Z",
  },
  {
    id: "EVT-2026-172",
    eventCode: "#EVT-2026-172",
    bookingNumber: "#BKG-2026-172",
    eventName: "Wedding Celebration (Dhaka)",
    eventType: "Wedding",
    eventDate: "2026-08-10",
    location: "Dhaka Metro",
    bookingStatus: "confirmed",
    grandTotal: 193000,
    createdAt: "2026-07-15T11:20:00Z",
  },
  {
    id: "EVT-2026-001",
    eventCode: "#EVT-2026-001",
    bookingNumber: "#BKG-2026-001",
    eventName: "Royal Wedding Ceremony",
    eventType: "Wedding",
    eventDate: "2026-11-15",
    location: "Gulshan Club, Dhaka",
    bookingStatus: "confirmed",
    grandTotal: 380000,
    createdAt: "2026-07-20T10:00:00Z",
  },
];

export default function MyEventsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const role = (user?.role || "customer").toLowerCase();

  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Events");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewEventName, setReviewEventName] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    let localCustom: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
        if (stored) {
          const parsed = JSON.parse(stored);
          localCustom = parsed.map((b: any, idx: number) => ({
            id: b.id || `CUSTOM-${idx}`,
            bookingNumber: b.bookingNumber || `#${b.id}`,
            eventName: b.eventName || b.notes || `${b.eventType || "Event"} Celebration`,
            eventType: b.eventType || "Custom Event",
            eventDate: b.eventDate ? new Date(b.eventDate).toISOString().split("T")[0] : "2026-11-15",
            location: b.location || b.address || "Dhaka Zone Venue",
            bookingStatus: (b.bookingStatus || b.status || "PENDING REVIEW").toLowerCase(),
            grandTotal: Number(b.grandTotal || b.budget || 143000),
            createdAt: b.createdAt || new Date().toISOString(),
          }));
        }
      } catch (e) {}
    }

    try {
      const response = await apiClient.get("/bookings/my").catch(() => apiClient.get("/customers/events"));
      if (response && response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const list = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
        const combined = [...localCustom, ...list];
        setEventsList(combined.length > 0 ? combined : [...localCustom, ...DEFAULT_MY_EVENTS]);
      } else {
        setEventsList([...localCustom, ...DEFAULT_MY_EVENTS]);
      }
    } catch (error) {
      setEventsList([...localCustom, ...DEFAULT_MY_EVENTS]);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchEvents();

    const handleUpdate = () => {
      fetchEvents();
    };

    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const filteredEvents = eventsList.filter((evt) => {
    const status = (evt.bookingStatus || evt.status || "pending").toLowerCase();
    if (activeTab === "Active" && status !== "confirmed" && status !== "in_progress") return false;
    if (activeTab === "Completed" && status !== "completed") return false;
    if (activeTab === "Pending" && status !== "pending" && status !== "pending review" && status !== "pending_review") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (evt.eventName || evt.notes || "").toLowerCase();
      const loc = (evt.location || evt.venue?.address || "").toLowerCase();
      return name.includes(q) || loc.includes(q);
    }
    return true;
  });

  const handleOpenNewEvent = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "in_progress":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "pending":
      case "pending review":
      case "pending_review":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const defaultSteps = [
    { label: "Created", done: true },
    { label: "Review", done: true },
    { label: "Confirmation", done: false },
    { label: "Execution", done: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {role === "admin" ? "All Platform Events" : "My Events"}
          </h1>
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
          <p className="text-sm text-slate-500 mt-1">
            {role === "admin"
              ? "Monitor progression stages and track all scheduled events across Bangladesh."
              : "Monitor event progression stages and track upcoming schedules."}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleOpenNewEvent}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Event
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["All Events", "Active", "Pending", "Completed"].map((tab) => (
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

        <div className="relative flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-300 focus:bg-white text-slate-900 transition-all duration-200"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-slate-400 font-medium">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((evt, idx) => {
            const status = evt.bookingStatus || evt.status || "pending";
            const steps = defaultSteps.map((step, stepIdx) => {
              if (status === "completed") return { ...step, done: true };
              if (status === "confirmed" && stepIdx <= 2) return { ...step, done: true };
              return step;
            });

            return (
              <div
                key={evt.id ? `${evt.id}-${idx}` : idx}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-purple-900/5 hover:-translate-y-1 hover:border-purple-200 transition-all duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                          {evt.eventCode || (String(evt.id).startsWith("#EVT") ? evt.id : `#EVT-${String(evt.id || "").replace("#", "").replace("BKG-", "")}`)}
                        </span>
                        {(evt.bookingNumber || evt.bookingRef) && (
                          <span className="text-[10px] font-mono text-slate-400 font-medium">
                            Linked Order: {evt.bookingNumber || evt.bookingRef}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">
                        {evt.eventTitle || evt.eventName || evt.notes || "Untitled Event"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(evt.eventDate || evt.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.location || evt.notes || evt.venue?.address || "Dhaka Zone Venue"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Budget</p>
                      <p className="text-lg font-bold text-slate-900">
                        ৳{Number(evt.budgetAmount || evt.grandTotal || evt.budget || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 transition-colors duration-300 group-hover:bg-purple-50/40 group-hover:border-purple-100">
                    <p className="text-xs font-semibold text-slate-700">Progression Stage</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {steps.map((step, i) => (
                        <div key={`step-${idx}-${i}`} className="flex flex-col items-center gap-1.5">
                          {step.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                          <span className={`text-[10px] font-semibold ${step.done ? "text-slate-900" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {status === "completed" ? (
                    <button
                      onClick={() => {
                        setReviewEventName(evt.eventTitle || evt.eventName || "Your Celebrated Event");
                        setReviewModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Rate EVENTO Platform
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Managed Event OS</span>
                  )}

                  <Link
                    href={`/dashboard/bookings/${evt.bookingNumber ? evt.bookingNumber.replace("#", "") : evt.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    View Event Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">No events found matching your filter.</p>
          </div>
        )}
      </div>

      <PlatformReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        eventName={reviewEventName}
      />
    </div>
  );
}