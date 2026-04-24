/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/TypeaheadSelectControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { X, CaretDown } from "@phosphor-icons/react"
import { get } from "lodash-es"
import { useMemo, useRef, useState } from "react"
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

import { cn } from "@needs/ui/lib/utils"
import { Button } from "@needs/ui/components/button"
import { Input } from "@needs/ui/components/input"
import { Badge } from "@needs/ui/components/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@needs/ui/components/popover"

import { getRuleValue } from "../../utils/getRuleValue"
import { FormLabel } from "../FormLabel"
import {
  OptionType,
  SelectControlOption,
  SelectControlProps,
  SelectVariant,
  isSelectBasedOptions,
  isString,
  key,
} from "./SelectControl"

const getValue = (option: SelectControlOption | string) =>
  isString(option) ? option : option.value

export const TypeaheadSelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  id,
  name,
  label,
  options,
  selectedOptions = [],
  controller,
  labelIcon,
  placeholderText,
  onFilter,
  variant,
}: SelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [open, setOpen] = useState(false)
  const [filterValue, setFilterValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const required = getRuleValue(controller.rules?.required) === true
  const isTypeaheadMulti = variant === SelectVariant.typeaheadMulti

  const combinedOptions = useMemo(
    () =>
      [
        ...options.filter(
          (o) =>
            !selectedOptions.map((s) => getValue(s)).includes(getValue(o))
        ),
        ...selectedOptions,
      ] as OptionType,
    [selectedOptions, options]
  )

  const filteredOptions = combinedOptions.filter((option) =>
    getValue(option).toLowerCase().startsWith(filterValue.toLowerCase())
  )

  const findValue = (k: string) =>
    isSelectBasedOptions(combinedOptions)
      ? combinedOptions.find((o) => o.key === k)?.value ?? k
      : k

  return (
    <FormLabel
      id={id}
      name={name}
      label={label}
      isRequired={required}
      error={get(errors, name)}
      labelIcon={labelIcon}
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => {
          const arrayValue: string[] = Array.isArray(field.value)
            ? field.value
            : field.value
              ? [field.value]
              : []
          const singleKey = Array.isArray(field.value)
            ? field.value[0] ?? ""
            : field.value ?? ""

          const triggerContent =
            variant === SelectVariant.typeahead
              ? findValue(singleKey) || placeholderText || ""
              : placeholderText || ""

          const clear = () => {
            setFilterValue("")
            field.onChange(isTypeaheadMulti ? [] : "")
          }

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={id || name}
                  aria-expanded={open}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm",
                    get(errors, name) && "border-destructive"
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                    {isTypeaheadMulti && arrayValue.length > 0 ? (
                      arrayValue.map((selection) => (
                        <Badge
                          key={selection}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={(ev) => {
                            ev.stopPropagation()
                            field.onChange(
                              arrayValue.filter((item) => item !== selection)
                            )
                          }}
                        >
                          {findValue(selection)} ×
                        </Badge>
                      ))
                    ) : (
                      <span
                        className={cn(
                          "truncate text-left",
                          !triggerContent && "text-muted-foreground"
                        )}
                      >
                        {triggerContent || placeholderText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {(filterValue || arrayValue.length > 0) && (
                      <span
                        role="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation()
                          clear()
                        }}
                        aria-label="Clear input value"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </span>
                    )}
                    <CaretDown size={14} className="text-muted-foreground" />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-2"
              >
                <Input
                  ref={inputRef}
                  placeholder={placeholderText}
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value)
                    onFilter?.(e.target.value)
                  }}
                  className="mb-2"
                />
                <ul
                  role="listbox"
                  className="max-h-60 overflow-auto text-sm"
                >
                  {filteredOptions.map((option) => {
                    const k = String(key(option))
                    const active = arrayValue.includes(k)
                    return (
                      <li key={k}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            if (isTypeaheadMulti) {
                              if (active) {
                                field.onChange(
                                  arrayValue.filter((v) => v !== k)
                                )
                              } else {
                                field.onChange([...arrayValue, k])
                              }
                              setFilterValue("")
                            } else {
                              field.onChange(
                                Array.isArray(field.value) ? [k] : k
                              )
                              setOpen(false)
                            }
                          }}
                          className={cn(
                            "block w-full rounded-sm px-2 py-1.5 text-left hover:bg-muted",
                            active && "bg-muted font-medium"
                          )}
                        >
                          {getValue(option)}
                        </button>
                      </li>
                    )
                  })}
                  {filteredOptions.length === 0 && (
                    <li className="px-2 py-1.5 text-muted-foreground">
                      —
                    </li>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          )
        }}
      />
    </FormLabel>
  )
}
