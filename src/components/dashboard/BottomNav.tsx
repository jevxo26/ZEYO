"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarCheck, Plus, Wallet, User } from "lucide-react";

/**
 * Fixed bottom navigation for phone / tablet widths (< lg breakpoint).
 * Lives inside DashboardLayout so it renders on every /dashboard/* route
 * without each page needing to know about it.
 *
 * Wallet -> /dashboard/earnings, Profile -> /dashboard/settings (confirmed routes).
 */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/earnings", label: "Wallet", icon: Wallet },
  { href: "/dashboard/settings", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(href);

  const handleNewBooking = () => {
    window.dispatchEvent(new CustomEvent("open-dashboard-modal", { detail: "new-booking" }));
  };

  // Left two items, then a gap for the floating + button, then right two items.
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2 min-w-0"
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.4 : 1.8}
          className={active ? "text-amber-500" : "text-slate-400"}
        />
        <span
          className={`text-[10px] font-semibold leading-none ${
            active ? "text-amber-500" : "text-slate-400"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Primary"
    >
      <div className="relative mx-auto max-w-md">
        {/* Floating center action button */}
        <button
          onClick={handleNewBooking}
          aria-label="New booking"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 flex items-center justify-center active:scale-95 transition-transform duration-150 border-4 border-white"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        <div className="flex items-stretch bg-white/95 backdrop-blur-md border-t border-slate-200 rounded-t-3xl shadow-[0_-8px_24px_rgba(15,23,42,0.08)] px-2">
          {leftItems.map(renderItem)}
          {/* spacer for the floating button */}
          <div className="w-14 shrink-0" />
          {rightItems.map(renderItem)}
        </div>
      </div>
    </nav>
  );
}