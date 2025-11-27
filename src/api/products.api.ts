import { api } from '@/lib/api/axios';
import { Product, CreateProductDto, UpdateProductDto } from '@/types';

export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getByCategory: (categoryId: number) => api.get<Product[]>(`/products/category/${categoryId}`),
  create: (dto: CreateProductDto) => api.post<Product>('/products', dto),
  update: (id: number, dto: UpdateProductDto) => api.put<Product>(`/products/${id}`, dto),
  delete: (id: number) => api.delete(`/products/${id}`),
};
