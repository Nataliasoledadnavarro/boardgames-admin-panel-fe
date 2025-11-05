'use client';

import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  icon = <Search className="h-4 w-4" />,
  clearable = true,
  disabled = false,
  className,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn('relative flex-1 max-w-md', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>

      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('pl-10', clearable && value && 'pr-10')}
      />

      {clearable && value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
