import type { Metadata } from 'next'
import { Bricolage_Grotesque, Delicious_Handrawn, Public_Sans } from 'next/font/google'
import { AppProvider } from './context/AppContext'
import { Toaster } from './components/ui/sonner'

import './globals.css'

const title = 'Homegym'

export const metadata: Metadata = {
  title,
  description: "Workouts based on what's around you",
}

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-bricolage',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-public-sans',
})

const handrawn = Delicious_Handrawn({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-handrawn',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${publicSans.variable} ${handrawn.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#130225" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  )
}
