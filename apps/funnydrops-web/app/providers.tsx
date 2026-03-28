'use client'

import { Router } from 'wouter'
import { StoreProvider } from '@/src/web/lib/store'
import { AuthProvider } from '@/src/web/lib/auth'
import { I18nProvider } from '@/src/web/lib/i18n'
import { ThemeProvider } from '@/src/web/lib/theme'
import { Provider } from '@/src/web/components/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Router>
      <Provider>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <StoreProvider>
                {children}
              </StoreProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </Provider>
    </Router>
  )
}
