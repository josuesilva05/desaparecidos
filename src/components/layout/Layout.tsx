import React, { Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div>Carregando...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};