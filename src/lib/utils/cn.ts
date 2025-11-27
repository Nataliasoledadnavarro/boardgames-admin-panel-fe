import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS sin conflictos
 * @param inputs - Clases a combinar
 * @returns String de clases optimizado
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
