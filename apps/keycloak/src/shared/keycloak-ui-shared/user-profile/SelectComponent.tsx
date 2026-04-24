/* eslint-disable */

// @ts-nocheck

import { Controller } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pangea/ui/components/select"

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
            const currentValues = Array.isArray(field.value) ? field.value : []
            return (
              <div className="space-y-2">
                {options.map((option) => {
                  const checked = currentValues.includes(option)
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${attribute.name}-${option}`}
                        checked={checked}
                        disabled={attribute.readOnly}
                        onChange={() => {
                          if (checked) {
                            field.onChange(
                              currentValues.filter((v: string) => v !== option)
                            )
                          } else {
                            field.onChange([...currentValues, option])
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`${attribute.name}-${option}`}
                        className="text-sm"
                      >
                        {fetchLabel(option)}
                      </label>
                    </div>
                  )
                })}
              </div>
            )
          }

          const value = Array.isArray(field.value) ? field.value[0] : field.value
          return (
            <Select
              value={value ? String(value) : undefined}
              disabled={attribute.readOnly}
              onValueChange={(v) => field.onChange(v)}
            >
              <SelectTrigger id={attribute.name} aria-label={t("selectOne")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={String(option)}>
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
