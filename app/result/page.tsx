'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Logo } from '../components'
import styles from './result.module.css'
import { WorkoutBlock } from '../components'
import { NoResult, EquipmentList } from '../components'
import { getMarkdown, fallbackCopyText } from '../utils'
import { useToast } from '../hooks/useToast'

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

  const handleCopyToClipboard = () => {
    const workoutPlanElement = document.getElementById('workout-plan')
    if (workoutPlanElement) {
      const plan = getMarkdown(workoutPlanElement.innerHTML)

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(plan)
          .then(() => {
            showToast('Workout plan copied to clipboard!')
          })
          .catch(() => {
            fallbackCopyText(plan, showToast)
          })
      } else {
        fallbackCopyText(plan, showToast)
      }
    }
  }

  if (!state.workoutResult) {
    return <NoResult />
  }

  return (
    <div className="app-wrapper result-page">
      <header className="app-header">
        <Logo />
      </header>

      <main>
        <EquipmentList equipment={state.workoutResult.equipment} />

        <div id="workout-plan" className={styles.plan}>
          {state.workoutResult.plan.map((block) => (
            <WorkoutBlock key={block.title} block={block} />
          ))}
        </div>

        <div className="app-main__button-container fixed">
          <Button variant="secondary" onClick={handleBackToMain}>
            Create new plan
          </Button>
          <Button variant="primary" onClick={handleCopyToClipboard}>
            Copy to clipboard
          </Button>
        </div>
      </main>
    </div>
  )
}
