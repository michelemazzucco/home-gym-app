import { useSyncExternalStore } from 'react'
import type { WorkoutBlock } from './workout'

const STORAGE_KEY = 'homegym-workout-result:v2'

export interface StoredResult {
  equipment: string[]
  plan: WorkoutBlock[] | null
}

const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedValue: StoredResult | null = null

const isPlan = (value: unknown): value is WorkoutBlock[] =>
  Array.isArray(value) &&
  value.every(
    (block) =>
      Array.isArray(block?.sessions) &&
      block.sessions.every((session: unknown) =>
        Array.isArray((session as { exercizes?: unknown })?.exercizes)
      )
  )

const isStoredResult = (value: unknown): value is StoredResult => {
  const candidate = value as StoredResult | null
  return Array.isArray(candidate?.equipment) && (candidate.plan === null || isPlan(candidate.plan))
}

const readRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export const getSnapshot = (): StoredResult | null => {
  const raw = readRaw()

  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      const parsed = raw ? (JSON.parse(raw) as StoredResult) : null
      cachedValue = isStoredResult(parsed) ? parsed : null
    } catch {
      cachedValue = null
    }
  }

  return cachedValue
}

export const getServerSnapshot = (): StoredResult | null => null

const subscribeToNothing = () => () => {}

/**
 * False on the server and during hydration, true afterwards. The stored plan is only known on the
 * client, so anything that depends on it waits for this to avoid rendering step 1 and then step 3.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )

export const save = (result: StoredResult | null) => {
  try {
    if (result) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {}

  listeners.forEach((listener) => listener())
}
