import type { WorkoutBlock } from './workout'

export const isMockMode = () => process.env.MOCK_OPENAI === 'true'

if (isMockMode()) {
  console.warn(
    '[home-gym] MOCK_OPENAI is on. The API routes return canned data and never call OpenAI.'
  )
}

/** A real gpt-4o-mini run on `public/example-equipment.jpg`, captured as-is. */
export const MOCK_EQUIPMENT = [
  'barbell',
  'weight plates',
  'squat rack',
  'resistance band (loop)',
  'exercise ball',
  'yoga mat',
  'foam roller',
  'adjustable dumbbell plate set (with handle)',
  'single dumbbell',
]

/** The plan the real route returned for MOCK_EQUIPMENT: 3 sessions a week over 8 weeks. */
export const MOCK_PLAN: WorkoutBlock[] = [
  {
    title: 'Week 1-3: Foundation',
    sessions: [
      {
        title: 'Session A - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Back squat (barbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Single-arm row (dumbbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Incline push (exercise ball)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Romanian deadlift (barbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Pallof press (band)', sets: '2', reps: '12-15', rest: '60s' },
          { name: 'Plank (mat)', sets: '2', reps: '30s', rest: '60s' },
          { name: 'Hamstring curl (ball)', sets: '2', reps: '12', rest: '60s' },
          { name: "Child's pose stretch", sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session B - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Deadlift (barbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Standing overhead press (dumbbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Split squat (single dumbbell)', sets: '2', reps: '10 each', rest: '90s' },
          { name: 'Band pull-apart', sets: '2', reps: '15', rest: '60s' },
          { name: 'Glute bridge (barbell)', sets: '2', reps: '12', rest: '60s' },
          { name: 'Side plank (mat)', sets: '2', reps: '30s each', rest: '60s' },
          { name: 'Standing calf raise (single dumbbell)', sets: '2', reps: '15', rest: '60s' },
          { name: 'Kneeling hip flexor stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session C - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Front squat (barbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Chest press (dumbbell)', sets: '2', reps: '10-12', rest: '90s' },
          { name: 'Single-leg RDL (bodyweight)', sets: '2', reps: '10 each', rest: '90s' },
          { name: 'Lat pullover (single dumbbell)', sets: '2', reps: '12', rest: '60s' },
          { name: 'Band assisted chin (band)', sets: '2', reps: '6-8', rest: '90s' },
          { name: 'Dead bug (mat)', sets: '2', reps: '12', rest: '60s' },
          { name: 'Thoracic rotation stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
    ],
  },
  {
    title: 'Week 4-6: Development',
    sessions: [
      {
        title: 'Session A - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Back squat (barbell)', sets: '3', reps: '10-12', rest: '90s' },
          { name: 'Single-arm row (dumbbell)', sets: '3', reps: '10-12', rest: '90s' },
          { name: 'Incline push (exercise ball)', sets: '3', reps: '10-12', rest: '90s' },
          { name: 'Romanian deadlift (barbell)', sets: '3', reps: '10-12', rest: '90s' },
          { name: 'Pallof press (band)', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Plank (mat)', sets: '2', reps: '40s', rest: '60s' },
          { name: 'Hamstring curl (ball)', sets: '2', reps: '12-15', rest: '60s' },
          { name: "Child's pose stretch", sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session B - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Deadlift (barbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Standing overhead press (dumbbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Split squat (single dumbbell)', sets: '3', reps: '10 each', rest: '90s' },
          { name: 'Band pull-apart', sets: '3', reps: '15', rest: '60s' },
          { name: 'Glute bridge (barbell)', sets: '3', reps: '12', rest: '60s' },
          { name: 'Side plank (mat)', sets: '2', reps: '40s each', rest: '60s' },
          { name: 'Standing calf raise (single dumbbell)', sets: '2', reps: '15', rest: '60s' },
          { name: 'Kneeling hip flexor stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session C - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Front squat (barbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Chest press (dumbbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Single-leg RDL (dumbbell)', sets: '3', reps: '10 each', rest: '90s' },
          { name: 'Lat pullover (single dumbbell)', sets: '3', reps: '12', rest: '60s' },
          { name: 'Band assisted chin (band)', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Dead bug (mat)', sets: '2', reps: '15', rest: '60s' },
          { name: 'Thoracic rotation stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
    ],
  },
  {
    title: 'Week 7-8: Consolidation',
    sessions: [
      {
        title: 'Session A - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Back squat (barbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Single-arm row (dumbbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Incline push (exercise ball)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Romanian deadlift (barbell)', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Pallof press (band)', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Plank (mat)', sets: '2', reps: '50s', rest: '60s' },
          { name: 'Hamstring curl (ball)', sets: '2', reps: '15', rest: '60s' },
          { name: "Child's pose stretch", sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session B - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Deadlift (barbell)', sets: '3', reps: '6-8', rest: '2min' },
          { name: 'Standing overhead press (dumbbell)', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Split squat (single dumbbell)', sets: '3', reps: '8 each', rest: '90s' },
          { name: 'Band pull-apart', sets: '3', reps: '20', rest: '60s' },
          { name: 'Glute bridge (barbell)', sets: '3', reps: '10', rest: '60s' },
          { name: 'Side plank (mat)', sets: '2', reps: '50s each', rest: '60s' },
          { name: 'Standing calf raise (single dumbbell)', sets: '2', reps: '20', rest: '60s' },
          { name: 'Kneeling hip flexor stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
      {
        title: 'Session C - Full Body',
        exercizes: [
          { name: 'Foam roll mobility', sets: '1', reps: '5min', rest: '0' },
          { name: 'Front squat (barbell)', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Chest press (dumbbell)', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Single-leg RDL (dumbbell)', sets: '3', reps: '8 each', rest: '90s' },
          { name: 'Lat pullover (single dumbbell)', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Band assisted chin (band)', sets: '3', reps: '6-8', rest: '90s' },
          { name: 'Dead bug (mat)', sets: '2', reps: '20', rest: '60s' },
          { name: 'Thoracic rotation stretch', sets: '1', reps: '2min', rest: '0' },
        ],
      },
    ],
  },
]

/** Stands in for the network round trip so loading states are visible while testing. */
export const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
