'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackClassName,
  size = 'md',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-48 w-48',
    lg: 'h-64 w-64',
  };

  // ✅ Verificar si es una URL válida (Picsum está permitido)
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;

    // ✅ Rutas locales
    if (url.startsWith('/')) return true;

    // ✅ URLs de Picsum y otros permitidos
    try {
      const urlObj = new URL(url);
      const allowedDomains = ['picsum.photos', 'images.unsplash.com'];

      return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  // ✅ Fallback cuando no hay imagen o falló
  if (!src || imageError || !isValidImageUrl(src)) {
    return (
      <div
        className={cn(
          'bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground',
          sizeClasses[size],
          fallbackClassName,
          className
        )}
      >
        {imageError ? (
          <>
            <AlertCircle className="h-8 w-8 mb-2" />
            <span className="text-xs text-center px-2">Error al cargar imagen</span>
          </>
        ) : (
          <>
            <Package className="h-8 w-8 mb-2" />
            <span className="text-xs text-center px-2">Sin imagen</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('relative rounded-lg overflow-hidden bg-muted', sizeClasses[size], className)}
    >
      {/* ✅ Spinner de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
