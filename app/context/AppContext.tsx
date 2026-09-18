'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  DifficultyLevel,
  SESSION_MINUTES_DEFAULT,
  SESSIONS_DEFAULT,
  WEEKS_DEFAULT,
  WorkoutBlock,
} from '../lib/workout'
import { getServerSnapshot, getSnapshot, save, subscribe } from '../lib/planStorage'

export type Step = 1 | 2 | 3

interface AppState {
  stepOverride: Step | null
  selectedImage: File | null
  difficulty: DifficultyLevel
  sessionsPerWeek: number
  weeks: number
  sessionMinutes: number
  /** Identifies the photo the equipment list came from, so step 1 -> 2 does not repeat the vision call. */
  analyzedImageKey: string | null
}

interface AppContextType {
  step: Step
  selectedImage: File | null
  difficulty: DifficultyLevel
  sessionsPerWeek: number
  weeks: number
  sessionMinutes: number
  equipment: string[]
  plan: WorkoutBlock[] | null
  analyzedImageKey: string | null
  setStep: (step: Step) => void
  setSelectedImage: (image: File | null) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setSessionsPerWeek: (sessions: number) => void
  setWeeks: (weeks: number) => void
  setSessionMinutes: (minutes: number) => void
  setEquipment: (equipment: string[], analyzedImageKey?: string | null) => void
  commitPlan: (equipment: string[], plan: WorkoutBlock[]) => void
  resetState: () => void
}

const initialState: AppState = {
  stepOverride: null,
  selectedImage: null,
  difficulty: 'beginner',
  sessionsPerWeek: SESSIONS_DEFAULT,
  weeks: WEEKS_DEFAULT,
  sessionMinutes: SESSION_MINUTES_DEFAULT,
  analyzedImageKey: null,
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  // The equipment list and the plan live in localStorage, so a reload lands the
  // user back on their plan instead of an empty form.
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setStep = useCallback(
    (stepOverride: Step) => setState((prev) => ({ ...prev, stepOverride })),
    []
  )

  const setSelectedImage = useCallback(
    (selectedImage: File | null) => setState((prev) => ({ ...prev, selectedImage })),
    []
  )

  const setDifficulty = useCallback(
    (difficulty: DifficultyLevel) => setState((prev) => ({ ...prev, difficulty })),
    []
  )

  const setSessionsPerWeek = useCallback(
    (sessionsPerWeek: number) => setState((prev) => ({ ...prev, sessionsPerWeek })),
    []
  )

  const setWeeks = useCallback((weeks: number) => setState((prev) => ({ ...prev, weeks })), [])

  const setSessionMinutes = useCallback(
    (sessionMinutes: number) => setState((prev) => ({ ...prev, sessionMinutes })),
    []
  )

  const setEquipment = useCallback((nextEquipment: string[], analyzedImageKey?: string | null) => {
    save({ equipment: nextEquipment, plan: getSnapshot()?.plan ?? null })
    if (analyzedImageKey !== undefined) {
      setState((prev) => ({ ...prev, analyzedImageKey }))
    }
  }, [])

  const commitPlan = useCallback((nextEquipment: string[], nextPlan: WorkoutBlock[]) => {
    save({ equipment: nextEquipment, plan: nextPlan })
    setState((prev) => ({ ...prev, stepOverride: 3 }))
  }, [])

  const resetState = useCallback(() => {
    save(null)
    setState(initialState)
  }, [])

  const value = useMemo(() => {
    const equipment = stored?.equipment ?? []
    const plan = stored?.plan ?? null
    const step: Step = state.stepOverride ?? (plan ? 3 : 1)

    return {
      step,
      selectedImage: state.selectedImage,
      difficulty: state.difficulty,
      sessionsPerWeek: state.sessionsPerWeek,
      weeks: state.weeks,
      sessionMinutes: state.sessionMinutes,
      equipment,
      plan,
      analyzedImageKey: state.analyzedImageKey,
      setStep,
      setSelectedImage,
      setDifficulty,
      setSessionsPerWeek,
      setWeeks,
      setSessionMinutes,
      setEquipment,
      commitPlan,
      resetState,
    }
  }, [
    stored,
    state,
    setStep,
    setSelectedImage,
    setDifficulty,
    setSessionsPerWeek,
    setWeeks,
    setSessionMinutes,
    setEquipment,
    commitPlan,
    resetState,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
