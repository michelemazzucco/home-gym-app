'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export const ApiKeyDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <div className="text-3xl" aria-hidden="true">
          🫣
        </div>
        <DialogTitle>Enter your OpenAI API key</DialogTitle>
        <DialogDescription>
          The key stays in this browser tab. It is never saved anywhere.
        </DialogDescription>
      </DialogHeader>

      {/* Mounted only while the dialog is open, so the draft always starts from the saved key. */}
      <ApiKeyForm onDone={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
)

const ApiKeyForm = ({ onDone }: { onDone: () => void }) => {
  const { apiKey, setApiKey } = useApp()
  const [draft, setDraft] = useState(apiKey)

  const handleSave = () => {
    if (!draft.trim()) {
      toast('Please add your API key :)')
      return
    }
    setApiKey(draft.trim())
    onDone()
  }

  return (
    <>
      <Input
        id="apikey"
        type="password"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSave()
        }}
        placeholder="sk-..."
        autoComplete="off"
      />

      <DialogFooter>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save key
        </Button>
      </DialogFooter>
    </>
  )
}
