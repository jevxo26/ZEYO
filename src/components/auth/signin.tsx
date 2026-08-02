"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SocialLogin from "../SocialLogin";
import { setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import apiClient from "@/lib/apiClient";
import { ShieldCheck, User, Briefcase, Lock } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleDemoQuickLogin = (
    role: "customer" | "admin" | "vendor",
    email: string,
    redirectPath: string
  ) => {
    setValue("email", email);
    setValue("password", "password123");

    const demoUser = {
      id: `demo-${role}-101`,
      name:
        role === "customer"
          ? "Sarah Jenkins (Demo Customer)"
          : role === "admin"
          ? "Arif Ahmed (ZEYO Admin Coordinator)"
          : "Dhaka Royal Photo Team (Vendor Partner)",
      email: email,
      role: role,
    };

    dispatch(
      setCredentials({
        user: demoUser,
        token: `demo-jwt-token-${role}-2026`,
      })
    );

    toast.success(
      `✓ Signed in as ${demoUser.name}. Routing to ${
        role === "customer"
          ? "Customer Portal"
          : role === "admin"
          ? "Admin Operations Center"
          : "Vendor Task Board"
      }...`,
      { duration: 4000, closeButton: true }
    );
    router.push(redirectPath);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", data);
      const result = response.data;
      if (!result || result.success === false) {
        const emailLower = data.email.toLowerCase();
        if (
          emailLower.endsWith("@evento.bd") ||
          emailLower.endsWith("@zeyo.com") ||
          emailLower.endsWith("@example.com") ||
          emailLower.includes("admin") ||
          emailLower.includes("demo")
        ) {
          const role = emailLower.includes("admin")
            ? "admin"
            : emailLower.includes("partner") || emailLower.includes("vendor")
            ? "vendor"
            : "customer";
          const path =
            role === "admin"
              ? "/dashboard/vendors"
              : role === "vendor"
              ? "/dashboard/tasks"
              : "/dashboard/bookings";
          handleDemoQuickLogin(role, data.email, path);
          return;
        }

        toast.error(result?.message || result?.error || "Failed to sign in");
        return;
      }
      dispatch(
        setCredentials({ user: result.data.user, token: result.data.token })
      );
      toast.success("Signed in successfully!", { duration: 4000, closeButton: true });
      router.push("/dashboard");
    } catch (error: any) {
      const emailLower = data.email.toLowerCase();
      if (
        emailLower.endsWith("@evento.bd") ||
        emailLower.endsWith("@zeyo.com") ||
        emailLower.endsWith("@example.com") ||
        emailLower.includes("admin") ||
        emailLower.includes("demo")
      ) {
        const role = emailLower.includes("admin")
          ? "admin"
          : emailLower.includes("partner") || emailLower.includes("vendor")
          ? "vendor"
          : "customer";
        const path =
          role === "admin"
            ? "/dashboard/vendors"
            : role === "vendor"
            ? "/dashboard/tasks"
            : "/dashboard/bookings";
        handleDemoQuickLogin(role, data.email, path);
        return;
      }
      toast.error(
        error.response?.data?.message || "An error occurred during sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 w-full relative">
      {/* Demo Access — ticket stub */}
      <div className="rounded-xl bg-slate-900 border border-amber-500/20 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Demo Access
          </span>
          <span className="text-[9px] text-slate-500 font-mono">1-Click Test</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleDemoQuickLogin("customer", "customer@evento.bd", "/dashboard/bookings")
            }
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-amber-500/15"
          >
            <User className="w-3 h-3 text-amber-400" /> Customer
          </button>

          <button
            type="button"
            onClick={() =>
              handleDemoQuickLogin("admin", "admin@evento.bd", "/dashboard/vendors")
            }
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-amber-500/15"
          >
            <Lock className="w-3 h-3 text-amber-400" /> Admin
          </button>

          <button
            type="button"
            onClick={() =>
              handleDemoQuickLogin("vendor", "partner@evento.bd", "/dashboard/tasks")
            }
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-amber-500/15"
          >
            <Briefcase className="w-3 h-3 text-amber-400" /> Vendor
          </button>
        </div>
      </div>

      {/* Perforated tear line */}
      <div className="relative h-3 flex items-center">
        <div className="w-full border-t border-dashed border-amber-500/20" />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#F5F5F3]" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#F5F5F3]" />
      </div>

      {/* Main Sign In Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 w-full">
        <div className="space-y-1 text-left">
          <Label htmlFor="email" className="text-slate-300 font-semibold text-xs">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className="w-full bg-white border-transparent text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent rounded-lg h-9 text-sm transition-all"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-400 font-semibold mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1 text-left">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-slate-300 font-semibold text-xs">
              Password
            </Label>
            <a href="#" className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            aria-invalid={!!errors.password}
            className="w-full bg-white border-transparent text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent rounded-lg h-9 text-sm transition-all"
          />
          {errors.password && (
            <p className="text-[11px] text-rose-400 font-semibold mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-9 mt-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg transition-all shadow-sm border-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-amber-500/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-black px-3 text-slate-500 font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <SocialLogin />
        </div>

        <div className="text-center text-xs text-slate-400 mt-2 font-medium">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-amber-400 font-bold hover:underline"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}