"use client";

import { motion } from "framer-motion";
import { SignUpForm } from "@/components/auth/signup";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-8 lg:px-24 relative z-10 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Header */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to home</span>
          </Link>
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tight text-slate-900">
                EVENTO
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Create your account
            </h1>
            <p className="text-slate-500 text-base">
              Join thousands of professionals managing events effortlessly.
            </p>
          </div>

          {/* Form Component */}
          <SignUpForm />

          {/* Footer info */}
          <div className="mt-12 text-center text-xs font-medium text-slate-400">
            Secure, encrypted connection &bull; © 2026 Evento
          </div>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 fixed right-0 top-0 bottom-0 h-screen">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1600"
          alt="Event Management"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <blockquote className="text-3xl font-medium text-white leading-snug">
            "The best platform for organizing complex corporate events and weddings in one place."
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-white">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Michael T." className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-semibold">Michael Torres</p>
              <p className="text-white/70 text-sm">Lead Coordinator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
