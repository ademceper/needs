/* eslint-disable */

// @ts-nocheck

import { get } from "lodash-es"
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pangea/ui/components/select"

import { getRuleValue } from "../../utils/getRuleValue"
import { FormLabel } from "../FormLabel"
import {
  SelectControlProps,
  isSelectBasedOptions,
  isString,
  key,
} from "./SelectControl"

export const SingleSelectControl = <
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
  isDisabled,
  onSelect,
  placeholderText,
}: SelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const required = getRuleValue(controller.rules?.required) === true
  const invalid = !!get(errors, name)

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
        render={({ field: { onChange, value } }) => {
          const currentKey = Array.isArray(value) ? value[0] : value
          return (
            <Select
              value={currentKey ? String(currentKey) : undefined}
              disabled={isDisabled}
              onValueChange={(v) => {
                const convertedValue = Array.isArray(value) ? [v] : v
                if (onSelect) {
                  onSelect(convertedValue, onChange)
                } else {
                  onChange(convertedValue)
                }
              }}
            >
              <SelectTrigger
                id={id || name}
                aria-label={label}
                className={invalid ? "border-destructive" : undefined}
              >
                <SelectValue placeholder={placeholderText} />
              </SelectTrigger>
              <SelectContent data-testid={`select-${name}`}>
                {[...options, ...selectedOptions].map((option) => (
                  <SelectItem key={key(option)} value={String(key(option))}>
                    {isString(option) ? option : option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }}
      />
    </FormLabel>
  )
}
