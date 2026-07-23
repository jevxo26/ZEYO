"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays, MapPin, Plus, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
export default function MyEventsPage() {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Events");

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/customers/events");
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const list = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
        setEventsList(list);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      setEventsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const handleUpdate = () => {
      fetchEvents();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  const filteredEvents = eventsList.filter((evt) => {
    const status = (evt.bookingStatus || evt.status || "pending").toLowerCase();
    if (activeTab === "Active" && status !== "confirmed" && status !== "in_progress") return false;
    if (activeTab === "Completed" && status !== "completed") return false;
    if (activeTab === "Pending" && status !== "pending") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (evt.eventName || evt.notes || "").toLowerCase();
      const loc = (evt.location || evt.venue?.address || "").toLowerCase();
      return name.includes(q) || loc.includes(q);
    }
    return true;
  });

  const handleOpenNewEvent = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-event" }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "in_progress":
        return "bg-emerald-100 text-emerald-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
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
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Events</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor event progression stages and track upcoming schedules.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleOpenNewEvent}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["All Events", "Active", "Pending", "Completed"].map((tab) => (
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

        <div className="relative flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-slate-400 font-medium">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const status = evt.bookingStatus || evt.status || "pending";
            const steps = defaultSteps.map((step, idx) => {
              if (status === "completed") return { ...step, done: true };
              if (status === "confirmed" && idx <= 2) return { ...step, done: true };
              return step;
            });

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between"
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
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {evt.bookingNumber || `#EVT-${evt.id}`}
                        </span>
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
                          {evt.location || evt.notes || evt.venue?.address || "TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Budget</p>
                      <p className="text-lg font-bold text-slate-900">
                        ${Number(evt.budgetAmount || evt.grandTotal || evt.budget || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                    <p className="text-xs font-semibold text-slate-700">Progression Stage</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
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
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/dashboard/bookings/${evt.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
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
    </div>
  );
}
