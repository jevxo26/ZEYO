'use client';

import { LayoutGrid, CalendarCheck, Wallet, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavKey } from './BottomNav';
import { Avatar } from '@/components/ui/avatar';

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  vendorName?: string;
}

const navItems: { key: NavKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
  { key: 'profile', label: 'Profile', icon: User },
];

export function Sidebar({ 
  active, 
  onNavigate, 
  vendorName = 'Rahim Ahmed' 
}: SidebarProps) {
  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col justify-between bg-white px-4 py-6 text-black md:flex">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
            Z
          </div>
          <span className="text-sm font-semibold tracking-wide text-amber-500">ZEYO</span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                active === key
                  ? 'bg-black/5 font-medium text-black'
                  : 'text-gray-600 hover:bg-black/5 hover:text-black'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-110',
                  active === key ? 'text-amber-500' : 'text-gray-500 group-hover:text-amber-500'
                )}
              />
              {label}
              {active === key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom - Profile with Avatar */}
      <div className="border-t border-gray-200 pt-4">
        <button 
          onClick={() => onNavigate('profile')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
        >
          <Avatar name={vendorName} size="md" />
          <div className="flex flex-1 flex-col items-start">
            <span className="text-sm font-medium text-black">{vendorName}</span>
            <span className="text-xs text-gray-500">Vendor</span>
          </div>
        </button>
      </div>
    </aside>
  );
}