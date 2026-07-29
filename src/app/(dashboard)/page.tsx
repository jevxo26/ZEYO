import ScheduleWidget from "@/components/ui/ScheduleWidget";
import { TrendingUp, Users, CalendarCheck, ShieldAlert } from "lucide-react";

export default function DashboardOverview() {
  const cards = [
    { title: "Total Platform Volume", val: "$542,800", pct: "+18%", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { title: "Active Vendors", val: "1,240", pct: "+4%", icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "Live Bookings", val: "389", pct: null, icon: CalendarCheck, color: "text-amber-600 bg-amber-50" },
    { title: "Disputed Claims", val: "4", pct: null, icon: ShieldAlert, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Matrix Overview</h1>
        <p className="text-xs text-gray-500 mt-0.5">Real-time status monitor of Evento backend channels.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl ${c.color}`}><c.icon size={16} /></div>
              {c.pct && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black">{c.pct}</span>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{c.title}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5 tracking-tight">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Core Processing Logs</h3>
          <div className="h-48 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
            Charts and analytic telemetry stream maps down here.
          </div>
        </div>
        <ScheduleWidget />
      </div>
    </div>
  );
}