/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/AccountRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { IconMapper, useEnvironment } from "../../shared/keycloak-ui-shared"
import { Link, LinkBreak } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"

import { Button } from "@needs/ui/components/button"
import { Badge } from "@needs/ui/components/badge"

import { unLinkAccount } from "../api/methods"
import { LinkedAccountRepresentation } from "../api/representations"
import { useAccountAlerts } from "../utils/useAccountAlerts"

type AccountRowProps = {
  account: LinkedAccountRepresentation
  isLinked?: boolean
  refresh: () => void
}

export const AccountRow = ({
  account,
  isLinked = false,
  refresh,
}: AccountRowProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { login } = context.keycloak
  const { addAlert, addError } = useAccountAlerts()

  const unLink = async (account: LinkedAccountRepresentation) => {
    try {
      await unLinkAccount(context, account)
      addAlert(t("unLinkSuccess"))
      refresh()
    } catch (error) {
      addError("unLinkError", error)
    }
  }

  return (
    <li
      id={`${account.providerAlias}-idp`}
      aria-label={t("linkedAccounts")}
      data-testid={`linked-accounts/${account.providerName}`}
      className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <IconMapper icon={account.providerName} />
        <span
          id={`${account.providerAlias}-idp-name`}
          className="truncate text-sm font-medium"
        >
          {account.displayName}
        </span>
      </div>
      <div id={`${account.providerAlias}-idp-label`} className="shrink-0">
        <Badge variant={account.social ? "default" : "secondary"}>
          {t(account.social ? "socialLogin" : "systemDefined")}
        </Badge>
      </div>
      <div className="min-w-0 flex-5">
        <span
          id={`${account.providerAlias}-idp-username`}
          className="truncate text-sm text-muted-foreground"
        >
          {account.linkedUsername}
        </span>
      </div>
      <div
        id="setPasswordAction"
        aria-label={t("unLink")}
        className="flex shrink-0 items-center gap-2"
      >
        {isLinked ? (
          <Button
            id={`${account.providerAlias}-idp-unlink`}
            variant="link"
            onClick={() => unLink(account)}
          >
            <LinkBreak size={16} />
            {t("unLink")}
          </Button>
        ) : (
          <Button
            id={`${account.providerAlias}-idp-link`}
            variant="link"
            onClick={async () => {
              await login({
                action: "idp_link:" + account.providerAlias,
              })
            }}
          >
            <Link size={16} />
            {t("link")}
          </Button>
        )}
      </div>
    </li>
  )
}
