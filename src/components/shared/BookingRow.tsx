import { formatCurrency } from '@/lib/utils';
import { StatusBadge, type StatusType } from './StatusBadge';

export interface Booking {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  amount: number;
  status: StatusType;
}

interface BookingRowProps {
  booking: Booking;
  onClick?: (booking: Booking) => void;
}


export function BookingRow({ booking, onClick }: BookingRowProps) {
  return (
    <button
      onClick={() => onClick?.(booking)}
      className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left last:border-0 transition-colors hover:bg-gray-50/80"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{booking.customerName}</p>
        <p className="truncate text-xs text-gray-500">
          {booking.eventType} · {booking.date}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(booking.amount)}
        </span>
        <StatusBadge status={booking.status} />
      </div>
    </button>
  );
}
