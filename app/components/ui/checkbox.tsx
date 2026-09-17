'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/app/lib/utils'

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-ink shadow-field transition-colors outline-none motion-reduce:transition-none',
        'hover:border-white/40 focus-visible:ring-2 focus-visible:ring-ring/50',
        'data-[state=checked]:border-transparent data-[state=checked]:bg-[#423551]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex animate-pop items-center justify-center text-white motion-reduce:animate-none"
      >
        <CheckIcon className="size-4" strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
