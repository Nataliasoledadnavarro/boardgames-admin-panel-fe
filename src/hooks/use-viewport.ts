'use client';

import { useEffect } from 'react';
import { useSidebar } from '@/store/sidebar-store';

export function useViewport() {
  const { setCollapsed } = useSidebar();

  useEffect(() => {
    const checkViewport = () => {
      const shouldCollapse = window.innerWidth < 1024; // lg breakpoint
      setCollapsed(shouldCollapse);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => window.removeEventListener('resize', checkViewport);
  }, [setCollapsed]);
}
