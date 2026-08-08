'use client';

import { LayoutGrid, CalendarCheck, Wallet, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavKey = 'dashboard' | 'bookings' | 'wallet' | 'profile';

interface BottomNavProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onFabClick?: () => void;
}

const navItems: { key: NavKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
  { key: 'profile', label: 'Profile', icon: User },
];


export function BottomNav({ active, onNavigate, onFabClick }: BottomNavProps) {
  const [left, right] = [navItems.slice(0, 2), navItems.slice(2)];

  const renderItem = ({ key, label, icon: Icon }: (typeof navItems)[number]) => (
    <button
      key={key}
      onClick={() => onNavigate(key)}
      className="flex flex-col items-center gap-1 px-3 py-2"
    >
      <Icon
        className={cn('h-5 w-5', active === key ? 'text-teal-900' : 'text-gray-400')}
      />
      <span
        className={cn(
          'text-[10px]',
          active === key ? 'font-semibold text-teal-900' : 'text-gray-400'
        )}
      >
        {label}
      </span>
    </button>
  );

  return (
    <nav className="flex items-center justify-between border-t border-gray-100 bg-white px-2 py-1">
      {left.map(renderItem)}

      <button
        onClick={onFabClick}
        aria-label="Add"
        className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg"
      >
        <Plus className="h-5 w-5" />
      </button>

      {right.map(renderItem)}
    </nav>
  );
}
