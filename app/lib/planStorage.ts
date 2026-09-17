import type { WorkoutBlock } from './workout'

const STORAGE_KEY = 'homegym-workout-result:v2'

export interface StoredResult {
  equipment: string[]
  plan: WorkoutBlock[] | null
}

const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedValue: StoredResult | null = null

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
      cachedValue = parsed && Array.isArray(parsed.equipment) ? parsed : null
    } catch {
      cachedValue = null
    }
  }

  return cachedValue
}

export const getServerSnapshot = (): StoredResult | null => null

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
