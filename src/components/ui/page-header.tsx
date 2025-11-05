'use client';

import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function PageHeader({
  icon,
  title,
  description,
  badge,
  actions,
  className,
  iconClassName = 'gradient-secondary',
}: PageHeaderProps) {
  return (
    <div className={cn('glass-card rounded-xl p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg', iconClassName)}>{icon}</div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className="text-sm">
              {badge.text}
            </Badge>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}

// Helper para crear badges de conteo con pluralización
export const createCountBadge = (
  count: number,
  singular: string,
  plural?: string
): { text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  const pluralForm = plural || `${singular}s`;
  return {
    text: `${count} ${count !== 1 ? pluralForm : singular}`,
    variant: 'secondary',
  };
};
