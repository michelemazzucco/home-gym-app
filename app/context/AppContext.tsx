'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

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

interface WorkoutBlock {
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
  loading: boolean
  workoutResult: WorkoutResult | null
}

interface AppContextType {
  state: AppState
  setSelectedImage: (image: File | null) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setLoading: (loading: boolean) => void
  setWorkoutResult: (result: WorkoutResult | null) => void
  resetState: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    selectedImage: null,
    difficulty: 'beginner',
    loading: false,
    workoutResult: null
  })

  const setSelectedImage = (image: File | null) => {
    setState(prev => ({ ...prev, selectedImage: image }))
  }

  const setDifficulty = (difficulty: DifficultyLevel) => {
    setState(prev => ({ ...prev, difficulty }))
  }

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }

  const setWorkoutResult = (result: WorkoutResult | null) => {
    setState(prev => ({ ...prev, workoutResult: result }))
  }

  const resetState = () => {
    setState({
      selectedImage: null,
      difficulty: 'beginner',
      loading: false,
      workoutResult: null
    })
  }

  return (
    <AppContext.Provider value={{
      state,
      setSelectedImage,
      setDifficulty,
      setLoading,
      setWorkoutResult,
      resetState
    }}>
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