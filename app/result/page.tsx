'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Logo } from '../components'
import styles from './result.module.css'
import { WorkoutBlock } from '../components'
import { Label, EquipmentBadge } from '../components'
import { getMarkdown } from '../utils'
import { useToast } from '../hooks/useToast'

const fallbackCopyText = (text: string, showToast: (message: string) => void) => {
  // Create a temporary textarea element
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Make it invisible but not display:none (iOS needs it to be visible)
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  textArea.style.opacity = '0'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    // For iOS, we need to set the selection range
    textArea.setSelectionRange(0, 99999)
    const successful = document.execCommand('copy')
    if (successful) {
      showToast('Workout plan copied to clipboard!')
    } else {
      showToast('Failed to copy workout plan.')
    }
  } catch (err) {
    showToast('Copy not supported.')
  } finally {
    document.body.removeChild(textArea)
  }
}

export default function ResultPage() {
  const { state, resetState, setLoading } = useApp()
  const router = useRouter()
  const { showToast } = useToast()
  useEffect(() => {
    setLoading(false)
  }, [])

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
            Create new plan
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const workoutPlanElement = document.getElementById('workout-plan')
              if (workoutPlanElement) {
                const plan = getMarkdown(workoutPlanElement.innerHTML)
                // Try modern clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard
                    .writeText(plan)
                    .then(() => {
                      showToast('Workout plan copied to clipboard!')
                    })
                    .catch(() => {
                      // Fallback for iOS and other browsers
                      fallbackCopyText(plan, showToast)
                    })
                } else {
                  // Fallback for iOS and other browsers
                  fallbackCopyText(plan, showToast)
                }
              }
            }}
          >
            Copy to clipboard
          </Button>
        </div>
      </main>
    </div>
  )
}
