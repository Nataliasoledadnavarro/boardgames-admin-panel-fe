import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories-service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/types';

// Keys para el cache de TanStack Query
export const CATEGORIES_QUERY_KEY = 'categories';

// Hook para obtener todas las categorías
export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      const [data] = await Promise.all([
        categoriesService.getAll(),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para obtener una categoría por ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
};

// Hook para crear una categoría
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};

// Hook para actualizar una categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryDto) => categoriesService.update(data),
    onSuccess: updatedCategory => {
      queryClient.setQueryData([CATEGORIES_QUERY_KEY, updatedCategory.id], updatedCategory);
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};

// Hook para eliminar una categoría
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};
