'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  // Estado del modal
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  // Contenido
  title: string;
  description?: string;
  icon?: ReactNode;

  // Trigger button (opcional - puede abrirse programáticamente)
  trigger?: ReactNode;

  // Content
  children: ReactNode;

  // Tamaños
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  // Estilos
  className?: string;
  headerClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  icon,
  trigger,
  children,
  size = 'md',
  className,
  headerClassName,
}: ModalProps) {
  const content = (
    <DialogContent className={cn(sizeClasses[size], className)}>
      <DialogHeader className={headerClassName}>
        <DialogTitle className={cn(icon && 'flex items-center gap-2')}>
          {icon}
          {title}
        </DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className="mt-4">{children}</div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {content}
    </Dialog>
  );
}
