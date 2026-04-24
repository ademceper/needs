/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/SingleSelectControl.tsx" --revert
 */

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
} from "@needs/ui/components/select"

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
  const combined = [...options, ...selectedOptions]

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
          const currentKey = Array.isArray(value) ? value[0] ?? "" : value ?? ""
          return (
            <Select
              value={String(currentKey ?? "")}
              disabled={isDisabled}
              onValueChange={(next) => {
                const converted = Array.isArray(value) ? [next] : next
                if (onSelect) {
                  onSelect(converted, onChange)
                } else {
                  onChange(converted)
                }
              }}
            >
              <SelectTrigger
                id={id || name}
                aria-label={label}
                data-testid={`select-${name}`}
                className={get(errors, name) ? "border-destructive" : undefined}
              >
                <SelectValue placeholder={placeholderText} />
              </SelectTrigger>
              <SelectContent>
                {combined.map((option) => (
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
