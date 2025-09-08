import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AlertProvider } from '@/hooks/useAlert';

const Home = lazy(() => import('../components/home/Home').then(module => ({ default: module.Home })));
const PersonDetails = lazy(() => import('../components/person-details/PersonDetails'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AlertProvider>
        <Layout>
            <Home />
        </Layout>
      </AlertProvider>
    ),
  },
  {
    path: "/detalhes-pessoa/:id",
    element: (
      <AlertProvider>
        <Layout>
            <PersonDetails />
        </Layout>
      </AlertProvider>
    ),
  },
]);

export { RouterProvider, router };