'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EQUIPMENT_MAX_ITEMS, EQUIPMENT_NAME_MAX } from '../lib/workout'
import { Checkbox } from './ui/checkbox'

interface StepEquipmentProps {
  selected: string[]
  added: string[]
  onToggle: (item: string) => void
  onAdd: (item: string) => void
  onRemove: (item: string) => void
}

export const StepEquipment = ({
  selected,
  added,
  onToggle,
  onAdd,
  onRemove,
}: StepEquipmentProps) => {
  const { equipment } = useApp()
  const [draft, setDraft] = useState('')
  // Only the list that arrives with the step is staggered; items added by hand appear at once.
  const [staggerUpTo] = useState(equipment.length)
  const inputRef = useRef<HTMLInputElement>(null)
  const canAdd = equipment.length < EQUIPMENT_MAX_ITEMS

  // Typing anywhere on the step goes into the add field. Focusing it on keydown lets the browser
  // deliver the same keystroke to the field, so the first letter is not lost.
  useEffect(() => {
    if (!canAdd) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.length !== 1 || event.key === ' ') return
      const target = event.target as HTMLElement
      if (target.isContentEditable || target.closest('input, textarea, select, [role="dialog"]')) {
        return
      }
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canAdd])

  const commitDraft = () => {
    const value = draft.trim()
    if (value) onAdd(value)
    setDraft('')
  }

  // The bottom mask fades whatever runs under the actions. It masks the content itself, so it
  // leaves no trace when the list is short, and lg:pb-16 matches it so the last row clears the
  // fade at the end of the scroll. The 4px inset on the top and left, cancelled by the negative
  // margin, keeps the scroll container from clipping the focus rings of the first row and column.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:-mt-1 lg:-ml-1 lg:h-full lg:content-start lg:overflow-y-auto lg:mask-b-from-[calc(100%-4rem)] lg:pt-1 lg:pr-2 lg:pb-16 lg:pl-1">
      {canAdd && (
        <div className="flex h-10 items-center gap-3 rounded-lg border border-transparent bg-white/[0.03] pr-2 pl-3 transition-[background-color,border-color,box-shadow] focus-within:border-accent focus-within:bg-ink focus-within:ring-2 focus-within:ring-ring hover:bg-white/[0.08] focus-within:hover:bg-ink motion-reduce:transition-none">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-selected/80 text-chalk"
          >
            <Plus className="size-4" />
          </span>
          <input
            ref={inputRef}
            aria-label="Add missing item"
            maxLength={EQUIPMENT_NAME_MAX}
            enterKeyHint="done"
            value={draft}
            placeholder="Add missing item"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commitDraft()
              }
              if (event.key === 'Escape') setDraft('')
            }}
            className="w-full min-w-0 bg-transparent text-base leading-5 text-chalk outline-none placeholder:text-chalk focus:placeholder:text-muted-foreground/80"
          />
        </div>
      )}

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
              title={item}
              className="min-w-0 flex-1 cursor-pointer truncate text-base leading-5 text-chalk capitalize data-[muted=true]:text-muted-foreground"
              data-muted={!checked}
            >
              {item}
            </label>
            {added.includes(item) && (
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onRemove(item)}
                className="touch-target relative flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[color,background-color,opacity] outline-none group-hover:opacity-100 hover:bg-white/10 hover:text-chalk focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none pointer-coarse:size-9 [@media(hover:none)]:opacity-100"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
