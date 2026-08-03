"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SocialLogin from "../SocialLogin";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import {
  Camera,
  User,
  Mail,
  Phone,
  CalendarDays,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
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

const ACCENT_GRADIENT = "linear-gradient(135deg, #F59E0B, #FB923C)";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span
        className="w-1 h-1 rounded-full shrink-0"
        style={{ background: ACCENT_GRADIENT }}
      />
      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">
        {children}
      </span>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    reader.onload = () => setImagePreview(reader.result as string);
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
        dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
        toast.success("Account created successfully!");
        router.push("/dashboard");
        return;
      }

      const loginRes = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const loginResult = loginRes.data;
      if (loginResult && loginResult.data?.token) {
        dispatch(
          setCredentials({ user: loginResult.data.user, token: loginResult.data.token })
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

  const inputClass =
    "w-full bg-[#F5F5F3] border-transparent text-[#171334] placeholder-[#9A9A94] focus:ring-2 focus:ring-amber-500 focus:border-transparent rounded-lg h-9 text-sm transition-all pl-9";
  const labelClass = "text-slate-300 font-semibold text-xs";
  const errorClass = "text-rose-400 text-[11px] font-semibold mt-0.5";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A82] pointer-events-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 text-left w-full">
      {/* Gradient-ring Profile Photo Uploader */}
      <div className="flex flex-col items-center space-y-1.5 mb-1">
        <div
          className="relative w-[72px] h-[72px] rounded-full p-[2px]"
          style={{ background: ACCENT_GRADIENT }}
        >
          <div className="relative group w-full h-full rounded-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-amber-400/70" />
            )}
            <label
              htmlFor="profileImage"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] text-white font-semibold transition-opacity cursor-pointer"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              Upload
            </label>
          </div>
          <label
            htmlFor="profileImage"
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center border-2 border-black cursor-pointer"
            style={{ background: ACCENT_GRADIENT }}
          >
            <Camera className="w-2.5 h-2.5 text-black" />
          </label>
        </div>

        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          {...register("profileImage", { onChange: handleImageChange })}
        />
      </div>

      <SectionLabel>Personal Details</SectionLabel>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className={labelClass}>First Name</label>
          <div className="relative">
            <User className={iconClass} />
            <Input {...register("firstName")} placeholder="John" className={inputClass} />
          </div>
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Last Name</label>
          <div className="relative">
            <User className={iconClass} />
            <Input {...register("lastName")} placeholder="Doe" className={inputClass} />
          </div>
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className={labelClass}>Date of Birth</label>
          <div className="relative">
            <CalendarDays className={iconClass} />
            <Input type="date" {...register("dateOfBirth")} className={`${inputClass} block`} />
          </div>
          {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
        </div>

        {/* Gender — named peer groups so each radio only affects its own label */}
        <div className="space-y-1">
          <label className={labelClass}>Gender</label>
          <div className="grid grid-cols-3 gap-1">
            <div className="relative">
              <input
                type="radio"
                id="gender-male"
                value="male"
                {...register("gender")}
                className="peer/male hidden"
              />
              <label
                htmlFor="gender-male"
                className="peer-checked/male:text-black peer-checked/male:border-transparent peer-checked/male:[background-image:linear-gradient(135deg,#F59E0B,#FB923C)] cursor-pointer text-center rounded-lg h-9 flex items-center justify-center text-[10px] font-bold capitalize border border-white/10 bg-[#1A1A1A] text-slate-400 transition-all block w-full"
              >
                Male
              </label>
            </div>

            <div className="relative">
              <input
                type="radio"
                id="gender-female"
                value="female"
                {...register("gender")}
                className="peer/female hidden"
              />
              <label
                htmlFor="gender-female"
                className="peer-checked/female:text-black peer-checked/female:border-transparent peer-checked/female:[background-image:linear-gradient(135deg,#F59E0B,#FB923C)] cursor-pointer text-center rounded-lg h-9 flex items-center justify-center text-[10px] font-bold capitalize border border-white/10 bg-[#1A1A1A] text-slate-400 transition-all block w-full"
              >
                Female
              </label>
            </div>

            <div className="relative">
              <input
                type="radio"
                id="gender-other"
                value="other"
                {...register("gender")}
                className="peer/other hidden"
              />
              <label
                htmlFor="gender-other"
                className="peer-checked/other:text-black peer-checked/other:border-transparent peer-checked/other:[background-image:linear-gradient(135deg,#F59E0B,#FB923C)] cursor-pointer text-center rounded-lg h-9 flex items-center justify-center text-[10px] font-bold capitalize border border-white/10 bg-[#1A1A1A] text-slate-400 transition-all block w-full"
              >
                Other
              </label>
            </div>
          </div>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
      </div>

      <SectionLabel>Contact & Security</SectionLabel>

      <div className="space-y-1">
        <label className={labelClass}>Email Address</label>
        <div className="relative">
          <Mail className={iconClass} />
          <Input type="email" {...register("email")} placeholder="name@company.com" className={inputClass} />
        </div>
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Phone Number</label>
        <div className="relative">
          <Phone className={iconClass} />
          <Input {...register("phone")} placeholder="+880 1700 000000" className={inputClass} />
        </div>
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Password</label>
        <div className="relative">
          <Lock className={iconClass} />
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className={`${inputClass} pr-9`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A82] hover:text-[#171334] transition-colors"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Confirm Password</label>
        <div className="relative">
          <Lock className={iconClass} />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="••••••••"
            className={`${inputClass} pr-9`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A82] hover:text-[#171334] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
      </div>

      <Button
        className="w-full h-9 mt-1 text-black font-bold text-sm rounded-lg transition-all shadow-sm border-0"
        style={{ background: ACCENT_GRADIENT }}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-black px-3 text-slate-500 font-semibold">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <SocialLogin />
      </div>

      <div className="text-center text-xs mt-2 text-slate-400 font-medium">
        Already have an account?{" "}
        <button
          type="button"
          className="text-amber-300 font-bold hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}