'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'gray' | 'blue' | 'purple' | 'amber' | 'emerald' | 'red';

const toneClasses: Record<Tone, string> = {
  gray: 'bg-gray-50 text-gray-500',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-500',
};

interface SettingsRowProps {
  icon?: ReactNode;
  tone?: Tone;
  label: string;
  description?: string;
  value?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SettingsRow({
  icon,
  tone = 'gray',
  label,
  description,
  value,
  trailing,
  onClick,
  className,
}: SettingsRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-3 border-b border-gray-50 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-gray-50/80',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
              toneClasses[tone]
            )}
          >
            {icon}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-400">{value}</span>}
        {trailing ?? <ChevronRight className="h-4 w-4 text-gray-300" />}
      </div>
    </button>
  );
}