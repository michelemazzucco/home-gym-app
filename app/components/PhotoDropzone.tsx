'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/app/lib/utils'
import { buttonVariants } from './ui/button'

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
  preparing,
  onPreparingChange,
}: {
  previewUrl: string | null
  onSelect: (file: File) => void
  preparing: boolean
  onPreparingChange: (preparing: boolean) => void
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
      toast(
        `${file.type ? `${file.type} files are` : 'This file type is'} not supported. Use a JPEG, PNG, GIF or WebP photo.`
      )
      return
    }
    onPreparingChange(true)
    try {
      onSelect(await compressImage(file))
    } catch (error) {
      console.error('Image compression error:', error)
      toast("Couldn't read that image. Try another photo.")
    } finally {
      onPreparingChange(false)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={previewUrl ? 'Replace the photo' : 'Upload a photo'}
      aria-busy={preparing}
      aria-disabled={preparing}
      onClick={() => {
        if (!preparing) inputRef.current?.click()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (!preparing) inputRef.current?.click()
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

        if (file && !preparing) validateAndSet(file)
        event.dataTransfer.clearData()
      }}
      className={cn(
        'relative flex min-h-[280px] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border-strong bg-white/[0.03] p-6 transition-[border-color,background-color,box-shadow] outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none lg:min-h-media',
        isDragging && !preparing && 'border-accent bg-accent/10',
        preparing && 'cursor-progress'
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

      {preparing ? (
        <span
          role="status"
          className={buttonVariants({ variant: 'secondary', className: 'relative' })}
        >
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          Preparing the photo
        </span>
      ) : previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={previewUrl}
            src={previewUrl}
            alt="The equipment you uploaded"
            className="relative max-h-[240px] w-auto animate-pop rounded-lg object-contain motion-reduce:animate-none lg:max-h-[412px]"
          />
          <span
            aria-hidden="true"
            className={cn(
              buttonVariants({ variant: 'icon', size: 'icon' }),
              'absolute top-3 right-3 size-9 sm:top-4 sm:right-4 sm:size-11'
            )}
          >
            <RefreshCw className="size-4 sm:size-5" />
          </span>
        </>
      ) : (
        <span
          aria-hidden="true"
          className={buttonVariants({ variant: 'secondary', className: 'relative' })}
        >
          <Camera className="size-4" />
          <span className="pointer-coarse:hidden">Upload photo</span>
          <span className="hidden pointer-coarse:inline">Take or choose a photo</span>
        </span>
      )}
    </div>
  )
}

const Diagonals = () => (
  <svg
    aria-hidden="true"
    preserveAspectRatio="none"
    viewBox="0 0 100 100"
    className="absolute inset-0 size-full text-chalk opacity-10"
  >
    <path
      d="M0 0 L100 100 M100 0 L0 100"
      stroke="currentColor"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)
