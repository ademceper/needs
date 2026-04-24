/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/OptionsComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Controller } from "react-hook-form"

import { Checkbox } from "@needs/ui/components/checkbox"
import {
  RadioGroup,
  RadioGroupItem,
} from "@needs/ui/components/radio-group"
import { Label } from "@needs/ui/components/label"

import {
  OptionLabel,
  Options,
  UserProfileFieldProps,
} from "./UserProfileFields"
import { UserProfileGroup } from "./UserProfileGroup"
import { fieldName, isRequiredAttribute, label } from "./utils"

export const OptionComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute } = props
  const isRequired = isRequiredAttribute(attribute)
  const isMultiSelect = inputType.startsWith("multiselect")
  const options =
    (attribute.validators?.options as Options | undefined)?.options || []

  const optionLabel =
    (attribute.annotations?.["inputOptionLabels"] as OptionLabel) || {}
  const prefix = attribute.annotations?.[
    "inputOptionLabelsI18nPrefix"
  ] as string

  return (
    <UserProfileGroup {...props}>
      <Controller
        name={fieldName(attribute.name)}
        control={form.control}
        defaultValue={attribute.defaultValue}
        render={({ field }) => {
          if (isMultiSelect) {
            const selected: string[] = Array.isArray(field.value)
              ? field.value
              : []
            return (
              <div className="flex flex-col gap-2">
                {options.map((option) => {
                  const checked = selected.includes(option)
                  return (
                    <div
                      key={option}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={option}
                        data-testid={option}
                        checked={checked}
                        disabled={attribute.readOnly}
                        required={isRequired}
                        onCheckedChange={(next) => {
                          if (next === true) {
                            field.onChange([...selected, option])
                          } else {
                            field.onChange(
                              selected.filter((v) => v !== option)
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option}>
                        {label(props.t, optionLabel[option], option, prefix)}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )
          }

          const value = Array.isArray(field.value)
            ? field.value[0] ?? ""
            : field.value ?? ""
          return (
            <RadioGroup
              value={value}
              disabled={attribute.readOnly}
              required={isRequired}
              onValueChange={(v) => field.onChange([v])}
            >
              {options.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <RadioGroupItem
                    id={option}
                    data-testid={option}
                    value={option}
                  />
                  <Label htmlFor={option}>
                    {label(props.t, optionLabel[option], option, prefix)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )
        }}
      />
    </UserProfileGroup>
  )
}
