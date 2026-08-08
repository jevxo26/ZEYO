'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav, type NavKey } from './BottomNav';

interface PageContainerProps {
  children: ReactNode;
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onFabClick?: () => void;
}


export function PageContainer({ children, active, onNavigate, onFabClick }: PageContainerProps) {
  return (
    <div className="flex h-dvh bg-gray-50 md:bg-muted/40">
      <Sidebar active={active} onNavigate={onNavigate} />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden md:max-w-none md:px-8 md:py-6">
        <div className="flex-1 overflow-y-auto pb-2 md:rounded-2xl md:bg-white md:shadow-sm md:ring-1 md:ring-black/5">
          {children}
        </div>

        <BottomNav active={active} onNavigate={onNavigate} onFabClick={onFabClick} />
      </div>
    </div>
  );
}