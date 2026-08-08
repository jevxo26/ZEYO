import { Bell } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TopBarProps {
  balance: number;
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export function TopBar({ balance, unreadCount = 0, onNotificationClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      {/* Logo - Desktop/Tablet এ hidden, Mobile এ visible */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-sm font-bold text-white">
          Z
        </div>
        <span className="text-sm font-semibold tracking-wide text-black">ZEYO</span>
      </div>

      {/* Desktop/Tablet - Logo hidden, empty space */}
      <div className="hidden md:block">
        {/* ডেস্কটপে কিছু দেখাবে না */}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-amber-500">
          {formatCurrency(balance)}
        </span>

        <button
          onClick={onNotificationClick}
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-50"
        >
          <Bell className="h-4 w-4 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>
    </header>
  );
}