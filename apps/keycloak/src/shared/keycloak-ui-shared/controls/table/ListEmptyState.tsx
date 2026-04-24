/* eslint-disable */

// @ts-nocheck

import {
  ComponentClass,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from "react"
import { Plus, MagnifyingGlass } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"

type SVGIconProps = React.SVGProps<SVGSVGElement>

export type Action = {
  text: string
  type?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export type ListEmptyStateProps = {
  message: string
  instructions: ReactNode
  primaryActionText?: string
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>
  hasIcon?: boolean
  icon?: ComponentClass<SVGIconProps>
  isSearchVariant?: boolean
  secondaryActions?: Action[]
  isDisabled?: boolean
}

export const ListEmptyState = ({
  message,
  instructions,
  onPrimaryAction,
  hasIcon = true,
  isSearchVariant,
  primaryActionText,
  secondaryActions,
  icon,
  isDisabled = false,
  children,
}: PropsWithChildren<ListEmptyStateProps>) => {
  const IconComponent = isSearchVariant ? MagnifyingGlass : icon ?? Plus

  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center rounded-md border bg-card px-4 py-12 text-center"
    >
      {hasIcon && (
        <div className="mb-4 text-muted-foreground">
          <IconComponent size={48} />
        </div>
      )}
      <h1 className="text-lg font-semibold">{message}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {instructions}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {primaryActionText && (
          <Button
            data-testid={`${message
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            onClick={onPrimaryAction}
            disabled={isDisabled}
          >
            {primaryActionText}
          </Button>
        )}
        {children}
        {secondaryActions?.map((action) => (
          <Button
            key={action.text}
            data-testid={`${action.text
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            variant="outline"
            onClick={action.onClick}
            disabled={isDisabled}
          >
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  )
}
