'use client'

import * as React from 'react'
import { useState } from 'react'
import { Dialog } from '@base-ui-components/react/dialog'
import { Button, KeyField } from '../'
import styles from './index.module.css'
import { useToast } from '../../hooks/useToast'

export const ApiDialog = ({
  open,
  setOpen,
  apiKey,
  setApiKey,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  apiKey: string
  setApiKey: (apiKey: string) => void
}) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const { showToast } = useToast()

  const handleSave = () => {
    if (!localApiKey) {
      showToast('Please add you API key :)')
      return
    }
    setApiKey(localApiKey)
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <Dialog.Title className={styles.title}>
            <div className={styles.emoji}>🫣</div>
            Enter your OpenAI API key
          </Dialog.Title>
          <Dialog.Description className={styles.description}>
            To get started, please enter your API key &mdash; It will not be saved anywhere.
          </Dialog.Description>
          <div className={styles.content}>
            <KeyField
              id="apikey"
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className={styles.actions}>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Get Started
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
