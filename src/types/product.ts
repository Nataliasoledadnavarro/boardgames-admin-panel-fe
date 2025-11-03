export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}
