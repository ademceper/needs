/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next"

import { Button } from "@pangea/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@pangea/ui/components/dialog"

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
      <Dialog open>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {t("somethingWentWrong")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {errorMessage ? (
              <p>{t(errorMessage)}</p>
            ) : networkErrorMessage && i18n.exists(networkErrorMessage) ? (
              <p>{t(networkErrorMessage)}</p>
            ) : (
              <p>{t("somethingWentWrongDescription")}</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={onRetry}>{t("tryAgain")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message
  }

  return null
}
