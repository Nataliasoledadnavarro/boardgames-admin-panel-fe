import { Product, CreateProductDto, UpdateProductDto } from '@/types';

// Datos simulados
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Catan',
    description: 'Juego de estrategia clásico para construir civilizaciones',
    price: 45.99,
    categoryId: '1',
    imageUrl: 'https://via.placeholder.com/300x300/4f46e5/white?text=Catan',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Ticket to Ride',
    description: 'Aventura ferroviaria por todo el mundo',
    price: 52.99,
    categoryId: '1',
    imageUrl: 'https://via.placeholder.com/300x300/059669/white?text=Ticket',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Splendor',
    description: 'Juego de cartas de comercio de gemas',
    price: 38.99,
    categoryId: '2',
    imageUrl: 'https://via.placeholder.com/300x300/dc2626/white?text=Splendor',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Contador estático para IDs determinísticos
let mockIdCounter = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    await delay(500);
    return [...mockProducts];
  },

  getById: async (id: string): Promise<Product | null> => {
    await delay(300);
    return mockProducts.find(p => p.id === id) || null;
  },

  // Crear producto con valores determinísticos
  create: async (data: CreateProductDto): Promise<Product> => {
    await delay(800);

    // ID incremental en lugar de Date.now()
    mockIdCounter++;

    // Fecha fija para mock (en producción esto vendría del servidor)
    const now = new Date('2024-11-10T12:00:00Z'); // Fecha fija

    const newProduct: Product = {
      ...data,
      id: mockIdCounter.toString(),
      createdAt: now,
      updatedAt: now,
    };

    mockProducts.push(newProduct);
    return newProduct;
  },

  update: async (data: UpdateProductDto): Promise<Product> => {
    await delay(600);
    const index = mockProducts.findIndex(p => p.id === data.id);
    if (index === -1) throw new Error('Producto no encontrado');

    // Fecha fija para mock
    const now = new Date('2024-11-10T12:00:00Z');

    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: now,
    };
    return mockProducts[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(400);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    mockProducts.splice(index, 1);
  },
};
