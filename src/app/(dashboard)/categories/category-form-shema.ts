import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
