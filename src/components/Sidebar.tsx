"use client";
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
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "customer";

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    toast.success("✓ Signed out successfully!");
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
              {getPortalTitle()}
            </p>
          </div>
        </div>

        {role !== "vendor" && (
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-dashboard-modal", { detail: "new-booking" })
              )
            }
            className="w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <span className="flex items-center justify-center gap-2">
              <Plus size={13} /> New Booking
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
    </aside>
  );
}
