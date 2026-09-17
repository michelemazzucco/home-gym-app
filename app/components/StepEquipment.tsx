'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Checkbox } from './ui/checkbox'

interface StepEquipmentProps {
  selected: string[]
  onToggle: (item: string) => void
  onAdd: (item: string) => void
  onRemove: (item: string) => void
}

export const StepEquipment = ({ selected, onToggle, onAdd, onRemove }: StepEquipmentProps) => {
  const { equipment } = useApp()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  // Only the list that arrives with the step is staggered; items added by hand appear at once.
  const [staggerUpTo] = useState(equipment.length)

  const commitDraft = () => {
    const value = draft.trim()
    if (value) onAdd(value)
    setDraft('')
    setAdding(false)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="font-display text-[28px] leading-[34px] font-normal text-chalk">
          Validate and add equipment
        </h2>
        <p className="max-w-[38ch] text-base leading-[1.4] text-muted-foreground">
          {equipment.length > 0
            ? 'Untick anything the app got wrong, and add what it missed.'
            : 'Nothing was found in the photo. Add your equipment by hand, or continue with bodyweight only.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {equipment.map((item, index) => {
          const checked = selected.includes(item)
          return (
            <div
              key={item}
              style={{
                animationDelay: index < staggerUpTo ? `${Math.min(index, 8) * 35}ms` : '0ms',
              }}
              className="group flex h-10 animate-rise items-center gap-3 rounded-lg border border-border bg-ink pr-2 pl-3 shadow-field motion-reduce:animate-none"
            >
              <Checkbox
                id={`equipment-${item}`}
                checked={checked}
                onCheckedChange={() => onToggle(item)}
              />
              <label
                htmlFor={`equipment-${item}`}
                className="min-w-0 flex-1 cursor-pointer truncate text-base leading-5 text-chalk capitalize data-[muted=true]:text-muted-foreground"
                data-muted={!checked}
              >
                {item}
              </label>
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onRemove(item)}
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[color,background-color,opacity] group-hover:opacity-100 hover:bg-white/10 hover:text-chalk focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}

        {adding ? (
          <div className="flex h-10 animate-pop items-center rounded-lg border border-accent bg-ink px-3 shadow-field motion-reduce:animate-none">
            <input
              autoFocus
              value={draft}
              placeholder="Kettlebell, resistance band..."
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitDraft()
                if (event.key === 'Escape') {
                  setDraft('')
                  setAdding(false)
                }
              }}
              className="w-full bg-transparent text-base leading-5 text-chalk outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-10 items-center gap-3 rounded-lg bg-white/[0.03] pr-2 pl-3 text-base leading-5 text-chalk transition-colors hover:bg-white/[0.08] motion-reduce:transition-none"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#423551]/80">
              <Plus className="size-4" />
            </span>
            Add missing item
          </button>
        )}
      </div>
    </div>
  )
}
