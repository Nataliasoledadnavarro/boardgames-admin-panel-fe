import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

// Datos simulados de categorías (más adelante será tu API Java)
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Estrategia',
    description: 'Juegos que requieren planificación y táctica',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Cartas',
    description: 'Juegos basados en mecánicas de cartas',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Familiar',
    description: 'Juegos aptos para toda la familia',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Contador estático para IDs
let mockCategoryIdCounter = 100;

export const categoriesService = {
  // GET /api/categories
  getAll: async (): Promise<Category[]> => {
    await delay(400);
    return [...mockCategories];
  },

  // GET /api/categories/:id
  getById: async (id: string): Promise<Category | null> => {
    await delay(200);
    return mockCategories.find(c => c.id === id) || null;
  },

  // POST /api/categories
  create: async (data: CreateCategoryDto): Promise<Category> => {
    await delay(600);

    // ID incremental determinístico
    mockCategoryIdCounter++;

    // Fecha fija para mock
    const now = new Date('2024-11-10T12:00:00Z');

    const newCategory: Category = {
      ...data,
      id: mockCategoryIdCounter.toString(),
      createdAt: now,
      updatedAt: now,
    };

    mockCategories.push(newCategory);
    return newCategory;
  },

  // PUT /api/categories/:id
  update: async (data: UpdateCategoryDto): Promise<Category> => {
    await delay(600);
    const index = mockCategories.findIndex(c => c.id === data.id);
    if (index === -1) throw new Error('Categoría no encontrada');

    // Fecha fija para mock
    const now = new Date('2024-11-10T12:00:00Z');

    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
      updatedAt: now,
    };
    return mockCategories[index];
  },

  // DELETE /api/categories/:id
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Categoría no encontrada');

    mockCategories.splice(index, 1);
  },
};
