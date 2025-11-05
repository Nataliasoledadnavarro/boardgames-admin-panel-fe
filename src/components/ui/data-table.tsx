'use client';

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Definición de columna genérica
export interface DataTableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  className?: string;
}

// Definición de acción
export interface DataTableAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'secondary' | 'ghost';
  className?: string;
  disabled?: (row: T) => boolean;
  loading?: (row: T) => boolean;
}

// Props del componente
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  loading?: boolean;
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
  };
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyState,
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  // Función para obtener el valor de una celda
  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    try {
      if (typeof column.key === 'string' && column.key.includes('.')) {
        return column.key.split('.').reduce((obj, key) => {
          return obj && typeof obj === 'object' ? obj[key] : undefined;
        }, row);
      }
      return row[column.key as keyof T];
    } catch (error) {
      console.warn('Error getting cell value:', column.key, error);
      return undefined;
    }
  };

  // Helper para renderizar valores primitivos
  const renderPrimitiveValue = (value: any): ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Sí' : 'No'}</Badge>;
    }

    if (typeof value === 'number' || typeof value === 'bigint') {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }

    return <span>{String(value)}</span>;
  };

  // Renderizar contenido de celda
  const renderCellContent = (column: DataTableColumn<T>, row: T, index: number): ReactNode => {
    const value = getCellValue(row, column);

    if (column.render) {
      return column.render(value, row, index);
    }

    return renderPrimitiveValue(value);
  };

  // Función para renderizar skeleton de tabla
  const renderSkeletonTable = () => {
    const skeletonRows = 5;

    return (
      <div className={cn('glass-card rounded-xl p-6', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.title}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" variant="dark" />
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded" variant="dark" />
                      <Skeleton className="h-8 w-8 rounded" variant="dark" />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Estado de carga con skeleton de tabla
  if (loading) {
    return renderSkeletonTable();
  }

  // Estado vacío
  if (data.length === 0 && emptyState) {
    return (
      <div className={cn('glass-card rounded-xl p-6', className)}>
        <div className="text-center py-12">
          {emptyState.icon && (
            <div className="mx-auto mb-4 text-muted-foreground">{emptyState.icon}</div>
          )}
          <h3 className="text-lg font-semibold text-foreground mb-2">{emptyState.title}</h3>
          <p className="text-muted-foreground mb-4">{emptyState.description}</p>
          {emptyState.action}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('glass-card rounded-xl p-6', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  column.className,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
                style={{ width: column.width }}
              >
                {column.title}
              </TableHead>
            ))}
            {actions.length > 0 && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(
                'hover:bg-sidebar-accent/30 transition-colors',
                onRowClick && 'cursor-pointer',
                rowClassName?.(row)
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn(
                    column.className,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {renderCellContent(column, row, rowIndex)}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant || 'ghost'}
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        disabled={action.disabled?.(row) || action.loading?.(row)}
                        className={action.className}
                      >
                        {action.loading?.(row) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          action.icon
                        )}
                        {action.label && <span className="sr-only">{action.label}</span>}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper exports
export const createStatusBadge = (
  status: string,
  variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default'
) => <Badge variant={variant}>{status}</Badge>;

export const formatTableDate = (
  date: string | Date | null | undefined,
  options: {
    fallback?: string;
    format?: 'short' | 'long' | 'full';
  } = {}
) => {
  const { fallback = '-', format = 'short' } = options;

  if (!date) return fallback;

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return fallback;
    }

    const formatOptions = {
      short: {
        day: '2-digit' as const,
        month: 'short' as const,
        year: 'numeric' as const,
      },
      long: {
        day: '2-digit' as const,
        month: 'long' as const,
        year: 'numeric' as const,
      },
      full: {
        weekday: 'long' as const,
        day: '2-digit' as const,
        month: 'long' as const,
        year: 'numeric' as const,
      },
    };

    return new Intl.DateTimeFormat('es', formatOptions[format]).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date:', date, error);
    return fallback;
  }
};
