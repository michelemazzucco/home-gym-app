import { cn } from '../lib/utils'

interface StepHeadingProps {
  title: string
  description: string
  className?: string
}

export const StepHeading = ({ title, description, className }: StepHeadingProps) => (
  <div className="space-y-3">
    <h2 className="font-display text-[28px] leading-[34px] font-normal text-chalk">{title}</h2>
    <p className={cn('text-base leading-[1.4] text-muted-foreground', className)}>{description}</p>
  </div>
)
