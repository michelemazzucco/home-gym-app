'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './context/AppContext'
import { useToast } from './hooks/useToast'
import { Loader, Logo, Button, Form, ApiDialog } from './components'

export default function Home() {
  const {
    state,
    setSelectedImage,
    setDifficulty,
    setSessionsPerWeek,
    setWeeks,
    setLoading,
    setWorkoutResult,
    setApiKey,
  } = useApp()
  const router = useRouter()
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      setOpen(true)
    }
  }, [])

  const analyzeImage = async () => {
    if (!state.selectedImage) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', state.selectedImage)
      formData.append('difficulty', state.difficulty)
      formData.append('sessionsPerWeek', String(state.sessionsPerWeek))
      formData.append('weeks', String(state.weeks))
      if (state.apiKey) {
        formData.append('apiKey', state.apiKey)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setWorkoutResult(data)
      router.push('/result')
    } catch (error) {
      console.error('Error analyzing image:', error)
      showToast('Error analyzing image. Please try again.')
      setLoading(false)
    }
  }

  if (state.loading) {
    return <Loader />
  }

  return (
    <div className="app-wrapper">
      <ApiDialog open={open} setOpen={setOpen} apiKey={state.apiKey} setApiKey={setApiKey} />
      <header className="app-header">
        <Logo />
        <h2 className="app-header__subtitle">
          Workouts based
          <br /> on what&apos;s around you
        </h2>
      </header>
      <main className="app-main">
        <Form
          setWeeks={setWeeks}
          setDifficulty={setDifficulty}
          setSessionsPerWeek={setSessionsPerWeek}
          setSelectedImage={setSelectedImage}
        />
      </main>
      <footer className="app-main__button-container">
        <Button
          variant="primary"
          onClick={
            !state.selectedImage ? () => showToast('Upload an image to get started!') : analyzeImage
          }
          disabled={state.loading}
        >
          Let&apos;s go!
        </Button>
      </footer>
    </div>
  )
}
