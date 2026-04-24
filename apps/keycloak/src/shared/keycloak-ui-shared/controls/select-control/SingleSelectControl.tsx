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
  // Radix Select forbids SelectItem value="". Map empty keys to a sentinel
  // so the "default / no selection" option still renders.
  const EMPTY_SENTINEL = "__kc_empty__"
  const toSentinel = (v: string) => (v === "" ? EMPTY_SENTINEL : v)
  const fromSentinel = (v: string) => (v === EMPTY_SENTINEL ? "" : v)

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
              value={toSentinel(String(currentKey ?? ""))}
              disabled={isDisabled}
              onValueChange={(next) => {
                const normalized = fromSentinel(next)
                const converted = Array.isArray(value) ? [normalized] : normalized
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
                className={[
                  "h-12 w-full rounded-2xl border-transparent bg-muted px-4 hover:bg-muted/80 focus-visible:border-transparent focus-visible:bg-muted/70 focus-visible:ring-0 dark:bg-muted/60 dark:hover:bg-muted/70",
                  get(errors, name) && "border-destructive",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <SelectValue placeholder={placeholderText} />
              </SelectTrigger>
              <SelectContent>
                {combined.map((option) => (
                  <SelectItem
                    key={key(option)}
                    value={toSentinel(String(key(option)))}
                  >
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
