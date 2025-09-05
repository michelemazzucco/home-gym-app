'use client'

import React, { useEffect, useRef, useState } from 'react'

type FacingMode = 'user' | 'environment'

export function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('user')

  useEffect(() => {
    const start = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        alert('Could not access camera. Please upload a photo instead.')
        onClose()
      }
    }

    start()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  const switchCamera = async () => {
    const newFacingMode: FacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
        onCapture(file)
      },
      'image/jpeg',
      0.8
    )
  }

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    onClose()
  }

  return (
    <div>
      <h2>Take Photo</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button onClick={capturePhoto}>Capture</button>
        <button onClick={switchCamera}>
          Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
        </button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  )
}
