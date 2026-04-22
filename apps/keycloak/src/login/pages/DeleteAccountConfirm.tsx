import type { PageProps } from "keycloakify/login/pages/PageProps"
import { Warning } from "@phosphor-icons/react"

import { Alert, AlertDescription } from "@pangea/ui/components/alert"
import { Button } from "@pangea/ui/components/button"

import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { KcSubmit } from "../components/kc-form"

export default function DeleteAccountConfirm(
  props: PageProps<
    Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, triggered_from_aia } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("deleteAccountConfirm")}
    >
      <form action={url.loginAction} method="post" className="space-y-4">
        <Alert
          variant="default"
          className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100"
        >
          <Warning className="size-4" aria-hidden />
          <AlertDescription>{msg("irreversibleAction")}</AlertDescription>
        </Alert>

        <p className="text-sm">{msg("deletingImplies")}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{msg("loggingOutImmediately")}</li>
          <li>{msg("errasingData")}</li>
        </ul>
        <p className="text-sm">{msg("finalDeletionConfirmation")}</p>

        {triggered_from_aia ? (
          <div className="grid grid-cols-2 gap-2">
            <KcSubmit label={msgStr("doConfirmDelete")} />
            <Button
              size="xl"
              type="submit"
              variant="outline"
              name="cancel-aia"
              value="true"
            >
              {msgStr("doCancel")}
            </Button>
          </div>
        ) : (
          <KcSubmit label={msgStr("doConfirmDelete")} />
        )}
      </form>
    </Template>
  )
}
