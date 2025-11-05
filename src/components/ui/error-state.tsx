'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string | null;
  icon?: ReactNode;
  actions?: ReactNode;
  showRetry?: boolean;
  onRetry?: () => void;
  showGoHome?: boolean;
  variant?: 'default' | 'minimal' | 'page';
  className?: string;
}

export function ErrorState({
  title,
  description,
  error,
  icon,
  actions,
  showRetry = true,
  onRetry,
  showGoHome = false,
  variant = 'default',
  className,
}: ErrorStateProps) {
  // Auto-generar título y descripción basado en el contexto
  const defaultTitle = title || 'Error al cargar datos';
  const defaultDescription = description || 'Ocurrió un problema al obtener la información.';
  const errorMessage =
    error instanceof Error ? error.message : typeof error === 'string' ? error : null;

  const defaultIcon = icon || <AlertTriangle className="h-8 w-8" />;

  const variantStyles = {
    default: 'glass-card rounded-xl p-6',
    minimal: 'bg-muted/30 rounded-lg p-4',
    page: 'glass-card rounded-xl p-8 max-w-md mx-auto mt-20',
  };

  return (
    <div className={cn(variantStyles[variant], 'text-center', className)}>
      <div className="flex flex-col items-center space-y-4">
        {/* Icono */}
        <div className="text-red-500 mb-2">{defaultIcon}</div>

        {/* Título */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{defaultTitle}</h3>

          {/* Descripción */}
          <p className="text-muted-foreground">{defaultDescription}</p>

          {/* Mensaje de error técnico (si existe) */}
          {errorMessage && (
            <details className="mt-3">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Ver detalles técnicos
              </summary>
              <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900">
                {errorMessage}
              </p>
            </details>
          )}
        </div>

        {/* Acciones */}
        {(actions || showRetry || showGoHome) && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            )}

            {showGoHome && (
              <Button
                onClick={() => (window.location.href = '/')}
                variant="default"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Ir al inicio
              </Button>
            )}

            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para manejo de errores comunes
export function useErrorHandler() {
  const handleRetry = (retryFn?: () => void) => {
    if (retryFn) {
      retryFn();
    } else {
      window.location.reload();
    }
  };

  const createErrorProps = (
    error: Error | string | null,
    context: string = 'datos'
  ): Partial<ErrorStateProps> => ({
    title: `Error al cargar ${context}`,
    description: `No se pudo obtener la información de ${context}. Por favor, inténtalo de nuevo.`,
    error,
    onRetry: () => handleRetry(),
  });

  return {
    handleRetry,
    createErrorProps,
  };
}
