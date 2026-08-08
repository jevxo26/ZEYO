import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}


export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-2">{children}</div>
    </div>
  );
}
