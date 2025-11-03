import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products-service';
import { CreateProductDto, UpdateProductDto } from '@/types';

// Keys para el cache de TanStack Query
export const PRODUCTS_QUERY_KEY = 'products';

// Hook para obtener todos los productos
export const useProducts = () => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: productsService.getAll,
  });
};

// Hook para obtener un producto por ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => productsService.getById(id),
    enabled: !!id, // Solo ejecuta si hay ID
  });
};

// Hook para crear un producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsService.create(data),
    onSuccess: () => {
      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

// Hook para actualizar un producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductDto) => productsService.update(data),
    onSuccess: updatedProduct => {
      // Actualizar cache específico y lista general
      queryClient.setQueryData([PRODUCTS_QUERY_KEY, updatedProduct.id], updatedProduct);
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

// Hook para eliminar un producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};
