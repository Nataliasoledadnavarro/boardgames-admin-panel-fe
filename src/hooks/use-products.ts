import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { CreateProductDto, UpdateProductDto } from '@/types';

const PRODUCTS_KEY = ['products'];

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: () => productsService.getAll(),
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, 'category', categoryId],
    queryFn: () => productsService.getByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dto }: UpdateProductDto & { id: number }) =>
      productsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
};

export const useDuplicateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.duplicateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
};
