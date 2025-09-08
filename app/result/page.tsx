'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '../context/AppContext'
import { Button, Logo } from '../components'
import styles from './result.module.css'
import { WorkoutBlock } from '../components'
import { Label, EquipmentBadge } from '../components'
import { getMarkdown } from '../utils'

export default function ResultPage() {
  const { state, resetState } = useApp()
  const router = useRouter()

  const handleBackToMain = () => {
    resetState()
    router.push('/')
  }

  if (!state.workoutResult) {
    return (
      <div>
        <header>
          <h1>No Results</h1>
          <button onClick={() => router.push('/')}>← Back to Main</button>
        </header>
        <main>
          <p>No workout plan data found. Please go back and analyze an image.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-wrapper result-page">
      <header className="app-header">
        <Logo />
      </header>

      <main>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: 'var(--spacing-xxs) 0 var(--spacing-sm)',
          }}
        >
          <Label>Detected equipment</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {state.workoutResult.equipment.map((item) => (
              <EquipmentBadge name={item} key={item} />
            ))}
          </div>
        </div>

        <div id="workout-plan" className={styles.plan}>
          {state.workoutResult.plan.map((block) => (
            <WorkoutBlock key={block.title} block={block} />
          ))}
        </div>

        <div className="app-main__button-container fixed">
          <Button variant="secondary" onClick={handleBackToMain}>
            Create a new one
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const workoutPlanElement = document.getElementById('workout-plan')
              if (workoutPlanElement) {
                const plan = getMarkdown(workoutPlanElement.innerHTML)
                navigator.clipboard.writeText(plan)
                alert('Workout plan copied to clipboard!')
              }
            }}
          >
            Copy Workout Plan
          </Button>
        </div>
      </main>
    </div>
  )
}
