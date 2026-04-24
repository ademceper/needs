/* eslint-disable */

// @ts-nocheck

import { Children, useState } from "react"
import { X } from "@phosphor-icons/react"

import { cn } from "@pangea/ui/lib/utils"
import { Button } from "@pangea/ui/components/button"
import { Input } from "@pangea/ui/components/input"
import { Badge } from "@pangea/ui/components/badge"

import { KeycloakSelectProps, SelectVariant } from "./KeycloakSelect"

export const TypeaheadSelect = ({
  toggleId,
  onSelect,
  onToggle,
  onFilter,
  variant,
  validated,
  placeholderText,
  selections,
  isDisabled,
  children,
  footer,
  typeAheadAriaLabel,
}: KeycloakSelectProps) => {
  const [filterValue, setFilterValue] = useState("")
  const [open, setOpen] = useState(false)

  const childArray = Children.toArray(children) as any[]

  const filtered = childArray.filter((c) => {
    const text = String(c?.props?.children ?? "")
    return text.toLowerCase().includes(filterValue.toLowerCase())
  })

  const selArr = Array.isArray(selections)
    ? selections
    : selections
    ? [selections]
    : []

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1",
          validated === "error" && "border-destructive"
        )}
        onClick={() => {
          setOpen(true)
          onToggle?.(true)
        }}
      >
        {variant === SelectVariant.typeaheadMulti &&
          selArr.map((s: any, i: number) => (
            <Badge
              key={i}
              variant="secondary"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(s)
              }}
            >
              {s} ×
            </Badge>
          ))}
        <Input
          id={toggleId}
          aria-label={typeAheadAriaLabel}
          value={
            variant === SelectVariant.typeahead && selections
              ? String(selections)
              : filterValue
          }
          placeholder={placeholderText}
          onChange={(e) => {
            setFilterValue(e.target.value)
            onFilter?.(e.target.value)
          }}
          onFocus={() => {
            setOpen(true)
            onToggle?.(true)
          }}
          disabled={isDisabled}
          className="h-7 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        />
        {filterValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Clear input value"
            onClick={(e) => {
              e.stopPropagation()
              onSelect?.("")
              setFilterValue("")
              onFilter?.("")
            }}
          >
            <X size={12} />
          </Button>
        )}
      </div>
      {open && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow"
          onMouseLeave={() => {
            setOpen(false)
            onToggle?.(false)
          }}
        >
          {filtered.map((c, i) => (
            <button
              key={c?.key ?? i}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                onSelect?.(c?.props?.value ?? c?.props?.children)
                setFilterValue("")
                onFilter?.("")
                if (variant !== SelectVariant.typeaheadMulti) {
                  setOpen(false)
                  onToggle?.(false)
                }
              }}
            >
              {c?.props?.children}
            </button>
          ))}
          {footer && (
            <div className="border-t px-3 py-2 text-sm">{footer}</div>
          )}
        </div>
      )}
    </div>
  )
}
