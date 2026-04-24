/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/applications/Applications.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import {
  CaretRight,
  Check,
  ArrowSquareOut,
  Info,
} from "@phosphor-icons/react"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@needs/ui/components/button"
import { Spinner } from "@needs/ui/components/spinner"

import { deleteConsent, getApplications } from "../api/methods"
import { ClientRepresentation } from "../api/representations"
import { Page } from "../components/page/Page"
import { TFuncKey } from "../i18n"
import { formatDate } from "../utils/formatDate"
import { useAccountAlerts } from "../utils/useAccountAlerts"
import { usePromise } from "../utils/usePromise"

type Application = ClientRepresentation & {
  open: boolean
}

function DetailRow({
  term,
  children,
}: {
  term: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{term}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

export const Applications = () => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()

  const [applications, setApplications] = useState<Application[]>()
  const [key, setKey] = useState(1)
  const refresh = () => setKey(key + 1)

  usePromise(
    (signal) => getApplications({ signal, context }),
    (clients) => setApplications(clients.map((c) => ({ ...c, open: false }))),
    [key]
  )

  const toggleOpen = (clientId: string) => {
    setApplications([
      ...applications!.map((a) =>
        a.clientId === clientId ? { ...a, open: !a.open } : a
      ),
    ])
  }

  const removeConsent = async (id: string) => {
    try {
      await deleteConsent(context, id)
      refresh()
      addAlert(t("removeConsentSuccess"))
    } catch (error) {
      addError("removeConsentError", error)
    }
  }

  if (!applications) {
    return <Spinner />
  }

  return (
    <Page title={t("application")} description={t("applicationsIntroMessage")}>
      <div
        id="applications-list"
        aria-label={t("application")}
        className="rounded-md border bg-card"
      >
        <div className="grid grid-cols-[2rem_2fr_2fr_2fr] items-center gap-4 border-b px-4 py-3 text-sm font-semibold text-muted-foreground">
          <span />
          <span>{t("name")}</span>
          <span>{t("applicationType")}</span>
          <span>{t("status")}</span>
        </div>

        {applications.map((application) => (
          <div
            key={application.clientId}
            data-testid="applications-list-item"
            className="border-b last:border-b-0"
          >
            <div className="grid grid-cols-[2rem_2fr_2fr_2fr] items-center gap-4 px-4 py-3">
              <button
                type="button"
                onClick={() => toggleOpen(application.clientId)}
                aria-expanded={application.open}
                aria-controls={`content-${application.clientId}`}
                id={`toggle-${application.clientId}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              >
                <CaretRight
                  size={16}
                  className={`transition-transform ${application.open ? "rotate-90" : ""}`}
                />
              </button>

              <div className="min-w-0">
                {application.effectiveUrl ? (
                  <Button
                    variant="link"
                    className="title-case h-auto p-0"
                    onClick={() => window.open(application.effectiveUrl)}
                  >
                    {label(t, application.clientName || application.clientId)}
                    <ArrowSquareOut size={14} />
                  </Button>
                ) : (
                  <span>
                    {label(t, application.clientName || application.clientId)}
                  </span>
                )}
              </div>

              <div className="text-sm">
                {application.userConsentRequired
                  ? t("thirdPartyApp")
                  : t("internalApp")}
                {application.offlineAccess ? ", " + t("offlineAccess") : ""}
              </div>

              <div className="text-sm">
                {application.inUse ? t("inUse") : t("notInUse")}
              </div>
            </div>

            {application.open && (
              <div
                id={`content-${application.clientId}`}
                aria-label={t("applicationDetails", {
                  clientId: application.clientId,
                })}
                className="border-t bg-muted/30 px-16 py-4"
              >
                <dl className="divide-y">
                  <DetailRow term={t("client")}>
                    {application.clientId}
                  </DetailRow>
                  {application.description && (
                    <DetailRow term={t("description")}>
                      {application.description}
                    </DetailRow>
                  )}
                  {application.effectiveUrl && (
                    <DetailRow term="URL">
                      {application.effectiveUrl.split('"')}
                    </DetailRow>
                  )}
                  {application.consent && (
                    <>
                      <DetailRow term={t("hasAccessTo")}>
                        <ul className="space-y-1">
                          {application.consent.grantedScopes.map((scope) => (
                            <li
                              key={`scope${scope.id}`}
                              className="flex items-center gap-1"
                            >
                              <Check size={14} />
                              {t(scope.name as TFuncKey, scope.displayText)}
                            </li>
                          ))}
                        </ul>
                      </DetailRow>
                      {application.tosUri && (
                        <DetailRow term={t("termsOfService")}>
                          {application.tosUri}
                        </DetailRow>
                      )}
                      {application.policyUri && (
                        <DetailRow term={t("privacyPolicy")}>
                          {application.policyUri}
                        </DetailRow>
                      )}
                      {application.logoUri && (
                        <DetailRow term={t("logo")}>
                          <img src={application.logoUri} alt="" />
                        </DetailRow>
                      )}
                      <DetailRow term={t("accessGrantedOn")}>
                        {formatDate(new Date(application.consent.createdDate))}
                      </DetailRow>
                    </>
                  )}
                </dl>

                {(application.consent || application.offlineAccess) && (
                  <>
                    <hr className="my-4" />
                    <div className="flex flex-wrap items-center gap-4">
                      <ContinueCancelModal
                        buttonTitle={t("removeAccess")}
                        modalTitle={t("removeAccess")}
                        continueLabel={t("confirm")}
                        cancelLabel={t("cancel")}
                        buttonVariant="secondary"
                        onContinue={() => removeConsent(application.clientId)}
                      >
                        {t("removeModalMessage", {
                          name: application.clientId,
                        })}
                      </ContinueCancelModal>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Info size={14} /> {t("infoMessage")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Page>
  )
}

export default Applications
