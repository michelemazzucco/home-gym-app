import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-ui text-base font-medium outline-none transition-[color,background-color,box-shadow,translate] focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white shadow-raised hover:bg-accent-hover',
        secondary:
          'border border-border bg-ink text-white shadow-raised hover:border-white/40 hover:bg-white/5',
        ghost: 'text-chalk hover:bg-white/10',
        icon: 'border border-border bg-ink text-chalk shadow-raised hover:border-white/40 hover:bg-white/5',
      },
      size: {
        default: 'h-[41px] px-6 py-2',
        sm: 'h-9 px-4',
        icon: 'size-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
