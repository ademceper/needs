/* eslint-disable */

// @ts-nocheck

import { ReactNode } from "react"
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form"

import { cn } from "@pangea/ui/lib/utils"
import { Input } from "@pangea/ui/components/input"

import { getRuleValue } from "../utils/getRuleValue"
import { FormLabel } from "./FormLabel"

export type TextControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> & {
  label: string
  labelIcon?: string | ReactNode
  isDisabled?: boolean
  helperText?: string
  "data-testid"?: string
  type?: string
  [k: string]: any
}

export const TextControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextControlProps<T, P>
) => {
  const { labelIcon, helperText, className, ...rest } = props
  const required = !!getRuleValue(props.rules?.required)
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>)

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  })

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
      helperText={helperText}
    >
      <Input
        required={required}
        id={props.name}
        data-testid={props["data-testid"] || props.name}
        disabled={props.isDisabled}
        className={cn(fieldState.error && "border-destructive", className)}
        {...rest}
        {...field}
      />
    </FormLabel>
  )
}
