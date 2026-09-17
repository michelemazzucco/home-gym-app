export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Exercize {
  name: string
  sets: string
  reps: string
  rest: string
}

export interface Session {
  title: string
  exercizes: Exercize[]
}

export interface WorkoutBlock {
  title: string
  sessions: Session[]
}

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export const SESSIONS_MIN = 1
export const SESSIONS_MAX = 7
export const SESSIONS_DEFAULT = 3

export const WEEKS_MIN = 4
export const WEEKS_MAX = 12
export const WEEKS_DEFAULT = 8

export const SESSION_MINUTES_MIN = 15
export const SESSION_MINUTES_MAX = 90
export const SESSION_MINUTES_DEFAULT = 30
export const SESSION_MINUTES_OPTIONS = [15, 20, 30, 45, 60, 75, 90]

/** Minutes as HH:MM, e.g. 30 -> "00:30", 90 -> "01:30". */
export const formatDuration = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

export const clamp = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n === 0) return fallback
  return Math.max(min, Math.min(max, Math.floor(n)))
}

export const isDifficulty = (value: unknown): value is DifficultyLevel =>
  DIFFICULTY_LEVELS.some((level) => level.value === value)

export const EQUIPMENT_SYSTEM_PROMPT = `You identify fitness equipment in photos of home spaces.

List every distinct item that could be used for a workout. Include purpose-built gear
(dumbbells, kettlebells, resistance bands, pull-up bar, bench, rack, mat) and improvised
objects that are clearly usable as load or support (chair, sturdy table, stairs, backpack,
water bottles).

Rules:
- Use short, generic names in singular or plural as appropriate, e.g. "dumbbells", "yoga mat".
- Do not guess weights, brands or quantities.
- Do not list decoration, clothing, flooring or the room itself.
- If you see no usable equipment, return an empty list.`

export const PLAN_SYSTEM_PROMPT = `You are an experienced personal trainer specializing in home fitness programming. Apply these principles when designing every plan:

PROGRESSIVE OVERLOAD
Increase stimulus each week by adding reps, sets, or reducing rest — never increase all three at once. For beginners, add reps first. For intermediate/advanced, alternate between volume and intensity weeks.

EXERCISE ORDERING
Always sequence: compound multi-joint movements first (e.g. squat, hinge, push, pull), isolation or accessory work last. Higher neurological demand = earlier in the session.

SET AND REP SCHEMES BY DIFFICULTY
- Beginner: 2-3 sets, 10-15 reps, full-body each session, long rest (90s). Focus on movement quality and consistency.
- Intermediate: 3-4 sets, varied rep ranges — strength work at 5-8 reps, hypertrophy at 8-12, endurance at 15+. Rest 60-90s. Introduce push/pull/legs structure if frequency allows.
- Advanced: 4-5 sets, periodized rep ranges across blocks, shorter rest (45-60s for hypertrophy), supersets allowed. Include intensity techniques like drop sets or tempo work in later blocks.

BLOCK PERIODIZATION
Each block should have a distinct focus that builds on the previous:
- First block: foundation — master movement patterns, build work capacity, moderate volume.
- Middle block(s): development — increase load or volume, introduce more complex variations.
- Final block: peak or consolidation — higher intensity, lower volume, or test improvements.

DELOAD
For programs 8 weeks or longer, reduce volume by ~40% in the last week of each block (deload). Note this in the session title (e.g. "Deload — Light Week").

REST PERIODS
Strength focus: 2-3 min. Hypertrophy focus: 60-90s. Endurance/conditioning: 30-45s. Scale down for beginners who need more recovery.

SESSION STRUCTURE
Each session should implicitly follow roughly 12% movement prep → 76% main work → 12% cooldown/flexibility, scaled to the session length given in the request. A short session means fewer exercises, not rushed ones. Reflect this in exercise selection and volume, not as explicit sections.

OUTPUT BREVITY
The plan is read on a small paper sheet, so every string stays short. Exercise names are at most five words and carry no coaching notes in brackets. Sets, reps and rest hold a value or a range and nothing else. Session titles are at most six words. Put progression in the numbers across blocks, never in prose inside a field.

EQUIPMENT CREATIVITY
If equipment is limited, use tempo (slow eccentric), isometric holds, unilateral variations, and bodyweight progressions to increase difficulty without adding load.`

export const buildPlanPrompt = ({
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
}) => `Create a full-body home workout program for someone who wants to get in shape.

Program details:
- Duration: ${weeks} weeks, ${sessionsPerWeek} sessions per week
- Difficulty: ${difficulty}
- Each session: ${sessionMinutes} minutes

Equipment: use only ${
  equipment.length > 0
    ? `this equipment: ${equipment.join(', ')}. Do not introduce any other equipment.`
    : 'bodyweight exercises or improvised objects (e.g. chair, water bottle).'
}

The program must be:
- Progressive across weeks
- Balanced between strength and flexibility
- Appropriate for the ${difficulty} level

Blocks: Divide the program into 2-3 roughly equal blocks (e.g. a ${weeks}-week plan → ${Math.ceil(
  weeks / 3
)}-week blocks). Each block title must include the week range and a focus theme, e.g. "Week 1-4: Foundation".`

export const EQUIPMENT_SCHEMA = {
  name: 'detected_equipment',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      equipment: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['equipment'],
    additionalProperties: false,
  },
} as const

export const PLAN_SCHEMA = {
  name: 'workout_plan',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      plan: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Week range and focus, e.g. "Week 1-4: Foundation". Six words at most.',
            },
            sessions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'e.g. "Session A - Full body". Six words at most.',
                  },
                  exercizes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description:
                            'The movement alone, five words at most, e.g. "Goblet squat". No notes in brackets.',
                        },
                        sets: {
                          type: 'string',
                          description: 'A number or range, e.g. "3" or "2-3".',
                        },
                        reps: {
                          type: 'string',
                          description:
                            'A number, range or hold, e.g. "10-15" or "30s". No per-week notes.',
                        },
                        rest: {
                          type: 'string',
                          description: 'e.g. "90s" or "2min", or "0" for none.',
                        },
                      },
                      required: ['name', 'sets', 'reps', 'rest'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['title', 'exercizes'],
                additionalProperties: false,
              },
            },
          },
          required: ['title', 'sessions'],
          additionalProperties: false,
        },
      },
    },
    required: ['plan'],
    additionalProperties: false,
  },
} as const

export const describeExercize = ({ sets, reps, rest }: Exercize) =>
  `${sets} sets, ${reps} reps${rest === '0' ? '' : `, ${rest} rest`}`

export const planToMarkdown = (equipment: string[], plan: WorkoutBlock[]) => {
  const lines: string[] = ['# Homegym workout plan', '']

  if (equipment.length > 0) {
    lines.push(`**Equipment:** ${equipment.join(', ')}`, '')
  }

  for (const block of plan) {
    lines.push(`## ${block.title}`, '')
    for (const session of block.sessions) {
      lines.push(`### ${session.title}`, '')
      for (const exercize of session.exercizes) {
        lines.push(`- **${exercize.name}** — ${describeExercize(exercize)}`)
      }
      lines.push('')
    }
  }

  return lines.join('\n').trimEnd()
}
