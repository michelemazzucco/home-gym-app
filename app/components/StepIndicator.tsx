'use client'

import { Fragment } from 'react'
import { cn } from '@/app/lib/utils'
import type { Step } from '../context/AppContext'

const STEPS: Step[] = [1, 2, 3]

interface StepIndicatorProps {
  current: Step
  onSelect?: (step: Step) => void
}

export const StepIndicator = ({ current, onSelect }: StepIndicatorProps) => (
  <ol className="flex items-center" aria-label="Progress">
    {STEPS.map((step, index) => {
      const done = step <= current
      const reachable = step < current && Boolean(onSelect)

      return (
        <Fragment key={step}>
          {index > 0 && <li aria-hidden="true" className="mx-3 h-px w-[27px] bg-white/20" />}
          <li>
            <button
              type="button"
              disabled={!reachable}
              onClick={reachable ? () => onSelect?.(step) : undefined}
              aria-current={step === current ? 'step' : undefined}
              aria-label={`Step ${step}`}
              className={cn(
                'flex size-[35px] items-center justify-center rounded-full font-display text-base leading-5 text-white transition-colors',
                done ? 'bg-accent' : 'bg-white/10 text-white/60',
                reachable ? 'cursor-pointer hover:bg-accent-hover' : 'cursor-default'
              )}
            >
              {step}
            </button>
          </li>
        </Fragment>
      )
    })}
  </ol>
)
