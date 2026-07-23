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
import apiClient from "@/lib/apiClient";

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

      const response = await apiClient.post("/auth/register", {
        name: fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        profileImage: null,
      });

      const result = response.data;
      if (!result || result.success === false) {
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
      const loginRes = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const loginResult = loginRes.data;
      if (loginResult && loginResult.data?.token) {
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left w-full">
      {/* Circle Profile Photo Uploader */}
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center cursor-pointer transition-all hover:border-slate-400">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-slate-400" />
          )}
          <label
            htmlFor="profileImage"
            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-semibold transition-opacity cursor-pointer"
          >
            <Camera className="w-5 h-5 mb-1" />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-sm">First Name</Label>
          <Input 
            {...register("firstName")} 
            placeholder="John"
            className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
          />
          {errors.firstName && (
            <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-sm">Last Name</Label>
          <Input 
            {...register("lastName")} 
            placeholder="Doe"
            className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
          />
          {errors.lastName && (
            <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-sm">Email Address</Label>
        <Input 
          type="email" 
          {...register("email")} 
          placeholder="name@company.com"
          className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
        />
        {errors.email && (
          <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-sm">Phone Number</Label>
        <Input 
          {...register("phone")} 
          placeholder="+880 1700 000000"
          className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
        />
        {errors.phone && (
          <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.phone.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-sm">Date of Birth</Label>
          <Input
            type="date"
            {...register("dateOfBirth")}
            className="bg-white border-slate-300 text-slate-900 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all block w-full"
          />
          {errors.dateOfBirth && (
            <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-sm">Gender</Label>
          <select
            {...register("gender")}
            className="w-full bg-white border border-slate-300 text-slate-900 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 px-3 transition-all focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled className="text-slate-400">
              Select
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-sm">Password</Label>
        <Input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
        />
        {errors.password && (
          <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-sm">Confirm Password</Label>
        <Input
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-slate-900 focus:border-slate-900 rounded-lg h-10 transition-all"
        />
        {errors.confirmPassword && (
          <p className="text-rose-500 text-xs font-semibold mt-0.5">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        className="w-full h-11 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm"
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

      <div className="text-center text-sm mt-6 text-slate-500 font-medium">
        Already have an account?{" "}
        <button
          type="button"
          className="text-slate-900 font-bold hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}