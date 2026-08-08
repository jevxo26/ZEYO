'use client';

import { cn } from '@/lib/utils';

interface FilterTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function FilterTabs<T extends string>({ tabs, active, onChange }: FilterTabsProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
            active === tab.key
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}