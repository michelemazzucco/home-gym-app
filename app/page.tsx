'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './context/AppContext'
import { Loader } from './components/Loader'

export default function Home() {
  const { state, setSelectedImage, setDifficulty, setSessionsPerWeek, setWeeks, setLoading, setWorkoutResult } = useApp()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please upload a photo instead.')
    }
  }

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    
    if (stream) {
      // Stop current stream
      stream.getTracks().forEach(track => track.stop())
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: newFacingMode }
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('Error switching camera:', error)
        alert('Could not switch camera.')
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
            setSelectedImage(file)
            stopCamera()
          }
        }, 'image/jpeg', 0.8) // Add quality parameter to ensure proper JPEG
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type - OpenAI only supports these formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert(`Unsupported file type: ${file.type}. OpenAI supports: JPEG, PNG, GIF, WebP only.`)
        return
      }
      
      // Check file size (7.5MB limit to account for base64 expansion)
      const maxSize = 7.5 * 1024 * 1024 // 7.5MB in bytes
      if (file.size > maxSize) {
        alert(`Image too large. Maximum size is 7.5MB, your image is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }
      setSelectedImage(file)
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
    <div>
      <header>
        <h1>Home Gym App</h1>
      </header>

      <main>
        {!showCamera && (
          <div>
            <h2>Upload or Take Photo</h2>
            
            <div>
              <button onClick={startCamera}>
                Take Photo
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()}>
                Upload Photo
              </button>
            </div>

            {state.selectedImage && (
              <div>
                <p>Selected: {state.selectedImage.name}</p>
                <img 
                  src={URL.createObjectURL(state.selectedImage)} 
                  alt="Selected equipment"
                  style={{ maxWidth: '300px', height: 'auto' }}
                />
              </div>
            )}

            <div>
              <label htmlFor="difficulty">Difficulty Level:</label>
              <select
                id="difficulty"
                value={state.difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="sessionsPerWeek">Sessions per week:</label>
              <input
                id="sessionsPerWeek"
                type="number"
                value={state.sessionsPerWeek}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setSessionsPerWeek(Number.isFinite(value) ? value : 3)
                }}
              />
            </div>

            <div>
              <label htmlFor="weeks">Number of weeks:</label>
              <input
                id="weeks"
                type="number"
                value={state.weeks}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setWeeks(Number.isFinite(value) ? value : 12)
                }}
              />
            </div>

            {state.selectedImage && (
              <button onClick={analyzeImage} disabled={state.loading}>
                Get Workout Plan
              </button>
            )}
          </div>
        )}

        {showCamera && (
          <div>
            <h2>Take Photo</h2>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div>
              <button onClick={capturePhoto}>Capture</button>
              <button onClick={switchCamera}>
                Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
              </button>
              <button onClick={stopCamera}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}