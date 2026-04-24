/* eslint-disable */

// @ts-nocheck

import { ReactNode, useState } from "react"

import { Button } from "@pangea/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@pangea/ui/components/dialog"

export type ContinueCancelModalProps = {
  modalTitle: string
  continueLabel: string
  cancelLabel: string
  buttonTitle: string | ReactNode
  buttonVariant?: string
  buttonTestRole?: string
  isDisabled?: boolean
  onContinue: () => void
  component?: React.ElementType<any> | React.ComponentType<any>
  children?: ReactNode
  [k: string]: any
}

const mapVariant = (v?: string): any => {
  if (!v) return "default"
  if (v === "primary") return "default"
  if (v === "secondary") return "outline"
  if (v === "danger") return "destructive"
  if (v === "tertiary") return "outline"
  return v
}

export const ContinueCancelModal = ({
  modalTitle,
  continueLabel,
  cancelLabel,
  buttonTitle,
  isDisabled,
  buttonVariant,
  buttonTestRole,
  onContinue,
  component,
  children,
}: ContinueCancelModalProps) => {
  const [open, setOpen] = useState(false)

  const TriggerComponent = component ?? Button

  return (
    <>
      <TriggerComponent
        variant={component ? buttonVariant : mapVariant(buttonVariant)}
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        data-testrole={buttonTestRole}
      >
        {buttonTitle}
      </TriggerComponent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div>{children}</div>
          <DialogFooter>
            <Button
              id="modal-cancel"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              id="modal-confirm"
              onClick={() => {
                setOpen(false)
                onContinue()
              }}
            >
              {continueLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
