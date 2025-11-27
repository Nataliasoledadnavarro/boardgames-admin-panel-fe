'use client';

import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';

export default function DashboardPage() {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Administrador de juegos</h1>
        <p className="text-muted-foreground">Panel de reportes de juegos de mesa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Productos */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <span className="text-2xl">🎲</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Productos</h3>
          </div>

          {loadingProducts ? (
            <p className="text-2xl font-bold text-muted-foreground animate-pulse">...</p>
          ) : (
            <p className="text-4xl font-bold text-primary mb-1">{products.length}</p>
          )}

          <p className="text-sm text-muted-foreground">Total de productos registrados</p>
        </div>

        {/* Card Categorías */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <span className="text-2xl">📂</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Categorías</h3>
          </div>

          {loadingCategories ? (
            <p className="text-2xl font-bold text-muted-foreground animate-pulse">...</p>
          ) : (
            <p className="text-4xl font-bold mb-1">{categories.length}</p>
          )}

          <p className="text-sm text-muted-foreground">Total de categorías activas</p>
        </div>

        {/* Card Precio promedio */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Precio Promedio</h3>
          </div>

          {loadingProducts ? (
            <p className="text-2xl font-bold text-muted-foreground animate-pulse">...</p>
          ) : (
            <p className="text-4xl font-bold mb-1">
              $
              {products.length > 0
                ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
                : '0.00'}
            </p>
          )}

          <p className="text-sm text-muted-foreground">Precio promedio de productos</p>
        </div>
      </div>
    </div>
  );
}
