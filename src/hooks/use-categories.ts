import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/types';

const CATEGORIES_KEY = ['categories'];

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoriesService.getAll(),
  });
};

export const useCategoryById = (id: number) => {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => categoriesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dto }: UpdateCategoryDto & { id: number }) =>
      categoriesService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};
