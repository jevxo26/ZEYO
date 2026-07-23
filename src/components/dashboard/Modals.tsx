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
  const [vendorCategory, setVendorCategory] = useState("Catering");
  const [vendorZone, setVendorZone] = useState("Central Hub");

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
      const response = await apiClient.post("/customers/events", {
        eventTitle: eventName,
        eventDate: new Date(eventDate).toISOString(),
        estimatedBudget: Number(eventBudget),
        notes: eventLocation,
      });

      if (response.data?.success !== false) {
        toast.success("Draft Event created successfully!");
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        closeModal();
      } else {
        toast.error(response.data?.message || "Failed to create event.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventLocation || !eventBudget) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post("/bookings", {
        eventName,
        eventType: "Standard",
        eventDate: new Date(eventDate).toISOString(),
        location: eventLocation,
        budget: Number(eventBudget),
        notes: eventName,
        status: "PENDING",
      });

      if (response.data?.success !== false) {
        toast.success("Booking created successfully!");
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        closeModal();
      } else {
        toast.error(response.data?.message || "Failed to create booking.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName) return;

    toast.success(`Vendor "${vendorName}" onboarded successfully!`);
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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {activeModal === "new-event" && "Create New Event"}
            {activeModal === "new-booking" && "New Booking"}
            {activeModal === "new-vendor" && "Onboard Vendor"}
            {activeModal === "add-zone" && "Add Zone Configuration"}
          </h2>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: New Event */}
        {activeModal === "new-event" && (
          <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Wedding Reception"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Budget ($)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={eventBudget}
                  onChange={(e) => setEventBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Notes / Location</label>
              <input
                type="text"
                placeholder="Venue or notes"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                {isLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: New Booking */}
        {activeModal === "new-booking" && (
          <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Booking / Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Corporate Gala"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Total Budget ($)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={eventBudget}
                  onChange={(e) => setEventBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Location / Venue</label>
              <input
                type="text"
                required
                placeholder="City Center, Venue Name"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                {isLoading ? "Saving..." : "Create Booking"}
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Onboard Vendor */}
        {activeModal === "new-vendor" && (
          <form onSubmit={handleCreateVendor} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Vendor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lumina AV Systems"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                >
                  <option value="Catering">Catering</option>
                  <option value="Audio/Visual">Audio/Visual</option>
                  <option value="Decor & Design">Decor & Design</option>
                  <option value="Floristry">Floristry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Zone</label>
                <select
                  value={vendorZone}
                  onChange={(e) => setVendorZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                >
                  <option value="Central Hub">Central Hub</option>
                  <option value="North District">North District</option>
                  <option value="South District">South District</option>
                </select>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                Onboard Vendor
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Add Zone */}
        {activeModal === "add-zone" && (
          <form onSubmit={handleSaveZone} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Zone Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Chittagong Metro"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Pricing Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  placeholder="1.15"
                  value={zoneMultiplier}
                  onChange={(e) => setZoneMultiplier(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Platform Commission (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Standard VAT (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Min. Advance Payment (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={minAdvance}
                    onChange={(e) => setMinAdvance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
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
