'use client'
import { useState, useRef, useEffect } from 'react'
import { Button, Select } from '../'
import { CameraIcon } from '@heroicons/react/16/solid'
import { NumberField } from '../NumberField'
import { DifficultyLevel, useApp } from '../../context/AppContext'
import styles from './index.module.css'
import { useToast } from '@/app/hooks/useToast'
import isMobile from 'is-mobile'

interface FormProps {
  setWeeks: (weeks: number) => void
  setSelectedImage: (file: File) => void
  setDifficulty: (difficulty: DifficultyLevel) => void
  setSessionsPerWeek: (sessions: number) => void
}

export const Form = ({
  setWeeks,
  setSelectedImage,
  setDifficulty,
  setSessionsPerWeek,
}: FormProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state } = useApp()
  const { showToast } = useToast()
  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

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

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          // Target max size: 4MB to stay safely under Vercel's 4.5MB limit
          const maxSizeBytes = 4 * 1024 * 1024
          let quality = 0.9
          let width = img.width
          let height = img.height

          // Scale down if image is very large
          const maxDimension = 2048
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension
              width = maxDimension
            } else {
              width = (width / height) * maxDimension
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'))
                  return
                }

                // If still too large and quality can be reduced, try again
                if (blob.size > maxSizeBytes && quality > 0.5) {
                  quality -= 0.1
                  tryCompress()
                  return
                }

                // If still too large even at minimum quality, reject
                if (blob.size > maxSizeBytes) {
                  reject(new Error('Image too large even after compression'))
                  return
                }

                // Convert blob to File
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })

                resolve(compressedFile)
              },
              'image/jpeg',
              quality
            )
          }

          tryCompress()
        }
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  }

  const validateAndSetFile = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showToast(`Unsupported file type: ${file.type}. Supported types: JPEG, PNG, GIF, WebP only.`)
      return
    }

    try {
      const compressedFile = await compressImage(file)
      setSelectedImage(compressedFile)
    } catch (error) {
      showToast('Failed to process image. Please try another image.')
      console.error('Image compression error:', error)
    }
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

  return (
    <div className={styles.formContainer}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
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
        {state.selectedImage ? (
          <img
            className={styles.selectedImage}
            src={URL.createObjectURL(state.selectedImage)}
            alt="Selected equipment"
          />
        ) : (
          <>
            <Button variant="secondary">
              <CameraIcon width={16} height={16} />
              {isMobile() ? 'Take a picture or select one' : 'Upload an image'}
            </Button>
          </>
        )}
      </div>
      <div className={styles.fieldsContainer}>
        <div className={styles.fieldFullWidth}>
          <Select
            label="Level"
            options={levels}
            onChange={(value) => setDifficulty(value as DifficultyLevel)}
          />
        </div>

        <div>
          <NumberField
            id="sessionsPerWeek"
            defaultValue={3}
            onChange={(value) => setSessionsPerWeek(value)}
            max={7}
            min={1}
            label="Sesh per week"
          />
        </div>

        <div>
          <NumberField
            id="weeks"
            defaultValue={8}
            onChange={(value) => setWeeks(value)}
            max={12}
            min={4}
            label="Plan duration"
          />
        </div>
      </div>
    </div>
  )
}
