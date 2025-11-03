export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Administrador de juegos</h1>
        <p className="text-muted-foreground">Panel de reportes de juegos de mesa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">📦 Productos</h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">Total de productos</p>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">📂 Categorías</h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">Total de categorías</p>
        </div>
      </div>
    </div>
  );
}
