"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, MapPin, DollarSign, Tag, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

const schema = yup.object({
  title: yup.string().required("Event title is required"),
  date: yup.string().required("Date is required"),
  location: yup.string().required("Location is required"),
  budget: yup.number().typeError("Budget must be a number").required("Budget is required"),
  type: yup.string().required("Event type is required"),
});

type FormData = yup.InferType<typeof schema>;

export function NewBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail === "new-event") {
        setIsOpen(true);
      }
    };
    window.addEventListener("open-dashboard-modal", handleOpen);
    return () => window.removeEventListener("open-dashboard-modal", handleOpen);
  }, []);

  if (!isOpen) return null;

  const close = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // POST to the actual /bookings API
      const response = await apiClient.post("/bookings", {
        // Based on typical booking API
        eventName: data.title,
        eventType: data.type,
        eventDate: new Date(data.date).toISOString(),
        location: data.location,
        budget: data.budget,
        notes: data.title,
        status: "PENDING", 
      });

      if (response.data?.success !== false) {
        toast.success("Booking created successfully!");
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        close();
      } else {
        toast.error(response.data?.message || "Failed to create booking");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">New Booking</h2>
          <button onClick={close} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Title / Notes</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                {...register("title")} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                placeholder="e.g. Thompson Wedding"
              />
            </div>
            {errors.title && <p className="text-xs text-rose-500 font-semibold">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Type</label>
              <select 
                {...register("type")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              >
                <option value="">Select type</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="text-xs text-rose-500 font-semibold">{errors.type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</label>
              <div className="relative">
                <input 
                  type="date"
                  {...register("date")} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>
              {errors.date && <p className="text-xs text-rose-500 font-semibold">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                {...register("location")} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                placeholder="Venue name or address"
              />
            </div>
            {errors.location && <p className="text-xs text-rose-500 font-semibold">{errors.location.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number"
                {...register("budget")} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                placeholder="5000"
              />
            </div>
            {errors.budget && <p className="text-xs text-rose-500 font-semibold">{errors.budget.message}</p>}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
