interface ActivityProps {
  emoji: string;
  title: string;
  subtitle: string;
  amount: string;
  time: string;
}

export default function RecentActivityItem({
  emoji,
  title,
  subtitle,
  amount,
  time,
}: ActivityProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl flex items-center justify-center font-bold text-sm">
          {emoji}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 leading-tight">
            {title}
          </p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            {subtitle}
          </p>
          <p className="text-xs font-extrabold text-[#064E3B] mt-0.5">
            {amount}
          </p>
        </div>
      </div>
      <span className="text-[9px] text-gray-400 font-bold">{time}</span>
    </div>
  );
}
