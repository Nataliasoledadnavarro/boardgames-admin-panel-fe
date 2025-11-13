import { Product, CreateProductDto, UpdateProductDto } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Catan',
    description:
      'Juego de estrategia donde construyes asentamientos y ciudades en la isla de Catan.',
    price: 45.99,
    categoryId: '1',
    categoryName: 'Estrategia',
    imageUrl: 'https://picsum.photos/seed/catan/400/300',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    name: 'Ticket to Ride',
    description: 'Aventura ferroviaria donde conectas ciudades a través de rutas de tren.',
    price: 52.99,
    categoryId: '2',
    categoryName: 'Familiares',
    imageUrl: 'https://picsum.photos/seed/train/400/300',
    createdAt: new Date('2024-02-01T14:15:00Z'),
    updatedAt: new Date('2024-02-10T09:45:00Z'),
  },
  {
    id: '3',
    name: 'Exploding Kittens',
    description: 'Juego de cartas estratégico lleno de gatitos, explosiones y láser.',
    price: 19.99,
    categoryId: '2',
    categoryName: 'Cartas',
    imageUrl: 'https://picsum.photos/seed/kittens/400/300',
    createdAt: new Date('2024-02-05T16:20:00Z'),
    updatedAt: new Date('2024-02-05T16:20:00Z'),
  },
  {
    id: '4',
    name: 'Pandemic',
    description: 'Juego cooperativo donde trabajas en equipo para salvar al mundo de enfermedades.',
    price: 39.99,
    categoryId: '1',
    categoryName: 'Estrategia',
    imageUrl: 'https://picsum.photos/seed/pandemic/400/300',
    createdAt: new Date('2024-02-08T11:00:00Z'),
    updatedAt: new Date('2024-02-15T13:30:00Z'),
  },
  {
    id: '5',
    name: 'Azul',
    description: 'Hermoso juego de colocación de azulejos inspirado en los mosaicos portugueses.',
    price: 42.5,
    categoryId: '1',
    categoryName: 'Estrategia',
    imageUrl: 'https://picsum.photos/seed/azul/400/300',
    createdAt: new Date('2024-02-10T08:45:00Z'),
    updatedAt: new Date('2024-02-10T08:45:00Z'),
  },
  {
    id: '6',
    name: 'Expansión Catan: Navegantes',
    description: 'Expansión que añade exploración marítima y nuevos escenarios a Catan.',
    price: 28.99,
    categoryId: '4',
    categoryName: 'Expansiones',
    imageUrl: 'https://picsum.photos/seed/seafarers/400/300',
    createdAt: new Date('2024-02-12T15:10:00Z'),
    updatedAt: new Date('2024-02-12T15:10:00Z'),
  },
  {
    id: '7',
    name: 'UNO',
    description: 'El clásico juego de cartas familiar que todos conocen y aman.',
    price: 12.99,
    categoryId: '2',
    categoryName: 'Cartas',
    imageUrl: 'https://picsum.photos/seed/uno/400/300',
    createdAt: new Date('2024-02-14T12:25:00Z'),
    updatedAt: new Date('2024-02-14T12:25:00Z'),
  },
  {
    id: '8',
    name: 'Monopoly Clásico',
    description: 'El juego de bienes raíces más famoso del mundo.',
    price: 34.99,
    categoryId: '3',
    categoryName: 'Familiares',
    imageUrl: 'https://picsum.photos/seed/monopoly/400/300',
    createdAt: new Date('2024-02-16T09:15:00Z'),
    updatedAt: new Date('2024-02-18T14:50:00Z'),
  },
  {
    id: '9',
    name: 'Scrabble',
    description: 'Juego de palabras donde la estrategia y el vocabulario son clave.',
    price: 29.99,
    categoryId: '3',
    categoryName: 'Familiares',
    imageUrl: 'https://picsum.photos/seed/scrabble/400/300',
    createdAt: new Date('2024-02-18T13:40:00Z'),
    updatedAt: new Date('2024-02-18T13:40:00Z'),
  },
  {
    id: '10',
    name: 'Sin Imagen',
    description: 'Producto de prueba sin imagen para verificar el fallback.',
    price: 15.99,
    categoryId: '1',
    categoryName: 'Estrategia',
    createdAt: new Date('2024-02-20T10:00:00Z'),
    updatedAt: new Date('2024-02-20T10:00:00Z'),
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

    mockIdCounter++;
    const now = new Date();

    const newProduct: Product = {
      ...data,
      id: mockIdCounter.toString(),
      // Generar imageUrl automáticamente si no se proporciona
      imageUrl: data.imageUrl || `https://picsum.photos/seed/game${mockIdCounter}/400/300`,
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

    const now = new Date();

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
