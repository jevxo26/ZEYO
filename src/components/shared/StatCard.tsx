import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
  className?: string;
}


export function StatCard({ label, value, valueClassName, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-start gap-1 rounded-xl border border-gray-100 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm',
        className
      )}
    >
      <span className={cn('text-base font-semibold text-gray-900', valueClassName)}>
        {value}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

interface StatGroupProps {
  stats: StatCardProps[];
  className?: string;
}


export function StatGroup({ stats, className }: StatGroupProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
