'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp, type DifficultyLevel } from './context/AppContext'
import { Select, NumberField, Loader, Logo, Button } from './components'
import Image from 'next/image'
import { CameraIcon } from '@heroicons/react/16/solid'

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)

  // Prevent the browser from opening the file when dropping outside the dropzone
  useEffect(() => {
    const preventIfFileDrag = (event: DragEvent) => {
      const types = event.dataTransfer?.types
      if (types && Array.from(types).includes('Files')) {
        event.preventDefault()
      }
    }

    window.addEventListener('dragover', preventIfFileDrag)
    window.addEventListener('drop', preventIfFileDrag)

    return () => {
      window.removeEventListener('dragover', preventIfFileDrag)
      window.removeEventListener('drop', preventIfFileDrag)
    }
  }, [])

  const stopCamera = () => setShowCamera(false)

  const validateAndSetFile = (file: File) => {
    // Check file type - OpenAI only supports these formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(`Unsupported file type: ${file.type}. OpenAI supports: JPEG, PNG, GIF, WebP only.`)
      return
    }

    // Check file size (7.5MB limit to account for base64 expansion)
    const maxSize = 7.5 * 1024 * 1024 // 7.5MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image too large. Maximum size is 7.5MB, your image is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      )
      return
    }

    setSelectedImage(file)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
    // Allow re-selecting the same file later
    event.currentTarget.value = ''
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounterRef.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current <= 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file) {
        validateAndSetFile(file)
      }
      event.dataTransfer.clearData()
      return
    }

    // Fallback for browsers that populate items instead of files
    const items = event.dataTransfer.items
    if (items && items.length > 0) {
      for (let index = 0; index < items.length; index += 1) {
        const item = items[index]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            validateAndSetFile(file)
            break
          }
        }
      }
      event.dataTransfer.clearData()
    }
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
    } finally {
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
          there is around you
        </h2>
      </header>

      <main className="app-main">
        {!showCamera && (
          <div>
            <div
              className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
              aria-label="Upload an image by clicking or dragging and dropping"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <Button variant="secondary">
                <CameraIcon width={16} height={16} />
                Take a picture or select one
              </Button>
              {/*<Button
                variant="secondary"
                onClick={() => setShowCamera(true)}
                disabled={state.loading}
              >
                Take Photo
              </Button>*/}
              {state.selectedImage && (
                <div className="dropzone__preview">
                  <p>Selected: {state.selectedImage.name}</p>
                  <Image
                    src={URL.createObjectURL(state.selectedImage)}
                    alt="Selected equipment"
                    style={{ maxWidth: '300px', height: 'auto', margin: '0 auto' }}
                  />
                </div>
              )}
            </div>

            <div>
              <label>Difficulty Level:</label>
              <Select
                options={levels}
                onChange={(value) => setDifficulty(value as DifficultyLevel)}
              />
            </div>

            <div>
              <label htmlFor="sessionsPerWeek">Sessions per week:</label>
              <NumberField
                id="sessionsPerWeek"
                defaultValue={3}
                onChange={(value) => setSessionsPerWeek(value)}
              />
            </div>

            <div>
              <label htmlFor="weeks">Number of weeks:</label>
              <NumberField id="weeks" defaultValue={12} onChange={(value) => setWeeks(value)} />
            </div>

            <div>
              <Button variant="primary" onClick={analyzeImage} disabled={state.loading}>
                Let&apos;s go!
              </Button>
            </div>
          </div>
        )}

        {/* showCamera && (
          <CameraCapture
            onCapture={(file) => {
              validateAndSetFile(file)
              stopCamera()
            }}
            onClose={stopCamera}
          />
        ) */}
      </main>
    </div>
  )
}
