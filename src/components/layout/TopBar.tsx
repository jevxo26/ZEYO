import { Bell, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface TopBarProps {
  balance: number;
  unreadCount?: number;
  onNotificationClick?: () => void;
  onSearch?: (query: string) => void;
  title?: string;
}

export function TopBar({ 
  balance, 
  unreadCount = 0, 
  onNotificationClick,
  onSearch,
  title = 'Dashboard'
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="px-4 py-3">
      {/* Mobile Layout - Logo, Balance, Notification in one row */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
            Z
          </div>
          <span className="text-sm font-semibold tracking-wide text-amber-500">ZEYO</span>
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
      </div>

      {/* Mobile - Dashboard Title & Search Bar (Next line) */}
      <div className="mt-3 flex items-center gap-3 md:hidden">
        <h1 className="text-lg font-semibold text-black whitespace-nowrap">{title}</h1>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Desktop/Tablet Layout - Dashboard & Search Bar in one row */}
      <div className="hidden md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-lg font-semibold text-black md:text-xl whitespace-nowrap">{title}</h1>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 md:py-2"
            />
          </div>
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
      </div>
    </header>
  );
}