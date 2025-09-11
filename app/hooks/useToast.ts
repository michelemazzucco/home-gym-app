'use client'
import { Toast } from '@base-ui-components/react/toast'

export interface ToastOptions {
  title?: string
  description: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

export function useToast() {
  const toastManager = Toast.useToastManager()

  const showToast = (options: ToastOptions | string) => {
    const config = typeof options === 'string' ? { description: options } : options

    toastManager.add({
      title: config.title,
      description: config.description,
      type: config.type,
    })
  }

  return { showToast }
}
