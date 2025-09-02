import type { Metadata } from 'next'
import { AppProvider } from './context/AppContext'

export const metadata: Metadata = {
  title: 'Home Gym App',
  description: 'Get workouts based on your equipment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}