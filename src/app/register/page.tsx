"use client";

import { SignUpForm } from "@/components/auth/signup";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#070b13] py-12 px-4 overflow-hidden font-sans">
      {/* Decorative Premium Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/10 to-cyan-500/20 blur-[120px] pointer-events-none" />
      
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[540px] relative z-10"
      >
        {/* Logo and Intro */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              EVENTO
            </span>
          </Link>
          <p className="text-slate-400 text-sm font-medium">
            Create your account to start managing your events and bookings.
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <SignUpForm />
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Secure, encrypted connection &bull; © 2026 Evento
        </div>
      </motion.div>
    </div>
  );
}
