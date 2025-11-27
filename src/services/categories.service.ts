import { categoriesApi } from '@/api/categories.api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';
import { toast } from 'sonner';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data } = await categoriesApi.getAll();
    return data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await categoriesApi.getById(id);
    return data;
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    if (dto.name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    const { data } = await categoriesApi.create(dto);

    toast.success('Categoría creada correctamente');

    return data;
  },

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const { data } = await categoriesApi.update(id, dto);
    toast.success('Categoría actualizada correctamente');
    return data;
  },

  async delete(id: number): Promise<void> {
    await categoriesApi.delete(id);
    toast.success('Categoría eliminada correctamente');
  },

  async getCategoriesWithProductCount(): Promise<(Category & { productCount: number })[]> {
    // Este método podría implementarse cuando el backend lo soporte
    const categories = await this.getAll();
    // Por ahora retorna sin el count, pero la estructura está lista
    return categories.map(cat => ({ ...cat, productCount: 0 }));
  },
};
