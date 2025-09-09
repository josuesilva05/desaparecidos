import React, { Suspense } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
};
