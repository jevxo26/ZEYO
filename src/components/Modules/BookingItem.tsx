"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, AlertTriangle } from "lucide-react";

interface BookingProps {
  id: string;
  event: string;
  date: string;
  client: string;
  zone: string;
  budget: string;
  pendingCount: number;
}

export default function BookingItem({
  id,
  event,
  date,
  client,
  zone,
  budget,
  pendingCount,
}: BookingProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-white border border-gray-200/60 rounded-3xl overflow-hidden transition-all duration-300 ${
        isOpen ? "ring-2 ring-purple-600/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-purple-200" : "shadow-[0_4px_15px_rgba(0,0,0,0.01)]"
      }`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="grid grid-cols-1 sm:grid-cols-5 gap-4 px-6 py-5 items-center text-xs font-semibold text-gray-700 hover:bg-gray-50/50 cursor-pointer select-none"
      >
        <span className="font-black text-purple-600 text-sm tracking-tight">{id}</span>
        <div>
          <p className="font-bold text-gray-900 text-sm">{event}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
            📅 {date}
          </p>
        </div>
        <div>
          <p className="font-bold text-gray-800">{client}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
            📍 {zone}
          </p>
        </div>
        <span className="font-black text-slate-900 text-sm">{budget}</span>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="bg-amber-50 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-md border border-amber-100 shadow-sm shrink-0">
            {pendingCount} Pending
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-slate-50/30 p-6 space-y-4 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Service Breakdown & Assignment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Completed */}
            <div className="bg-white border border-gray-200/60 p-5 rounded-2xl flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-gray-300 transition-all">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center text-base font-bold shadow-xs">
                  📸
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Photography & Videography
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    Budget Allocation: ৳ 150,000
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-700">
                  LensCraft Studios
                </p>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 shadow-xs flex items-center gap-1">
                  <Check size={12} /> Confirmed
                </span>
              </div>
            </div>

            {/* Pending dropdown action component */}
            <div className="bg-white border-2 border-amber-100/80 p-5 rounded-2xl space-y-5 shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-amber-200 transition-all">
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center text-base font-bold shadow-xs">
                    🍽️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      Premium Catering (500 pax)
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      Budget Allocation: ৳ 850,000
                    </p>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-100 shadow-xs flex items-center gap-1 shrink-0">
                  <AlertTriangle size={12} /> Pending
                </span>
              </div>
              
              <div className="bg-slate-50 p-2 rounded-2xl flex items-center justify-between gap-3 border border-gray-200/50">
                <select className="flex-1 bg-white border border-gray-200 text-xs p-2 rounded-xl text-gray-700 font-bold focus:outline-none focus:border-purple-400 cursor-pointer">
                  <option>Select Vendor...</option>
                  <option>Grand Delights Catering</option>
                  <option>Saffron Spice Cuisine</option>
                </select>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
