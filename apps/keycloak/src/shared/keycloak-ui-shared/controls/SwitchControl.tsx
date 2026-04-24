/* eslint-disable */

// @ts-nocheck

import {
  Controller,
  FieldValues,
  FieldPath,
  UseControllerProps,
  PathValue,
  useFormContext,
} from "react-hook-form"

import { Switch } from "@pangea/ui/components/switch"

import { FormLabel } from "./FormLabel"
import { debeerify } from "../user-profile/utils"

export type SwitchControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<any, P> & {
  name: string
  label?: string
  labelIcon?: string
  labelOn: string
  labelOff: string
  stringify?: boolean
  defaultValue?: any
  onChange?: (...args: any[]) => void
  [k: string]: any
}

export const SwitchControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  labelOn,
  stringify,
  defaultValue,
  labelIcon,
  ...props
}: SwitchControlProps<T, P>) => {
  const fallbackValue = stringify ? "false" : false
  const defValue = defaultValue ?? (fallbackValue as PathValue<T, P>)
  const { control } = useFormContext()
  return (
    <FormLabel
      name={props.name}
      isRequired={props.rules?.required === true}
      label={props.label}
      labelIcon={labelIcon}
    >
      <Controller
        control={control}
        name={props.name}
        defaultValue={defValue}
        render={({ field: { onChange, value } }) => (
          <div className="flex items-center gap-2">
            <Switch
              id={props.name}
              data-testid={debeerify(props.name)}
              aria-label={props.label}
              checked={stringify ? value === "true" : value}
              onCheckedChange={(checked) => {
                const v = stringify ? checked.toString() : checked
                props.onChange?.(undefined, checked)
                onChange(v)
              }}
            />
            <label htmlFor={props.name} className="text-sm">
              {labelOn}
            </label>
          </div>
        )}
      />
    </FormLabel>
  )
}
