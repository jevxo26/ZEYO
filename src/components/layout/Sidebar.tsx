'use client';

import { LayoutGrid, CalendarCheck, Wallet, User, Settings } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { NavKey } from './BottomNav';

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  balance?: number;
}

const navItems: { key: NavKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
  { key: 'profile', label: 'Profile', icon: User },
];


export function Sidebar({ active, onNavigate, balance = 125000 }: SidebarProps) {
  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col justify-between bg-teal-950 px-4 py-6 text-white md:flex">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-teal-950">
            Z
          </div>
          <span className="text-sm font-semibold tracking-wide">ZEYO</span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                active === key
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-teal-200/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-110',
                  active === key ? 'text-amber-400' : 'text-teal-200/70 group-hover:text-amber-400'
                )}
              />
              {label}
              {active === key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-teal-200/70 transition-colors hover:bg-white/5 hover:text-white">
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <div className="rounded-xl bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10">
          <p className="text-[10px] text-teal-200/60">Available Balance</p>
          <p className="text-sm font-semibold text-amber-400">{formatCurrency(balance)}</p>
        </div>
      </div>
    </aside>
  );
}