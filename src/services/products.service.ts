// src/services/products.service.ts
import { productsApi } from '@/api/products.api';
import { Product, CreateProductDto, UpdateProductDto } from '@/types';
import { toast } from 'sonner';

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data } = await productsApi.getAll();
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await productsApi.getById(id);
    return data;
  },

  async getByCategory(categoryId: number): Promise<Product[]> {
    const { data } = await productsApi.getByCategory(categoryId);
    return data;
  },

  async create(dto: CreateProductDto): Promise<Product> {
    if (dto.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    const { data } = await productsApi.create(dto);

    toast.success('Producto creado correctamente');

    return data;
  },

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const { data } = await productsApi.update(id, dto);
    toast.success('Producto actualizado correctamente');
    return data;
  },

  async delete(id: number): Promise<void> {
    await productsApi.delete(id);
    toast.success('Producto eliminado correctamente');
  },

  async getByPriceRange(min: number, max: number): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.price >= min && p.price <= max);
  },

  async duplicateProduct(id: number): Promise<Product> {
    const original = await this.getById(id);
    return this.create({
      name: `${original.name} (Copia)`,
      description: original.description,
      price: original.price,
      category: { id: original.category.id },
      imageUrl: original.imageUrl,
    });
  },
};
