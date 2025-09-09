'use client'

import { useRouter } from 'next/navigation'
import { useApp } from './context/AppContext'
import { Loader, Logo, Button, Form } from './components'

export default function Home() {
  const {
    state,
    setSelectedImage,
    setDifficulty,
    setSessionsPerWeek,
    setWeeks,
    setLoading,
    setWorkoutResult,
  } = useApp()
  const router = useRouter()

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(`Unsupported file type: ${file.type}. OpenAI supports: JPEG, PNG, GIF, WebP only.`)
      return
    }

    const maxSize = 7.5 * 1024 * 1024 // 7.5MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image too large. Maximum size is 7.5MB, your image is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      )
      return
    }

    setSelectedImage(file)
  }

  const analyzeImage = async () => {
    if (!state.selectedImage) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', state.selectedImage)
      formData.append('difficulty', state.difficulty)
      formData.append('sessionsPerWeek', String(state.sessionsPerWeek))
      formData.append('weeks', String(state.weeks))

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
      alert('Error analyzing image. Please try again.')
      setLoading(false)
    }
  }

  if (state.loading) {
    return <Loader />
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <Logo />
        <h2 className="app-header__subtitle">
          Workouts based on what
          <br />
          there&apos;s around you
        </h2>
      </header>
      <main className="app-main">
        <Form
          setWeeks={setWeeks}
          setDifficulty={setDifficulty}
          setSessionsPerWeek={setSessionsPerWeek}
          validateAndSetFile={validateAndSetFile}
        />
      </main>
      <footer className="app-main__button-container">
        <Button variant="primary" onClick={analyzeImage} disabled={state.loading}>
          Let&apos;s go!
        </Button>
      </footer>
    </div>
  )
}
