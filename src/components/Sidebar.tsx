"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Users,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [context, setContext] = useState<"vendor" | "planner">("vendor");

  const vendorRoutes = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: ClipboardList },
    { name: "Earnings", href: "/dashboard/earnings", icon: Wallet },
    { name: "Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "Vendors", href: "/dashboard/vendors", icon: Users },
    { name: "Reviews", href: "#", icon: Star },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const plannerRoutes = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Events", href: "/dashboard/my-events", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "Vendors", href: "/dashboard/vendors", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const activeRoutes = context === "vendor" ? vendorRoutes : plannerRoutes;

  return (
    <aside className="w-[230px] flex min-h-screen shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4">
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
                <Zap size={14} className="text-white" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                EVENTO
              </h2>
            </div>
            <p className="mt-1 pl-9 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {context === "vendor" ? "Vendor Portal" : "Planner Mode"}
            </p>
          </div>
          <button
            onClick={() =>
              setContext(context === "vendor" ? "planner" : "vendor")
            }
            title="Switch Mode"
            className="cursor-pointer rounded-lg bg-slate-100 p-1.5 text-slate-600 transition hover:bg-slate-200"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-dashboard-modal", { detail: "new-event" }),
            )
          }
          className="w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <span className="flex items-center justify-center gap-2">
            <Plus size={13} /> New Event
          </span>
        </button>

        <nav className="space-y-0.5">
          {activeRoutes.map((route) => {
            const isActive =
              pathname === route.href ||
              (route.href !== "/dashboard" && pathname.startsWith(route.href));
            const Icon = route.icon;

            return (
              <Link
                key={route.name}
                href={route.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-white" : "text-slate-400"}
                />
                {route.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-0.5 border-t border-slate-200 pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <HelpCircle size={15} /> Help Center
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={15} /> Logout
        </Link>
      </div>
    </aside>
  );
}
