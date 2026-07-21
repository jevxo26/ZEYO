interface ProgressBarProps {
  name: string;
  percentage: number;
  valueLabel: string;
  colorClass: string;
}

export default function ProgressBar({
  name,
  percentage,
  valueLabel,
  colorClass,
}: ProgressBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold text-gray-800">
        <span>{name}</span>
        <span>
          {percentage}%{" "}
          <span className="text-gray-400 font-normal">({valueLabel})</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
