import type { DifficultyLevel, WorkoutBlock } from './workout'

export const isMockMode = () => process.env.MOCK_OPENAI === 'true'

if (isMockMode()) {
  console.warn(
    '[home-gym] MOCK_OPENAI is on. The API routes return canned data and never call OpenAI.'
  )
}

export const MOCK_EQUIPMENT = [
  'dumbbells',
  'pull-up bar',
  'kettlebell',
  'yoga mat',
  'resistance bands',
  'flat bench',
]

const SCHEMES: Record<DifficultyLevel, { sets: string; reps: string; rest: string }> = {
  beginner: { sets: '2-3', reps: '10-15', rest: '90s' },
  intermediate: { sets: '3-4', reps: '8-12', rest: '75s' },
  advanced: { sets: '4-5', reps: '6-10', rest: '60s' },
}

const BLOCK_THEMES = ['Foundation', 'Development', 'Consolidation']

const MOVEMENTS = [
  'Goblet squat',
  'Romanian deadlift',
  'Floor press',
  'Bent-over row',
  'Split squat',
  'Overhead press',
  'Kettlebell swing',
  'Hollow hold',
  'Band pull-apart',
  'Dead bug',
]

/**
 * Builds a plausible plan from the same inputs the real route uses, so the settings and the
 * confirmed equipment visibly change the output while testing without OpenAI credits.
 */
export const mockPlan = ({
  equipment,
  difficulty,
  sessionsPerWeek,
  weeks,
  sessionMinutes,
}: {
  equipment: string[]
  difficulty: DifficultyLevel
  sessionsPerWeek: number
  weeks: number
  sessionMinutes: number
}): WorkoutBlock[] => {
  const scheme = SCHEMES[difficulty]
  const blockCount = weeks >= 9 ? 3 : 2
  const weeksPerBlock = Math.ceil(weeks / blockCount)
  const gear = equipment.length > 0 ? equipment : ['bodyweight only']
  const exercisesPerSession = Math.max(2, Math.min(8, Math.round(sessionMinutes / 8)))

  return Array.from({ length: blockCount }, (_, blockIndex) => {
    const firstWeek = blockIndex * weeksPerBlock + 1
    const lastWeek = Math.min(weeks, firstWeek + weeksPerBlock - 1)

    return {
      title: `Week ${firstWeek}-${lastWeek}: ${BLOCK_THEMES[blockIndex] ?? 'Peak'}`,
      sessions: Array.from({ length: sessionsPerWeek }, (_, sessionIndex) => ({
        title: `Session ${String(sessionIndex + 1).padStart(2, '0')} — ${
          gear[sessionIndex % gear.length]
        } focus`,
        exercizes: Array.from({ length: exercisesPerSession }, (_, exerciseIndex) => {
          const movement =
            MOVEMENTS[(sessionIndex * 4 + exerciseIndex + blockIndex) % MOVEMENTS.length]
          return {
            name: `${movement} with ${gear[(exerciseIndex + sessionIndex) % gear.length]}`,
            sets: scheme.sets,
            reps: scheme.reps,
            rest: exerciseIndex === exercisesPerSession - 1 ? '0' : scheme.rest,
          }
        }),
      })),
    }
  })
}

/** Stands in for the network round trip so loading states are visible while testing. */
export const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
