'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ControlsBarProps {
  searchElement: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ControlsBar({ searchElement, actions, className }: ControlsBarProps) {
  return (
    <div className={cn('glass-card rounded-xl p-6', className)}>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {searchElement}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
