import { api } from '@/lib/api/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: number) => api.get<Category>(`/categories/${id}`),
  create: (dto: CreateCategoryDto) => api.post<Category>('/categories', dto),
  update: (id: number, dto: UpdateCategoryDto) => api.put<Category>(`/categories/${id}`, dto),
  delete: (id: number) => api.delete(`/categories/${id}`),
};
