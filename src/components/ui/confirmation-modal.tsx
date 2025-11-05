'use client';

import { ReactNode, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  loading?: boolean;
  icon?: ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'destructive',
  loading = false,
  icon,
}: ConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant}
              onClick={onConfirm}
              disabled={loading}
              className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook CON los helpers
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<ConfirmationModalProps, 'isOpen' | 'onClose'> | null>(
    null
  );

  const showConfirmation = (props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => {
    setConfig(props);
    setIsOpen(true);
  };

  const closeConfirmation = () => {
    setIsOpen(false);
    setConfig(null);
  };

  // Helper para eliminaciones
  const confirmDelete = (itemName: string, onConfirm: () => void, loading = false) => {
    showConfirmation({
      title: 'Confirmar eliminación',
      description: `¿Estás seguro de eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive',
      loading,
      onConfirm,
    });
  };

  // Helper para acciones generales
  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    options: Partial<ConfirmationModalProps> = {}
  ) => {
    showConfirmation({
      title,
      description,
      variant: 'default',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      ...options,
      onConfirm,
    });
  };

  return {
    showConfirmation,
    closeConfirmation,
    confirmDelete,
    confirmAction,
    confirmationProps: config ? { ...config, isOpen, onClose: closeConfirmation } : null,
  };
}
