/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/SelectComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Controller } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@needs/ui/components/select"
import { Checkbox } from "@needs/ui/components/checkbox"
import { Label } from "@needs/ui/components/label"

import {
  OptionLabel,
  Options,
  UserProfileFieldProps,
} from "./UserProfileFields"
import { UserProfileGroup } from "./UserProfileGroup"
import { fieldName, label } from "./utils"

export const SelectComponent = (props: UserProfileFieldProps) => {
  const { t, form, inputType, attribute } = props
  const isMultiValue = inputType === "multiselect"

  const options =
    (attribute.validators?.options as Options | undefined)?.options || []

  const optionLabel =
    (attribute.annotations?.["inputOptionLabels"] as OptionLabel) || {}
  const prefix = attribute.annotations?.[
    "inputOptionLabelsI18nPrefix"
  ] as string

  const fetchLabel = (option: string) =>
    label(props.t, optionLabel[option], option, prefix)

  return (
    <UserProfileGroup {...props}>
      <Controller
        name={fieldName(attribute.name)}
        defaultValue={attribute.defaultValue}
        control={form.control}
        render={({ field }) => {
          if (isMultiValue) {
            const selected: string[] = Array.isArray(field.value)
              ? field.value
              : []
            return (
              <div className="flex flex-col gap-2">
                {options.map((option) => {
                  const id = `${attribute.name}-${option}`
                  const checked = selected.includes(option)
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={checked}
                        disabled={attribute.readOnly}
                        onCheckedChange={(next) => {
                          if (next === true) {
                            field.onChange([...selected, option])
                          } else {
                            field.onChange(selected.filter((v) => v !== option))
                          }
                        }}
                      />
                      <Label htmlFor={id}>{fetchLabel(option)}</Label>
                    </div>
                  )
                })}
              </div>
            )
          }

          const value =
            typeof field.value === "string" ? field.value : ""

          return (
            <Select
              value={value}
              disabled={attribute.readOnly}
              onValueChange={(v) => field.onChange(v)}
            >
              <SelectTrigger
                id={attribute.name}
                aria-label={t("selectOne")}
                className="h-12! w-full rounded-2xl! border-transparent bg-muted px-4 py-2 text-base hover:bg-muted/80 focus-visible:border-transparent focus-visible:bg-muted/70 focus-visible:ring-0 dark:bg-muted/60 dark:hover:bg-muted/70"
              >
                <SelectValue placeholder={t("selectOne")} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {fetchLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }}
      />
    </UserProfileGroup>
  )
}
