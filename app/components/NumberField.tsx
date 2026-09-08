'use client'

import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Label } from './ui/label'

interface NumberFieldProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  className?: string
}

export const NumberField = ({ label, value, min, max, onChange, className }: NumberFieldProps) => {
  const id = useId()
  const commit = (next: number) => onChange(Math.max(min, Math.min(max, next)))

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex h-10 items-center rounded-lg border border-border bg-ink pr-1 pl-3 shadow-raised transition-colors focus-within:border-accent hover:border-white/40">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (Number.isFinite(next)) commit(next)
          }}
          className="w-full min-w-0 bg-transparent text-base leading-5 text-chalk outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <div className="flex shrink-0 items-center gap-1">
          <StepButton
            label={`Decrease ${label}`}
            disabled={value <= min}
            onClick={() => commit(value - 1)}
          >
            <Minus className="size-3.5" />
          </StepButton>
          <StepButton
            label={`Increase ${label}`}
            disabled={value >= max}
            onClick={() => commit(value + 1)}
          >
            <Plus className="size-3.5" />
          </StepButton>
        </div>
      </div>
    </div>
  )
}

const StepButton = ({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-chalk disabled:pointer-events-none disabled:opacity-30"
  >
    {children}
  </button>
)
