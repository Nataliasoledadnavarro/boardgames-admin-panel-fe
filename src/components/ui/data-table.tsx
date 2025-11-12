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
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { DataTableColumn, DataTableProps } from '@/types/data-table';

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
      return row[column.key];
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

  // ✅ Renderizar contenido de celda con tipado corregido
  const renderCellContent = (column: DataTableColumn<T>, row: T, index: number): ReactNode => {
    const value = getCellValue(row, column);

    if (column.render) {
      // ✅ Pasar el valor con 'as any' para que la función render maneje el tipado específico
      return column.render(value as any, row, index);
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

  if (data.length === 0 && emptyState) {
    return (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
        variant="default"
        className={className}
      />
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
                  <div
                    className="flex justify-end gap-2"
                    role="group"
                    aria-label="Acciones de fila"
                  >
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
                        aria-label={action.label}
                      >
                        {action.loading?.(row) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          action.icon
                        )}
                        <span className="sr-only">{action.label}</span>
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
