'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showToast(`Unsupported file type: ${file.type}. Supported types: JPEG, PNG, GIF, WebP only.`)
      return
    }

    const maxSize = 7.5 * 1024 * 1024 // 7.5MB in bytes
    if (file.size > maxSize) {
      showToast(
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
