import { cn } from '@/lib/utils';

export type StatusType =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'verified';

const statusStyles: Record<StatusType, string> = {
  confirmed: 'bg-blue-50 text-blue-600',
  pending: 'bg-amber-50 text-amber-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
  verified: 'bg-emerald-50 text-emerald-600',
};

const statusLabel: Record<StatusType, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  verified: 'Verified Agent',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}


export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
