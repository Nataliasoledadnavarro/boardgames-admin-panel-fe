'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateCategory, useUpdateCategory } from '@/hooks';
import { CreateCategoryDto, UpdateCategoryDto, Category } from '@/types';
import { categoryFormSchema, type CategoryFormData } from './category-form-shema';
import { Package, FileText } from 'lucide-react';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEditing = !!category;
  const isLoading = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  const onSubmit = React.useCallback(
    async (data: CategoryFormData) => {
      try {
        if (isEditing && category) {
          const updateData: UpdateCategoryDto = {
            name: data.name.trim(),
            description: data.description.trim(),
          };
          await updateCategory.mutateAsync({ id: category.id, ...updateData });
        } else {
          const createData: CreateCategoryDto = {
            name: data.name.trim(),
            description: data.description.trim(),
          };

          await createCategory.mutateAsync(createData);
        }

        onClose();
        onSuccess?.();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [isEditing, category, createCategory, updateCategory, onClose, onSuccess]
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
                Nombre de categoría
              </FormLabel>
              <FormControl>
                <Input placeholder="Ej: Estratégia" disabled={isLoading} {...field} />
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
                  placeholder="Describe las características principales de la categoría..."
                  rows={3}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              'Actualizar categoría'
            ) : (
              'Crear categoría'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
