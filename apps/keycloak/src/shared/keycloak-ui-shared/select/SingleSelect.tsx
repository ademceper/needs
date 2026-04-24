/* eslint-disable */

// @ts-nocheck

import { Children } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pangea/ui/components/select"

import { KeycloakSelectProps } from "./KeycloakSelect"

type SingleSelectProps = Omit<KeycloakSelectProps, "variant">

export const SingleSelect = ({
  toggleId,
  onSelect,
  selections,
  isDisabled,
  className,
  children,
  ...props
}: SingleSelectProps) => {
  const childArray = Children.toArray(children) as any[]

  const currentValue = Array.isArray(selections) ? selections[0] : selections

  return (
    <Select
      value={currentValue !== undefined ? String(currentValue) : undefined}
      disabled={isDisabled}
      onValueChange={(v) => onSelect?.(v)}
    >
      <SelectTrigger
        id={toggleId}
        aria-label={props["aria-label"]}
        className={className}
      >
        <SelectValue placeholder={props["aria-label"]} />
      </SelectTrigger>
      <SelectContent>
        {childArray.map((c, i) => (
          <SelectItem
            key={c?.key ?? i}
            value={String(c?.props?.value ?? c?.props?.children ?? "")}
          >
            {c?.props?.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
