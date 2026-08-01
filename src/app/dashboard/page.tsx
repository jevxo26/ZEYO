"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
  Wallet as WalletIcon,
  User as UserIcon,
  Coins,
  Briefcase,
  CheckCircle2,
  CircleCheckBig,
  Heart,
  Star,
  LogOut,
  Menu,
  X,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import apiClient from "@/lib/apiClient";

// ═════════════════════════════════════════════════════════════════════════
// Shared types
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

// ═════════════════════════════════════════════════════════════════════════
// Fallback / demo data (used until the real API responds)
// ═════════════════════════════════════════════════════════════════════════
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

// ═════════════════════════════════════════════════════════════════════════
// ROOT — reads role and renders the matching dashboard
// ═════════════════════════════════════════════════════════════════════════
export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const role = (user?.role || "customer").toLowerCase();

  if (role === "vendor") return <VendorDashboard />;
  return <CustomerDashboard />;
}

// ═════════════════════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD — matches "ZEYO" Figma design
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
    <div className="min-h-screen bg-slate-50 md:bg-white">
      <div className="md:flex md:min-h-screen">
        {/* Tablet / desktop sidebar */}
        <aside className="hidden md:flex md:w-60 lg:w-64 md:flex-col md:border-r md:border-slate-100 md:px-5 md:py-6 md:shrink-0">
          <div className="flex items-center gap-2.5 px-1 mb-8">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">Z</div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">ZEYO</span>
          </div>
          <nav className="flex-1 space-y-1">
            {[
              { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
              { key: "bookings", label: "Bookings", icon: CalendarDays },
              { key: "wallet", label: "Wallet", icon: WalletIcon },
              { key: "profile", label: "Profile", icon: UserIcon },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === (item.key as typeof activeTab);
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main column */}
        <div className="flex-1 md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-8 md:py-8 pb-24 md:pb-8">
          {/* Top bar */}
          <header className="flex items-center justify-between px-4 pt-5 pb-2 md:px-0 md:pt-0">
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs">Z</div>
              <span className="font-extrabold text-slate-900 tracking-tight">ZEYO</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>
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
          <div className="px-4 mt-4 md:px-0 md:mt-6">
            <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{displayName}</h2>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 px-4 mt-5 md:px-0 md:gap-4">
            <StatCard label="Total Earnings" value={`৳${totalEarnings.toLocaleString()}`} />
            <StatCard label="This Month" value={monthEarnings.toLocaleString()} accent />
            <StatCard label="Completed" value={String(completedCount)} />
          </div>

          {/* Recent Bookings */}
          <div className="mt-7 px-4 md:px-0">
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
                      {b.eventType || (b as any).eventType} • {b.location || "Location TBD"}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {new Date(b.date || (b as any).eventDate || Date.now()).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
          <div className="mt-6 mx-4 md:mx-0 bg-slate-900 rounded-2xl p-5">
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
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-between z-40">
        {[
          { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
          { key: "bookings", label: "Bookings", icon: CalendarDays },
          null,
          { key: "wallet", label: "Wallet", icon: WalletIcon },
          { key: "profile", label: "Profile", icon: UserIcon },
        ].map((item, idx) =>
          item === null ? (
            <div key={`gap-${idx}`} className="w-12" />
          ) : (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as typeof activeTab)}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === item.key ? "text-amber-600" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        )}
      </nav>

      <button
        onClick={handleNewBooking}
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/30 z-50 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
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
// VENDOR DASHBOARD — matches "LensLife" Figma design
// ═════════════════════════════════════════════════════════════════════════
const VENDOR_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid, badge: null as string | null },
  { key: "new-jobs", label: "New Jobs", icon: Briefcase, badge: "4", badgeColor: "bg-blue-500" },
  { key: "active-jobs", label: "Active Jobs", icon: CircleCheckBig, badge: "3", badgeColor: "bg-emerald-500" },
  { key: "completed-jobs", label: "Completed Jobs", icon: CheckCircle2, badge: null },
  { key: "wallet", label: "Wallet", icon: WalletIcon, badge: null },
  { key: "services", label: "My Services", icon: Heart, badge: "1", badgeColor: "bg-amber-500" },
  { key: "reviews", label: "Reviews", icon: Star, badge: null },
  { key: "profile", label: "Profile", icon: UserIcon, badge: null },
] as const;

function VendorDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const [jobs, setJobs] = useState<VendorJob[]>(DEFAULT_VENDOR_JOBS);
  const [requests, setRequests] = useState<VendorRequest[]>(DEFAULT_VENDOR_REQUESTS);
  const [todayEarnings, setTodayEarnings] = useState(1240);
  const [totalBalance, setTotalBalance] = useState(8650);
  const [activeJobsCount, setActiveJobsCount] = useState(3);
  const [pendingPayout, setPendingPayout] = useState(2350);
  const [monthPerf, setMonthPerf] = useState({ jobsCompleted: 68, earningsGoal: 82, clientRating: 96 });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<(typeof VENDOR_NAV_ITEMS)[number]["key"]>("dashboard");

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
  const initials = displayName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col px-4 py-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">L</div>
            <span className="font-extrabold text-slate-900 tracking-tight">LensLife</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{(user as any)?.category || "Photographer"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 mb-4">
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 4 new jobs
          </span>
          <span className="text-slate-200">•</span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1 pending
          </span>
        </div>

        <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">Main Menu</p>
        <nav className="flex-1 space-y-1">
          {VENDOR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </span>
                {item.badge && (
                  <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row">
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 lg:py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
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

        {/* Job requests panel */}
        <div
          className={`xl:w-80 xl:shrink-0 xl:static xl:border-l xl:border-slate-100 xl:bg-white xl:block
          fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white shadow-2xl transition-transform duration-300
          ${requestsOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}`}
        >
          <div className="p-5 sm:p-6 h-full overflow-y-auto">
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