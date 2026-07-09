"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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

  profileImage: yup.mixed<FileList>().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const fullName =
        `${data.firstName} ${data.lastName}`.trim();

      const response = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

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
        toast.error(
          result.message ??
            result.error ??
            "Failed to create account"
        );
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

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const loginResult = await loginRes.json();

      if (
        loginRes.ok &&
        loginResult.data?.token
      ) {
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
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

    <div className="flex flex-col items-center space-y-2">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border flex items-center justify-center">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-slate-400">No Image</span>
        )}
      </div>

      <Label
        htmlFor="profileImage"
        className="cursor-pointer text-sm text-indigo-600 hover:underline"
      >
        Upload photo
      </Label>

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
      <div>
        <Label>First Name</Label>
        <Input {...register("firstName")} />
        {errors.firstName && (
          <p className="text-red-500 text-sm">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Label>Last Name</Label>
        <Input {...register("lastName")} />
        {errors.lastName && (
          <p className="text-red-500 text-sm">
            {errors.lastName.message}
          </p>
        )}
      </div>
    </div>

    <div>
      <Label>Email</Label>
      <Input type="email" {...register("email")} />
      {errors.email && (
        <p className="text-red-500 text-sm">
          {errors.email.message}
        </p>
      )}
    </div>

    <div>
      <Label>Phone</Label>
      <Input {...register("phone")} />
      {errors.phone && (
        <p className="text-red-500 text-sm">
          {errors.phone.message}
        </p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label>Date of Birth</Label>
        <Input
          type="date"
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <div>
        <Label>Gender</Label>

        <select
          {...register("gender")}
          className="w-full border rounded-md h-10 px-3"
          defaultValue=""
        >
          <option value="" disabled>
            Select
          </option>

          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {errors.gender && (
          <p className="text-red-500 text-sm">
            {errors.gender.message}
          </p>
        )}
      </div>
    </div>

    <div>
      <Label>Password</Label>
      <Input
        type="password"
        {...register("password")}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">
          {errors.password.message}
        </p>
      )}
    </div>

    <div>
      <Label>Confirm Password</Label>
      <Input
        type="password"
        {...register("confirmPassword")}
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">
          {errors.confirmPassword.message}
        </p>
      )}
    </div>

    <Button
      className="w-full"
      type="submit"
      disabled={isLoading}
    >
      {isLoading
        ? "Creating account..."
        : "Sign Up"}
    </Button>

    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>

      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-slate-500">
          Or continue with
        </span>
      </div>
    </div>

    <SocialLogin />

    <div className="text-center text-sm mt-4">
      Already have an account?{" "}
      <button
        type="button"
        className="text-indigo-600 hover:underline"
        onClick={() => router.push("/login")}
      >
        Sign In
      </button>
    </div>
  </form>
);
}