'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false,
  icon,
}: ConfirmationModalProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: icon || <Trash2 className="h-12 w-12 text-red-500" />,
          iconBg: 'bg-red-50',
          confirmButton: 'danger' as const,
        };
      case 'warning':
        return {
          icon: icon || <AlertTriangle className="h-12 w-12 text-amber-500" />,
          iconBg: 'bg-amber-50',
          confirmButton: 'default' as const,
        };
      case 'info':
        return {
          icon: icon || <Info className="h-12 w-12 text-blue-500" />,
          iconBg: 'bg-blue-50',
          confirmButton: 'default' as const,
        };
      default:
        return {
          icon: icon || <CheckCircle className="h-12 w-12 text-green-500" />,
          iconBg: 'bg-green-50',
          confirmButton: 'default' as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg sm:min-h-[280px]"
        onInteractOutside={e => {
          if (loading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          {/* Ícono grande con fondo circular */}
          <div
            className={`
            inline-flex items-center justify-center w-20 h-20 rounded-full 
            ${config.iconBg} border border-border/20
          `}
          >
            {config.icon}
          </div>

          <DialogDescription className="text-center text-muted-foreground max-w-sm leading-relaxed">
            {description}
          </DialogDescription>
        </div>

        {/* Footer con botones */}
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto min-w-[100px]"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={config.confirmButton}
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto min-w-[100px]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmationOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({});

  const confirmDelete = (
    itemName: string,
    onConfirm: () => void | Promise<void>,
    isLoading = false,
    customOptions?: ConfirmationOptions
  ) => {
    setOptions({
      title: customOptions?.title || 'Eliminar elemento',
      description:
        customOptions?.description ||
        `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: customOptions?.confirmText || 'Eliminar',
      cancelText: customOptions?.cancelText || 'Cancelar',
      variant: customOptions?.variant || 'destructive',
      icon: customOptions?.icon,
    });
    setOnConfirmCallback(() => onConfirm);
    setLoading(isLoading);
    setIsOpen(true);
  };

  const confirm = (
    title: string,
    description: string,
    onConfirm: () => void | Promise<void>,
    customOptions?: ConfirmationOptions
  ) => {
    setOptions({
      title,
      description,
      confirmText: customOptions?.confirmText || 'Confirmar',
      cancelText: customOptions?.cancelText || 'Cancelar',
      variant: customOptions?.variant || 'default',
      icon: customOptions?.icon,
    });
    setOnConfirmCallback(() => onConfirm);
    setLoading(false);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      setLoading(true);
      try {
        await onConfirmCallback();
      } catch (error) {
        console.error('Error in confirmation:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeConfirmation = () => {
    setIsOpen(false);
    setOnConfirmCallback(null);
    setLoading(false);
    setOptions({});
  };

  const confirmationProps = isOpen
    ? {
        isOpen,
        onClose: closeConfirmation,
        onConfirm: handleConfirm,
        title: options.title || 'Confirmar',
        description: options.description || '¿Estás seguro?',
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        variant: options.variant,
        loading,
        icon: options.icon,
      }
    : null;

  return {
    confirmDelete,
    confirm,
    closeConfirmation,
    confirmationProps,
    isOpen,
  };
}
