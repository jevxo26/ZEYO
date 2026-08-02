"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Calendar,
  Percent,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Briefcase,
  X,
  CreditCard,
  Building,
  Check,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { toast } from "sonner";

const DEFAULT_VENDOR_PAYOUTS = [
  {
    id: "PAY-2026-101",
    bookingNumber: "#BKG-2026-001",
    eventName: "Royal Wedding Ceremony (Photography Coverage)",
    serviceCategory: "Photography",
    eventDate: "2026-11-15",
    payoutAmount: 35000,
    status: "paid_out",
    clearedAt: "2026-11-16",
  },
  {
    id: "PAY-2026-102",
    bookingNumber: "#BKG-2026-002",
    eventName: "Gaye Holud Night (Stage & Decor)",
    serviceCategory: "Decoration",
    eventDate: "2026-11-13",
    payoutAmount: 65000,
    status: "escrow_pending",
    clearedAt: "2026-11-14",
  },
  {
    id: "PAY-2026-103",
    bookingNumber: "#BKG-2026-003",
    eventName: "Corporate Annual Summit (AV Tech)",
    serviceCategory: "Sound System",
    eventDate: "2026-12-01",
    payoutAmount: 38000,
    status: "escrow_pending",
    clearedAt: "2026-12-02",
  },
];

