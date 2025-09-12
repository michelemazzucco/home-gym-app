'use client'
import * as React from 'react'
import { Toast } from '@base-ui-components/react/toast'
import styles from './index.module.css'
import { XMarkIcon } from '@heroicons/react/16/solid'

export const ToastList = () => {
  const { toasts } = Toast.useToastManager()
  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={styles.toast}>
      <div>
        <Toast.Title className={styles.title} />
        <Toast.Description className={styles.description} />
      </div>
      <Toast.Close className={styles.close} aria-label="Close">
        <XMarkIcon className={styles.icon} width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}
