/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata"
import { TFunction } from "i18next"
import { get } from "lodash-es"
import { PropsWithChildren, ReactNode } from "react"
import { UseFormReturn, type FieldError } from "react-hook-form"

import { Label } from "@needs/ui/components/label"

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
  const fieldLabel = labelAttribute(t, attribute) || ""
  const isRequired = isRequiredAttribute(attribute)

  return (
    <div key={attribute.name} className="space-y-1.5">
      {fieldLabel && (
        <div className="flex items-center gap-1">
          <Label htmlFor={attribute.name}>
            {fieldLabel}
            {isRequired && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
          {helpText && (
            <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
          )}
        </div>
      )}
      {component ? (
        <div className="flex items-stretch gap-2">
          <div className="flex-1">{children}</div>
          <div>{component}</div>
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
