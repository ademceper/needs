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
import { ArrowSquareOut, SignOut } from "@phosphor-icons/react"
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
    <header data-testid="page-header" className="bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 border-b py-5">
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

            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userDisplayName(keycloak, t("unknownUser"))}
            </span>

            <Button
              variant="outline"
              data-testid="sign-out"
              onClick={() => keycloak.logout()}
            >
              <SignOut size={16} />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
