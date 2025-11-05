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
//import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormModalProps {
  // Estado del modal
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  // Contenido
  title: string;
  description?: string;

  // Trigger button (opcional - puede abrirse programáticamente)
  trigger?: ReactNode;

  // Form content
  children: ReactNode;

  // Tamaños
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  // Estilos
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function FormModal({
  isOpen,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  size = 'md',
  className,
}: FormModalProps) {
  const content = (
    <DialogContent className={cn(sizeClasses[size], className)}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
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
