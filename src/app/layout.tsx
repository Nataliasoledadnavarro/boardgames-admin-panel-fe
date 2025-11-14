import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Panel - Juegos de Mesa',
  description: 'Panel de administración para e-commerce de juegos de mesa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
