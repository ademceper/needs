/* eslint-disable */

// @ts-nocheck

import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  useFormContext,
} from "react-hook-form"
import { Minus, Plus } from "@phosphor-icons/react"

import { cn } from "@pangea/ui/lib/utils"
import { Button } from "@pangea/ui/components/button"
import { Input } from "@pangea/ui/components/input"

import { getRuleValue } from "../utils/getRuleValue"
import { FormLabel } from "./FormLabel"

export type NumberControlOption = {
  key: string
  value: string
}

export type NumberControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> & {
  name: string
  label?: string
  labelIcon?: string
  controller: Omit<ControllerProps, "name" | "render">
  [k: string]: any
}

export const NumberControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  name,
  label,
  controller,
  labelIcon,
  ...rest
}: NumberControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormLabel
      name={name}
      label={label}
      isRequired={controller.rules?.required === true}
      error={errors[name]}
      labelIcon={labelIcon}
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => {
          const required = !!controller.rules?.required
          const min = getRuleValue(controller.rules?.min)
          const max = controller.rules?.max
          const value = field.value ?? controller.defaultValue
          const setValue = (newValue: number) =>
            field.onChange(
              min !== undefined ? Math.max(newValue, Number(min)) : newValue
            )

          return (
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setValue(value - 1)}
                className="rounded-r-none"
                aria-label="decrement"
              >
                <Minus size={14} />
              </Button>
              <Input
                {...rest}
                id={name}
                type="number"
                value={value ?? ""}
                required={required}
                min={min !== undefined ? Number(min) : undefined}
                max={max !== undefined ? Number(max) : undefined}
                onChange={(event) => {
                  const newValue = Number(event.currentTarget.value)
                  setValue(!isNaN(newValue) ? newValue : controller.defaultValue)
                }}
                className={cn(
                  "rounded-none text-center",
                  errors[name] && "border-destructive"
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setValue((value ?? 0) + 1)}
                className="rounded-l-none"
                aria-label="increment"
              >
                <Plus size={14} />
              </Button>
            </div>
          )
        }}
      />
    </FormLabel>
  )
}
