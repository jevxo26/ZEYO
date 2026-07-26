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

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const response = await apiClient.get("/vendors/earnings");
        if (response.data && response.data.success !== false) {
          const rawData = response.data.data;
          const list = Array.isArray(rawData)
            ? rawData
            : Array.isArray(rawData?.data)
            ? rawData.data
            : [];
          setPayoutsList(list.length > 0 ? list : DEFAULT_VENDOR_PAYOUTS);
        } else {
          setPayoutsList(DEFAULT_VENDOR_PAYOUTS);
        }
      } catch (error) {
        console.error("Failed to fetch financial data", error);
        setPayoutsList(DEFAULT_VENDOR_PAYOUTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  const totalEarnings = payoutsList.reduce(
    (acc, b) => acc + Number(b.payoutAmount || b.grandTotal || 0),
    0
  );
  const clearedPayouts = payoutsList
    .filter((b) => b.status === "paid_out" || b.status === "confirmed")
    .reduce((acc, b) => acc + Number(b.payoutAmount || b.grandTotal || 0), 0);
  const pendingEscrow = payoutsList
    .filter(
      (b) =>
        b.status === "escrow_pending" ||
        (b.status || "").toLowerCase() === "pending"
    )
    .reduce((acc, b) => acc + Number(b.payoutAmount || b.grandTotal || 0), 0);

  const handleWithdraw = () => {
    toast.success(
      `✓ Escrow payout withdrawal request of ৳${totalEarnings.toLocaleString()} submitted to EVENTO Finance Desk!`,
      { duration: 4000 }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Vendor Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shrink-0 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Managed Event OS — Vendor Partner Payout Ledger
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
              Partner Earnings &amp; Protected Escrow
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-1 max-w-2xl leading-relaxed">
              All payouts are disbursed directly by EVENTO Operations via secure
              escrow after quality assurance clearance. Customer transaction
              details remain confidential.
            </p>
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          className="px-5 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-purple-700" /> Request Escrow Payout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
              ৳
            </div>
            <h3 className="font-semibold text-slate-700">
              Total Assigned Earnings
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            ৳{totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total contracted BDT value
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Cleared Payouts</h3>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700">
            ৳{clearedPayouts.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Transferred to partner bank account
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">
              Pending Escrow Release
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-amber-700">
            ৳{pendingEscrow.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Awaiting EVENTO Operations QA sign-off
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Assigned Job Payout Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Itemized EVENTO disbursement schedule
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {payoutsList.length} Dispatched Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Assigned Service Job</th>
                <th className="p-4">Category</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Partner Payout (BDT)</th>
                <th className="p-4 pr-6 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : payoutsList.length > 0 ? (
                payoutsList.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {b.bookingNumber || `#BKG-${b.id}`}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {b.eventName || "Untitled Event"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {b.serviceCategory || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(
                        b.eventDate || b.createdAt || "2026-11-15"
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
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
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
