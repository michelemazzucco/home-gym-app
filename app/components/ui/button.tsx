import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-ui text-base font-medium outline-none transition-[color,background-color,box-shadow,translate] duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
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
        // An icon reads lighter than a word, so the side it sits on gets less padding.
        default: 'h-[41px] px-6 py-2 has-[>svg:first-child]:pl-4 has-[>svg:last-child]:pr-4',
        sm: 'h-9 px-4 has-[>svg:first-child]:pl-3 has-[>svg:last-child]:pr-3',
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
  children,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  // The icon-side padding below leans on :first-child / :last-child, which skip text nodes,
  // so a bare label is wrapped to keep the icon's real position visible to CSS.
  const content = asChild
    ? children
    : React.Children.toArray(children).map((child, index) =>
        typeof child === 'string' || typeof child === 'number' ? (
          <span key={index}>{child}</span>
        ) : (
          child
        )
      )

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
