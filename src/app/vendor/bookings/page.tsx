'use client';

import { cn } from '@/lib/utils';

interface FilterTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function FilterTabs<T extends string>({ tabs, active, onChange }: FilterTabsProps<T>) {
  return (
    <div className="flex gap-1 px-4 py-2 md:px-6">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            active === key
              ? 'bg-amber-500 text-white'  // teal থেকে amber/orange করা হলো
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}