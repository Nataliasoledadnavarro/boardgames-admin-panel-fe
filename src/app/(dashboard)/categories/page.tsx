'use client';

import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks';
import { useModal } from '@/hooks/use-modal';
import { PageHeader, createCountBadge } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { ControlsBar } from '@/components/ui/controls-bar';
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal';
import { FormModal } from '@/components/ui/form-modal';
import { ErrorState } from '@/components/ui/error-state';
import { DataTable, DataTableColumn, DataTableAction } from '@/components/ui/data-table';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Category } from '@/types';
import { formatTableDate } from '@/lib/utils/date';

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
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Definir columnas de la tabla
  const columns: DataTableColumn<Category>[] = [
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
      key: 'createdAt',
      title: 'Creada',
      render: value => <span className="text-muted-foreground">{formatTableDate(value)}</span>,
    },
    {
      key: 'updatedAt',
      title: 'Actualizada',
      render: value => <span className="text-muted-foreground">{formatTableDate(value)}</span>,
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
      disabled: category => {
        return (
          deleteCategory.isPending ||
          category.name === 'General' ||
          (category.productCount ?? 0) > 0
        );
      },
    },
  ];

  // ErrorState reutilizable con retry
  if (error) {
    return (
      <ErrorState
        title="Error al cargar categorías"
        description="No se pudieron obtener las categorías. Verifica tu conexión e inténtalo de nuevo."
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
        icon={<FolderOpen className="h-6 w-6 text-white" />}
        title="Gestión de Categorías"
        description="Organiza y administra las categorías de productos"
        badge={createCountBadge(categories.length, 'categoría')}
      />

      {/* ControlsBar con FormModal reutilizable */}
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
          <FormModal
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
            size="sm"
          >
            {/* Aquí irá el formulario */}
            <div className="p-4 text-center text-muted-foreground">
              <div className="space-y-4">
                <div className="text-sm">
                  {categoryModal.isEditing ? 'Editando:' : 'Creando nueva categoría'}
                </div>
                {categoryModal.selectedItem && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <strong>Datos actuales:</strong>
                    <br />
                    Nombre: {categoryModal.selectedItem.name}
                    <br />
                    Descripción: {categoryModal.selectedItem.description}
                  </div>
                )}
                <div className="text-muted-foreground">Formulario de categoría próximamente...</div>
              </div>
            </div>
          </FormModal>
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
          title: searchTerm ? 'No se encontraron categorías' : 'Sin categorías',
          description: searchTerm
            ? 'Intenta con otros términos de búsqueda'
            : 'Comenza creando tu primera categoría',
          action: !searchTerm ? (
            <Button onClick={() => categoryModal.open()} className="button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          ) : undefined,
        }}
      />

      {/* Modal de confirmación */}
      {confirmation.confirmationProps && <ConfirmationModal {...confirmation.confirmationProps} />}
    </div>
  );
}
