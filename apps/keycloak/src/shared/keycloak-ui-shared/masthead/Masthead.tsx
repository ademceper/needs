/* eslint-disable */

// @ts-nocheck

import { TFunction } from "i18next"
import type { Keycloak, KeycloakTokenParsed } from "oidc-spa/keycloak-js"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { List as BarsIcon } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@pangea/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pangea/ui/components/dropdown-menu"

import { DefaultAvatar } from "./DefaultAvatar"
import { KeycloakDropdown } from "./KeycloakDropdown"

function loggedInUserName(
  token: KeycloakTokenParsed | undefined,
  t: TFunction
) {
  if (!token) {
    return t("unknownUser")
  }

  const givenName = token.given_name
  const familyName = token.family_name
  const preferredUsername = token.preferred_username

  if (givenName && familyName) {
    return t("fullName", { givenName, familyName })
  }

  return givenName || familyName || preferredUsername || t("unknownUser")
}

type KeycloakMastheadProps = {
  keycloak: Keycloak
  brand: {
    src?: string
    alt?: string
    className?: string
    href?: string
  }
  avatar?: { src?: string; alt?: string }
  features?: {
    hasLogout?: boolean
    hasManageAccount?: boolean
    hasUsername?: boolean
  }
  kebabDropdownItems?: ReactNode[]
  dropdownItems?: ReactNode[]
  toolbarItems?: ReactNode[]
  toolbar?: ReactNode
  [k: string]: any
}

const KeycloakMasthead = ({
  keycloak,
  brand: { src, alt, className, href },
  avatar,
  features: {
    hasLogout = true,
    hasManageAccount = true,
    hasUsername = true,
  } = {},
  kebabDropdownItems,
  dropdownItems = [],
  toolbarItems,
  toolbar,
  ...rest
}: KeycloakMastheadProps) => {
  const { t } = useTranslation()
  const extraItems: ReactNode[] = []
  if (hasManageAccount) {
    extraItems.push(
      <DropdownMenuItem
        key="manageAccount"
        onClick={() => keycloak.accountManagement()}
      >
        {t("manageAccount")}
      </DropdownMenuItem>
    )
  }
  if (hasLogout) {
    extraItems.push(
      <DropdownMenuItem key="signOut" onClick={() => keycloak.logout()}>
        {t("signOut")}
      </DropdownMenuItem>
    )
  }

  const picture = keycloak.idTokenParsed?.picture

  return (
    <header
      {...rest}
      className="flex items-center gap-4 border-b bg-background px-4 py-2"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("navigation")}
        className="md:hidden"
      >
        <BarsIcon size={20} />
      </Button>

      <a href={href} className="inline-flex items-center">
        <img src={src} alt={alt} className={className} />
      </a>

      <div className="ml-auto flex items-center gap-2">
        {toolbar}
        {toolbarItems?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}

        <div className="hidden md:block">
          <KeycloakDropdown
            data-testid="options"
            dropDownItems={[...dropdownItems, ...extraItems]}
            title={
              hasUsername
                ? loggedInUserName(keycloak.idTokenParsed, t)
                : undefined
            }
          />
        </div>

        <div className="md:hidden">
          <KeycloakDropdown
            data-testid="options-kebab"
            isKebab
            dropDownItems={[
              ...(kebabDropdownItems || dropdownItems),
              ...extraItems,
            ]}
          />
        </div>

        {picture || avatar?.src ? (
          <Avatar>
            <AvatarImage src={picture ?? avatar?.src} alt={avatar?.alt ?? t("avatar")} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        ) : (
          <DefaultAvatar {...avatar} />
        )}
      </div>
    </header>
  )
}

export default KeycloakMasthead
