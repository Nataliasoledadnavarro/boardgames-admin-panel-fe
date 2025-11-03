'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useSidebar } from '@/store/sidebar-store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-page-light dark:bg-page-dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area con margen dinámico */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out',
          isCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
