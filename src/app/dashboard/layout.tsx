"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Bell, Mail, Search, Sparkles, ShieldCheck, Briefcase, User as UserIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import Modals from "@/components/dashboard/Modals";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const getRoleHeaderBadge = () => {
    if (!user) return null;
    const r = (user.role || "").toLowerCase();
    if (r === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Admin Operations Center
        </span>
      );
    }
    if (r === "vendor" || r === "partner") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Briefcase className="w-3.5 h-3.5" /> Background Vendor Partner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <UserIcon className="w-3.5 h-3.5" /> Customer Portal
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Dashboard Body */}
      <div className="flex flex-1 min-h-0">
        <Modals />
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Sub-header bar for quick search & active role status */}
          <header className="sticky top-0 z-30 px-6 py-3 flex justify-between items-center gap-4 shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 w-80 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search bookings, events, tasks, or partners..."
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {getRoleHeaderBadge()}

              <button className="relative rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" title="Notifications">
                <Bell size={17} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-600" />
              </button>

              <button className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" title="Messages">
                <Mail size={17} />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
