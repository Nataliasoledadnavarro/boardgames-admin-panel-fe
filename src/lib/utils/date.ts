/**
 * Utilidades para formateo y manejo de fechas
 * Funciones determinísticas para evitar errores de hidratación
 */

export const formatDate = (
  date: string | Date | null | undefined,
  options: {
    fallback?: string;
    format?: 'short' | 'long' | 'full' | 'iso' | 'relative';
    locale?: string;
  } = {}
) => {
  const { fallback = '-', format = 'short', locale = 'es' } = options;

  if (!date) return fallback;

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return fallback;
    }

    switch (format) {
      case 'iso':
        return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

      case 'short':
        return new Intl.DateTimeFormat(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(dateObj);

      case 'long':
        return new Intl.DateTimeFormat(locale, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(dateObj);

      case 'full':
        return new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(dateObj);

      default:
        return dateObj.toLocaleDateString(locale);
    }
  } catch (error) {
    console.warn('Error formatting date:', date, error);
    return fallback;
  }
};

// Alias específico para tablas
export const formatTableDate = (
  date: string | Date | null | undefined,
  format: 'short' | 'long' | 'iso' = 'short'
) => {
  return formatDate(date, { format });
};

// Validadores
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
