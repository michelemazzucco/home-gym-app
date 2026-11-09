import type { Ref } from 'react'
import { cn } from '../lib/utils'

interface StepHeadingProps {
  title: string
  description: string
  className?: string
  ref?: Ref<HTMLHeadingElement>
}

export const StepHeading = ({ title, description, className, ref }: StepHeadingProps) => (
  <div className="space-y-3">
    <h2
      ref={ref}
      tabIndex={-1}
      className="font-display text-[28px] leading-[34px] font-normal text-chalk outline-none"
    >
      {title}
    </h2>
    <p className={cn('text-base leading-[1.4] text-muted-foreground', className)}>{description}</p>
  </div>
)
