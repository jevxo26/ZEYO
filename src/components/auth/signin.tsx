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
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) {
        toast.error(result.message || result.error || "Failed to sign in");
        return;
      }
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred during sign in");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="space-y-1.5 text-left">
        <Label htmlFor="email" className="text-slate-300 font-medium text-xs tracking-wide uppercase">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          className="w-full bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-11 transition-all"
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-slate-300 font-medium text-xs tracking-wide uppercase">
            Password
          </Label>
          <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={!!errors.password}
          className="w-full bg-slate-950/40 border-slate-800 text-white placeholder-slate-500 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-11 transition-all"
        />
        {errors.password && (
          <p className="text-xs text-rose-500 font-semibold mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-[#0f172a] px-3 text-slate-500 font-bold rounded-full">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <SocialLogin />
      </div>

      <div className="text-center text-sm text-slate-400 mt-4 font-medium">
        Don't have an account?{" "}
        <button 
          type="button" 
          onClick={() => router.push('/register')} 
          className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
