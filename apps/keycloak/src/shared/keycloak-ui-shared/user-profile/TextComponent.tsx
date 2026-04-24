/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@needs/ui/lib/utils"
import { Input } from "@needs/ui/components/input"

import { UserProfileFieldProps } from "./UserProfileFields"
import { UserProfileGroup } from "./UserProfileGroup"
import { fieldName, isRequiredAttribute, label } from "./utils"

export const TextComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute } = props
  const isRequired = isRequiredAttribute(attribute)
  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as string)
    : "text"

  return (
    <UserProfileGroup {...props} floating>
      <Input
        id={attribute.name}
        data-testid={attribute.name}
        type={type}
        variant="secondary"
        size="xl"
        placeholder={
          attribute.readOnly
            ? " "
            : label(
                props.t,
                attribute.annotations?.["inputTypePlaceholder"] as string,
                " ",
                attribute.annotations?.[
                  "inputOptionLabelsI18nPrefix"
                ] as string
              ) || " "
        }
        disabled={attribute.readOnly}
        required={isRequired}
        defaultValue={attribute.defaultValue}
        className={cn("peer pt-5 pb-1 placeholder:text-transparent")}
        {...form.register(fieldName(attribute.name))}
      />
    </UserProfileGroup>
  )
}
