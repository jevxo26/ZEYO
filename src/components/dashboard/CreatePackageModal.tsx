"use client";

import React, { useState, useEffect } from "react";
import { X, Package, DollarSign, Tag, Sparkles, Image as ImageIcon, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { EventPackage } from "@/types/package";
import apiClient from "@/lib/apiClient";

export function CreatePackageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [includedText, setIncludedText] = useState("Photography, Videography, Stage Decor, Sound System");
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      const detail =
        typeof customEvent.detail === "string"
          ? customEvent.detail
          : customEvent.detail?.type || customEvent.detail?.modal;

      if (detail === "new-package") {
        setIsOpen(true);
      }
    };

    window.addEventListener("open-dashboard-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-dashboard-modal", handleOpenModal);
    };
  }, []);

  if (!isOpen) return null;

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setSubtitle("");
    setBasePrice("");
    setDiscountPercentage("0");
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !basePrice) {
      toast.error("Please fill in Package Title and Price");
      return;
    }

    setIsLoading(true);

    try {
      const includedList = includedText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const newPackage: EventPackage = {
        id: `pkg-custom-${Date.now()}`,
        title,
        subtitle: subtitle || "Managed Premium Event Package",
        eventTypeId: eventType.toLowerCase().includes("wedding") ? "evt-type-wedding" : "evt-type-holud",
        basePrice: Number(basePrice),
        discountPercentage: Number(discountPercentage) || 0,
        imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        popular: isPopular,
        included: includedList,
        configuredServices: [],
      };

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("customPackages");
        let list: EventPackage[] = [];
        if (stored) {
          try {
            list = JSON.parse(stored);
          } catch (err) {}
        }
        list.unshift(newPackage);
        localStorage.setItem("customPackages", JSON.stringify(list));

        // Notify app components to re-render instantly
        window.dispatchEvent(new Event("dashboard-data-update"));
      }

      // Non-blocking API sync attempt
      try {
        await apiClient.post("/api/admin/packages", {
          name: title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          shortDescription: subtitle,
          description: subtitle,
          basePrice: Number(basePrice),
          imageUrl: imageUrl.trim(),
        }).catch(() => null);
      } catch (err) {}

      toast.success("✨ Package created successfully! It is now live on the Packages page.", {
        duration: 4000,
      });

      closeModal();
    } catch (error) {
      toast.error("Failed to save package.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Package className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Create New Event Package</h3>
              <p className="text-xs text-purple-100">Add a new package to the platform catalog</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Package Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Royal Wedding Package"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subtitle / Highlight Description
            </label>
            <input
              type="text"
              placeholder="e.g. Complete stage floral decor, 4K videography & DJ performance"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
              >
                <option value="Wedding">Wedding Ceremony</option>
                <option value="Gaye Holud">Gaye Holud / Mehendi</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Corporate">Corporate Gala</option>
                <option value="Anniversary">Anniversary Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Base Price (BDT) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">৳</span>
                <input
                  type="number"
                  required
                  placeholder="120000"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                Mark as &quot;Most Popular&quot;
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Included Services (Comma separated)
            </label>
            <textarea
              rows={2}
              value={includedText}
              onChange={(e) => setIncludedText(e.target.value)}
              placeholder="Photography, Cinematic Video, Floral Stage, Catering Support"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {isLoading ? "Publishing..." : "Publish Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
