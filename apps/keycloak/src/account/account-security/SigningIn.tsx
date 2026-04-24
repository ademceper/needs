/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/SigningIn.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { DotsThreeVertical, Warning, Info } from "@phosphor-icons/react"
import { Fragment, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { Button } from "@needs/ui/components/button"
import { Spinner } from "@needs/ui/components/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@needs/ui/components/dropdown-menu"

import { useEnvironment } from "../../shared/keycloak-ui-shared"
import { getCredentials } from "../api/methods"
import {
  CredentialContainer,
  CredentialMetadataRepresentation,
} from "../api/representations"
import { EmptyRow } from "../components/datalist/EmptyRow"
import { Page } from "../components/page/Page"
import { TFuncKey } from "../i18n"
import { formatDate } from "../utils/formatDate"
import { usePromise } from "../utils/usePromise"

type MobileLinkProps = {
  title: string
  onClick: () => void
  testid?: string
}

const MobileLink = ({ title, onClick, testid }: MobileLinkProps) => {
  return (
    <>
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={title}>
              <DotsThreeVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClick}>{title}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        variant="link"
        onClick={onClick}
        className="hidden lg:inline-flex"
        data-testid={testid}
      >
        {title}
      </Button>
    </>
  )
}

export const SigningIn = () => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { login } = context.keycloak

  const [credentials, setCredentials] = useState<CredentialContainer[]>()

  usePromise((signal) => getCredentials({ signal, context }), setCredentials, [])

  const renderCredentialRow = (
    credMetadata: CredentialMetadataRepresentation,
    container: CredentialContainer
  ) => {
    const credential = credMetadata.credential
    const hasWarning =
      credMetadata.warningMessageTitle &&
      credMetadata.warningMessageDescription

    return (
      <li
        key={credential.id}
        id={`cred-${credential.id}`}
        className="flex flex-col gap-3 border-b p-4 last:border-b-0 md:flex-row md:items-center"
      >
        <div
          data-testrole="label"
          className="min-w-0 max-w-xs truncate text-sm font-medium"
        >
          {t(credential.userLabel) || t(credential.type as TFuncKey)}
        </div>

        {credential.createdDate && (
          <div
            data-testrole="created-at"
            className="min-w-0 flex-1 text-sm text-muted-foreground"
          >
            <Trans i18nKey="credentialCreatedAt">
              <strong className="mr-2"></strong>
              {{ date: formatDate(new Date(credential.createdDate)) }}
            </Trans>
          </div>
        )}

        {(credMetadata.infoMessage ||
          credMetadata.infoProperties ||
          hasWarning) && (
          <div
            data-testrole="warning-message"
            className="min-w-0 flex-1 space-y-2 text-sm"
          >
            {credMetadata.infoMessage && (
              <p className="flex items-center gap-1">
                <Info size={14} />
                {t(
                  credMetadata.infoMessage.key,
                  credMetadata.infoMessage.parameters?.reduce(
                    (acc, val, idx) => ({ ...acc, [idx]: val }),
                    {}
                  )
                )}
              </p>
            )}
            {credMetadata.infoProperties && (
              <div className="flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0" />
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {credMetadata.infoProperties.map((prop) => (
                    <Fragment key={prop.key}>
                      <dt className="text-muted-foreground">{t(prop.key)}</dt>
                      <dd>{prop.parameters ? prop.parameters[0] : ""}</dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            )}
            {hasWarning && (
              <>
                <p className="flex items-center gap-1 text-amber-600">
                  <Warning size={14} />
                  {t(
                    credMetadata.warningMessageTitle.key,
                    credMetadata.warningMessageTitle.parameters?.reduce(
                      (acc, val, idx) => ({ ...acc, [idx]: val }),
                      {}
                    )
                  )}
                </p>
                <p className="text-muted-foreground">
                  {t(
                    credMetadata.warningMessageDescription.key,
                    credMetadata.warningMessageDescription.parameters?.reduce(
                      (acc, val, idx) => ({ ...acc, [idx]: val }),
                      {}
                    )
                  )}
                </p>
              </>
            )}
          </div>
        )}

        <div
          id={`action-${credential.id}`}
          aria-label={t("updateCredAriaLabel")}
          aria-labelledby={`cred-${credential.id}`}
          className="flex shrink-0 flex-wrap items-center gap-2"
        >
          {container.removeable && (
            <Button
              variant="destructive"
              data-testrole="remove"
              onClick={async () => {
                await login({
                  action: "delete_credential:" + credential.id,
                })
              }}
            >
              {t("delete")}
            </Button>
          )}
          {container.updateAction && (
            <Button
              variant="outline"
              onClick={async () => {
                await login({ action: container.updateAction })
              }}
              data-testrole="update"
            >
              {t("update")}
            </Button>
          )}
        </div>
      </li>
    )
  }

  if (!credentials) {
    return <Spinner />
  }

  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category)),
  ]

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      {credentialUniqueCategories.map((category) => (
        <section key={category} className="mb-8">
          <h2
            className="text-xl font-semibold"
            id={`${category}-categ-title`}
          >
            {t(category as TFuncKey)}
          </h2>

          {credentials
            .filter((cred) => cred.category == category)
            .map((container) => (
              <Fragment key={container.type}>
                <div className="mt-4 mb-3 flex items-start gap-4">
                  <div className="flex-1">
                    <h3
                      className="mb-1 text-base font-medium"
                      data-testid={`${container.type}/help`}
                    >
                      <span
                        className="cred-title block"
                        data-testid={`${container.type}/title`}
                      >
                        {t(container.displayName as TFuncKey)}
                      </span>
                    </h3>
                    <p
                      className="text-sm text-muted-foreground"
                      data-testid={`${container.type}/help-text`}
                    >
                      {t(container.helptext as TFuncKey)}
                    </p>
                  </div>

                  {container.createAction && (
                    <MobileLink
                      onClick={() =>
                        login({ action: container.createAction })
                      }
                      title={t("setUpNew", {
                        name: t(
                          `${container.type}-display-name` as TFuncKey
                        ),
                      })}
                      testid={`${container.type}/create`}
                    />
                  )}
                </div>

                <ul
                  aria-label="credential list"
                  className="mb-8 divide-y rounded-md border bg-card"
                  data-testid={`${container.type}/credential-list`}
                >
                  {container.userCredentialMetadatas.length === 0 && (
                    <EmptyRow
                      message={t("notSetUp", {
                        name: t(container.displayName as TFuncKey),
                      })}
                      data-testid={`${container.type}/not-set-up`}
                    />
                  )}

                  {container.userCredentialMetadatas.map((meta) =>
                    renderCredentialRow(meta, container)
                  )}
                </ul>
              </Fragment>
            ))}
        </section>
      ))}
    </Page>
  )
}

export default SigningIn
