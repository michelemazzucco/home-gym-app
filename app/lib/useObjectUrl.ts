'use client'

import { useEffect, useMemo, useRef } from 'react'

/**
 * Object URL for a file. The previous URL is revoked when the file changes.
 * Revoking on unmount is deliberately skipped: React re-runs effect cleanups in
 * development, which would kill a URL the component is still rendering.
 */
export const useObjectUrl = (file: File | null) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  const previous = useRef<string | null>(null)

  useEffect(() => {
    const stale = previous.current
    previous.current = url
    if (stale && stale !== url) URL.revokeObjectURL(stale)
  }, [url])

  return url
}
