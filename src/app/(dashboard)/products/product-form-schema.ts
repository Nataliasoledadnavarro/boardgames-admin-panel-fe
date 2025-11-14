import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z
    .string()
    .min(1, 'El precio es requerido')
    .refine(
      val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0 && num <= 99999;
      },
      { message: 'El precio debe ser un número entre 0.01 y 99,999' }
    ),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  imageUrl: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
