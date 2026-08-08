import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-20 w-20 text-2xl',
};


export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?';

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-teal-900 font-semibold text-white',
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
