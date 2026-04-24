/* eslint-disable */

// @ts-nocheck

import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form"

import { cn } from "@pangea/ui/lib/utils"
import { Textarea } from "@pangea/ui/components/textarea"

import { FormLabel } from "./FormLabel"

export type TextAreaControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> & {
  label: string
  labelIcon?: string
  isDisabled?: boolean
  [k: string]: any
}

export const TextAreaControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextAreaControlProps<T, P>
) => {
  const required = !!props.rules?.required
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>)

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  })

  return (
    <FormLabel
      isRequired={required}
      label={props.label}
      labelIcon={props.labelIcon}
      name={props.name}
      error={fieldState.error}
    >
      <Textarea
        required={required}
        id={props.name}
        data-testid={props.name}
        disabled={props.isDisabled}
        className={cn(fieldState.error && "border-destructive")}
        {...field}
      />
    </FormLabel>
  )
}
