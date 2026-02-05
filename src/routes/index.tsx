import { lazy, Suspense, type JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { HomePage } from '@/features/home/HomePage';
import { LoginPage } from '@/features/auth/LoginPage';
import { Loading } from '@/shared/components/Loading';
import { RouteErrorPage } from '@/shared/pages/RouteErrorPage';
import { PetDetailsPage } from '@/features/pets/PetDetailsPage';
import { PetFormPage } from '@/features/pets/PetFormPage';
import { TutoresDetailsPage } from '@/features/tutores/TutoresDetailsPage';

const PetsPage = lazy(() => import('@/features/pets/PetsPage').then(module => ({ default: module.PetsPage })));
const TutoresPage = lazy(() => import('@/features/tutores/TutoresPage').then(module => ({ default: module.TutoresPage })));

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<Loading />}>{element}</Suspense>
);

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorPage /> },
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'pets', element: <ProtectedRoute element={withSuspense(<PetsPage />)} />, errorElement: <RouteErrorPage /> },
      { path: 'pets/new', element: <ProtectedRoute element={<PetFormPage />} />, errorElement: <RouteErrorPage /> },
      { path: 'pets/:id', element: <ProtectedRoute element={<PetDetailsPage />} />, errorElement: <RouteErrorPage /> },
      { path: 'pets/:id/edit', element: <ProtectedRoute element={<PetFormPage />} />, errorElement: <RouteErrorPage /> },
      { path: 'tutores', element: <ProtectedRoute element={withSuspense(<TutoresPage />)} />, errorElement: <RouteErrorPage /> },
      { path: 'tutores/:id', element: <ProtectedRoute element={<TutoresDetailsPage />} />, errorElement: <RouteErrorPage /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
