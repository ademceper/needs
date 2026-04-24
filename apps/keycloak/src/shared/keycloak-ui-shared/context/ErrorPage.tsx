/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/context/ErrorPage.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next"
import { Warning } from "@phosphor-icons/react"

import { Button } from "@needs/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@needs/ui/components/card"

import { getNetworkErrorMessage } from "../utils/errors"

type ErrorPageProps = {
  error?: unknown
}

export const ErrorPage = (props: ErrorPageProps) => {
  const { t, i18n } = useTranslation()
  const error = props.error
  const errorMessage = getErrorMessage(error)
  const networkErrorMessage = getNetworkErrorMessage(error)
  console.error(error)

  function onRetry() {
    location.href = location.origin + location.pathname
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Warning size={20} aria-hidden />
            {t("somethingWentWrong")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {errorMessage ? (
            <p>{t(errorMessage)}</p>
          ) : networkErrorMessage && i18n.exists(networkErrorMessage) ? (
            <p>{t(networkErrorMessage)}</p>
          ) : (
            <p>{t("somethingWentWrongDescription")}</p>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onRetry}>{t("tryAgain")}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message
  }

  return null
}
