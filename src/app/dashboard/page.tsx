"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Star,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

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

export default function VendorDashboard() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [bookingsList, setBookingsList] = useState<BookingItemType[]>([]);

  const loadData = () => {
    if (typeof window !== "undefined") {
      const storedEvents = localStorage.getItem("dashboard_events");
      const storedBookings = localStorage.getItem("dashboard_bookings");

      if (storedEvents) setEventsList(JSON.parse(storedEvents));
      if (storedBookings) setBookingsList(JSON.parse(storedBookings));
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
    };
  }, []);

  // Compute stats
  const totalEarnings = bookingsList.reduce((acc, b) => {
    const numeric = parseInt(b.budget.replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const activeEventsCount = eventsList.filter(
    (e) => e.status === "Active",
  ).length;
  const completedEventsCount = eventsList.filter(
    (e) => e.status === "Completed",
  ).length;
  const completionRate =
    eventsList.length > 0
      ? ((completedEventsCount / eventsList.length) * 100).toFixed(1)
      : "100";

  const kpis = [
    {
      label: "Total Earnings",
      val: `৳ ${totalEarnings.toLocaleString()}`,
      meta: "+12.4%",
      positive: true,
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)",
      glow: "rgba(124,58,237,0.25)",
      bg: "rgba(124,58,237,0.08)",
      desc: "Sum of all event budgets",
    },
    {
      label: "Active Events",
      val: activeEventsCount.toString(),
      meta: `${eventsList.length - activeEventsCount - completedEventsCount} Drafts`,
      positive: true,
      icon: Calendar,
      gradient: "linear-gradient(135deg, #2563eb, #0ea5e9)",
      glow: "rgba(37,99,235,0.25)",
      bg: "rgba(37,99,235,0.08)",
      desc: "Currently running projects",
    },
    {
      label: "Pending Reviews",
      val: "3",
      meta: "Action Needed",
      positive: false,
      icon: Star,
      gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
      glow: "rgba(245,158,11,0.2)",
      bg: "rgba(245,158,11,0.08)",
      desc: "Awaiting customer feedback",
    },
    {
      label: "Completion Rate",
      val: `${completionRate}%`,
      meta: "Top Tier",
      positive: true,
      icon: CheckCircle,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "rgba(16,185,129,0.2)",
      bg: "rgba(16,185,129,0.08)",
      desc: "Completed vs total events",
    },
  ];

  const recentActivity = [
    {
      label: "Photography - Thompson Wedding",
      time: "2h ago",
      status: "Confirmed",
      statusColor: "#7c3aed",
    },
    {
      label: "Catering - Johnson Corporate",
      time: "5h ago",
      status: "Pending",
      statusColor: "#f59e0b",
    },
    {
      label: "Florist - Martinez Quinceañera",
      time: "1d ago",
      status: "Completed",
      statusColor: "#10b981",
    },
  ];

  const schedule = [
    {
      day: "WED",
      date: "11",
      time: "09:00 AM",
      label: "Venue Walkthrough",
      location: "Grand Plaza",
    },
    {
      day: "FRI",
      date: "13",
      time: "02:00 PM",
      label: "Client Meeting",
      location: "Virtual",
    },
    {
      day: "SUN",
      date: "15",
      time: "08:00 AM",
      label: "Thompson Wedding",
      location: "Rosewood Manor",
    },
  ];

  const handleManageTasks = () => {
    window.dispatchEvent(
      new CustomEvent("open-dashboard-modal", { detail: "new-event" }),
    );
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Premium Member
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Welcome back, Sarah! 👋
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Here&apos;s a complete summary of your event operations and
              financials today.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleManageTasks}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              New Event <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: k.gradient,
                  boxShadow: `0 4px 12px ${k.glow}`,
                }}
              >
                <k.icon size={18} className="text-white" />
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: k.positive
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(245,158,11,0.1)",
                  color: k.positive ? "#059669" : "#d97706",
                }}
              >
                {k.meta}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {k.label}
              </p>
              <p
                className="text-2xl font-black text-gray-900 mt-0.5"
                style={{ letterSpacing: "-0.03em" }}
              >
                {k.val}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">{k.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Assignments + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Assignments + Activity */}
        <div className="lg:col-span-2 space-y-5">
          {/* Featured Assignment */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.12)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <div
              className="p-5 border-b flex justify-between items-center"
              style={{ borderColor: "rgba(124,58,237,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Briefcase size={15} style={{ color: "#7c3aed" }} />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  New Assignment
                </h3>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-[10px] font-bold flex items-center gap-0.5"
                style={{ color: "#7c3aed" }}
              >
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="p-5 flex flex-col sm:flex-row gap-5">
              <div
                className="w-full sm:w-28 h-22 rounded-xl overflow-hidden shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200')`,
                  minHeight: "88px",
                }}
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      Photography — Thompson Wedding
                    </h4>
                    <span
                      className="text-[9px] font-bold px-2.5 py-0.5 rounded-full shrink-0 text-white"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      }}
                    >
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <Calendar size={11} className="text-purple-400" />
                    Oct 15, 2024
                    <span className="mx-0.5">•</span>
                    <MapPin size={11} className="text-blue-400" />
                    Grand Plaza Hotel
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href="/dashboard/tasks"
                    className="text-[10px] font-bold px-4 py-2 rounded-xl text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      boxShadow: "0 3px 10px rgba(124,58,237,0.2)",
                    }}
                  >
                    View Details
                  </Link>
                  <button
                    className="text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                    style={{
                      border: "1px solid rgba(124,58,237,0.2)",
                      color: "#7c3aed",
                    }}
                  >
                    Contact Client
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.12)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <div
              className="p-5 border-b flex justify-between items-center"
              style={{ borderColor: "rgba(124,58,237,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={15} style={{ color: "#7c3aed" }} />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Recent Activity
                </h3>
              </div>
            </div>
            <div
              className="divide-y"
              style={{ borderColor: "rgba(124,58,237,0.06)" }}
            >
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: item.statusColor }}
                    />
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {item.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </span>
                    <span
                      className="text-[9px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: `${item.statusColor}18`,
                        color: item.statusColor,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Schedule */}
        <div
          className="rounded-2xl p-5 space-y-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1e0a3c 0%, #0f172a 100%)",
            boxShadow: "0 10px 40px rgba(124,58,237,0.2)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Weekly Schedule
              </h3>
              <p className="text-[9px] mt-0.5" style={{ color: "#a78bfa" }}>
                Oct 9 – Oct 15
              </p>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderLeft: "3px solid",
                  borderLeftColor:
                    idx === 2 ? "#7c3aed" : idx === 1 ? "#2563eb" : "#a78bfa",
                }}
              >
                <div className="text-center min-w-[32px]">
                  <p
                    className="text-[8px] font-bold uppercase tracking-wider"
                    style={{ color: "#a78bfa" }}
                  >
                    {item.day}
                  </p>
                  <p className="text-lg font-black text-white leading-none mt-0.5">
                    {item.date}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-gray-400">
                    {item.time}
                  </p>
                  <p className="text-xs font-bold text-gray-200 mt-0.5 truncate">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={8} /> {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full text-center text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer relative z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))",
              color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
