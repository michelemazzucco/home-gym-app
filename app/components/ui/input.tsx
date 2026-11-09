import * as React from 'react'

import { cn } from '@/app/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-ink px-3 text-base leading-5 text-chalk shadow-field transition-colors outline-none motion-reduce:transition-none',
        'placeholder:text-muted-foreground/80',
        'hover:border-border-strong focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        className
      )}
      {...props}
    />
  )
}

export { Input }
