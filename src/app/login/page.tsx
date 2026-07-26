"use client";

import { SignInForm } from "@/components/auth/signin";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to home</span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                EVENTO
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Welcome back to EVENTO
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sign in to your account or use the <strong>1-Click Managed Event OS Demo Roles</strong> below to test Customer, Admin, or Vendor portals.
            </p>
          </div>

          {/* Form Component */}
          <SignInForm />

          {/* Footer info */}
          <div className="mt-10 text-center text-xs font-medium text-slate-400">
            🔒 Managed Event OS Role Security &bull; © 2026 EVENTO
          </div>
        </div>
      </div>

      {/* Right Column: Image & Testimonial */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600"
          alt="Event Management Bangladesh"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider">
            ★ Managed Multi-Vendor Platform
          </div>
          <blockquote className="text-2xl font-semibold text-white leading-snug">
            &ldquo;EVENTO has completely transformed how we plan and book events across Bangladesh. The custom calculator and zero-leakage vendor coordination are state of the art.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 flex items-center justify-center font-bold text-white">
              SJ
            </div>
            <div>
              <p className="text-white font-semibold">Sarah Jenkins</p>
              <p className="text-white/70 text-sm">
                Event Director, Gulshan Convention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
