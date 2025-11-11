'use client';

import { Product } from '@/types/product';
import { Modal } from '@/components/ui/modal'; // ✅ Usar componente reutilizable
import { ProductImage } from './product-image';
import { formatTableDate } from '@/lib/utils/date';
import { Package, DollarSign, Tag, Calendar } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      title={product.name}
      icon={<Package className="h-5 w-5 text-primary" />}
      size="lg"
    >
      <div className="space-y-4">
        {/* Imagen del producto */}
        <ProductImage src={product.imageUrl} alt={product.name} size="lg" className="w-full h-48" />

        {/* Descripción */}
        <div>
          <p className=" leading-relaxed">{product.description}</p>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {/* Precio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Precio
            </div>
            <p className="text-xl font-semibold text-green-800">${product.price.toFixed(2)}</p>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              Categoría
            </div>
            <p className="font-medium">ID: {product.categoryId}</p>
          </div>

          {/* Fecha de creación */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Creado
            </div>
            <p className="text-sm">{formatTableDate(product.createdAt)}</p>
          </div>

          {/* Última actualización */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Actualizado
            </div>
            <p className="text-sm">{formatTableDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
