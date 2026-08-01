"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { navItems } from "@/data/navdata";

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);

  // Desktop collapse (lg+) and mobile/tablet drawer (<lg) each manage their
  // own state now — DashboardLayout renders <Sidebar /> with no props.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("/api/users/profile/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Header's PanelLeft button (DashboardLayout) dispatches this to open
  // the mobile drawer.
  useEffect(() => {
    const handleToggle = () => setMobileOpen((p) => !p);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  // Close the drawer automatically whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "..";

  const toggleCollapse = () => setIsCollapsed((p) => !p);

  const NavLinks = ({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) => (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
              isActive
                ? "bg-indigo-500/10 text-indigo-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/40"
                : "text-slate-600 hover:bg-white/40 hover:text-indigo-600 border border-transparent"
            )}
          >
            <item.icon
              className={cn(
                "shrink-0",
                collapsed ? "mx-auto" : "mr-3",
                isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-indigo-600"
              )}
              size={20}
            />
            {!collapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const ProfileFooter = ({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) => (
    <div className="p-4 border-t border-white/20 shrink-0">
      <Link
        href={user ? `/profile/${user.id}` : "#"}
        onClick={onNavigate}
        className={cn(
          "flex items-center cursor-pointer hover:opacity-80 transition-opacity",
          collapsed ? "justify-center" : ""
        )}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
            {initials}
          </div>
        )}
        {!collapsed && (
          <div className="ml-3 truncate">
            <p className="text-sm font-medium text-slate-700 truncate">{user?.name || "Loading..."}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
          </div>
        )}
      </Link>
    </div>
  );

  return (
    <>
      {/* ── Fixed sidebar — desktop only (lg+). Mobile/tablet nav lives in BottomNav. ── */}
      <aside
        className={cn(
          "hidden lg:flex relative flex-col h-full shrink-0 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out z-20",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 shrink-0">
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              AdminPanel
            </span>
          )}
          {isCollapsed && (
            <div className="mx-auto text-indigo-500">
              <Menu size={24} />
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition-colors z-30"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <NavLinks collapsed={isCollapsed} />
        <ProfileFooter collapsed={isCollapsed} />
      </aside>

      {/* ── Off-canvas drawer — mobile/tablet (<lg), opened via header toggle ── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-72 max-w-[80vw] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              AdminPanel
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
          <ProfileFooter collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </aside>
      </div>
    </>
  );
}