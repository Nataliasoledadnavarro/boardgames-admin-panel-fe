import { ReactNode } from 'react';

export interface DataTableColumn<T, K extends keyof T = keyof T> {
  key: K;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: T[K], row: T, index: number) => ReactNode;
  className?: string;
}

// Definición correcta de DataTableAction
export interface DataTableAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'secondary' | 'ghost' | 'outline';
  disabled?: (row: T) => boolean;
  loading?: (row: T) => boolean;
}

// Props del componente con tipado correcto
export interface DataTableProps<T> {
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

// Tipos adicionales para futuras funcionalidades
export interface DataTableSortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface DataTableFilterConfig<T> {
  key: keyof T;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith';
}
