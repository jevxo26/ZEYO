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
      const response = await apiClient.post("/auth/login", data);
      const result = response.data;
      if (!result || result.success === false) {
        toast.error(result?.message || result?.error || "Failed to sign in");
        return;
      }
      dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          className="w-full bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-11 transition-all"
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
            Password
          </Label>
          <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={!!errors.password}
          className="w-full bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-11 transition-all"
        />
        {errors.password && (
          <p className="text-xs text-rose-500 font-semibold mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm"
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <SocialLogin />
      </div>

      <div className="text-center text-sm text-slate-500 mt-6 font-medium">
        Don't have an account?{" "}
        <button 
          type="button" 
          onClick={() => router.push('/register')} 
          className="text-slate-900 font-bold hover:underline"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