export default function EarningsPage() {
  const [payoutsList, setPayoutsList] = useState<any[]>(DEFAULT_VENDOR_PAYOUTS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Payout withdrawal modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState("bKash");
  const [accountNumber, setAccountNumber] = useState("01712345678");
  const [bankName, setBankName] = useState("BRAC Bank");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const fetchFinancials = async () => {
    let localCustomBookings: any[] = [];
    let localCustomTasks: any[] = [];

    if (typeof window !== "undefined") {
      try {
        const storedTasks = localStorage.getItem("customVendorTasks");
        if (storedTasks) {
          const list = JSON.parse(storedTasks);
          localCustomTasks = list.map((t: any, idx: number) => ({
            id: t.id || `PAY-TSK-${idx}`,
            bookingNumber: t.bookingRef || `#BKG-${idx}`,
            eventName: `${t.title || "Assigned Service Execution"} (${t.category})`,
            serviceCategory: t.category || "Fulfillment",
            eventDate: t.date || "Upcoming",
            payoutAmount: Number((t.payout || "").replace(/[^0-9]/g, "") || 35000),
            status: t.status === "Completed" || t.status === "Paid Out" || t.status === "paid_out" ? "paid_out" : "escrow_pending",
            clearedAt: t.status === "Completed" ? "Cleared" : "Pending QA",
          }));
        }
      } catch (e) {}

      try {
        const storedBookings = localStorage.getItem("customBookings") || localStorage.getItem("custom_bookings");
        if (storedBookings) {
          const list = JSON.parse(storedBookings);
          localCustomBookings = list.map((b: any, idx: number) => ({
            id: b.id || `PAY-CUSTOM-${idx}`,
            bookingNumber: b.bookingNumber || `#${b.id}`,
            eventName: `${b.eventName || b.notes || "Custom Event"} (${b.assignedService || b.eventType || "Service"})`,
            serviceCategory: b.assignedService || b.eventType || "Event Fulfillment",
            eventDate: b.eventDate ? new Date(b.eventDate).toISOString().split("T")[0] : "Upcoming",
            payoutAmount: Number(b.grandTotal || b.budget || 35000),
            status: b.bookingStatus === "completed" || b.status === "COMPLETED" ? "paid_out" : "escrow_pending",
            clearedAt: "Pending QA",
          }));
        }
      } catch (e) {}
    }

    const mergedLocal = [...localCustomTasks, ...localCustomBookings];

    try {
      const response = await apiClient.get("/vendors/earnings");
      if (response.data && response.data.success !== false) {
        const rawData = response.data.data;
        const apiList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
        const combined = [...mergedLocal, ...apiList];
        const unique = combined.filter(
          (item, idx, self) => idx === self.findIndex((t) => String(t.bookingNumber) === String(item.bookingNumber) || String(t.id) === String(item.id))
        );
        setPayoutsList(unique.length > 0 ? unique : DEFAULT_VENDOR_PAYOUTS);
      } else {
        const combined = [...mergedLocal, ...DEFAULT_VENDOR_PAYOUTS];
        const unique = combined.filter(
          (item, idx, self) => idx === self.findIndex((t) => String(t.bookingNumber) === String(item.bookingNumber) || String(t.id) === String(item.id))
        );
        setPayoutsList(unique);
      }
    } catch (error) {
      console.warn("Using local financial data");
      const combined = [...mergedLocal, ...DEFAULT_VENDOR_PAYOUTS];
      const unique = combined.filter(
        (item, idx, self) => idx === self.findIndex((t) => String(t.bookingNumber) === String(item.bookingNumber) || String(t.id) === String(item.id))
      );
      setPayoutsList(unique);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchFinancials();

    const handleUpdate = () => fetchFinancials();
    const interval = setInterval(fetchFinancials, 15000);

    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => {
      window.removeEventListener("dashboard-data-update", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const parseAmount = (val: any): number => {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalEarnings = payoutsList.reduce(
    (acc, b) => acc + parseAmount(b.payoutAmount || b.grandTotal),
    0
  );
  const clearedPayouts = payoutsList
    .filter((b) => b.status === "paid_out" || b.status === "confirmed")
    .reduce((acc, b) => acc + parseAmount(b.payoutAmount || b.grandTotal), 0);
  const pendingEscrow = payoutsList
    .filter(
      (b) =>
        b.status === "escrow_pending" ||
        (b.status || "").toLowerCase() === "pending"
    )
    .reduce((acc, b) => acc + parseAmount(b.payoutAmount || b.grandTotal), 0);

  const handleConfirmWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayout(true);

    setTimeout(() => {
      setIsSubmittingPayout(false);
      setShowPayoutModal(false);

      // Update pending items to paid out for demo confirmation
      const updatedList = payoutsList.map((p) => ({
        ...p,
        status: "paid_out",
      }));
      setPayoutsList(updatedList);

      toast.success(
        `✓ Payout request of ৳${totalEarnings.toLocaleString()} sent to ${payoutMethod} (${accountNumber})! EVENTO Finance Desk processing within 2 hours.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Vendor Notice Banner */}
      <div className="bg-black rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-neutral-800">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 shrink-0 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/20">
              Vendor Escrow Ledger
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Partner Earnings &amp; Protected Escrow
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
              {lastRefreshed && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Disbursed directly by EVENTO Operations via secure escrow after QA clearance. Customer transaction details remain protected.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-4 py-2.5 bg-amber-500 text-black hover:bg-amber-400 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-black" /> Request Escrow Payout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-amber-400 font-bold">
              ৳
            </div>
            <h3 className="font-semibold text-neutral-700">
              Total Assigned Earnings
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900">
            ৳{totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Total contracted BDT value
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-700">Cleared Payouts</h3>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700">
            ৳{clearedPayouts.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Transferred to partner bank / mobile wallet
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-700">
              Pending Escrow Release
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-amber-700">
            ৳{pendingEscrow.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Awaiting EVENTO Operations QA sign-off
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Assigned Job Payout Ledger
            </h2>
            <p className="text-xs text-neutral-500">
              Itemized EVENTO disbursement schedule
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-500">
            {payoutsList.length} Dispatched Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Assigned Service Job</th>
                <th className="p-4">Category</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Partner Payout (BDT)</th>
                <th className="p-4 pr-6 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : payoutsList.length > 0 ? (
                payoutsList.map((b, idx) => (
                  <tr key={b.id ? `${b.id}-${idx}` : idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-neutral-900">
                      {b.bookingNumber || `#BKG-${b.id}`}
                    </td>
                    <td className="p-4 font-bold text-neutral-900">
                      {b.eventName || "Untitled Event"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-neutral-100 text-neutral-700">
                        <Briefcase className="w-3.5 h-3.5 text-neutral-400" />{" "}
                        {b.serviceCategory || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-xs">
                      {new Date(
                        b.eventDate || b.createdAt || "2026-11-15"
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-extrabold text-neutral-900">
                      ৳
                      {Number(
                        b.payoutAmount || b.grandTotal || 0
                      ).toLocaleString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "paid_out" || b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status === "paid_out"
                          ? "Paid Out ✓"
                          : "Pending Escrow"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-500">
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-neutral-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Request Escrow Payout
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  EVENTO Partner Disbursements
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmWithdrawal} className="p-6 space-y-4">
              <div className="p-4 bg-black rounded-xl border border-neutral-800 space-y-1 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
                  Available Payout Balance
                </span>
                <p className="text-2xl font-black text-amber-400">
                  ৳{totalEarnings.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">
                  Disbursement Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="bKash">bKash Merchant / Personal</option>
                  <option value="Nagad">Nagad Wallet</option>
                  <option value="Rocket">Rocket Wallet</option>
                  <option value="Bank Wire">Bank Wire Transfer (BRAC / City / DBBL)</option>
                </select>
              </div>

              {payoutMethod === "Bank Wire" ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. BRAC Bank Limited"
                      className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Account Number / IBAN
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="150120xxxxxxxxx"
                      className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">
                    Mobile Number ({payoutMethod})
                  </label>
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01712345678"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayout}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-amber-400 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isSubmittingPayout ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}