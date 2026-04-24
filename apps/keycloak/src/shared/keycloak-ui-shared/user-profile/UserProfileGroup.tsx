/* eslint-disable */

// @ts-nocheck

import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata"
import { TFunction } from "i18next"
import { get } from "lodash-es"
import { PropsWithChildren, ReactNode } from "react"
import { UseFormReturn, type FieldError } from "react-hook-form"

import { Label } from "@pangea/ui/components/label"

import { FormErrorText } from "../controls/FormErrorText"
import { HelpItem } from "../controls/HelpItem"
import {
  UserFormFields,
  fieldName,
  isRequiredAttribute,
  label,
  labelAttribute,
} from "./utils"

export type UserProfileGroupProps = {
  t: TFunction
  form: UseFormReturn<UserFormFields>
  attribute: UserProfileAttributeMetadata
  renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode
}

export const UserProfileGroup = ({
  t,
  form,
  attribute,
  renderer,
  children,
}: PropsWithChildren<UserProfileGroupProps>) => {
  const helpText = label(
    t,
    attribute.annotations?.["inputHelperTextBefore"] as string
  )
  const {
    formState: { errors },
  } = form

  const component = renderer?.(attribute)
  const error = get(errors, fieldName(attribute.name)) as FieldError
  const isRequired = isRequiredAttribute(attribute)
  const labelText = labelAttribute(t, attribute) || ""

  return (
    <div key={attribute.name} className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor={attribute.name}>
          {labelText}
          {isRequired && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        {helpText && (
          <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
        )}
      </div>
      {component ? (
        <div className="flex items-stretch gap-2">
          {children}
          {component}
        </div>
      ) : (
        children
      )}
      {error && (
        <FormErrorText
          data-testid={`${attribute.name}-helper`}
          message={error.message as string}
        />
      )}
    </div>
  )
}
