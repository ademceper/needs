/* eslint-disable */

// @ts-nocheck

import { Controller } from "react-hook-form"

import { Checkbox } from "@pangea/ui/components/checkbox"
import { Label } from "@pangea/ui/components/label"

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
        render={({ field }) => (
          <div className="space-y-2">
            {options.map((option) => {
              const checked = field.value?.includes(option)
              return (
                <div key={option} className="flex items-center gap-2">
                  {isMultiSelect ? (
                    <Checkbox
                      id={option}
                      data-testid={option}
                      checked={checked}
                      disabled={attribute.readOnly}
                      onCheckedChange={(c) => {
                        if (c) {
                          field.onChange([...(field.value || []), option])
                        } else {
                          field.onChange(
                            field.value?.filter(
                              (item: string) => item !== option
                            )
                          )
                        }
                      }}
                    />
                  ) : (
                    <input
                      type="radio"
                      id={option}
                      data-testid={option}
                      value={option}
                      checked={checked}
                      disabled={attribute.readOnly}
                      required={isRequired}
                      onChange={() => field.onChange([option])}
                      className="h-4 w-4"
                    />
                  )}
                  <Label htmlFor={option}>
                    {label(props.t, optionLabel[option], option, prefix)}
                  </Label>
                </div>
              )
            })}
          </div>
        )}
      />
    </UserProfileGroup>
  )
}
