'use client'
import { Toast } from '@base-ui-components/react/toast'

export interface ToastOptions {
  title?: string
  description: string
}

export function useToast() {
  const toastManager = Toast.useToastManager()

  const showToast = (options: ToastOptions | string) => {
    const config = typeof options === 'string' ? { description: options } : options

    toastManager.add({
      title: config.title,
      description: config.description,
    })
  }

  return { showToast }
}
