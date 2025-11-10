'use client';

import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { useModal } from '@/hooks/use-modal';
import { PageHeader, createCountBadge } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { ControlsBar } from '@/components/ui/controls-bar';
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal';
import { FormModal } from '@/components/ui/form-modal';
import { ErrorState } from '@/components/ui/error-state';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { formatTableDate } from '@/lib/utils/date';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const productModal = useModal<Product>();
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  const confirmation = useConfirmation();

  const handleDelete = async (product: Product) => {
    confirmation.confirmDelete(
      product.name,
      async () => {
        try {
          await deleteProduct.mutateAsync(product.id);
          confirmation.closeConfirmation();
        } catch (error) {
          console.error('Error al eliminar producto:', error);
        }
      },
      deleteProduct.isPending
    );
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Definir columnas de la tabla
  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Nombre',
      render: value => <span className="font-medium">{value}</span>,
    },
    {
      key: 'description',
      title: 'Descripción',
      className: 'max-w-md',
      render: value => <span className="truncate block">{value}</span>,
    },
    {
      key: 'price',
      title: 'Precio',
      align: 'right',
      render: value => (
        <span className="font-mono font-semibold text-green-600">${Number(value).toFixed(2)}</span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Creado',
      render: value => (
        <span className="text-muted-foreground">
          {formatTableDate(value instanceof Date ? value.toISOString() : value)}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<Product>[] = [
    {
      label: 'Ver detalles',
      icon: <Eye className="h-4 w-4" />,
      onClick: product => console.log('Ver producto:', product.id),
      className: 'hover:bg-blue-500/10 hover:text-blue-600',
    },
    {
      label: 'Editar producto',
      icon: <Edit className="h-4 w-4" />,
      onClick: product => productModal.openWith(product),
      className: 'hover:bg-purple-500/10 hover:text-purple-600',
    },
    {
      label: 'Eliminar producto',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      className: 'hover:bg-red-500/10 hover:text-red-600',
      disabled: () => deleteProduct.isPending,
    },
  ];

  if (error) {
    return (
      <ErrorState
        title="Error al cargar productos"
        description="No se pudieron obtener los productos. Verifica tu conexión e inténtalo de nuevo."
        error={error}
        onRetry={() => refetch()}
        actions={
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Ir al Dashboard
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Package className="h-6 w-6 text-white" />}
        title="Gestión de Productos"
        description="Administra tu inventario de productos"
        badge={createCountBadge(products.length, 'producto')}
      />

      <ControlsBar
        searchElement={
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar productos..."
            className="flex-1 max-w-md"
          />
        }
        actions={
          <FormModal
            isOpen={productModal.isOpen}
            onOpenChange={open => (open ? productModal.open() : productModal.close())}
            title={productModal.isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            description={
              productModal.isEditing
                ? 'Modifica los datos del producto'
                : 'Agrega un nuevo producto a tu inventario'
            }
            trigger={
              <Button className="button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            }
            size="md"
          >
            <div className="p-4 text-center text-muted-foreground">
              <div className="space-y-4">
                <div className="text-sm">
                  {productModal.isEditing ? 'Editando:' : 'Creando nuevo producto'}
                </div>
                {productModal.selectedItem && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <strong>Datos actuales:</strong>
                    <br />
                    Nombre: {productModal.selectedItem.name}
                    <br />
                    Precio: ${productModal.selectedItem.price}
                    <br />
                    Descripción: {productModal.selectedItem.description}
                  </div>
                )}
                <div className="text-muted-foreground">Formulario de producto próximamente...</div>
              </div>
            </div>
          </FormModal>
        }
      />

      <DataTable
        data={filteredProducts}
        columns={columns}
        actions={actions}
        loading={isLoading}
        emptyState={{
          icon: <Package className="h-12 w-12" />,
          title: searchTerm ? 'No se encontraron productos' : 'Sin productos',
          description: searchTerm
            ? 'Intenta con otros términos de búsqueda'
            : 'Comienza agregando tu primer producto',
          action: !searchTerm ? (
            <Button onClick={() => productModal.open()} className="button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          ) : undefined,
        }}
      />

      {confirmation.confirmationProps && <ConfirmationModal {...confirmation.confirmationProps} />}
    </div>
  );
}
