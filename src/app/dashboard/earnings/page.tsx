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
  FileText
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

export default function EarningsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const response = await apiClient.get("/bookings/my");
        if (response.data && response.data.success !== false) {
          const rawData = response.data.data;
          const list = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
          setBookings(list);
        }
      } catch (error) {
        console.error("Failed to fetch financial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  const totalRevenue = bookings.reduce((acc, b) => acc + Number(b.grandTotal || b.budget || 0), 0);
  const pendingRevenue = bookings
    .filter((b) => (b.bookingStatus || b.status || "pending").toLowerCase() === "pending")
    .reduce((acc, b) => acc + Number(b.grandTotal || b.budget || 0), 0);
  const commission = totalRevenue * 0.1; // 10% platform commission estimate

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Track your earnings, payouts, and transaction history in real-time.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0">
          <Download className="w-4 h-4" /> Withdraw Funds
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Gross pipeline value</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Pending Payouts</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${pendingRevenue.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Estimated Fees</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${commission.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Platform commissions (10%)</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <span className="text-xs font-semibold text-slate-500">{bookings.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Booking Number</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">Loading transactions...</td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {b.bookingNumber || `#BKG-${b.id}`}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{b.eventName || b.notes || "Untitled Event"}</td>
                    <td className="p-4 text-slate-500">{new Date(b.eventDate || b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-900">${Number(b.grandTotal || b.budget || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        (b.bookingStatus || b.status) === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        (b.bookingStatus || b.status) === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.bookingStatus || b.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/dashboard/bookings/${b.id}`} className="text-slate-400 hover:text-slate-900 inline-block p-1">
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">No transaction records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
