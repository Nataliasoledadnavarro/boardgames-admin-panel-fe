'use client';

import { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  onRetry?: () => void;
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackClassName,
  size = 'md',
  onRetry,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-48 w-48',
    lg: 'h-64 w-64',
  };

  const handleRetry = () => {
    setImageError(false);
    setIsLoading(true);
    if (onRetry) {
      onRetry();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Estado de error
  if (src && imageError) {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <ErrorState
          title="Error de imagen"
          description="No se pudo cargar la imagen del producto."
          icon={<AlertCircle className="h-6 w-6" />}
          onRetry={handleRetry}
          showRetry={true}
          showGoHome={false}
          variant="minimal"
          className="h-full"
        />
      </div>
    );
  }

  // Sin imagen
  if (!src || src.trim() === '') {
    return (
      <div className={cn('relative', sizeClasses[size], fallbackClassName, className)}>
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="Sin imagen"
          description="No hay imagen disponible para este producto."
          variant="minimal"
          size="sm"
          className="h-full"
        />
      </div>
    );
  }

  // Imagen con estado de carga
  return (
    <div
      className={cn('relative rounded-lg overflow-hidden bg-muted', sizeClasses[size], className)}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" variant="medium" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
