import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Routes } from './routes'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  </StrictMode>,
)
