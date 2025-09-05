import type { Metadata } from 'next'
import { AppProvider } from './context/AppContext'
import { Barlow_Condensed } from 'next/font/google'

import './global.css'

export const metadata: Metadata = {
  title: 'HOMEGYM',
  description: 'Workouts based on what there is around you',
}

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  variable: '--font-barlow-condensed',
  style: ['normal', 'italic'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#030D2E" />
      </head>
      <body className={barlowCondensed.variable}>
        <AppProvider>
          <div className="root">{children}</div>
        </AppProvider>
      </body>
    </html>
  )
}
