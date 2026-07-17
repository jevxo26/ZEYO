"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays, MapPin, Plus } from "lucide-react";

interface EventStep {
  label: string;
  done: boolean;
}

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  budget: string;
  status: string;
  steps: EventStep[];
}

const initialDefaultEvents: EventItem[] = [
  {
    id: "#EVT-9112",
    name: "Annual Corporate Gala 2024",
    date: "Oct 15, 2024",
    location: "Dhaka Zone A",
    budget: "৳ 4,500,000",
    status: "Active",
    steps: [
      { label: "Submitted", done: true },
      { label: "Admin Review", done: true },
      { label: "Vendor Match", done: true },
      { label: "Execution", done: false },
    ],
  },
  {
    id: "#EVT-7203",
    name: "Tech Summit Retreat",
    date: "Mar 10, 2024",
    location: "Sylhet Resort",
    budget: "৳ 2,100,000",
    status: "Completed",
    steps: [
      { label: "Submitted", done: true },
      { label: "Admin Review", done: true },
      { label: "Vendor Match", done: true },
      { label: "Executed", done: true },
    ],
  },
];

const statusStyle = (status: string) => {
  if (status === "Active") return { bg: "rgba(16,185,129,0.1)", color: "#059669" };
  if (status === "Completed") return { bg: "rgba(124,58,237,0.1)", color: "#7c3aed" };
  return { bg: "rgba(245,158,11,0.1)", color: "#d97706" };
};

export default function MyEventsPage() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Events");

  const loadEvents = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboard_events");
      if (stored) {
        setEventsList(JSON.parse(stored));
      } else {
        localStorage.setItem("dashboard_events", JSON.stringify(initialDefaultEvents));
        setEventsList(initialDefaultEvents);
      }
    }
  };

  useEffect(() => {
    loadEvents();

    const handleUpdate = () => {
      loadEvents();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  const filteredEvents = eventsList.filter((evt) => {
    // Tab filter
    if (activeTab === "Active" && evt.status !== "Active") return false;
    if (activeTab === "Completed" && evt.status !== "Completed") return false;
    if (activeTab === "Drafts" && evt.status !== "Draft") return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        evt.name.toLowerCase().includes(q) ||
        evt.id.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNewEvent = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-event" }));
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", transform: "translate(40%,-40%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">My Events</h1>
            <p className="text-sm text-purple-200 mt-1 font-medium">Monitor and track event progression stages and matching statuses.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Search size={13} className="text-purple-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="bg-transparent text-xs font-medium text-white placeholder-purple-300 outline-none w-32"
              />
            </div>
            <button
              onClick={handleOpenNewEvent}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-700 cursor-pointer shrink-0"
              style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
            >
              <Plus size={13} /> New Event
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All Events", "Active", "Completed", "Drafts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={
              activeTab === tab
                ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", boxShadow: "0 3px 10px rgba(124,58,237,0.25)" }
                : { background: "rgba(255,255,255,0.8)", color: "#6b7280", border: "1px solid rgba(124,58,237,0.12)" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const st = statusStyle(evt.status);
            const doneCount = evt.steps ? evt.steps.filter((s) => s.done).length : 0;
            const stepsLength = evt.steps ? evt.steps.length : 1;

            return (
              <div
                key={evt.id}
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(124,58,237,0.1)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Top Row */}
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {evt.status}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">{evt.id}</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 mt-2">{evt.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                      <CalendarDays size={11} className="text-purple-400" />
                      {evt.date}
                      <span className="text-gray-300">•</span>
                      <MapPin size={11} className="text-blue-400" />
                      {evt.location}
                    </p>
                  </div>
                  <div
                    className="px-4 py-2.5 rounded-xl text-right"
                    style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)" }}
                  >
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Budget</p>
                    <p className="text-base font-black mt-0.5" style={{ color: "#7c3aed" }}>{evt.budget}</p>
                  </div>
                </div>

                {/* Progress Pipeline */}
                {evt.steps && evt.steps.length > 0 && (
                  <div
                    className="p-4 rounded-xl relative pt-8"
                    style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.08)" }}
                  >
                    {/* Track */}
                    <div
                      className="absolute left-8 right-8 h-0.5 rounded-full"
                      style={{ top: "28px", background: "rgba(124,58,237,0.1)" }}
                    />
                    {/* Progress fill */}
                    <div
                      className="absolute left-8 h-0.5 rounded-full"
                      style={{
                        top: "28px",
                        width: `${((doneCount - 1) / (stepsLength - 1)) * (100 - 8)}%`,
                        background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                        maxWidth: "calc(100% - 4rem)",
                      }}
                    />

                    <div className="flex justify-between items-start relative z-10">
                      {evt.steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 text-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm"
                            style={
                              step.done
                                ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white" }
                                : { background: "white", color: "#9ca3af", border: "2px solid rgba(124,58,237,0.15)" }
                            }
                          >
                            {step.done ? "✓" : i + 1}
                          </div>
                          <span
                            className="text-[9px] font-bold"
                            style={{ color: step.done ? "#374151" : "#9ca3af" }}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid rgba(124,58,237,0.08)" }}>
                  <button className="text-xs font-bold px-4 py-2 rounded-xl cursor-pointer" style={{ color: "#7c3aed" }}>
                    {evt.status === "Completed" ? "Invoice PDF" : "Support Check"}
                  </button>
                  <button
                    className="text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", boxShadow: "0 3px 10px rgba(124,58,237,0.2)" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-purple-100">
            <p className="text-sm font-semibold text-gray-500">No events found matching filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
