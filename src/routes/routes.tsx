import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from '@/components/layout/Layout';

// Lazy loading das páginas
const Home = lazy(() => import('../pages/Home/Home').then(module => ({ default: module.Home })));
const PersonDetails = lazy(() => import('../pages/PersonDetails/PersonDetails'));

const LoadingSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-96 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<LoadingSkeleton />}>
          <Home />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/person/:id",
    element: (
      <Layout>
        <Suspense fallback={<div className="container mx-auto p-6"><Skeleton className="h-screen w-full rounded-lg" /></div>}>
          <PersonDetails />
        </Suspense>
      </Layout>
    ),
  },
]);

export { RouterProvider, router };