"use client";

import { useEffect, useState } from "react";
import { X, Calendar, DollarSign, MapPin, Briefcase, Star, CheckCircle } from "lucide-react";

type ModalType = "new-event" | "new-vendor" | "new-booking" | null;

export default function Modals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Form states
  // Event
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventBudget, setEventBudget] = useState("");
  const [eventStatus, setEventStatus] = useState("Active");

  // Vendor
  const [vendorName, setVendorName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Catering");
  const [vendorZone, setVendorZone] = useState("Central Hub");
  const [vendorRating, setVendorRating] = useState("4.8");
  const [vendorJobs, setVendorJobs] = useState("0");
  const [vendorVerified, setVendorVerified] = useState(true);

  // Booking
  const [bookingEvent, setBookingEvent] = useState("");
  const [bookingClient, setBookingClient] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingZone, setBookingZone] = useState("");
  const [bookingBudget, setBookingBudget] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Pending");

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
    // Reset forms
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventBudget("");
    setEventStatus("Active");

    setVendorName("");
    setVendorCategory("Catering");
    setVendorZone("Central Hub");
    setVendorRating("4.8");
    setVendorJobs("0");
    setVendorVerified(true);

    setBookingEvent("");
    setBookingClient("");
    setBookingDate("");
    setBookingZone("");
    setBookingBudget("");
    setBookingStatus("Pending");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventLocation || !eventBudget) return;

    // Load existing
    const defaultEvents = [
      {
        id: "#EVT-9112",
        name: "Annual Corporate Gala 2024",
        date: "Oct 15, 2024",
        location: "Dhaka Zone A",
        budget: "৳ 4,500,000",
        status: "Active",
        steps: [
          { label: "Submitted", done: true },
          { label: "Admin Review", done: true },
          { label: "Vendor Match", done: true },
          { label: "Execution", done: false },
        ],
      },
      {
        id: "#EVT-7203",
        name: "Tech Summit Retreat",
        date: "Mar 10, 2024",
        location: "Sylhet Resort",
        budget: "৳ 2,100,000",
        status: "Completed",
        steps: [
          { label: "Submitted", done: true },
          { label: "Admin Review", done: true },
          { label: "Vendor Match", done: true },
          { label: "Executed", done: true },
        ],
      },
    ];

    const currentEvents = JSON.parse(localStorage.getItem("dashboard_events") || JSON.stringify(defaultEvents));
    const randomId = `#EVT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent = {
      id: randomId,
      name: eventName,
      date: new Date(eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      location: eventLocation,
      budget: `৳ ${Number(eventBudget).toLocaleString()}`,
      status: eventStatus,
      steps: [
        { label: "Submitted", done: true },
        { label: "Admin Review", done: eventStatus !== "Draft" },
        { label: "Vendor Match", done: eventStatus === "Completed" },
        { label: eventStatus === "Completed" ? "Executed" : "Execution", done: eventStatus === "Completed" },
      ],
    };

    localStorage.setItem("dashboard_events", JSON.stringify([newEvent, ...currentEvents]));
    window.dispatchEvent(new Event("dashboard-data-update"));
    closeModal();
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName) return;

    const defaultVendors = [
      { name: "Epicurean Delights", id: "V-4029", category: "Catering", zone: "Central Hub", rating: "4.9", jobs: 3, verified: true },
      { name: "Lumina AV Systems", id: "V-1102", category: "Audio/Visual", zone: "North District", rating: "4.7", jobs: 1, verified: true },
      { name: "Grandeur Events Decor", id: "V-8831", category: "Decor & Design", zone: "South District", rating: "4.5", jobs: 0, verified: false },
    ];

    const currentVendors = JSON.parse(localStorage.getItem("dashboard_vendors") || JSON.stringify(defaultVendors));
    const randomId = `V-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVendor = {
      name: vendorName,
      id: randomId,
      category: vendorCategory,
      zone: vendorZone,
      rating: vendorRating,
      jobs: parseInt(vendorJobs) || 0,
      verified: vendorVerified,
    };

    localStorage.setItem("dashboard_vendors", JSON.stringify([newVendor, ...currentVendors]));
    window.dispatchEvent(new Event("dashboard-data-update"));
    closeModal();
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEvent || !bookingClient || !bookingDate || !bookingZone || !bookingBudget) return;

    const defaultBookings = [
      {
        id: "#EVT-8924",
        event: "Corporate Gala",
        date: "Oct 15, 2024",
        client: "Acme Corp Ltd.",
        zone: "Dhaka - Gulshan (Zone A)",
        budget: "৳ 1,250,000",
        pending: 2,
        status: "Pending",
      },
      {
        id: "#EVT-4912",
        event: "Anniversary Dinner",
        date: "Nov 02, 2024",
        client: "Dr. Fahim Rahman",
        zone: "Dhaka - Dhanmondi (Zone B)",
        budget: "৳ 350,000",
        pending: 1,
        status: "Confirmed",
      },
    ];

    const currentBookings = JSON.parse(localStorage.getItem("dashboard_bookings") || JSON.stringify(defaultBookings));
    const randomId = `#EVT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: randomId,
      event: bookingEvent,
      date: new Date(bookingDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      client: bookingClient,
      zone: bookingZone,
      budget: `৳ ${Number(bookingBudget).toLocaleString()}`,
      pending: bookingStatus === "Pending" ? 1 : 0,
      status: bookingStatus,
    };

    localStorage.setItem("dashboard_bookings", JSON.stringify([newBooking, ...currentBookings]));
    window.dispatchEvent(new Event("dashboard-data-update"));
    closeModal();
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
      <div
        className="w-full max-w-lg rounded-3xl p-6 relative overflow-hidden transition-all duration-300 transform scale-100"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 243, 255, 0.95))",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          boxShadow: "0 20px 50px rgba(124, 58, 237, 0.15)",
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-purple-100 text-purple-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* --- Modal 1: New Event --- */}
        {activeModal === "new-event" && (
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="text-purple-600" size={20} /> Create New Event
              </h2>
              <p className="text-xs text-gray-500 mt-1">Initiate a new event roadmap and configure baseline details.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. annual Gala Retreat"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Budget (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={eventBudget}
                    onChange={(e) => setEventBudget(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gulshan, Dhaka"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer mt-4"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
              }}
            >
              Launch Event
            </button>
          </form>
        )}

        {/* --- Modal 2: Onboard Vendor --- */}
        {activeModal === "new-vendor" && (
          <form onSubmit={handleCreateVendor} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Briefcase className="text-purple-600" size={20} /> Onboard New Vendor
              </h2>
              <p className="text-xs text-gray-500 mt-1">Register a new service provider to the ecosystem.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina AV Systems"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={vendorCategory}
                    onChange={(e) => setVendorCategory(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  >
                    <option value="Catering">Catering</option>
                    <option value="Audio/Visual">Audio/Visual</option>
                    <option value="Decor & Design">Decor & Design</option>
                    <option value="Floristry">Floristry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Zone</label>
                  <select
                    value={vendorZone}
                    onChange={(e) => setVendorZone(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  >
                    <option value="Central Hub">Central Hub</option>
                    <option value="North District">North District</option>
                    <option value="South District">South District</option>
                    <option value="West End">West End</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={vendorRating}
                    onChange={(e) => setVendorRating(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Active Jobs</label>
                  <input
                    type="number"
                    required
                    value={vendorJobs}
                    onChange={(e) => setVendorJobs(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vendorVerified"
                  checked={vendorVerified}
                  onChange={(e) => setVendorVerified(e.target.checked)}
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-200 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="vendorVerified" className="text-xs font-bold text-gray-700 cursor-pointer">Verify Vendor Status</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer mt-4"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
              }}
            >
              Onboard Vendor
            </button>
          </form>
        )}

        {/* --- Modal 3: New Booking --- */}
        {activeModal === "new-booking" && (
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <DollarSign className="text-purple-600" size={20} /> New Booking Assignment
              </h2>
              <p className="text-xs text-gray-500 mt-1">Initiate a new booking with budget and zone multipliers.</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Event Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding"
                    value={bookingEvent}
                    onChange={(e) => setBookingEvent(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karim Corp"
                    value={bookingClient}
                    onChange={(e) => setBookingClient(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Budget (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1250000"
                    value={bookingBudget}
                    onChange={(e) => setBookingBudget(e.target.value)}
                    className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Zone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka - Gulshan (Zone A)"
                  value={bookingZone}
                  onChange={(e) => setBookingZone(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="w-full bg-white/70 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer mt-4"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
              }}
            >
              Submit Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
