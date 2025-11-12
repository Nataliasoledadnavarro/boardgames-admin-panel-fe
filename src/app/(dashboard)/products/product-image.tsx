'use client';

import { useState } from 'react';
import Image from 'next/image';
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

  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;

    // Rutas locales
    if (url.startsWith('/')) return true;

    // URLs de Picsum y otros permitidos
    try {
      const urlObj = new URL(url);
      const allowedDomains = ['picsum.photos', 'images.unsplash.com'];
      return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleRetry = () => {
    setImageError(false);
    setIsLoading(true);
    if (onRetry) {
      onRetry();
    }
  };

  // Estado de carga con Skeleton
  if (isLoading && src && !imageError) {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <Skeleton className={cn('w-full h-full rounded-lg', sizeClasses[size])} variant="medium" />
        {/* Imagen oculta para manejar la carga */}
        <Image
          src={src}
          alt={alt}
          fill
          className="opacity-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  // Estado de error con ErrorState
  if (src && imageError && isValidImageUrl(src)) {
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
  if (!src || !isValidImageUrl(src)) {
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

  // Imagen cargada exitosamente
  return (
    <div
      className={cn('relative rounded-lg overflow-hidden bg-muted', sizeClasses[size], className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
