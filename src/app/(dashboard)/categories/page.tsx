'use client';

import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/use-categories';
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
import { CategoryForm } from './category-form';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Category } from '@/types';
import { formatTableDate } from '@/lib/utils';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categoryModal = useModal<Category>();
  const { data: categories = [], isLoading, error, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const confirmation = useConfirmation();

  const handleDelete = async (category: Category) => {
    confirmation.confirmDelete(
      category.name,
      async () => {
        try {
          await deleteCategory.mutateAsync(category.id);
          confirmation.closeConfirmation();
        } catch (error) {
          console.error('Error al eliminar categoría:', error);
        }
      },
      deleteCategory.isPending
    );
  };

  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Definir columnas de la tabla
  const columns: DataTableColumn<Category>[] = [
    {
      key: 'name',
      title: 'Nombre',
      render: value => <span className="font-medium">{String(value)}</span>,
    },
    {
      key: 'description',
      title: 'Descripción',
      className: 'max-w-md',
      render: value => <span className="truncate block">{String(value || '-')}</span>,
    },
    {
      key: 'createdAt',
      title: 'Creada',
      render: value => {
        return <span className="text-muted-foreground">{formatTableDate(value as string)}</span>;
      },
    },
    {
      key: 'updatedAt',
      title: 'Actualizada',
      render: value => {
        return <span className="text-muted-foreground">{formatTableDate(value as string)}</span>;
      },
    },
  ];

  const actions: DataTableAction<Category>[] = [
    {
      label: 'Editar categoría',
      icon: <Edit className="h-4 w-4" />,
      onClick: category => categoryModal.openWith(category),
      className: 'hover:bg-purple-500/10 hover:text-purple-600',
    },
    {
      label: 'Eliminar categoría',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      className: 'hover:bg-red-500/10 hover:text-red-600',
      disabled: () => deleteCategory.isPending,
    },
  ];

  // ErrorState
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          icon={<FolderOpen className="h-6 w-6 text-white" />}
          title="Gestión de Categorías"
          description="Organiza y administra las categorías de productos"
          badge={createCountBadge(0, 'categoría')}
        />

        <ErrorState
          title="Error al cargar categorías"
          description="No se pudieron obtener las categorías desde el servidor. Verifica tu conexión e inténtalo de nuevo."
          error={error}
          icon={<FolderOpen className="h-8 w-8" />}
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
        icon={<FolderOpen className="h-6 w-6 text-white" />}
        title="Gestión de Categorías"
        description="Organiza y administra las categorías de productos"
        badge={createCountBadge(categories.length, 'categoría')}
      />

      {/* ControlsBar */}
      <ControlsBar
        searchElement={
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar categorías..."
            className="flex-1 max-w-md"
          />
        }
        actions={
          <Modal
            isOpen={categoryModal.isOpen}
            onOpenChange={open => (open ? categoryModal.open() : categoryModal.close())}
            title={categoryModal.isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            description={
              categoryModal.isEditing
                ? 'Modifica los datos de la categoría'
                : 'Crea una nueva categoría para organizar tus productos'
            }
            trigger={
              <Button className="button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            }
            size="md"
          >
            <div className="space-y-4">
              <CategoryForm
                category={categoryModal.selectedItem}
                onClose={() => categoryModal.close()}
                onSuccess={() => refetch()}
              />
            </div>
          </Modal>
        }
      />

      {/* Tabla reutilizable */}
      <DataTable
        data={filteredCategories}
        columns={columns}
        actions={actions}
        loading={isLoading}
        emptyState={{
          icon: <FolderOpen className="h-12 w-12" />,
          title: searchTerm ? 'No se encontraron categorías' : 'Sin categorías registradas',
          description: searchTerm
            ? `No hay categorías que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
            : 'Comienza creando tu primera categoría para organizar mejor tus productos.',
          action: !searchTerm ? (
            <Button onClick={() => categoryModal.open()} className="button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Crear categoría
            </Button>
          ) : (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Limpiar búsqueda
            </Button>
          ),
        }}
      />

      {/* Modal de confirmación */}
      {confirmation.confirmationProps && <ConfirmationModal {...confirmation.confirmationProps} />}
    </div>
  );
}
