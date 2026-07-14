"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="relative z-50 bg-white border-b border-slate-100">
      <div className="h-16 flex items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            EVENTO
          </span>
          <span className="hidden lg:inline text-[11px] font-medium text-slate-400 tracking-wide">
            — Every moment, perfectly planned
          </span>
        </Link>

        {/* Desktop / Tablet nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[14px] font-medium py-2 transition-colors duration-200 group ${
                  active ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -bottom-0.5 h-[2px] bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-300 ease-out -translate-x-1/2 ${
                    active ? "w-6" : "w-0 group-hover:w-6"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop / Tablet actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-[14px] font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 transition-colors duration-200"
        >
          <span className="relative w-5 h-5">
            <Menu
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`md:hidden absolute top-16 inset-x-0 bg-white border-b border-slate-100 shadow-lg overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : "0ms" }}
                className={`relative flex items-center gap-3 py-3 text-[15px] font-medium border-b border-slate-50 last:border-0 transition-all duration-300 ${
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                } ${active ? "text-slate-900" : "text-slate-500"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-transform duration-200 ${
                    active ? "scale-100" : "scale-0"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/login"
              className="text-center text-[14px] font-medium text-slate-600 py-2 hover:text-slate-900 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-center text-[14px] font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}