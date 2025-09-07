import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, router } from './routes/routes.tsx'
import { ThemeProvider } from './components/providers/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <RouterProvider router={router} />
  </ThemeProvider>
)
