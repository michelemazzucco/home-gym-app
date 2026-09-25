'use client'

import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export const NewPlanDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Start a new plan?</DialogTitle>
        <DialogDescription>
          Your current plan will be cleared. Copy it first if you want to keep it.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-2 grid grid-cols-2 gap-3">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button
          onClick={() => {
            onOpenChange(false)
            onConfirm()
          }}
        >
          Create new plan
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
