import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, router } from './routes/routes.tsx'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
