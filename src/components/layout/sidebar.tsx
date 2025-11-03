'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/sidebar-store';
import { useViewport } from '@/hooks/use-viewport';
import {
  Package,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Dices,
} from 'lucide-react';

const navigation = [
  {
    name: 'Inicio',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Productos',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Categorías',
    href: '/categories',
    icon: FolderOpen,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  useViewport();

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full glass-sidebar flex flex-col">
        {/* Header del sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border/30 px-4">
          {!isCollapsed ? (
            // Modo expandido: Icono + Texto a la izquierda
            <div className="flex items-center space-x-2">
              <Dices className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl text-gradient-primary">Juegos Admin</h1>
            </div>
          ) : (
            <div className="p-2 gradient-primary rounded-lg flex items-center justify-center">
              <Dices className="h-5 w-5 text-white" />
            </div>
          )}

          {/* Botón siempre a la derecha */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors flex-shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map(item => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    'relative overflow-hidden',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0 transition-colors',
                      isCollapsed ? 'mx-auto' : 'mr-3',
                      isActive
                        ? 'text-blue-600'
                        : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="truncate transition-all duration-200">{item.name}</span>
                  )}
                </Link>

                {/* Tooltip para modo colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-sidebar-accent text-sidebar-accent-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-sidebar-border/20">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border/30 p-2">
          <div className="relative">
            <button className="group flex w-full items-center px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-all duration-200">
              <LogOut
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors',
                  isCollapsed ? 'mx-auto' : 'mr-3'
                )}
              />

              {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
            </button>

            {/* Tooltip para cerrar sesión */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-red-500/20 text-red-600 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-red-500/20">
                Cerrar Sesión
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
