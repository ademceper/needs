/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { label, useEnvironment } from "../../shared/keycloak-ui-shared"
import { Button } from "@needs/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@needs/ui/components/dropdown-menu"
import { ArrowSquareOut, CaretDown } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import { useHref } from "react-router-dom"

const ReferrerLink = () => {
  const { t } = useTranslation()
  const { environment } = useEnvironment()

  return environment.referrerUrl ? (
    <Button asChild variant="link" className="inline-flex h-auto p-0">
      <a
        data-testid="referrer-link"
        href={environment.referrerUrl.replace("_hash_", "#")}
      >
        {t("backTo", {
          app: label(t, environment.referrerName, environment.referrerUrl),
        })}
        <ArrowSquareOut size={16} />
      </a>
    </Button>
  ) : null
}

const userDisplayName = (keycloak: any, fallback: string): string => {
  const token = keycloak.idTokenParsed
  if (!token) return fallback
  const { given_name, family_name, preferred_username } = token
  if (given_name && family_name) return `${given_name} ${family_name}`
  return given_name || family_name || preferred_username || fallback
}

export const Header = () => {
  const { environment, keycloak } = useEnvironment()
  const { t } = useTranslation()

  const logoUrl = environment.logoUrl ? environment.logoUrl : "/"
  const internalLogoHref = useHref(logoUrl)
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl

  const realmName = environment.realm

  return (
    <header
      data-testid="page-header"
      className="flex items-center gap-4 border-b bg-background px-4 py-2 md:px-6"
    >
      <a
        href={indexHref}
        className="inline-flex items-center text-2xl tracking-tight md:text-3xl"
        style={{ fontFamily: '"Climate Crisis", sans-serif' }}
        aria-label={realmName}
      >
        {realmName}
      </a>

      <div className="ml-auto flex items-center gap-3">
        <ReferrerLink />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              data-testid="options-toggle"
              className="gap-1"
            >
              <span>{userDisplayName(keycloak, t("unknownUser"))}</span>
              <CaretDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => keycloak.logout()}>
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
