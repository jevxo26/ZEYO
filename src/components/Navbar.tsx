"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Calculator,
  Package,
  Settings,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Briefcase,
  Zap,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Calculator", href: "/calculator" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [clientUser, setClientUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync clientUser with Redux or localStorage on mount/path change
  useEffect(() => {
    if (user) {
      setClientUser(user);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setClientUser(JSON.parse(stored));
        } catch {
          setClientUser(null);
        }
      } else {
        setClientUser(null);
      }
    }
  }, [user, pathname]);

  const activeUser = user || clientUser;

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setClientUser(null);
    setDropdownOpen(false);
    setIsOpen(false);
    toast.success("✓ Signed out successfully!", {
      duration: 4000,
      closeButton: true,
    });
    router.push("/");
  };

  const getDashboardHref = () => {
    return "/dashboard";
  };

  const isLinkActive = (href: string) => pathname === href.split("#")[0];

  const getRoleBadge = () => {
    if (!activeUser) return null;
    const r = (activeUser.role || "").toLowerCase();
    if (r === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 text-white uppercase tracking-wider">
          <ShieldCheck className="w-2.5 h-2.5" /> Admin Hub
        </span>
      );
    }
    if (r === "vendor" || r === "partner") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
          <Briefcase className="w-2.5 h-2.5" /> Vendor Partner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
        <UserIcon className="w-2.5 h-2.5" /> Customer
      </span>
    );
  };

  return (
    <header className="relative z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="h-16 flex items-center justify-between px-6 md:px-10 max-w-7xl mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black shadow-sm shrink-0">
            <Zap size={16} className="text-amber-400" />
          </div>
          <span className="flex items-baseline gap-2">
            <span className="text-[16px] font-extrabold tracking-widest text-slate-900">
              ZEYO
            </span>
            <span className="hidden lg:inline text-[11px] font-semibold text-slate-400 tracking-wide">
              — Managed Event OS
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-[13px] font-bold py-2 transition-colors duration-200 group ${
                  active
                    ? "text-amber-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -bottom-0.5 h-[2px] bg-amber-500 rounded-full transition-all duration-300 ease-out -translate-x-1/2 ${
                    active ? "w-5" : "w-0 group-hover:w-5"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop User / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isMounted ? (
            <div className="w-32 h-9"></div> // Placeholder during hydration
          ) : activeUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {(activeUser.name || "U")[0].toUpperCase()}
                </div>
                <div className="text-left max-w-[130px] truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {activeUser.name}
                  </p>
                  {getRoleBadge()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {activeUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {activeUser.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={getDashboardHref()}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-600" />
                      Go to Dashboard
                    </Link>

                    <Link
                      href="/calculator"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <Calculator className="w-4 h-4 text-amber-600" />
                      Smart Calculator
                    </Link>

                    <Link
                      href="/packages"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-amber-600" />
                      Browse Packages
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-amber-600" />
                        System Settings
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors duration-200 px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold text-white bg-black hover:bg-slate-800 px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg px-6 py-4 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-bold py-1 ${
                    active ? "text-amber-600" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {!isMounted ? null : activeUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-black text-amber-400 flex items-center justify-center font-bold text-sm">
                    {(activeUser.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {activeUser.name}
                    </p>
                    <p className="text-xs text-slate-500">{activeUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={getDashboardHref()}
                    className="px-3 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl text-center"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl text-center"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 bg-black text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
