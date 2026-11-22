import type { Metadata } from 'next'
import { Bricolage_Grotesque, Caveat, Public_Sans } from 'next/font/google'
import PlausibleProvider from 'next-plausible'
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

const caveat = Caveat({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-caveat',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${publicSans.variable} ${caveat.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#130225" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <PlausibleProvider domain="michelemazzucco.it">
          <AppProvider>{children}</AppProvider>
          <Toaster />
        </PlausibleProvider>
      </body>
    </html>
  )
}
