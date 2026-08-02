"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ZoneAndEventSelector from "@/components/calculator/ZoneAndEventSelector";
import ServiceSelector from "@/components/calculator/ServiceSelector";
import ServiceConfigurator from "@/components/calculator/ServiceConfigurator";
import LiveBudgetSidebar from "@/components/calculator/LiveBudgetSidebar";
import BookingSummaryModal from "@/components/calculator/BookingSummaryModal";
import {
  EVENT_TYPES,
  CALCULATOR_SERVICES,
  calculateServicePrice,
} from "@/lib/calculatorData";
import { useDynamicZones } from "@/hooks/useDynamicZones";
import { useDynamicServices } from "@/hooks/useDynamicServices";
import { ConfiguredServiceState } from "@/types/calculator";
import {
  MapPin,
  Sparkles,
  CheckSquare,
  Sliders,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function SmartCalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Step state: 1 -> Zone & Event, 2 -> Select Services, 3 -> Configure Services
  const hasInitialParams = Boolean(searchParams.get("zone") && searchParams.get("event"));
  const [step, setStep] = useState<number>(hasInitialParams ? 2 : 1);

  // 1. Zone & Event State
  const initialZone = searchParams.get("zone") || "dhaka";
  const initialEvent = searchParams.get("event") || "wedding";
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZone);
  const [selectedEventTypeId, setSelectedEventTypeId] =
    useState<string>(initialEvent);
  const [eventDate, setEventDate] = useState<string>("");
  const [globalGuestCount, setGlobalGuestCount] = useState<number>(300);

  // 2. Selected Services State
  const [selectedServiceKeys, setSelectedServiceKeys] = useState<string[]>([
    "photography",
    "videography",
    "catering",
    "decoration",
  ]);

  // 3. Configurations State
  const [configurations, setConfigurations] = useState<
    Record<string, ConfiguredServiceState>
  >({});

  // 4. Summary Modal State
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  const dynamicZones = useDynamicZones();
  
  const activeZone =
    dynamicZones.find((z) => z.id === selectedZoneId) ||
    dynamicZones[0];
  const activeEvent =
    EVENT_TYPES.find((e) => e.id === selectedEventTypeId) ||
    EVENT_TYPES[0];

  const dynamicServices = useDynamicServices();

  // Initialize configurations whenever selectedServiceKeys or guestCount changes
  useEffect(() => {
    setConfigurations((prev) => {
      const next: Record<string, ConfiguredServiceState> = {};

      selectedServiceKeys.forEach((key) => {
        const srv = dynamicServices.find((s) => s.key === key);
        if (!srv) return;

        if (prev[key]) {
          // If already configured, keep it but recompute price if guest count changed
          const existing = prev[key];
          const updatedPrice = calculateServicePrice(
            srv,
            existing.selectedTierId,
            existing.selectedCoverageId,
            existing.guestCount || globalGuestCount,
            existing.selectedAddons.map((a) => a.id),
            activeZone.priceMultiplier
          );
          next[key] = {
            ...existing,
            calculatedPrice: updatedPrice,
          };
        } else {
          // Default fresh configuration
          const defaultTier = srv.tiers[0] || { id: "", name: "", price: 0, description: "", features: [] };
          const defaultCoverage = srv.coverages[0] || { id: "", name: "", multiplier: 1 };
          const initialPrice = calculateServicePrice(
            srv,
            defaultTier.id,
            defaultCoverage.id,
            srv.isPerGuest ? globalGuestCount : 1,
            [],
            activeZone.priceMultiplier
          );

          next[key] = {
            serviceKey: srv.key,
            serviceName: srv.name,
            selectedTierId: defaultTier.id,
            tierName: defaultTier.name,
            tierPrice: defaultTier.price,
            selectedCoverageId: defaultCoverage.id,
            coverageName: defaultCoverage.name,
            coverageMultiplier: defaultCoverage.multiplier,
            guestCount: srv.isPerGuest ? globalGuestCount : 1,
            selectedAddons: [],
            calculatedPrice: initialPrice,
          };
        }
      });

      return next;
    });
  }, [selectedServiceKeys, activeZone.priceMultiplier, globalGuestCount, dynamicServices]);

  const handleToggleService = (key: string) => {
    setSelectedServiceKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllServices = () => {
    setSelectedServiceKeys(dynamicServices.map((s) => s.key));
  };

  const handleClearAllServices = () => {
    setSelectedServiceKeys([]);
  };

  const handleUpdateConfiguration = (
    serviceKey: string,
    updates: Partial<ConfiguredServiceState>
  ) => {
    setConfigurations((prev) => {
      const existing = prev[serviceKey];
      if (!existing) return prev;
      return {
        ...prev,
        [serviceKey]: {
          ...existing,
          ...updates,
        },
      };
    });
  };

  const canProceedNext = () => {
    if (step === 1) return true;
    if (step === 2) return selectedServiceKeys.length > 0;
    if (step === 3) return selectedServiceKeys.length > 0;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Hero Header */}
      <header className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-indigo-200 mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Smart Event Calculator
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Design Your Event & Calculate Budget in Real-Time
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-100/80 max-w-2xl">
                Choose your zone and required services. Customize each service
                and watch your budget calculate automatically with EVENTO&apos;s
                transparent pricing.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl self-start md:self-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Managed by EVENTO • No Vendor Hassle</span>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl transition-all ${
                step === 1
                  ? "bg-white text-indigo-950 font-bold shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-indigo-100/80"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  step === 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                1
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs uppercase tracking-wider opacity-75">
                  Step 1
                </span>
                <span className="block text-sm truncate">Zone & Event</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl transition-all ${
                step === 2
                  ? "bg-white text-indigo-950 font-bold shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-indigo-100/80"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  step === 2
                    ? "bg-indigo-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                2
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs uppercase tracking-wider opacity-75">
                  Step 2
                </span>
                <span className="block text-sm truncate">Select Services</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl transition-all ${
                step === 3
                  ? "bg-white text-indigo-950 font-bold shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-indigo-100/80"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  step === 3
                    ? "bg-indigo-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                3
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs uppercase tracking-wider opacity-75">
                  Step 3
                </span>
                <span className="block text-sm truncate">Configure & Budget</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {bookingSuccessId ? (
          /* Success Screen */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Booking Submitted Successfully!
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Thank you for choosing EVENTO. Your reference ID is{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {bookingSuccessId}
              </strong>
              . Our platform coordinators are reviewing your custom event plan and will get in touch shortly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/bookings"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity"
              >
                View My Bookings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setBookingSuccessId(null);
                  setStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Plan Another Event
              </button>
            </div>
          </div>
        ) : (
          /* Wizard Layout */
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Steps */}
            <div className="flex-1 min-w-0 w-full space-y-8">
              {step === 1 && (
                <ZoneAndEventSelector
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                  selectedEventTypeId={selectedEventTypeId}
                  onSelectEventType={setSelectedEventTypeId}
                  eventDate={eventDate}
                  onChangeDate={setEventDate}
                  guestCount={globalGuestCount}
                  onChangeGuestCount={setGlobalGuestCount}
                />
              )}

              {step === 2 && (
                <ServiceSelector
                  selectedKeys={selectedServiceKeys}
                  activeZoneId={selectedZoneId}
                  onToggleService={handleToggleService}
                  onSelectAll={handleSelectAllServices}
                  onClearAll={handleClearAllServices}
                />
              )}

              {step === 3 && (
                <ServiceConfigurator
                  selectedKeys={selectedServiceKeys}
                  configurations={configurations}
                  onUpdateConfiguration={handleUpdateConfiguration}
                  zoneMultiplier={activeZone.priceMultiplier}
                  globalGuestCount={globalGuestCount}
                />
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    disabled={!canProceedNext()}
                    onClick={() => setStep(step + 1)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                      canProceedNext()
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Continue to {step === 1 ? "Select Services" : "Configure"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={selectedServiceKeys.length === 0}
                    onClick={() => setIsSummaryOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    Review Booking Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Sticky Budget Sidebar */}
            <LiveBudgetSidebar
              zoneName={activeZone.name}
              zoneMultiplier={activeZone.priceMultiplier}
              eventTypeName={activeEvent.name}
              configurations={configurations}
              onProceed={() => {
                if (step < 3) {
                  setStep(step + 1);
                } else {
                  setIsSummaryOpen(true);
                }
              }}
              canProceed={canProceedNext()}
              proceedLabel={
                step === 1
                  ? "Select Services"
                  : step === 2
                  ? "Configure Services"
                  : "Review & Submit"
              }
            />
          </div>
        )}
      </main>

      <BookingSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        zoneName={activeZone.name}
        eventTypeName={activeEvent.name}
        eventDate={eventDate}
        onDateChange={(date) => setEventDate(date)}
        globalGuestCount={globalGuestCount}
        configurations={configurations}
        onSuccess={(id) => {
          setIsSummaryOpen(false);
          setBookingSuccessId(id || "EVENTO-SUCCESS");
        }}
      />

      <Footer />
    </div>
  );
}

export default function SmartCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SmartCalculatorContent />
    </Suspense>
  );
}
