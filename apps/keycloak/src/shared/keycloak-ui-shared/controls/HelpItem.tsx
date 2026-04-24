/* eslint-disable */

// @ts-nocheck

import { ReactNode } from "react"
import { Question as HelpIcon } from "@phosphor-icons/react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@pangea/ui/components/popover"

import { useHelp } from "../context/HelpContext"

type HelpItemProps = {
  helpText: string | ReactNode
  fieldLabelId: string
  noVerticalAlign?: boolean
  unWrap?: boolean
}

export const HelpItem = ({
  helpText,
  fieldLabelId,
  unWrap = false,
}: HelpItemProps) => {
  const { enabled } = useHelp()
  if (!enabled) return null

  const trigger = unWrap ? (
    <span>
      <HelpIcon size={14} />
    </span>
  ) : (
    <button
      type="button"
      data-testid={`help-label-${fieldLabelId}`}
      aria-label={fieldLabelId}
      onClick={(e) => e.preventDefault()}
      className="inline-flex items-center text-muted-foreground"
    >
      <HelpIcon size={14} />
    </button>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-72 text-sm">{helpText}</PopoverContent>
    </Popover>
  )
}
