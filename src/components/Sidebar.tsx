"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  Settings,
  LogOut,
  Plus,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Users,
  X,
  Briefcase,
  CheckCircle2,
  Heart,
  Star,
  User as UserIcon,
} from "lucide-react";

interface RouteItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: "blue" | "emerald" | "amber";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "customer";

  // Mobile off-canvas state - opened externally via "toggle-mobile-sidebar" event
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  // Close drawer whenever the route changes (link tap on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll while the mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    toast.success("✓ Signed out successfully!", { duration: 4000, closeButton: true });
    router.push("/");
  };

  // ── Role-based nav lists ────────────────────────────────────────────────
  const customerRoutes: RouteItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Booking", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "Wallet", href: "/dashboard/earnings", icon: Wallet },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/settings", icon: UserIcon },
  ];

  // Matches the "LensLife" vendor sidebar from Figma: Dashboard, New Jobs,
  // Active Jobs, Completed Jobs, Wallet, My Services, Reviews, Profile —
  // with colored count badges on New/Active Jobs and My Services.
  const vendorRoutes: RouteItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Jobs", href: "/dashboard/jobs/new", icon: Briefcase, badge: 4, badgeColor: "blue" },
    { name: "Active Jobs", href: "/dashboard/jobs/active", icon: CheckCircle2, badge: 3, badgeColor: "emerald" },
    { name: "Completed Jobs", href: "/dashboard/jobs/completed", icon: ClipboardList },
    { name: "Wallet", href: "/dashboard/earnings", icon: Wallet },
    { name: "My Services", href: "/dashboard/services", icon: Heart, badge: 1, badgeColor: "amber" },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Profile", href: "/dashboard/settings", icon: UserIcon },
  ];

  const adminRoutes: RouteItem[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "All Events", href: "/dashboard/my-events", icon: Calendar },
    { name: "Vendor Partners", href: "/dashboard/vendors", icon: Users },
    { name: "Task Dispatch", href: "/dashboard/tasks", icon: ClipboardList },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const activeRoutes =
    role === "vendor" ? vendorRoutes : role === "admin" ? adminRoutes : customerRoutes;

  // ── Role-based brand + profile info ─────────────────────────────────────
  const brand =
    role === "vendor"
      ? { name: "LensLife", boxClass: "bg-blue-600" }
      : { name: "ZEYO", boxClass: "bg-slate-900" };

  const displayName = user?.name || (role === "vendor" ? "Alex Kumar" : "Rahim Ahmed");
  const roleLabel = role === "vendor" ? "Photographer" : role === "admin" ? "Administrator" : "Customer";
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const badgeStyles: Record<NonNullable<RouteItem["badgeColor"]>, string> = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  const sidebarContent = (
    <>
      <div className="space-y-5">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${brand.boxClass}`}>
              <span className="text-white font-extrabold text-[10px] leading-none">
                {brand.name[0]}
              </span>
            </div>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900">{brand.name}</h2>
          </div>

          {/* Close button - mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile card */}
        <div className="px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{displayName}</p>
              <p className="text-[10px] text-slate-400">{roleLabel}</p>
            </div>
          </div>

          {role === "vendor" && (
            <div className="mt-2.5 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 4 new jobs
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> 1 pending
              </span>
            </div>
          )}
        </div>

        {role !== "vendor" && (
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-dashboard-modal", { detail: "new-booking" })
              )
            }
            className="w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="flex items-center justify-center gap-2">
              <Plus size={13} /> {role === "admin" ? "Create Event" : "New Booking"}
            </span>
          </button>
        )}

        <div className="space-y-1.5">
          <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </p>
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
                  <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
                  {route.name}
                  {typeof route.badge === "number" && route.badge > 0 && (
                    <span
                      className={`ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                        isActive ? "bg-white/20 text-white" : badgeStyles[route.badgeColor || "blue"]
                      }`}
                    >
                      {route.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Backdrop overlay - mobile only, shown when drawer is open. Fixed = no flex layout impact. */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar - sticky so it stays in view while page content scrolls */}
      <aside className="hidden w-[230px] shrink-0 sticky top-0 h-screen overflow-y-auto flex-col justify-between border-r border-slate-200 bg-white p-4 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - off-canvas drawer, fixed positioned so it never affects flex layout */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] max-w-[80vw] flex-col justify-between border-r border-slate-200 bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}