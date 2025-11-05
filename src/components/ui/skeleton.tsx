import { cn } from '@/lib/utils';

interface SkeletonProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'light' | 'medium' | 'dark';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variants = {
    default: 'bg-accent',
    light: 'bg-muted/50',
    medium: 'bg-muted',
    dark: 'bg-muted-foreground/20',
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(variants[variant], 'animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
