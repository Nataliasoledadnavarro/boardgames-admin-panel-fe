'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: 'default' | 'minimal' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  size = 'md',
  className,
}: EmptyStateProps) {
  const variants = {
    default: 'glass-card rounded-xl p-6',
    minimal: 'bg-muted/30 rounded-lg p-4',
    card: 'border border-dashed border-muted-foreground/25 rounded-xl p-6 bg-muted/10',
  };

  const sizes = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  const iconSizes = {
    sm: 'mb-3',
    md: 'mb-4',
    lg: 'mb-6',
  };

  const titleSizes = {
    sm: 'text-base mb-1',
    md: 'text-lg mb-2',
    lg: 'text-xl mb-3',
  };

  const descriptionSizes = {
    sm: 'text-sm mb-3',
    md: 'mb-4',
    lg: 'text-lg mb-6',
  };

  return (
    <div className={cn(variants[variant], className)}>
      <div className={cn('text-center', sizes[size])}>
        {icon && <div className={cn('mx-auto text-muted-foreground', iconSizes[size])}>{icon}</div>}

        <h3 className={cn('font-semibold text-foreground', titleSizes[size])}>{title}</h3>

        <p className={cn('text-muted-foreground', descriptionSizes[size])}>{description}</p>

        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

// Variantes específicas para casos comunes
export function TableEmptyState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="default" {...props} />;
}

export function CardEmptyState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="card" {...props} />;
}

export function MinimalEmptyState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="minimal" {...props} />;
}
