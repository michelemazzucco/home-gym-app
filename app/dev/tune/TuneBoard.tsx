'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/app/components/ui/button'
import { ExamplePhotoNudge, SiteHeader, UploadHint } from '@/app/components'

type Control = {
  id: string
  label: string
  selector: string
  property: 'font-size' | 'line-height' | 'margin-top' | 'rotate'
  min: number
  max: number
  step: number
}

const CONTROLS: Control[] = [
  {
    id: 'wordmark',
    label: 'Homegym size',
    selector: '[data-tune=header] h1',
    property: 'font-size',
    min: 28,
    max: 80,
    step: 1,
  },
  {
    id: 'claim',
    label: 'Claim size',
    selector: '[data-tune=header] p',
    property: 'font-size',
    min: 16,
    max: 48,
    step: 1,
  },
  {
    id: 'claim-leading',
    label: 'Claim line height',
    selector: '[data-tune=header] p',
    property: 'line-height',
    min: 16,
    max: 56,
    step: 1,
  },
  {
    id: 'claim-gap',
    label: 'Gap under Homegym',
    selector: '[data-tune=header] p',
    property: 'margin-top',
    min: 0,
    max: 32,
    step: 1,
  },
  {
    id: 'upload',
    label: 'Upload here size',
    selector: '[data-tune=upload] span',
    property: 'font-size',
    min: 16,
    max: 48,
    step: 1,
  },
  {
    id: 'upload-turn',
    label: 'Upload here turn',
    selector: '[data-tune=upload] span',
    property: 'rotate',
    min: -30,
    max: 30,
    step: 1,
  },
  {
    id: 'nudge',
    label: 'Nudge size',
    selector: '[data-tune=nudge] p',
    property: 'font-size',
    min: 14,
    max: 36,
    step: 1,
  },
  {
    id: 'nudge-leading',
    label: 'Nudge line height',
    selector: '[data-tune=nudge] p',
    property: 'line-height',
    min: 14,
    max: 48,
    step: 1,
  },
]

const UNIT = { 'font-size': 'px', 'line-height': 'px', 'margin-top': 'px', rotate: 'deg' } as const
const CLASS = {
  'font-size': 'text',
  'line-height': 'leading',
  'margin-top': 'mt',
  rotate: 'rotate',
} as const

const toClass = ({ property }: Control, value: number, prefix: string) => {
  const sign = value < 0 ? '-' : ''
  return `${prefix}${sign}${CLASS[property]}-[${Math.abs(value)}${UNIT[property]}]`
}

/** Sliders over the real header, upload hint and nudge. They print the Tailwind classes to paste
    for the breakpoint the window is at, so resize the window to tune the other one. */
export const TuneBoard = () => {
  const root = useRef<HTMLDivElement>(null)
  const [initial, setInitial] = useState<Record<string, number>>({})
  const [values, setValues] = useState<Record<string, number>>({})
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)')
    const readValues = () => {
      const read: Record<string, number> = {}
      for (const control of CONTROLS) {
        const element = root.current?.querySelector(control.selector)
        if (!element) continue
        const raw = getComputedStyle(element).getPropertyValue(control.property)
        read[control.id] = Math.round(parseFloat(raw) || 0)
      }
      setInitial(read)
      setValues(read)
    }
    // The overrides must be gone before the computed styles are read, hence the clear and the
    // two frames in between.
    const update = () => {
      setWide(query.matches)
      setValues({})
      setInitial({})
      requestAnimationFrame(() => requestAnimationFrame(readValues))
    }
    const first = requestAnimationFrame(update)
    query.addEventListener('change', update)
    return () => {
      cancelAnimationFrame(first)
      query.removeEventListener('change', update)
    }
  }, [])

  const prefix = wide ? 'sm:' : ''
  const changed = CONTROLS.filter(
    (c) => values[c.id] !== undefined && values[c.id] !== initial[c.id]
  )
  const output = changed.map((c) => `${c.label}: ${toClass(c, values[c.id], prefix)}`).join('\n')
  const overrides = changed
    .map((c) => `${c.selector} { ${c.property}: ${values[c.id]}${UNIT[c.property]} !important; }`)
    .join('\n')

  return (
    <div
      ref={root}
      className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <style>{overrides}</style>

      <div className="space-y-16">
        <div data-tune="header">
          <SiteHeader />
        </div>
        <div className="relative lg:ml-48">
          <div data-tune="upload">
            <UploadHint />
          </div>
          <div
            data-tune="nudge"
            className="relative h-56 rounded-xl border border-dashed border-white/20"
          >
            <ExamplePhotoNudge onTry={() => toast('The nudge works.')} />
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-10 lg:self-start">
        <p className="text-sm text-muted-foreground">
          Tuning the {wide ? 'desktop (sm and up)' : 'mobile'} values. Resize the window for the
          other.
        </p>
        {CONTROLS.map((control) => (
          <label key={control.id} className="block space-y-1 text-sm">
            <span className="flex justify-between">
              {control.label}
              <span className="text-muted-foreground tabular-nums">
                {values[control.id] ?? '-'}
                {UNIT[control.property]}
              </span>
            </span>
            <input
              type="range"
              className="w-full cursor-pointer accent-accent"
              min={control.min}
              max={control.max}
              step={control.step}
              value={values[control.id] ?? 0}
              onChange={(event) =>
                setValues({ ...values, [control.id]: Number(event.target.value) })
              }
            />
          </label>
        ))}
        <pre className="min-h-16 rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
          {output || 'Move a slider to see the classes.'}
        </pre>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setValues(initial)}>
            Reset
          </Button>
          <Button
            className="flex-1"
            disabled={!output}
            onClick={async () => {
              await navigator.clipboard.writeText(output)
              toast('Classes copied.')
            }}
          >
            Copy classes
          </Button>
        </div>
      </aside>
    </div>
  )
}
