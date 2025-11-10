import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProductDto, UpdateProductDto } from '@/types/product';
import { productsService } from '@/services/products-service';

const PRODUCTS_QUERY_KEY = 'products';

// Hook para obtener todos los productos
export const useProducts = () => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: async () => {
      const [data] = await Promise.all([
        productsService.getAll(),
        new Promise(resolve => setTimeout(resolve, 1500)),
      ]);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para obtener producto por ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

// Hook para crear producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductDto) => productsService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

// Hook para actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: UpdateProductDto) => productsService.update(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

// Hook para eliminar producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};
