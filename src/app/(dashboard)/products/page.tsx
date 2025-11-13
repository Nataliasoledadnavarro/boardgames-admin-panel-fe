'use client';

import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { useModal } from '@/hooks/use-modal';
import { PageHeader, createCountBadge } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { ControlsBar } from '@/components/layout/controls-bar';
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal';
import { Modal } from '@/components/ui/modal';
import { ErrorState } from '@/components/ui/error-state';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumn, DataTableAction } from '@/types/data-table';
import { ProductDetailModal } from './product-detail-modal';
import { ProductForm } from './product-form';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { formatTableDate } from '@/lib/utils/date';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const productModal = useModal<Product>();
  const detailModal = useModal<Product>();
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

  const handleViewDetails = (product: Product) => {
    detailModal.openWith(product);
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Nombre',
      render: value => <span className="font-medium">{String(value)}</span>,
    },
    {
      key: 'description',
      title: 'Descripción',
      className: 'max-w-md',
      render: value => <span className="truncate block">{String(value)}</span>,
    },
    {
      key: 'price',
      title: 'Precio',
      align: 'right',
      render: value => {
        const price = typeof value === 'number' ? value : Number(value) || 0;
        return <span className="font-mono font-semibold text-green-600">${price.toFixed(2)}</span>;
      },
    },
    {
      key: 'createdAt',
      title: 'Creado',
      render: value => {
        const date = value instanceof Date ? value : new Date(value as string);
        return <span className="text-muted-foreground">{formatTableDate(date.toISOString())}</span>;
      },
    },
  ];

  const actions: DataTableAction<Product>[] = [
    {
      label: 'Ver detalles',
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetails,
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
      <div className="space-y-6">
        <PageHeader
          icon={<Package className="h-6 w-6 text-white" />}
          title="Gestión de Productos"
          description="Administra tu inventario de productos"
          badge={createCountBadge(0, 'producto')}
        />

        <ErrorState
          title="Error al cargar productos"
          description="No se pudieron obtener los productos desde el servidor. Verifica tu conexión e inténtalo de nuevo."
          error={error}
          icon={<Package className="h-8 w-8" />}
          onRetry={() => refetch()}
          showRetry={true}
          showGoHome={true}
          variant="default"
          actions={
            <Button onClick={() => window.location.reload()} variant="outline" className="ml-2">
              Recargar página
            </Button>
          }
        />
      </div>
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
          <Modal
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
            <div className="space-y-4">
              <ProductForm
                product={productModal.selectedItem}
                onClose={() => productModal.close()}
                onSuccess={() => refetch()}
              />
            </div>
          </Modal>
        }
      />

      <DataTable
        data={filteredProducts}
        columns={columns}
        actions={actions}
        loading={isLoading}
        emptyState={{
          icon: <Package className="h-12 w-12" />,
          title: searchTerm ? 'No se encontraron productos' : 'Sin productos registrados',
          description: searchTerm
            ? `No hay productos que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
            : 'Comienza agregando tu primer juego de mesa al inventario.',
          action: !searchTerm ? (
            <Button onClick={() => productModal.open()} className="button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear primer producto
            </Button>
          ) : (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Limpiar búsqueda
            </Button>
          ),
        }}
      />

      <ProductDetailModal
        product={detailModal.selectedItem}
        isOpen={detailModal.isOpen}
        onClose={() => detailModal.close()}
      />

      {confirmation.confirmationProps && <ConfirmationModal {...confirmation.confirmationProps} />}
    </div>
  );
}
