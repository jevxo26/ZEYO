import { ArrowUpRight, MoveRight } from "lucide-react";

interface CardKPIProps {
  title: string;
  value: string;
  change: string;
  variant?: "success" | "warning" | "neutral" | "danger";
}

export default function CardKPI({
  title,
  value,
  change,
  variant = "success",
}: CardKPIProps) {
  const schemas = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-gray-100 text-gray-700",
    danger: "bg-orange-50 text-orange-700",
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <span
          className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-0.5 ${schemas[variant]}`}
        >
          {change === "0%" ? "" : <ArrowUpRight size={10} />} {change}
        </span>
      </div>
      <p className="text-2xl font-black text-gray-950 tracking-tight">
        {value}
      </p>
    </div>
  );
}
