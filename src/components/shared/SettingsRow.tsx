'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}


export function SettingsRow({
  icon,
  label,
  value,
  trailing,
  onClick,
  className,
}: SettingsRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between border-b border-gray-50 px-4 py-3 text-left last:border-0',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500">
            {icon}
          </span>
        )}
        <span className="text-sm text-gray-800">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-400">{value}</span>}
        {trailing ?? <ChevronRight className="h-4 w-4 text-gray-300" />}
      </div>
    </button>
  );
}
