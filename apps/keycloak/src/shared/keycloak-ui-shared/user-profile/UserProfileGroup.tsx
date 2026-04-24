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
  floating?: boolean
}

export const UserProfileGroup = ({
  t,
  form,
  attribute,
  renderer,
  floating = false,
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

  if (floating) {
    const content = (
      <div className="relative">
        {children}
        {fieldLabel && (
          <Label
            htmlFor={attribute.name}
            className="pointer-events-none absolute top-1 left-4 z-10 text-xs text-muted-foreground transition-[top,font-size,color] duration-150 ease-out peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-foreground"
          >
            {fieldLabel}
            {isRequired && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
        )}
      </div>
    )

    return (
      <div key={attribute.name} className="space-y-1.5">
        {component ? (
          <div className="flex items-stretch gap-2">
            <div className="flex-1">{content}</div>
            <div>{component}</div>
          </div>
        ) : (
          content
        )}
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
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
