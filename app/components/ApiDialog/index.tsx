'use client'

import * as React from 'react'
import { useState } from 'react'
import { Dialog } from '@base-ui-components/react/dialog'
import { Button } from '../Button'
import styles from './index.module.css'

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

  const handleSave = () => {
    setApiKey(localApiKey)
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>
          <Dialog.Title className={styles.Title}>Enter OpenAI API key</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            To get started, please enter your API key. Your API key will not be saved anywhere.
          </Dialog.Description>
          <div className={styles.Content}>
            <input
              id="apikey"
              type="password"
              className={styles.Input}
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className={styles.Actions}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!localApiKey}>
              Get Started
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
