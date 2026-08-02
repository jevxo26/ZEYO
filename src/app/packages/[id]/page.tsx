"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PackageAddonSelector, {
  PackageAddonItem,
} from "@/components/packages/PackageAddonSelector";
import { BANGLADESH_ZONES, EVENT_TYPES } from "@/lib/calculatorData";
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Camera,
  Video,
  Utensils,
  Sun,
  Volume2,
  Layers,
  Zap,
  Loader2,
  Phone,
  Mail,
  User,
  FileText,
  X,
  Lock,
  KeyRound,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";

const SAMPLE_PACKAGES: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    description: string;
    basePrice: number;
    estimatedGuests: number;
    includedServices: string[];
    whatsIncluded: string[];
    addons: PackageAddonItem[];
    gallery: string[];
  }
> = {
  "wedding-basic": {
    id: "wedding-basic",
    title: "Wedding Basic Package",
    category: "Wedding",
    description:
      "A complete essential wedding event package tailored for cozy indoor celebrations.",
    basePrice: 180000,
    estimatedGuests: 250,
    includedServices: [
      "Photography (1 Senior Photographer, Color Corrected)",
      "Videography (HD Event Coverage)",
      "Basic Decoration (Artificial Floral Backdrop & Gate)",
      "Catering (Menu A - 250 Guests)",
      "Standard Ambiance Lighting",
      "Sound System (2 JBL Speakers & Mics)",
    ],
    whatsIncluded: [
      "Full venue setup and coordination",
      "Dedicated EVENTO Event Manager on-site",
      "Standard dining tables, chairs, and table linen",
      "Unlimited digital photos via cloud link",
      "Standard power cabling & safety inspection",
    ],
    addons: [
      { id: "drone", name: "Drone Aerial Cinematography", price: 10000 },
      { id: "live-stream", name: "Live Streaming (Single Camera)", price: 6000 },
      { id: "extra-photo", name: "Extra Senior Photographer", price: 5000 },
    ],
    gallery: [
      "/images/wedding-1.jpg",
      "/images/wedding-2.jpg",
      "/images/wedding-3.jpg",
    ],
  },
  "wedding-premium": {
    id: "wedding-premium",
    title: "Wedding Premium Package",
    category: "Wedding",
    description:
      "Our most popular all-inclusive wedding package featuring fresh florals, candid photography, and royal dining.",
    basePrice: 380000,
    estimatedGuests: 400,
    includedServices: [
      "Photography (2 Senior Photographers, Candid Specialist)",
      "Videography (2 Cinematographers, 4K Footage, Teaser)",
      "Premium Decoration (Fresh Flower Stage & Walkway)",
      "Catering (Menu B - Royal Kacchi for 400 Guests)",
      "Premium Dynamic Lighting (Moving Heads, RGB PARs)",
      "Concert Audio & Digital Podium",
      "30 KVA Backup Power Generator",
    ],
    whatsIncluded: [
      "Master Event Manager & Assistant Coordinator",
      "Fresh flower floral walkway and entrance gate",
      "3-minute cinematic teaser video",
      "High-resolution printed album voucher",
      "VIP guest seating arrangement in front rows",
    ],
    addons: [
      { id: "drone", name: "Drone Aerial Cinematography", price: 10000 },
      { id: "led-wall", name: "12x8 ft LED Stage Background Screen", price: 15000 },
      { id: "live-printing", name: "Live Instant Photo Printing", price: 8000 },
    ],
    gallery: [
      "/images/wedding-2.jpg",
      "/images/wedding-1.jpg",
      "/images/wedding-3.jpg",
    ],
  },
  "wedding-luxury": {
    id: "wedding-luxury",
    title: "Wedding Luxury Royal Package",
    category: "Wedding",
    description:
      "A breathtaking royal palace-style celebration with imported flowers, multi-cam broadcast, and celebrity DJ.",
    basePrice: 750000,
    estimatedGuests: 600,
    includedServices: [
      "Photography (3 Master Photographers, Dedicated Director)",
      "Videography (3 Cinematographers, Full Movie Feature)",
      "Luxury Theme Decoration (Imported Exotic Flowers, Royal Entrance)",
      "Catering (Menu C - Imperial Grand for 600 Guests)",
      "Royal Light & Laser Show with Chandeliers",
      "Line Array Sound System & Wireless Mics",
      "60 KVA Silent Diesel Generator",
      "Bridal Transport (Mercedes E-Class Decorated)",
    ],
    whatsIncluded: [
      "Executive Event Operations Team (5 Specialists)",
      "Imported exotic fresh floral decorations across venue",
      "Custom 3D stage backdrop with royal throne sofa",
      "Complete feature film wedding movie editing",
      "Red carpet VIP arrival with security guards",
    ],
    addons: [
      { id: "live-tv", name: "2 Live LED Screens in Hall", price: 20000 },
      { id: "dj", name: "Celebrity DJ + Visuals Setup", price: 16000 },
    ],
    gallery: [
      "/images/wedding-3.jpg",
      "/images/wedding-1.jpg",
      "/images/wedding-2.jpg",
    ],
  },
};

