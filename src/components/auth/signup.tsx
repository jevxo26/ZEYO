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

  const inputClass =
    "w-full bg-[#F1F0FA] border-transparent text-[#171334] placeholder-[#8A85B0] focus:ring-2 focus:ring-[#7C6FE8] focus:border-transparent rounded-lg h-9 text-sm transition-all";
  const labelClass = "text-[#D6D2EF] font-semibold text-xs";
  const errorClass = "text-rose-400 text-[11px] font-semibold mt-0.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 text-left w-full">
      {/* Circle Profile Photo Uploader */}
      <div className="flex flex-col items-center space-y-1.5 mb-1">
        <div
          className="relative group w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-all"
          style={{ backgroundColor: "#1F1B44", borderColor: "rgba(124,111,232,0.3)" }}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-[#9B8CF0]" />
          )}
          <label
            htmlFor="profileImage"
            className="absolute inset-0 bg-[#171334]/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] text-white font-semibold transition-opacity cursor-pointer"
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

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <Label className={labelClass}>First Name</Label>
          <Input {...register("firstName")} placeholder="John" className={inputClass} />
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </div>

        <div className="space-y-1">
          <Label className={labelClass}>Last Name</Label>
          <Input {...register("lastName")} placeholder="Doe" className={inputClass} />
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label className={labelClass}>Email Address</Label>
        <Input type="email" {...register("email")} placeholder="name@company.com" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label className={labelClass}>Phone Number</Label>
        <Input {...register("phone")} placeholder="+880 1700 000000" className={inputClass} />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <Label className={labelClass}>Date of Birth</Label>
          <Input type="date" {...register("dateOfBirth")} className={`${inputClass} block`} />
          {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
        </div>

        <div className="space-y-1">
          <Label className={labelClass}>Gender</Label>
          <select
            {...register("gender")}
            className="w-full bg-[#F1F0FA] border border-transparent text-[#171334] focus:ring-2 focus:ring-[#7C6FE8] focus:border-transparent rounded-lg h-9 px-3 text-sm transition-all focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled className="text-[#8A85B0]">
              Select
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label className={labelClass}>Password</Label>
        <Input type="password" {...register("password")} placeholder="••••••••" className={inputClass} />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label className={labelClass}>Confirm Password</Label>
        <Input type="password" {...register("confirmPassword")} placeholder="••••••••" className={inputClass} />
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
      </div>

      <Button
        className="w-full h-9 mt-1 text-white font-bold text-sm rounded-lg transition-all shadow-sm border-0"
        style={{ background: "linear-gradient(135deg, #4F7DF3, #9B5DE5)" }}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
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
          <span className="w-full border-t border-[#7C6FE8]/15" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-[#171334] px-3 text-[#7E7AA6] font-semibold">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <SocialLogin />
      </div>

      <div className="text-center text-xs mt-2 text-[#A8A3C9] font-medium">
        Already have an account?{" "}
        <button
          type="button"
          className="text-[#C7BEFA] font-bold hover:underline"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}