import { lazy, Suspense, type JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { HomePage } from '@/features/home/HomePage';
import { Loading } from '@/shared/components/Loading';
import { RouteErrorPage } from '@/shared/pages/RouteErrorPage';
import { PetDetailsPage } from '@/features/pets/PetDetailsPage';
import { TutoresDetailsPage } from '@/features/tutores/TutoresDetailsPage';

const PetsPage = lazy(() => import('@/features/pets/PetsPage').then(module => ({ default: module.PetsPage })));
const TutoresPage = lazy(() => import('@/features/tutores/TutoresPage').then(module => ({ default: module.TutoresPage })));

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'pets', element: withSuspense(<PetsPage />), errorElement: <RouteErrorPage /> },
      { path: 'pets/:id', element: <PetDetailsPage />, errorElement: <RouteErrorPage /> },
      { path: 'tutores', element: withSuspense(<TutoresPage />), errorElement: <RouteErrorPage /> },
      { path: 'tutores/:id', element: <TutoresDetailsPage />, errorElement: <RouteErrorPage /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
