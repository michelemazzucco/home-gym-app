'use client'

import { useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Label } from './ui/label'

interface NumberFieldProps {
  label: string
  value: number
  min: number
  max: number
  /** Shown after the number inside the field, e.g. "weeks". */
  unit?: string
  onChange: (value: number) => void
  className?: string
}

export const NumberField = ({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  className,
}: NumberFieldProps) => {
  const id = useId()
  // What the user is typing. It is only clamped on blur, so a first digit below `min` (the "1" of
  // "10" when the minimum is 4) is not snapped up before the second digit lands.
  const [draft, setDraft] = useState<string | null>(null)
  const commit = (next: number) => onChange(Math.max(min, Math.min(max, Math.round(next))))

  const settleDraft = () => {
    if (draft === null) return
    const next = Number(draft)
    commit(draft.trim() === '' || !Number.isFinite(next) ? value : next)
    setDraft(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex h-10 items-center rounded-lg border border-border bg-ink pr-1 pl-3 shadow-field transition-colors focus-within:border-accent hover:border-border-strong motion-reduce:transition-none">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={draft ?? value}
          min={min}
          max={max}
          onChange={(event) => {
            const text = event.target.value
            setDraft(text)
            const next = Number(text)
            if (text !== '' && Number.isInteger(next) && next >= min && next <= max) onChange(next)
          }}
          onBlur={settleDraft}
          onKeyDown={(event) => {
            if (event.key === 'Enter') settleDraft()
          }}
          className={cn(
            'min-w-0 bg-transparent text-base leading-5 text-chalk tabular-nums outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            // With a unit, the input hugs its digits so the unit sits right after the number.
            unit
              ? '[field-sizing:content] w-[2.5ch] supports-[field-sizing:content]:w-auto'
              : 'w-full'
          )}
        />
        {unit && (
          <label
            htmlFor={id}
            className="flex flex-1 cursor-text items-center self-stretch pl-1.5 text-base leading-5 text-muted-foreground"
          >
            {unit}
          </label>
        )}
        <div className="flex shrink-0 items-center gap-1">
          <StepButton
            label={`Decrease ${label}`}
            disabled={value <= min}
            onClick={() => {
              setDraft(null)
              commit(value - 1)
            }}
          >
            <Minus className="size-3.5" />
          </StepButton>
          <StepButton
            label={`Increase ${label}`}
            disabled={value >= max}
            onClick={() => {
              setDraft(null)
              commit(value + 1)
            }}
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
    className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,scale] outline-none hover:bg-white/10 hover:text-chalk focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none pointer-coarse:size-9"
  >
    {children}
  </button>
)
