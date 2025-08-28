import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}