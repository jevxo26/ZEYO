"use client";

import Sidebar from "@/components/Sidebar";
import { Bell, Mail, Search, Sparkles, ChevronDown } from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 px-6 py-3 flex justify-between items-center gap-4 shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 w-72 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search bookings, events, tasks..."
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="hidden md:flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
              <Sparkles size={11} />
              Upgrade
            </button>

            <button className="relative rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>

            <button className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
              <Mail size={17} />
            </button>

            <div className="mx-1 h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  Sarah Jenkins
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Vendor Admin
                </p>
              </div>
              <ChevronDown
                size={13}
                className="hidden text-slate-400 lg:block"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
