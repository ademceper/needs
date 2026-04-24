/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/MultiInputComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { MinusCircle, Plus } from "@phosphor-icons/react"
import { type TFunction } from "i18next"
import { Fragment, useEffect, useMemo } from "react"
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form"

import { Button } from "@needs/ui/components/button"
import { Input } from "@needs/ui/components/input"

import { InputType, UserProfileFieldProps } from "./UserProfileFields"
import { UserProfileGroup } from "./UserProfileGroup"
import { UserFormFields, fieldName, labelAttribute } from "./utils"

export const MultiInputComponent = ({
  t,
  form,
  attribute,
  renderer,
  ...rest
}: UserProfileFieldProps) => (
  <UserProfileGroup t={t} form={form} attribute={attribute} renderer={renderer}>
    <MultiLineInput
      t={t}
      form={form}
      aria-label={labelAttribute(t, attribute)}
      name={fieldName(attribute.name)!}
      defaultValue={[attribute.defaultValue || ""]}
      addButtonLabel={t("addMultivaluedLabel", {
        fieldLabel: labelAttribute(t, attribute),
      })}
      {...rest}
    />
  </UserProfileGroup>
)

export type MultiLineInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  t: TFunction
  name: FieldPath<UserFormFields>
  form: UseFormReturn<UserFormFields>
  addButtonLabel?: string
  isDisabled?: boolean
  defaultValue?: string[]
  inputType: InputType
}

const MultiLineInput = ({
  t,
  name,
  inputType,
  form,
  addButtonLabel,
  isDisabled = false,
  defaultValue,
  id,
  ...rest
}: MultiLineInputProps) => {
  const { register, setValue, control } = form
  const value = useWatch({
    name,
    control,
    defaultValue: defaultValue || "",
  })

  const fields = useMemo<string[]>(() => {
    return Array.isArray(value) && value.length !== 0
      ? value
      : defaultValue || [""]
  }, [value])

  const remove = (index: number) => {
    update([...fields.slice(0, index), ...fields.slice(index + 1)])
  }

  const append = () => {
    update([...fields, ""])
  }

  const updateValue = (index: number, value: string) => {
    update([...fields.slice(0, index), value, ...fields.slice(index + 1)])
  }

  const update = (values: string[]) => {
    const fieldValue = values.flatMap((field) => field)
    setValue(name, fieldValue, {
      shouldDirty: true,
    })
  }

  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as string)
    : "text"

  useEffect(() => {
    register(name)
  }, [register])

  return (
    <div id={id} className="space-y-2">
      {fields.map((value, index) => (
        <Fragment key={index}>
          <div className="flex items-center gap-2">
            <Input
              data-testid={name + index}
              onChange={(e) => updateValue(index, e.target.value)}
              name={`${name}.${index}.value`}
              value={value}
              disabled={isDisabled}
              type={type}
              variant="secondary"
              size="xl"
              {...rest}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-testid={"remove" + index}
              onClick={() => remove(index)}
              tabIndex={-1}
              aria-label={t("remove")}
              disabled={fields.length === 1 || isDisabled}
            >
              <MinusCircle size={16} />
            </Button>
          </div>
          {index === fields.length - 1 && (
            <Button
              type="button"
              variant="link"
              onClick={append}
              tabIndex={-1}
              aria-label={t("add")}
              data-testid="addValue"
              disabled={!value || isDisabled}
              className="px-0"
            >
              <Plus size={16} /> {t(addButtonLabel || "add")}
            </Button>
          )}
        </Fragment>
      ))}
    </div>
  )
}
