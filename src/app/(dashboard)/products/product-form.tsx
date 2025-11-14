'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks';
import { Product, CreateProductDto, UpdateProductDto } from '@/types';
import { productFormSchema, type ProductFormData } from './product-form-schema';
import { Package, DollarSign, FileText, Tag, ImageIcon } from 'lucide-react';
//import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;
  const isLoading = createProduct.isPending || updateProduct.isPending;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price?.toString() ?? '',
      categoryId: product?.categoryId ?? '',
      imageUrl: product?.imageUrl ?? '',
    },
  });

  // Submit handler con tipos explícitos
  const onSubmit = React.useCallback(
    async (data: ProductFormData) => {
      try {
        if (isEditing && product) {
          const updateData: UpdateProductDto = {
            id: product.id,
            name: data.name.trim(),
            description: data.description.trim(),
            price: parseFloat(data.price),
            categoryId: data.categoryId,
            imageUrl: data.imageUrl?.trim() || undefined,
          };

          await updateProduct.mutateAsync(updateData);
        } else {
          const createData: CreateProductDto = {
            name: data.name.trim(),
            description: data.description.trim(),
            price: parseFloat(data.price),
            categoryId: data.categoryId,
            imageUrl: data.imageUrl?.trim() || undefined,
          };

          await createProduct.mutateAsync(createData);
        }

        onClose();
        onSuccess?.();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [isEditing, product, createProduct, updateProduct, onClose, onSuccess]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Nombre del producto
              </FormLabel>
              <FormControl>
                <Input placeholder="Ej: Catan - Juego de mesa" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descripción
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe las características principales del producto..."
                  rows={3}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo URL de Imagen */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                URL de la imagen (opcional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={field.value}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center text-red-500"><span class="text-xs">Error al cargar imagen</span></div>';
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Precio con manejo de números */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Precio
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Categoría con Select */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categoría
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="w-full sm:w-auto button-primary"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </>
            ) : isEditing ? (
              'Actualizar producto'
            ) : (
              'Crear producto'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