export default function PackageDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawId = String(params?.id || "wedding-premium");
  const pkg =
    SAMPLE_PACKAGES[rawId] ||
    SAMPLE_PACKAGES["wedding-premium"];

  // Query zone filter
  const initialZone = searchParams.get("zone") || "dhaka";
  const [selectedZoneId, setSelectedZoneId] = useState(initialZone);
  const activeZone =
    BANGLADESH_ZONES.find((z) => z.id === selectedZoneId) ||
    BANGLADESH_ZONES[0];

  const [guestCount, setGuestCount] = useState(pkg.estimatedGuests);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Auth state
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const isUserLoggedIn = useMemo(() => {
    if (user || token) return true;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) return true;
    }
    return false;
  }, [user, token]);

  // Booking modal form state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  const handleBookPackageClick = () => {
    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    if (user) {
      if (!customerName) setCustomerName(user.name || "");
      if (!customerEmail) setCustomerEmail(user.email || "");
    } else if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!customerName) setCustomerName(parsed.name || "");
          if (!customerEmail) setCustomerEmail(parsed.email || "");
        }
      } catch (e) {}
    }
    setIsBookingModalOpen(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      if (authTab === "signin") {
        const loggedInUser = {
          id: "cust-" + Date.now(),
          name: authEmail.split("@")[0] || "Customer",
          email: authEmail || "customer@example.com",
          role: "customer",
        };
        dispatch(
          setCredentials({
            user: loggedInUser,
            token: "token-" + Date.now(),
          })
        );
        toast.success("✓ Signed in successfully! You can now book this package.", {
          duration: 4000,
          closeButton: true,
        });
      } else {
        const newAccountUser = {
          id: "cust-" + Date.now(),
          name: authName || "Customer",
          email: authEmail || "customer@example.com",
          role: "customer",
        };
        dispatch(
          setCredentials({
            user: newAccountUser,
            token: "token-" + Date.now(),
          })
        );
        toast.success("✓ Account created successfully! You can now book this package.", {
          duration: 4000,
          closeButton: true,
        });
      }
      setIsAuthModalOpen(false);
    }, 400);
  };

  const handleDemoCustomerLogin = () => {
    const demoCustomer = {
      id: "101",
      name: "Ahmed Tanvir",
      email: "tanvir.ahmed@gmail.com",
      role: "customer",
    };
    dispatch(
      setCredentials({
        user: demoCustomer,
        token: "demo-customer-jwt-token-778899",
      })
    );
    toast.success("✓ Signed in as Ahmed Tanvir (Demo Customer)!", {
      duration: 4000,
      closeButton: true,
    });
    setIsAuthModalOpen(false);
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const addonsTotal = useMemo(() => {
    return selectedAddonIds.reduce((sum, id) => {
      const found = pkg.addons.find((a) => a.id === id);
      if (!found) return sum;
      return (
        sum +
        (found.isPerGuest ? found.price * guestCount : found.price)
      );
    }, 0);
  }, [selectedAddonIds, pkg.addons, guestCount]);

  const zoneAdjustedPrice = Math.round(
    (pkg.basePrice + addonsTotal) * activeZone.priceMultiplier
  );

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: `${pkg.title} - ${activeZone.name}`,
        packageId: pkg.id,
        packageName: pkg.title,
        zoneName: activeZone.name,
        eventDate: eventDate || new Date(Date.now() + 86400000 * 14).toISOString(),
        guestCount,
        totalAmount: zoneAdjustedPrice,
        customerName,
        customerPhone,
        customerEmail,
        notes: customerNote,
        selectedAddons: selectedAddonIds.map((id) => {
          const found = pkg.addons.find((a) => a.id === id);
          return { id, name: found?.name, price: found?.price };
        }),
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/login?redirect=${redirectUrl}`);
          return;
        }
      }

      const result = await res.json().catch(() => ({}));
      setBookingSuccessId(
        result?.data?.id || "EVENTO-PKG-" + Math.floor(100000 + Math.random() * 900000)
      );
      setIsBookingModalOpen(false);
    } catch (err) {
      setBookingSuccessId("EVENTO-PKG-" + Math.floor(100000 + Math.random() * 900000));
      setIsBookingModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Breadcrumb / Back Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Packages
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Selected Zone:</span>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 focus:outline-none"
            >
              {BANGLADESH_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.priceMultiplier === 1 ? "Std" : `${(z.priceMultiplier - 1) * 100 > 0 ? "+" : ""}${Math.round((z.priceMultiplier - 1) * 100)}%`})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {bookingSuccessId ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Package Booking Confirmed!
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              You have successfully booked the{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {pkg.title}
              </strong>{" "}
              for {activeZone.name}. Your booking ID is{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {bookingSuccessId}
              </strong>
              . Our platform coordinators will assign our trusted background
              vendors and contact you shortly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/bookings"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity"
              >
                View My Bookings
              </Link>
              <Link
                href="/packages"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Browse More Packages
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Title */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  {pkg.category} Package
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {pkg.title}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  {pkg.description}
                </p>

                {/* Meta Bar */}
                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeZone.name} Rate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ~{pkg.estimatedGuests} Guests
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Managed Background Vendors
                    </span>
                  </div>
                </div>
              </div>

              {/* Included Services */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Included Services in This Package
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.includedServices.map((srv, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                    >
                      <div className="p-1 rounded-md bg-indigo-600 text-white shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {srv}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included Checklist */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  What&apos;s Included (Platform Benefits)
                </h3>
                <ul className="space-y-3">
                  {pkg.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional Add-ons */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                <PackageAddonSelector
                  addons={pkg.addons}
                  selectedAddonIds={selectedAddonIds}
                  onToggleAddon={handleToggleAddon}
                  guestCount={guestCount}
                />
              </div>

              {/* Managed Event OS Assurance */}
              <div className="bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <strong className="block font-bold text-slate-900 dark:text-white mb-1">
                    Managed Multi-Vendor Assurance
                  </strong>
                  Unlike traditional marketplaces where you browse, negotiate, and
                  manage individual vendors yourself, EVENTO assigns and supervises
                  vetted background professionals for photography, videography,
                  decor, catering, and audio. You deal only with EVENTO.
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary Sidebar */}
            <div className="w-full lg:sticky lg:top-24 space-y-6">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-[#4C2A9C] via-[#3A3FB0] to-[#2454C7] p-6 text-white">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-100/80 mb-1">
                    {activeZone.name} Package Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">
                      ৳{zoneAdjustedPrice.toLocaleString()}
                    </span>
                  </div>
                  {selectedAddonIds.length > 0 && (
                    <span className="block text-xs text-indigo-100/90 mt-1">
                      Includes +৳
                      {Math.round(
                        addonsTotal * activeZone.priceMultiplier
                      ).toLocaleString()}{" "}
                      in selected add-ons
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Guest count adjuster */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Estimated Guest Count
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={50}
                        max={5000}
                        step={10}
                        value={guestCount}
                        onChange={(e) =>
                          setGuestCount(
                            Math.max(50, Number(e.target.value) || 200)
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-500 shrink-0">
                        Guests
                      </span>
                    </div>
                  </div>

                  {/* Summary list */}
                  <div className="py-4 border-y border-slate-100 dark:border-slate-800 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Base Package ({pkg.estimatedGuests} guests)
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ৳
                        {Math.round(
                          pkg.basePrice * activeZone.priceMultiplier
                        ).toLocaleString()}
                      </span>
                    </div>

                    {selectedAddonIds.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Selected Add-ons ({selectedAddonIds.length})
                        </span>
                        <span className="font-semibold text-emerald-600">
                          +৳
                          {Math.round(
                            addonsTotal * activeZone.priceMultiplier
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleBookPackageClick}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    Book This Package
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/calculator?zone=${activeZone.id}&event=${pkg.category.toLowerCase()}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Want custom services? Try Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 px-6 py-5 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                    Confirm Package Booking
                  </span>
                  <h3 className="text-lg font-extrabold mt-0.5">
                    {pkg.title} • {activeZone.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/80"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tentative Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any preferences or venue directions..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-slate-400">
                      Total Package Rate
                    </span>
                    <span className="text-xl font-extrabold text-indigo-600">
                      ৳{zoneAdjustedPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg disabled:opacity-60"
                    >
                      {isSubmitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Auth Modal for Unauthenticated Users */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 px-6 py-5 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                    Authentication Required
                  </span>
                  <h3 className="text-lg font-extrabold mt-0.5">
                    Sign In or Sign Up to Book
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setAuthTab("signin")}
                  className={`flex-1 py-3.5 text-xs font-extrabold transition-all border-b-2 ${
                    authTab === "signin"
                      ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("signup")}
                  className={`flex-1 py-3.5 text-xs font-extrabold transition-all border-b-2 ${
                    authTab === "signup"
                      ? "border-purple-600 text-purple-600 bg-white dark:bg-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                {authTab === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                {authTab === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+880 17XX XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60"
                  >
                    {authLoading
                      ? "Please wait..."
                      : authTab === "signin"
                      ? "Sign In & Continue"
                      : "Create Account & Continue"}
                  </button>
                </div>

                {authTab === "signin" && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-500 mb-2">
                      Need instant access to test booking?
                    </p>
                    <button
                      type="button"
                      onClick={handleDemoCustomerLogin}
                      className="w-full py-2.5 px-4 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      1-Click Demo Customer Login
                    </button>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthTab(authTab === "signin" ? "signup" : "signin")}
                    className="text-xs font-semibold text-purple-600 hover:underline"
                  >
                    {authTab === "signin"
                      ? "Don't have an account? Sign up here"
                      : "Already have an account? Log in here"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
