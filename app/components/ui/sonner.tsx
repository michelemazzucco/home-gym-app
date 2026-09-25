'use client'

import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="dark"
    position="top-center"
    style={
      {
        '--normal-bg': 'var(--color-popover)',
        '--normal-text': 'var(--color-chalk)',
        '--normal-border': 'var(--color-border)',
        '--border-radius': 'var(--radius-lg)',
        '--width': '440px',
      } as CSSProperties
    }
    toastOptions={{
      className: 'font-display text-base shadow-raised',
      classNames: {
        description: 'text-muted-foreground!',
      },
    }}
    {...props}
  />
)

export { Toaster }
