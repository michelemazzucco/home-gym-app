'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

export const InfoDialog = ({
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
          🏋️
        </div>
        <DialogTitle>How this works</DialogTitle>
        <DialogDescription>
          Take a photo of the equipment you have at home. The app reads the photo, shows you what it
          found so you can correct it, and then writes a workout plan that uses only those items.
        </DialogDescription>
      </DialogHeader>

      <ol className="space-y-2 text-base text-muted-foreground">
        <li>
          <span className="text-chalk">1. Set up.</span> Pick your level, how often you train and
          how long the plan runs. Add a photo.
        </li>
        <li>
          <span className="text-chalk">2. Check the gear.</span> Remove what the app got wrong and
          add what it missed.
        </li>
        <li>
          <span className="text-chalk">3. Train.</span> Copy the plan and get going.
        </li>
      </ol>

      <p className="text-sm text-muted-foreground">
        The photo and the plan are sent to OpenAI and are not stored on any server.
      </p>
    </DialogContent>
  </Dialog>
)
