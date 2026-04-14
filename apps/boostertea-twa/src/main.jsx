import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { CartProvider } from './components/CartStore.jsx'
import { CartOverlay } from './components/CartOverlay.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <Router />
        <CartOverlay />
      </CartProvider>
    </ErrorBoundary>
  </StrictMode>,
)
