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
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { Camera, User } from "lucide-react";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type FormData = yup.InferType<typeof schema> & {
  profileImage?: FileList;
};

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          profileImage: null,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        toast.error(result.message ?? result.error ?? "Failed to create account");
        return;
      }

      if (result.data?.token) {
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );
        toast.success("Account created successfully!");
        router.push("/dashboard");
        return;
      }

      // Fallback sign in
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const loginResult = await loginRes.json();
      if (loginRes.ok && loginResult.data?.token) {
        dispatch(
          setCredentials({
            user: loginResult.data.user,
            token: loginResult.data.token,
          })
        );
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.success("Account created! Please login.");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {/* Circle Profile Photo Uploader */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="relative group w-20 h-20 rounded-full overflow-hidden bg-slate-950/40 border border-slate-800 flex items-center justify-center cursor-pointer transition-all hover:border-indigo-500">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-slate-500" />
          )}
          <label
            htmlFor="profileImage"
            className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white transition-opacity cursor-pointer"
          >
            <Camera className="w-4 h-4 mb-0.5" />
            Upload
          </label>
        </div>
        
        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          {...register("profileImage", {
            onChange: handleImageChange,
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">First Name</Label>
          <Input 
            {...register("firstName")} 
            placeholder="John"
            className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
          />
          {errors.firstName && (
            <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Last Name</Label>
          <Input 
            {...register("lastName")} 
            placeholder="Doe"
            className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
          />
          {errors.lastName && (
            <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Email Address</Label>
        <Input 
          type="email" 
          {...register("email")} 
          placeholder="name@company.com"
          className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
        />
        {errors.email && (
          <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Phone Number</Label>
        <Input 
          {...register("phone")} 
          placeholder="+880 1700 000000"
          className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
        />
        {errors.phone && (
          <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.phone.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Date of Birth</Label>
          <Input
            type="date"
            {...register("dateOfBirth")}
            className="bg-slate-950/40 border-slate-800 text-white focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all block w-full [color-scheme:dark]"
          />
          {errors.dateOfBirth && (
            <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Gender</Label>
          <select
            {...register("gender")}
            className="w-full bg-slate-950/40 border border-slate-800 text-white focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 px-3 transition-all focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled className="bg-slate-900 text-slate-500">
              Select
            </option>
            <option value="male" className="bg-slate-900 text-white">Male</option>
            <option value="female" className="bg-slate-900 text-white">Female</option>
            <option value="other" className="bg-slate-900 text-white">Other</option>
          </select>
          {errors.gender && (
            <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Password</Label>
        <Input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
        />
        {errors.password && (
          <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-slate-300 font-medium text-xs tracking-wide uppercase">Confirm Password</Label>
        <Input
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          className="bg-slate-950/40 border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10 transition-all"
        />
        {errors.confirmPassword && (
          <p className="text-rose-500 text-[10px] font-semibold mt-0.5">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        className="w-full h-11 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>

      <div className="relative my-4">
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

      <div className="text-center text-sm mt-4 text-slate-400 font-medium">
        Already have an account?{" "}
        <button
          type="button"
          className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}