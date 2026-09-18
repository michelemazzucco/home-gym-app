'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import isMobile from 'is-mobile'
import { toast } from 'sonner'
import { cn } from '@/app/lib/utils'
import { Button } from './ui/button'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

/** Vercel rejects request bodies over 4.5MB, so shrink on the client before upload. */
const compressImage = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onerror = () => reject(new Error('Failed to load image'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        const maxSizeBytes = 4 * 1024 * 1024
        const maxDimension = 2048
        let quality = 0.9
        let width = img.width
        let height = img.height

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
              if (blob.size > maxSizeBytes && quality > 0.5) {
                quality -= 0.1
                tryCompress()
                return
              }
              if (blob.size > maxSizeBytes) {
                reject(new Error('Image too large even after compression'))
                return
              }
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }))
            },
            'image/jpeg',
            quality
          )
        }

        tryCompress()
      }
    }
  })

export const PhotoDropzone = ({
  previewUrl,
  onSelect,
}: {
  previewUrl: string | null
  onSelect: (file: File) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Stop the browser from opening a file dropped outside the dropzone.
  useEffect(() => {
    const preventIfFileDrag = (event: DragEvent) => {
      if (Array.from(event.dataTransfer?.types ?? []).includes('Files')) {
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

  const validateAndSet = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast(`Unsupported file type: ${file.type}. Use JPEG, PNG, GIF or WebP.`)
      return
    }
    try {
      onSelect(await compressImage(file))
    } catch (error) {
      console.error('Image compression error:', error)
      toast('Failed to process the image. Please try another one.')
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload a photo by clicking or dragging and dropping"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        dragCounter.current += 1
        setIsDragging(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        setIsDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        dragCounter.current -= 1
        if (dragCounter.current <= 0) setIsDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        dragCounter.current = 0

        const file =
          event.dataTransfer.files?.[0] ??
          Array.from(event.dataTransfer.items ?? [])
            .find((item) => item.kind === 'file')
            ?.getAsFile()

        if (file) validateAndSet(file)
        event.dataTransfer.clearData()
      }}
      className={cn(
        'relative flex min-h-[280px] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/40 bg-white/[0.03] p-6 transition-colors motion-reduce:transition-none lg:min-h-media',
        isDragging && 'border-accent bg-accent/10'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) validateAndSet(file)
          event.currentTarget.value = ''
        }}
      />

      <Diagonals />

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={previewUrl}
          src={previewUrl}
          alt="The equipment you uploaded"
          className="relative max-h-[240px] w-auto animate-pop rounded-lg object-contain motion-reduce:animate-none lg:max-h-[412px]"
        />
      ) : (
        <Button variant="secondary" className="relative" tabIndex={-1}>
          <Camera className="size-4" />
          {isMobile() ? 'Take a picture or select one' : 'Upload photo'}
        </Button>
      )}
    </div>
  )
}

const Diagonals = () => (
  <svg
    aria-hidden="true"
    preserveAspectRatio="none"
    viewBox="0 0 100 100"
    className="absolute inset-0 size-full opacity-10"
  >
    <path
      d="M0 0 L100 100 M100 0 L0 100"
      stroke="#fff"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)
