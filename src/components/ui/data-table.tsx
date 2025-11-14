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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DataTableColumn, DataTableProps } from '@/types/data-table';
import { EllipsisVertical } from 'lucide-react';

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

  const renderCellContent = (column: DataTableColumn<T>, row: T, index: number): ReactNode => {
    const value = getCellValue(row, column);

    if (column.render) {
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
              {actions.length > 0 && <TableHead>Acciones</TableHead>}
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
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" variant="dark" />
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
                className={cn(column.className)}
                style={{ width: column.width }}
              >
                {column.title}
              </TableHead>
            ))}
            {actions.length > 0 && <TableHead>Acciones</TableHead>}
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
                <TableCell key={colIndex} className={cn(column.className)}>
                  {renderCellContent(column, row, rowIndex)}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={e => e.stopPropagation()}
                      >
                        <span className="sr-only">Abrir menú</span>
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, actionIndex) => {
                        const isDestructive =
                          action.className?.includes('red') ||
                          action.label.toLowerCase().includes('eliminar');
                        const isLast = actionIndex === actions.length - 1;
                        const nextAction = actions[actionIndex + 1];
                        const nextIsDestructive =
                          nextAction?.className?.includes('red') ||
                          nextAction?.label.toLowerCase().includes('eliminar');

                        return (
                          <div key={actionIndex}>
                            <DropdownMenuItem
                              onClick={e => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              disabled={action.disabled?.(row) || action.loading?.(row)}
                              className={cn(
                                'cursor-pointer',
                                isDestructive &&
                                  'text-red-600 focus:text-red-600 dark:text-red-400',
                                action.className
                              )}
                            >
                              {action.loading?.(row) ? (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <span className="mr-2">{action.icon}</span>
                              )}
                              {action.label}
                            </DropdownMenuItem>
                            {!isLast && !isDestructive && nextIsDestructive && (
                              <DropdownMenuSeparator />
                            )}
                          </div>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
