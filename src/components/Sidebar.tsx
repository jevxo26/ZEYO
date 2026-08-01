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
  HelpCircle,
  LogOut,
  Plus,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "customer";

  // Mobile off-canvas state
  const [isOpen, setIsOpen] = useState(false);

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

  const customerRoutes = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "Event Calendar", href: "/dashboard/my-events", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const vendorRoutes = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/dashboard/tasks", icon: ClipboardList },
    { name: "Earnings", href: "/dashboard/earnings", icon: Wallet },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const adminRoutes = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
    { name: "All Events", href: "/dashboard/my-events", icon: Calendar },
    { name: "Vendor Partners", href: "/dashboard/vendors", icon: Users },
    { name: "Task Dispatch", href: "/dashboard/tasks", icon: ClipboardList },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const activeRoutes =
    role === "vendor"
      ? vendorRoutes
      : role === "admin"
      ? adminRoutes
      : customerRoutes;

  const getPortalTitle = () => {
    if (role === "vendor") return "Vendor Portal";
    if (role === "admin") return "Admin Operations";
    return "Customer Portal";
  };

  const sidebarContent = (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
                <Zap size={14} className="text-white" />
              </div>
              <h2 className="bg-gradient-to-r from-violet-700 to-blue-700 bg-clip-text text-lg font-black tracking-tight text-transparent">
                EVENTO
              </h2>
            </div>
            <p className="mt-1 pl-9 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {getPortalTitle()}
            </p>
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

        {role !== "vendor" && (
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-dashboard-modal", { detail: "new-booking" })
              )
            }
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700"
          >
            <span className="flex items-center justify-center gap-2">
              <Plus size={13} /> {role === "admin" ? "Create Event" : "New Booking"}
            </span>
          </button>
        )}

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
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm"
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
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <HelpCircle size={15} /> Help Center
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger trigger */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
            <Zap size={14} className="text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-violet-700 to-blue-700 bg-clip-text text-base font-black tracking-tight text-transparent">
            EVENTO
          </h2>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Backdrop overlay - mobile only, shown when drawer is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar - always visible, static in layout */}
      <aside className="hidden w-[230px] shrink-0 min-h-screen flex-col justify-between border-r border-slate-200 bg-white p-4 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - off-canvas drawer, slides in from the left */}
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