/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextAreaComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Textarea } from "@needs/ui/components/textarea"

import { UserProfileFieldProps } from "./UserProfileFields"
import { UserProfileGroup } from "./UserProfileGroup"
import { fieldName, isRequiredAttribute } from "./utils"

export const TextAreaComponent = (props: UserProfileFieldProps) => {
  const { form, attribute } = props
  const isRequired = isRequiredAttribute(attribute)

  return (
    <UserProfileGroup {...props}>
      <Textarea
        id={attribute.name}
        data-testid={attribute.name}
        {...form.register(fieldName(attribute.name))}
        cols={attribute.annotations?.["inputTypeCols"] as number}
        rows={(attribute.annotations?.["inputTypeRows"] as number) ?? 4}
        readOnly={attribute.readOnly}
        required={isRequired}
        defaultValue={attribute.defaultValue}
        className="rounded-2xl border-transparent bg-muted px-4 py-2 text-base hover:bg-muted/80 focus-visible:border-transparent focus-visible:bg-muted/70 focus-visible:ring-0 dark:bg-muted/60 dark:hover:bg-muted/70"
      />
    </UserProfileGroup>
  )
}
