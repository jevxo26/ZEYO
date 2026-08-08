'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WithdrawMethodRowProps {
  icon: ReactNode;
  label: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}


export function WithdrawMethodRow({
  icon,
  label,
  description,
  selected,
  onClick,
}: WithdrawMethodRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left',
        selected ? 'border-teal-900 bg-teal-50' : 'border-gray-100 bg-white'
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
}
