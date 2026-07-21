import { MoreHorizontal } from "lucide-react";

export default function ScheduleWidget() {
  const agenda = [
    {
      day: "WED",
      date: "11",
      time: "09:00 AM - 11:00 AM",
      task: "Venue Walkthrough",
    },
    {
      day: "FRI",
      date: "13",
      time: "02:00 PM - 03:30 PM",
      task: "Client Meeting (Virtual)",
    },
    {
      day: "SUN",
      date: "15",
      time: "08:00 AM - 08:00 PM",
      task: "Thompson Wedding (Full Day)",
    },
  ];

  return (
    <div className="bg-[#0B1320] text-white p-5 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400">Oct 9 - Oct 15</span>
        <MoreHorizontal size={14} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        {agenda.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 items-start border-l-2 border-amber-400 pl-3 py-1"
          >
            <div className="text-center min-w-[24px]">
              <p className="text-[9px] font-bold text-amber-400 uppercase">
                {item.day}
              </p>
              <p className="text-sm font-black tracking-tight">{item.date}</p>
            </div>
            <div className="bg-slate-800/60 flex-1 p-2.5 rounded-xl border border-slate-700/40">
              <p className="text-[9px] text-gray-400 font-medium">
                {item.time}
              </p>
              <p className="text-xs font-bold text-gray-200 mt-0.5">
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-center text-amber-400 text-[11px] font-bold pt-2 border-t border-slate-800 hover:text-amber-300">
        View Full Calendar
      </button>
    </div>
  );
}
