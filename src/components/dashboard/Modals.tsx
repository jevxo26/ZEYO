"use client";

import { useEffect, useState } from "react";
import { X, Calendar, DollarSign, MapPin, Briefcase, Percent, UserCheck, ShieldCheck } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

type ModalType = "new-event" | "new-vendor" | "new-booking" | "add-zone" | null;

export default function Modals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Event & Booking state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");

  // Vendor state
  const [vendorName, setVendorName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Photography");
  const [vendorZone, setVendorZone] = useState("Dhaka Zone");
  const [vendorPayoutRate, setVendorPayoutRate] = useState("৳35,000 / Event");

  // Zone Configuration state
  const [zoneName, setZoneName] = useState("");
  const [zoneMultiplier, setZoneMultiplier] = useState("1.15");
  const [commission, setCommission] = useState("15.0");
  const [vat, setVat] = useState("5.0");
  const [minAdvance, setMinAdvance] = useState("20.0");

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<ModalType>;
      if (customEvent.detail) {
        setActiveModal(customEvent.detail);
      }
    };

    window.addEventListener("open-dashboard-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-dashboard-modal", handleOpenModal);
    };
  }, []);

  const closeModal = () => {
    setActiveModal(null);
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventBudget("");
    setVendorName("");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventBudget) return;

    setIsLoading(true);
    try {
      const newBooking = {
        id: `BKG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        bookingNumber: `#BKG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        eventName,
        eventType: "Standard",
        eventDate: new Date(eventDate).toISOString(),
        location: eventLocation || "Dhaka Zone Venue",
        budget: Number(eventBudget),
        grandTotal: Number(eventBudget),
        bookingStatus: "pending",
        status: "PENDING REVIEW",
        notes: eventName,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("customBookings");
          const list = stored ? JSON.parse(stored) : [];
          list.unshift(newBooking);
          localStorage.setItem("customBookings", JSON.stringify(list));
        } catch (err) {}
      }

      try {
        await apiClient.post("/customers/events", {
          eventTitle: eventName,
          eventDate: new Date(eventDate).toISOString(),
          estimatedBudget: Number(eventBudget),
          notes: eventLocation,
        });
      } catch (err) {}

      toast.success(`Event "${eventName}" created successfully!`);
      window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventLocation || !eventBudget) return;

    setIsLoading(true);
    try {
      const newBooking = {
        id: `BKG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        bookingNumber: `#BKG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        eventName,
        eventType: "Standard",
        eventDate: new Date(eventDate).toISOString(),
        location: eventLocation,
        budget: Number(eventBudget),
        grandTotal: Number(eventBudget),
        bookingStatus: "pending",
        status: "PENDING REVIEW",
        notes: eventName,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("customBookings");
          const list = stored ? JSON.parse(stored) : [];
          list.unshift(newBooking);
          localStorage.setItem("customBookings", JSON.stringify(list));
        } catch (err) {}
      }

      try {
        await apiClient.post("/bookings", {
          eventName,
          eventType: "Standard",
          eventDate: new Date(eventDate).toISOString(),
          location: eventLocation,
          budget: Number(eventBudget),
          notes: eventName,
          status: "PENDING",
        });
      } catch (err) {}

      toast.success(`Booking "${eventName}" created successfully!`);
      window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName) return;

    const newVendorItem = {
      id: `V-${Math.floor(1000 + Math.random() * 9000)}`,
      name: vendorName,
      category: vendorCategory,
      zone: vendorZone,
      rating: "4.9",
      jobs: 0,
      verified: true,
      payoutRate: vendorPayoutRate || "৳35,000 / Event",
    };

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customVendors");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newVendorItem);
        localStorage.setItem("customVendors", JSON.stringify(list));
      } catch (err) {}
    }

    try {
      await apiClient.post("/vendors", newVendorItem);
    } catch (err) {}

    toast.success(`✓ Partner "${vendorName}" onboarded to ${vendorZone}!`);
    window.dispatchEvent(new CustomEvent("dashboard-data-update"));
    closeModal();
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Zone Configuration saved successfully!");
    closeModal();
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {activeModal === "new-event" && "Create New Event"}
            {activeModal === "new-booking" && "New Booking"}
            {activeModal === "new-vendor" && "Onboard Vendor Team"}
            {activeModal === "add-zone" && "Add Zone Configuration"}
          </h2>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: New Event */}
        {activeModal === "new-event" && (
          <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Wedding Ceremony"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Budget (BDT ৳)</label>
                <input
                  type="number"
                  required
                  placeholder="150000"
                  value={eventBudget}
                  onChange={(e) => setEventBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Venue Address</label>
              <input
                type="text"
                placeholder="e.g. Gulshan Club, Dhaka"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {isLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: New Booking */}
        {activeModal === "new-booking" && (
          <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Booking / Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Gaye Holud Night"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Total Budget (BDT ৳)</label>
                <input
                  type="number"
                  required
                  placeholder="120000"
                  value={eventBudget}
                  onChange={(e) => setEventBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Location / Venue</label>
              <input
                type="text"
                required
                placeholder="Banani Convention Hall, Dhaka"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {isLoading ? "Saving..." : "Create Booking"}
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Onboard Vendor */}
        {activeModal === "new-vendor" && (
          <form onSubmit={handleCreateVendor} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Vendor Partner Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lumina AV Systems Bangladesh"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="Photography">Photography</option>
                  <option value="Videography">Videography</option>
                  <option value="Catering">Catering</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Stage & Lighting">Stage &amp; Lighting</option>
                  <option value="Sound System">Sound System</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Coverage Zone</label>
                <select
                  value={vendorZone}
                  onChange={(e) => setVendorZone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="Dhaka Zone">Dhaka Zone</option>
                  <option value="Chattogram Zone">Chattogram Zone</option>
                  <option value="Sylhet Zone">Sylhet Zone</option>
                  <option value="Rajshahi Zone">Rajshahi Zone</option>
                  <option value="Khulna Zone">Khulna Zone</option>
                  <option value="Barishal Zone">Barishal Zone</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Internal Payout Rate (BDT)</label>
              <input
                type="text"
                placeholder="e.g. ৳35,000 / Event"
                value={vendorPayoutRate}
                onChange={(e) => setVendorPayoutRate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                Onboard Vendor Partner
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Add Zone */}
        {activeModal === "add-zone" && (
          <form onSubmit={handleSaveZone} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Zone Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sylhet Zone"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Pricing Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  placeholder="1.15"
                  value={zoneMultiplier}
                  onChange={(e) => setZoneMultiplier(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Platform Commission (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Standard VAT (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Min. Advance (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={minAdvance}
                    onChange={(e) => setMinAdvance(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                Save Zone Configuration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
