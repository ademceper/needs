/* eslint-disable */

// @ts-nocheck

import { get } from "lodash-es"
import { useMemo, useState } from "react"
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"
import { X } from "@phosphor-icons/react"

import { cn } from "@pangea/ui/lib/utils"
import { Button } from "@pangea/ui/components/button"
import { Input } from "@pangea/ui/components/input"
import { Badge } from "@pangea/ui/components/badge"

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
  const required = getRuleValue(controller.rules?.required) === true
  const isTypeaheadMulti = variant === SelectVariant.typeaheadMulti
  const invalid = !!get(errors, name)

  const combinedOptions = useMemo(
    () =>
      [
        ...options.filter(
          (o) => !selectedOptions.map((o) => getValue(o)).includes(getValue(o))
        ),
        ...selectedOptions,
      ] as OptionType,
    [selectedOptions, options]
  )

  const filteredOptions = combinedOptions.filter((option) =>
    getValue(option).toLowerCase().includes(filterValue.toLowerCase())
  )

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
          const currentValueArray = Array.isArray(field.value)
            ? field.value
            : field.value
            ? [field.value]
            : []

          const updateValue = (optionKey: string) => {
            if (isTypeaheadMulti) {
              if (currentValueArray.includes(optionKey)) {
                field.onChange(
                  currentValueArray.filter((v: string) => v !== optionKey)
                )
              } else {
                field.onChange([...currentValueArray, optionKey])
              }
              setFilterValue("")
            } else {
              field.onChange(
                Array.isArray(field.value) ? [optionKey] : optionKey
              )
              setOpen(false)
              setFilterValue(
                isSelectBasedOptions(combinedOptions)
                  ? combinedOptions.find((o) => o.key === optionKey)?.value ??
                      optionKey
                  : optionKey
              )
            }
          }

          return (
            <div className="relative">
              <div
                className={cn(
                  "flex min-h-10 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1",
                  invalid && "border-destructive"
                )}
                onClick={() => setOpen(true)}
              >
                {isTypeaheadMulti &&
                  currentValueArray.map((selection: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        field.onChange(
                          currentValueArray.filter(
                            (v: string) => v !== selection
                          )
                        )
                      }}
                    >
                      {isSelectBasedOptions(combinedOptions)
                        ? combinedOptions.find((o) => o.key === selection)
                            ?.value ?? selection
                        : selection}{" "}
                      ×
                    </Badge>
                  ))}
                <Input
                  id={id || name}
                  value={filterValue}
                  placeholder={placeholderText}
                  onChange={(e) => {
                    setFilterValue(e.target.value)
                    onFilter?.(e.target.value)
                    setOpen(true)
                  }}
                  onFocus={() => setOpen(true)}
                  className="h-7 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                />
                {(filterValue || currentValueArray.length > 0) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterValue("")
                      field.onChange(isTypeaheadMulti ? [] : "")
                    }}
                    aria-label="Clear"
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
              {open && (
                <div
                  className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow"
                  onMouseLeave={() => setOpen(false)}
                >
                  {filteredOptions.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No results
                    </div>
                  )}
                  {filteredOptions.map((option) => {
                    const k = key(option)
                    const selected = currentValueArray.includes(k)
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => updateValue(k)}
                        className={cn(
                          "block w-full px-3 py-2 text-left text-sm hover:bg-muted",
                          selected && "bg-muted"
                        )}
                      >
                        {getValue(option)}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }}
      />
    </FormLabel>
  )
}
