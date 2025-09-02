'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '../context/AppContext'

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
    <div>
      <header>
        <h1>Workout Results</h1>
        <button onClick={handleBackToMain}>← Back to Main</button>
      </header>

      <main>
        <div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(state.workoutResult)}
          </div>
        </div>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(state.workoutResult))
            alert('Workout plan copied to clipboard!')
          }}
        >
          Copy Workout Plan
        </button>
      </main>
    </div>
  )
}