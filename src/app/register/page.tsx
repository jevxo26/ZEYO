"use client";

import { SignUpForm } from "@/components/auth/signup";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Fraunces, Manrope } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export default function RegisterPage() {
  return (
    <div
      className={`${fraunces.variable} ${manrope.variable} min-h-screen flex flex-col bg-[#F4F5FC]`}
      style={{
        fontFamily: "var(--font-body)",
        backgroundImage:
          "radial-gradient(circle, rgba(79,125,243,0.08) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <Navbar />
      <div className="flex-1 flex min-h-[calc(100vh-80px)]">
        {/* Left Column: Pass Card */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="w-full max-w-xl h-full flex flex-col justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-3 text-[#6B6795] hover:text-[#171334] transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Back to home</span>
          </Link>

          {/* The Pass */}
          <div className="relative rounded-[28px] bg-[#171334] border border-[#7C6FE8]/20 shadow-[0_25px_60px_-20px_rgba(23,19,52,0.55)] p-5 sm:p-6 overflow-hidden flex flex-col max-h-[88vh]">
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79,125,243,0.35), rgba(155,93,229,0.35))",
              }}
            />

            {/* Header */}
            <div className="relative mb-3 shrink-0">
              <div className="inline-flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)" }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span
                  className="text-base tracking-tight text-[#F1F0FA]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  EVENTO
                </span>
                <span
                  className="ml-auto text-[9px] font-bold tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border"
                  style={{ color: "#B7ACF5", borderColor: "rgba(124,111,232,0.35)" }}
                >
                  New Pass
                </span>
              </div>
              <h1
                className="text-xl text-[#F1F0FA] tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Create your account
              </h1>
              <p className="text-[#A8A3C9] text-[11px] leading-relaxed">
                Join event professionals managing bookings, vendors, and venues in one place.
              </p>
            </div>

            {/* Scrollable form area */}
            <div className="relative overflow-y-auto pr-1 -mr-1">
              <SignUpForm />
            </div>

            <div className="relative mt-3 text-center text-[10px] font-medium text-[#7E7AA6] shrink-0">
              🔒 Secure, encrypted connection &bull; © 2026 EVENTO
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Image & Testimonial */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1600"
          alt="Event Management"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.9) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(23,19,52,0.15) 0%, rgba(23,19,52,0.6) 55%, rgba(23,19,52,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)", opacity: 0.3 }}
        />
        <div className="absolute bottom-8 left-8 right-8 space-y-2">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(124,111,232,0.15)",
              borderColor: "rgba(124,111,232,0.4)",
              color: "#C7BEFA",
            }}
          >
            ★ Trusted by Event Professionals
          </div>
          <blockquote
            className="text-lg text-[#F1F0FA] leading-snug"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500 }}
          >
            &ldquo;The best platform for organizing complex corporate events and weddings in one place.&rdquo;
          </blockquote>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{ borderColor: "rgba(124,111,232,0.4)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                alt="Michael T."
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#F1F0FA] font-semibold text-sm">Michael Torres</p>
              <p className="text-[#A8A3C9] text-xs">Lead Coordinator</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}