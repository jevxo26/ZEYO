"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar as CalendarIcon,
  MapPin,
  Tag,
  Sparkles,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import Link from "next/link";

const schema = yup.object({
  title: yup.string().required("Celebration title is required"),
  date: yup.string().required("Date is required"),
  location: yup.string().required("Location is required"),
  zone: yup.string().required("Bangladesh zone is required"),
  budget: yup
    .number()
    .typeError("Budget must be a number in BDT")
    .required("Budget is required"),
  type: yup.string().required("Celebration type is required"),
});

type FormData = yup.InferType<typeof schema>;

interface NewBookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function NewBookingModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: NewBookingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;

  const close = () => {
    if (propOnClose) propOnClose();
    setInternalOpen(false);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      zone: "Dhaka Metro (Core Zone)",
      type: "Wedding",
    },
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setInternalOpen(true);
    window.addEventListener("open-dashboard-modal", handleOpen);
    return () =>
      window.removeEventListener("open-dashboard-modal", handleOpen);
  }, []);

  if (!isOpen || !mounted) return null;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const newBookingObj = {
      id: `BKG-2026-${Math.floor(100 + Math.random() * 900)}`,
      bookingNumber: `BKG-2026-${Math.floor(100 + Math.random() * 900)}`,
      eventName: data.title,
      eventType: data.type,
      eventDate: new Date(data.date).toISOString(),
      location: `${data.location} (${data.zone})`,
      budget: Number(data.budget),
      grandTotal: Number(data.budget),
      subtotal: Number(data.budget),
      tax: 0,
      discount: 0,
      createdAt: new Date().toISOString(),
      notes: `Custom ${data.type} celebration in ${data.zone}. Managed by EVENTO Coordinator.`,
      status: "CONFIRMED",
      bookingStatus: "confirmed",
    };

    // Save to local storage for instant dashboard updates
    const existing = localStorage.getItem("custom_bookings");
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newBookingObj);
    localStorage.setItem("custom_bookings", JSON.stringify(list));

    toast.success("✓ Custom celebration booking submitted to EVENTO Coordinator!");
    window.dispatchEvent(new CustomEvent("dashboard-data-update"));
    close();
    setIsLoading(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center font-bold text-sm">
              ৳
            </div>
            <div>
              <h2 className="text-base font-extrabold">
                Create New Celebration Booking
              </h2>
              <p className="text-[11px] text-purple-300">
                Managed Event OS • 100% Coordinator Protected
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Route Shortcuts to Calculator & Packages */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-3">
          <Link
            href="/calculator"
            onClick={close}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
              Smart Calculator
            </div>
            <span className="text-[10px] text-purple-200">
              4-step wizard with 7 BD zones
            </span>
          </Link>

          <Link
            href="/packages"
            onClick={close}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 text-slate-900 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold mb-1 text-purple-700">
              <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Browse Packages
            </div>
            <span className="text-[10px] text-slate-500">
              Curated wedding & corporate sets
            </span>
          </Link>
        </div>

        {/* Direct Booking Form in BDT */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-1 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Or Submit Quick Custom Booking Request (BDT ৳)
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Celebration Title
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("title")}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all font-semibold"
                placeholder="e.g. Ahmed & Fatima Royal Wedding"
              />
            </div>
            {errors.title && (
              <p className="text-xs text-rose-500 font-semibold">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Celebration Type
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold"
              >
                <option value="Wedding">Wedding Ceremony</option>
                <option value="Gaye Holud">Gaye Holud / Mehendi</option>
                <option value="Corporate">Corporate Summit / Gala</option>
                <option value="Social">Social / Birthday Gala</option>
                <option value="Other">Custom Bangladesh Event</option>
              </select>
              {errors.type && (
                <p className="text-xs text-rose-500 font-semibold">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bangladesh Zone
              </label>
              <select
                {...register("zone")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold"
              >
                <option value="Dhaka Metro (Core Zone)">
                  Dhaka Metro (1.00x)
                </option>
                <option value="Chattogram Region">Chattogram (1.10x)</option>
                <option value="Sylhet Region">Sylhet Region (1.15x)</option>
                <option value="Rajshahi District">Rajshahi (0.95x)</option>
                <option value="Khulna Metro">Khulna Metro (0.95x)</option>
                <option value="Rangpur Division">Rangpur (0.90x)</option>
                <option value="Barishal Coastal Area">
                  Barishal (0.90x)
                </option>
              </select>
              {errors.zone && (
                <p className="text-xs text-rose-500 font-semibold">
                  {errors.zone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Celebration Date
              </label>
              <input
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold"
              />
              {errors.date && (
                <p className="text-xs text-rose-500 font-semibold">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Estimated Budget (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-sm text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  {...register("budget")}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-extrabold"
                  placeholder="380000"
                />
              </div>
              {errors.budget && (
                <p className="text-xs text-rose-500 font-semibold">
                  {errors.budget.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Venue / Hall Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("location")}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-semibold"
                placeholder="e.g. Gulshan Club Hall, Dhaka"
              />
            </div>
            {errors.location && (
              <p className="text-xs text-rose-500 font-semibold">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? "Submitting..." : "Submit Booking to Coordinator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
