/* eslint-disable */

// @ts-nocheck

import { ReactNode } from "react"
import { DotsThreeVertical } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@pangea/ui/components/dropdown-menu"

type KeycloakDropdownProps = {
  "data-testid"?: string
  isKebab?: boolean
  title?: ReactNode
  dropDownItems: ReactNode[]
  [k: string]: any
}

export const KeycloakDropdown = ({
  isKebab = false,
  title,
  dropDownItems,
  ...rest
}: KeycloakDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid={`${rest["data-testid"]}-toggle`}
          variant={isKebab ? "ghost" : "outline"}
          size={isKebab ? "icon" : "default"}
        >
          {isKebab ? <DotsThreeVertical size={16} /> : title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{dropDownItems}</DropdownMenuContent>
    </DropdownMenu>
  )
}
