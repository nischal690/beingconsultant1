import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/firebase/auth-context'
import { ProductsProvider } from '@/context/products-context'
import { Toaster } from 'sonner'
import { StagewiseToolbar } from '@stagewise/toolbar-next'

export const metadata: Metadata = {
  title: 'Coaching Platform',
  description: 'Coaching platform for consultants',
  generator: 'v0.dev',
}

// Stagewise configuration
const stagewiseConfig = {
  plugins: []
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ProductsProvider>
            <AuthProvider>
            {children}
            <Toaster position="top-right" />
            {process.env.NODE_ENV === 'development' && <StagewiseToolbar config={stagewiseConfig} />}
          </AuthProvider>
          </ProductsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
