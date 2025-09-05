'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

interface Exercize {
  name: string
  sets: string
  reps: string
  rest: string
}

interface Session {
  title: string
  exercizes: Exercize[]
}

export interface WorkoutBlock {
  title: string
  sessions: Session[]
}

interface WorkoutResult {
  equipment: string[]
  plan: WorkoutBlock[]
}

interface AppState {
  selectedImage: File | null
  difficulty: DifficultyLevel
  sessionsPerWeek: number
  weeks: number
  loading: boolean
  workoutResult: WorkoutResult | null
}

interface AppContextType {
  state: AppState
  setSelectedImage: (image: File | null) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setSessionsPerWeek: (sessions: number) => void
  setWeeks: (weeks: number) => void
  setLoading: (loading: boolean) => void
  setWorkoutResult: (result: WorkoutResult | null) => void
  resetState: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY = 'homegym-workout-result'

// Helper functions for localStorage
const saveToStorage = (workoutResult: WorkoutResult | null) => {
  if (typeof window !== 'undefined') {
    if (workoutResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutResult))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

const loadFromStorage = (): WorkoutResult | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }
  return null
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    selectedImage: null,
    difficulty: 'beginner',
    sessionsPerWeek: 3,
    weeks: 12,
    loading: false,
    workoutResult: null,
  })

  // Load workout result from localStorage on mount
  useEffect(() => {
    const storedResult = loadFromStorage()
    if (storedResult) {
      setState((prev) => ({ ...prev, workoutResult: storedResult }))
    }
  }, [])

  const setSelectedImage = (image: File | null) => {
    setState((prev) => ({ ...prev, selectedImage: image }))
  }

  const setDifficulty = (difficulty: DifficultyLevel) => {
    setState((prev) => ({ ...prev, difficulty }))
  }

  const setSessionsPerWeek = (sessions: number) => {
    setState((prev) => ({ ...prev, sessionsPerWeek: sessions }))
  }

  const setWeeks = (weeks: number) => {
    setState((prev) => ({ ...prev, weeks }))
  }

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }

  const setWorkoutResult = (result: WorkoutResult | null) => {
    setState((prev) => ({ ...prev, workoutResult: result }))
    saveToStorage(result)
  }

  const resetState = () => {
    setState({
      selectedImage: null,
      difficulty: 'beginner',
      sessionsPerWeek: 3,
      weeks: 12,
      loading: false,
      workoutResult: null,
    })
    saveToStorage(null) // Clear localStorage
  }

  return (
    <AppContext.Provider
      value={{
        state,
        setSelectedImage,
        setDifficulty,
        setSessionsPerWeek,
        setWeeks,
        setLoading,
        setWorkoutResult,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
