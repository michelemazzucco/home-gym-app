'use client'

import { Dumbbell } from 'lucide-react'
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
        <Dumbbell aria-hidden="true" className="size-7 text-accent" strokeWidth={1.75} />
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
          <span className="text-chalk">2. Check the equipment.</span> Untick what the app got wrong
          and add what it missed.
        </li>
        <li>
          <span className="text-chalk">3. Train.</span> Copy the plan and get going.
        </li>
      </ol>

      <p className="text-sm text-muted-foreground">
        Your photo and settings go to OpenAI to build the plan. This app keeps nothing on its
        server; your plan stays in this browser.
      </p>
    </DialogContent>
  </Dialog>
)
