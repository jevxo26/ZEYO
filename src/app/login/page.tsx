"use client";

import { SignInForm } from "@/components/auth/signin";
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

export default function LoginPage() {
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
          <div className="w-full max-w-md">
            {/* The Pass */}
            <div className="relative rounded-[28px] bg-[#171334] border border-[#7C6FE8]/20 shadow-[0_25px_60px_-20px_rgba(23,19,52,0.55)] p-5 sm:p-6 overflow-hidden">
            {/* Corner glow accent */}
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79,125,243,0.35), rgba(155,93,229,0.35))",
              }}
            />

            {/* Header */}
            <div className="relative mb-3">
              <div className="inline-flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)",
                  }}
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
                  Access Pass
                </span>
              </div>
              <h1
                className="text-xl text-[#F1F0FA] tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Welcome back to EVENTO
              </h1>
              <p className="text-[#A8A3C9] text-[11px] leading-relaxed">
                Sign in, or tap a demo role below to preview the Customer, Admin, or Vendor portal.
              </p>
            </div>

            <SignInForm />

            <div className="relative mt-3 text-center text-[10px] font-medium text-[#7E7AA6]">
              🔒 Managed Event OS Role Security &bull; © 2026 EVENTO
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Image & Testimonial */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600"
          alt="Event Management Bangladesh"
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
          style={{
            background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)",
            opacity: 0.3,
          }}
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
            ★ Managed Multi-Vendor Platform
          </div>
          <blockquote
            className="text-lg text-[#F1F0FA] leading-snug"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500 }}
          >
            &ldquo;EVENTO transformed how we plan and book events across Bangladesh &mdash; zero-leakage vendor coordination, done right.&rdquo;
          </blockquote>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 flex items-center justify-center font-bold text-xs"
              style={{
                borderColor: "rgba(124,111,232,0.4)",
                background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)",
                color: "white",
              }}
            >
              SJ
            </div>
            <div>
              <p className="text-[#F1F0FA] font-semibold text-sm">Sarah Jenkins</p>
              <p className="text-[#A8A3C9] text-xs">Event Director, Gulshan Convention</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}