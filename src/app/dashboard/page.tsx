"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  ChevronRight,
  Menu,
  Coins,
  Briefcase,
  CheckCircle2,
  Wallet as WalletIcon,
  Star,
  X,
  MapPin,
  Calendar,
  DollarSign,
  LayoutGrid,
  User as UserIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import apiClient from "@/lib/apiClient";

// ═════════════════════════════════════════════════════════════════════════
// NOTE ON LAYOUT
// This page is the MAIN CONTENT ONLY. The role-based left navigation
// (Overview / Bookings / Wallet / Tasks / Earnings / Settings etc.) already
// lives in the shared <Sidebar /> component rendered by the dashboard
// layout (e.g. app/dashboard/layout.tsx):
//
//   <div className="flex">
//     <Sidebar />
//     <main className="flex-1">{children}</main>
//   </div>
//
// So this file does NOT render its own logo, nav links, or desktop sidebar
// — that would duplicate <Sidebar />. On mobile, navigation instead lives
// in the fixed BOTTOM TAB BAR rendered by CustomerDashboard below (this
// matches the Figma mobile design: ZEYO brand mark in the header + a
// bottom tab bar with a raised floating "+" action button). The bottom
// bar is mobile/tablet only (hidden at lg+) since the desktop <Sidebar />
// takes over navigation there.
// ═════════════════════════════════════════════════════════════════════════

interface CustomerBooking {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  date: string;
  amount: number;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
}

interface VendorJob {
  id: string;
  client: string;
  title: string;
  venue: string;
  amount: number;
  status: "NEW" | "ACTIVE";
}

interface VendorRequest {
  id: string;
  client: string;
  title: string;
  description: string;
  location: string;
  date: string;
  service: string;
  budget: number;
}

const DEFAULT_CUSTOMER_BOOKINGS: CustomerBooking[] = [
  { id: "BKG-1", clientName: "Farhan Islam", eventType: "Wedding", location: "Banani, Dhaka", date: "2026-08-10", amount: 65000, status: "CONFIRMED" },
  { id: "BKG-2", clientName: "Nasima Begum", eventType: "Birthday", location: "Dhanmondi, Dhaka", date: "2026-08-12", amount: 35000, status: "PENDING" },
  { id: "BKG-3", clientName: "Kabir Hossain", eventType: "Corporate", location: "Uttara, Dhaka", date: "2026-08-05", amount: 120000, status: "COMPLETED" },
];

const DEFAULT_VENDOR_JOBS: VendorJob[] = [
  { id: "J1", client: "Sarah & James", title: "Wedding Ceremony", venue: "Grand Ballroom, New York", amount: 1200, status: "NEW" },
  { id: "J2", client: "TechCorp Inc.", title: "Corporate Conference", venue: "Hilton Hotel, Chicago", amount: 3500, status: "NEW" },
  { id: "J3", client: "Marcus Lee", title: "Birthday Party", venue: "Rooftop Venue, Miami", amount: 800, status: "NEW" },
  { id: "J4", client: "Nova Brands", title: "Product Launch", venue: "Convention Center, LA", amount: 2200, status: "NEW" },
  { id: "J5", client: "Emily & Robert", title: "Anniversary Dinner", venue: "The Ritz, Boston", amount: 950, status: "ACTIVE" },
  { id: "J6", client: "Johnson Family", title: "Graduation Party", venue: "Garden Estate, Houston", amount: 1800, status: "ACTIVE" },
];

const DEFAULT_VENDOR_REQUESTS: VendorRequest[] = [
  { id: "R1", client: "Sarah & James", title: "Wedding Ceremony", description: "Full-day wedding photography coverage including ceremony and reception.", location: "Grand Ballroom", date: "2026-04-24", service: "Photography", budget: 1200 },
  { id: "R2", client: "Nova Brands", title: "Product Launch", description: "Full venue decoration with branded elements and floral arrangements.", location: "Convention Ce...", date: "2026-05-09", service: "Decoration", budget: 2200 },
];

const STATUS_STYLES: Record<CustomerBooking["status"], string> = {
  CONFIRMED: "bg-blue-50 text-blue-600",
  PENDING: "bg-amber-50 text-amber-600",
  COMPLETED: "bg-emerald-50 text-emerald-600",
};

// Fires the same event the shared Sidebar listens for, so mobile nav opens
// consistently across every dashboard page instead of building a new drawer.
const openMobileSidebar = () => {
  window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
};

