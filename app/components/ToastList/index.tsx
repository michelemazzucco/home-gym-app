'use client'
import * as React from 'react'
import { Toast } from '@base-ui-components/react/toast'
import styles from './index.module.css'
import { XMarkIcon } from '@heroicons/react/20/solid'

export const ToastList = () => {
  const { toasts } = Toast.useToastManager()
  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={styles.toast}>
      <Toast.Title className={styles.title} />
      <Toast.Description className={styles.description} />
      <Toast.Close className={styles.close} aria-label="Close">
        <XMarkIcon className={styles.icon} fill="#FFF" width={20} height={20} />
      </Toast.Close>
    </Toast.Root>
  ))
}