// ═════════════════════════════════════════════════════════════════════════
// ROOT — reads role, renders matching dashboard CONTENT (no sidebar here)
// ═════════════════════════════════════════════════════════════════════════
export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const role = (user?.role || "customer").toLowerCase();

  if (role === "vendor") return <VendorDashboard />;
  return <CustomerDashboard />;
}

// ═════════════════════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD CONTENT — "ZEYO" design, sits inside <main>
// ═════════════════════════════════════════════════════════════════════════
function CustomerDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const [bookings, setBookings] = useState<CustomerBooking[]>(DEFAULT_CUSTOMER_BOOKINGS);
  const [walletBalance, setWalletBalance] = useState(125000);
  const [totalEarnings, setTotalEarnings] = useState(345000);
  const [monthEarnings, setMonthEarnings] = useState(125000);
  const [completedCount, setCompletedCount] = useState(47);
  const [weekStats, setWeekStats] = useState({ newBookings: 5, revenue: 68000, conversion: 82 });
  const [notifCount, setNotifCount] = useState(1);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "wallet" | "profile">("dashboard");

  useEffect(() => {
    const fetchOverview = async () => {
      let localCustom: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
          if (stored) localCustom = JSON.parse(stored);
        } catch (e) {}
      }

      try {
        const res = await apiClient.get("/bookings/my");
        let apiList: any[] = [];
        if (res.data && res.data.success !== false) {
          const rawData = res.data.data;
          apiList = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
        }
        const combined = [...localCustom, ...apiList];
        if (combined.length > 0) setBookings(combined);
      } catch (e) {
        if (localCustom.length > 0) setBookings([...localCustom, ...DEFAULT_CUSTOMER_BOOKINGS]);
      }

      try {
        const walletRes = await apiClient.get("/wallet/summary");
        if (walletRes.data?.success !== false && walletRes.data?.data) {
          const d = walletRes.data.data;
          if (typeof d.balance === "number") setWalletBalance(d.balance);
          if (typeof d.totalEarnings === "number") setTotalEarnings(d.totalEarnings);
          if (typeof d.monthEarnings === "number") setMonthEarnings(d.monthEarnings);
          if (typeof d.completedCount === "number") setCompletedCount(d.completedCount);
          if (d.weekStats) setWeekStats(d.weekStats);
          if (typeof d.notifCount === "number") setNotifCount(d.notifCount);
        }
      } catch (e) {}
    };

    fetchOverview();
    const handleUpdate = () => fetchOverview();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const handleNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  const displayName = user?.name || "Rahim Ahmed";

  return (
    <div className="max-w-4xl mx-auto pb-28 lg:pb-8">
      {/* Top bar — ZEYO brand mark on mobile/tablet, plain title on desktop */}
      <header className="flex items-center justify-between px-4 pt-5 pb-2 lg:px-0 lg:pt-0">
        <div className="flex items-center gap-2.5">
          {/* Mobile/tablet brand mark — bottom tab bar handles nav, so no hamburger here */}
          <div className="lg:hidden w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-sm leading-none">Z</span>
          </div>
          <span className="lg:hidden font-extrabold text-slate-900 tracking-tight text-[15px]">ZEYO</span>
          <h1 className="hidden lg:block text-xl font-extrabold text-slate-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-full text-xs font-bold">
            <Coins className="w-3.5 h-3.5" />
            {walletBalance.toLocaleString()}
          </div>
          <button className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <Bell className="w-4 h-4 text-slate-600" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Welcome */}
      <div className="px-4 mt-4 lg:px-0 lg:mt-6">
        <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{displayName}</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-5 lg:px-0 lg:gap-4">
        <StatCard label="Total Earnings" value={`৳${totalEarnings.toLocaleString()}`} />
        <StatCard label="This Month" value={monthEarnings.toLocaleString()} accent />
        <StatCard label="Completed" value={String(completedCount)} />
      </div>

      {/* Recent Bookings */}
      <div className="mt-7 px-4 lg:px-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-slate-900">Recent Bookings</h3>
          <button className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5">
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2.5">
          {bookings.map((b, idx) => (
            <div
              key={b.id ? `bk-${b.id}-${idx}` : idx}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {b.clientName || (b as any).eventName || "Untitled Booking"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {b.eventType} • {b.location || "Location TBD"}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {b.date || (b as any).eventDate || ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-slate-900 text-sm">
                  ৳{Number(b.amount || (b as any).budget || 0).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    STATUS_STYLES[(b.status as CustomerBooking["status"]) || "CONFIRMED"]
                  }`}
                >
                  {b.status || "CONFIRMED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week */}
      <div className="mt-6 mx-4 lg:mx-0 bg-slate-900 rounded-2xl p-5">
        <p className="text-white font-extrabold text-sm mb-4">This Week</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">New Bookings</p>
            <p className="text-white font-extrabold text-lg mt-1">{weekStats.newBookings}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Revenue</p>
            <p className="text-amber-400 font-extrabold text-lg mt-1">৳{weekStats.revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Conversion</p>
            <p className="text-emerald-400 font-extrabold text-lg mt-1">{weekStats.conversion}%</p>
          </div>
        </div>
      </div>

      {/* Bottom tab bar — mobile/tablet only, with a raised floating "+" action button */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100">
        <div className="relative max-w-4xl mx-auto grid grid-cols-4 items-center px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <TabItem
            icon={<LayoutGrid className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <TabItem
            icon={<Briefcase className="w-5 h-5" />}
            label="Bookings"
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          />
          <TabItem
            icon={<WalletIcon className="w-5 h-5" />}
            label="Wallet"
            active={activeTab === "wallet"}
            onClick={() => setActiveTab("wallet")}
          />
          <TabItem
            icon={<UserIcon className="w-5 h-5" />}
            label="Profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />

          <button
            onClick={handleNewBooking}
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/30 active:scale-95 transition-transform"
            aria-label="New booking"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}

function TabItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-1.5 transition-colors ${
        active ? "text-amber-600" : "text-slate-400"
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
      <p className="text-[10px] text-slate-400 font-semibold leading-tight">{label}</p>
      <p className={`text-lg font-extrabold mt-1.5 ${accent ? "text-amber-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// VENDOR DASHBOARD CONTENT — "LensLife" design, sits inside <main>
// ═════════════════════════════════════════════════════════════════════════
function VendorDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const [jobs, setJobs] = useState<VendorJob[]>(DEFAULT_VENDOR_JOBS);
  const [requests, setRequests] = useState<VendorRequest[]>(DEFAULT_VENDOR_REQUESTS);
  const [todayEarnings, setTodayEarnings] = useState(1240);
  const [totalBalance, setTotalBalance] = useState(8650);
  const [activeJobsCount, setActiveJobsCount] = useState(3);
  const [pendingPayout, setPendingPayout] = useState(2350);
  const [monthPerf, setMonthPerf] = useState({ jobsCompleted: 68, earningsGoal: 82, clientRating: 96 });
  const [requestsOpen, setRequestsOpen] = useState(false);

  useEffect(() => {
    const fetchVendorOverview = async () => {
      let localTasks: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("customVendorTasks");
          if (stored) localTasks = JSON.parse(stored);
        } catch (e) {}
      }

      try {
        const res = await apiClient.get("/vendor/overview");
        if (res.data?.success !== false && res.data?.data) {
          const d = res.data.data;
          if (Array.isArray(d.jobs) && d.jobs.length > 0) setJobs(d.jobs);
          else if (localTasks.length > 0) setJobs(localTasks);
          if (Array.isArray(d.requests)) setRequests(d.requests);
          if (typeof d.todayEarnings === "number") setTodayEarnings(d.todayEarnings);
          if (typeof d.totalBalance === "number") setTotalBalance(d.totalBalance);
          if (typeof d.activeJobsCount === "number") setActiveJobsCount(d.activeJobsCount);
          if (typeof d.pendingPayout === "number") setPendingPayout(d.pendingPayout);
          if (d.monthPerf) setMonthPerf(d.monthPerf);
        } else if (localTasks.length > 0) {
          setJobs(localTasks);
        }
      } catch (e) {
        if (localTasks.length > 0) setJobs(localTasks);
      }
    };

    fetchVendorOverview();
    const handleUpdate = () => fetchVendorOverview();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const handleRespond = async (id: string, accept: boolean) => {
    try {
      await apiClient.post(`/vendor/requests/${id}/respond`, { accept });
    } catch (e) {}
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const displayName = user?.name || "Alex Kumar";

  return (
    <div className="flex flex-col xl:flex-row -m-0">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar — hamburger only on mobile/tablet (opens shared Sidebar) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={openMobileSidebar}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Welcome back, {displayName.split(" ")[0]}! Here&apos;s what&apos;s happening today.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRequestsOpen(true)}
            className="xl:hidden relative px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
          >
            Requests
            <span className="w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] flex items-center justify-center">
              {requests.length}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <VendorStatCard label="Today's Earnings" value={`$${todayEarnings.toLocaleString()}`} delta="+12% from yesterday" color="emerald" icon={<DollarSign className="w-[18px] h-[18px]" />} />
          <VendorStatCard label="Total Balance" value={`$${totalBalance.toLocaleString()}`} delta="+5.2% this month" color="blue" icon={<WalletIcon className="w-[18px] h-[18px]" />} />
          <VendorStatCard label="Active Jobs" value={String(activeJobsCount)} delta="+2 starting soon" color="amber" icon={<Briefcase className="w-[18px] h-[18px]" />} />
          <VendorStatCard label="Client Rating" value={`${(monthPerf.clientRating / 20).toFixed(1)} ★`} delta="Top rated partner" color="purple" icon={<Star className="w-[18px] h-[18px]" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">Recent Jobs</h2>
              <button className="text-xs font-bold text-slate-400 hover:text-slate-700">View all</button>
            </div>
            <div className="divide-y divide-slate-50">
              {jobs.map((job, idx) => (
                <div key={job.id ? `job-${job.id}-${idx}` : idx} className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {(job.client || "").split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{job.title}</p>
                      <p className="text-xs text-slate-400 truncate">{job.client} • {job.venue}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-slate-900 text-sm">${Number(job.amount || 0).toLocaleString()}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.status === "NEW" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-4 text-left transition-colors">
                <Briefcase className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">New Jobs</p>
              </button>
              <button className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl p-4 text-left transition-colors">
                <WalletIcon className="w-5 h-5 text-emerald-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">Wallet</p>
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5">
              <p className="text-white font-extrabold text-sm mb-1">This Month</p>
              <p className="text-slate-400 text-xs mb-4">April 2026 performance</p>
              <div className="space-y-3.5">
                <PerfBar label="Jobs Completed" value={monthPerf.jobsCompleted} color="bg-blue-500" />
                <PerfBar label="Earnings Goal" value={monthPerf.earningsGoal} color="bg-emerald-500" />
                <PerfBar label="Client Rating" value={monthPerf.clientRating} color="bg-amber-500" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-1">Pending Payout</p>
              <p className="text-2xl font-extrabold text-slate-900">${pendingPayout.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Clears in 2-3 business days</p>
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                Go to Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job requests panel — docked on xl screens, drawer below that */}
      <div
        className={`xl:w-80 xl:shrink-0 xl:static xl:ml-6 xl:border xl:border-slate-100 xl:bg-white xl:rounded-2xl xl:block xl:h-fit
        fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white shadow-2xl transition-transform duration-300
        ${requestsOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}`}
      >
        <div className="p-5 sm:p-6 h-full xl:h-auto overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400 font-medium">Review and respond to incoming job requests</p>
            <button className="xl:hidden text-slate-400" onClick={() => setRequestsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 mb-5">
            <h2 className="font-extrabold text-slate-900 text-sm">{requests.length} pending requests</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
              Action Required
            </span>
          </div>

          <div className="space-y-4">
            {requests.length === 0 && <p className="text-sm text-slate-400 text-center py-10">No pending requests</p>}
            {requests.map((r) => (
              <div key={r.id} className="border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                      {r.client.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{r.client}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">New Request</span>
                </div>

                <p className="font-bold text-slate-900 text-sm">{r.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.description}</p>

                <div className="grid grid-cols-2 gap-y-2 mt-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {r.location}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-400" /> {r.service}</span>
                  <span className="flex items-center gap-1 font-bold text-slate-900"><DollarSign className="w-3 h-3 text-slate-400" /> ${r.budget.toLocaleString()}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleRespond(r.id, false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                    Reject
                  </button>
                  <button onClick={() => handleRespond(r.id, true)} className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {requestsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 xl:hidden" onClick={() => setRequestsOpen(false)} />
      )}
    </div>
  );
}

function VendorStatCard({
  label,
  value,
  delta,
  color,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  color: "emerald" | "blue" | "amber" | "purple";
  icon: React.ReactNode;
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>{icon}</div>
      <p className="text-[11px] text-slate-400 font-semibold">{label}</p>
      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
      <p className="text-[10px] text-emerald-600 font-bold mt-1">{delta}</p>
    </div>
  );
}

function PerfBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-slate-400 font-semibold">{label}</span>
        <span className="text-[11px] text-white font-bold">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}