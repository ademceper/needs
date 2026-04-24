/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/personal-info/PersonalInfo.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  UserProfileFields,
  beerify,
  debeerify,
  setUserProfileServerError,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { TFunction } from "i18next"
import { useState } from "react"
import { ErrorOption, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button } from "@needs/ui/components/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@needs/ui/components/alert"
import { Spinner } from "@needs/ui/components/spinner"

import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../api/methods"
import {
  UserProfileMetadata,
  UserRepresentation,
} from "../api/representations"
import { Page } from "../components/page/Page"
import type { Environment } from "../environment"
import { TFuncKey, i18n } from "../i18n"
import { useAccountAlerts } from "../utils/useAccountAlerts"
import { usePromise } from "../utils/usePromise"

export const PersonalInfo = () => {
  const { t } = useTranslation()
  const context = useEnvironment<Environment>()
  const [userProfileMetadata, setUserProfileMetadata] =
    useState<UserProfileMetadata>()
  const [supportedLocales, setSupportedLocales] = useState<string[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const form = useForm<UserRepresentation>({ mode: "onChange" })
  const { handleSubmit, reset, setValue, setError } = form
  const { addAlert } = useAccountAlerts()

  usePromise(
    (signal) =>
      Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
      ]),
    ([personalInfo, supportedLocales]) => {
      setUserProfileMetadata(personalInfo.userProfileMetadata)
      setSupportedLocales(supportedLocales)
      reset(personalInfo)
      Object.entries(personalInfo.attributes || {}).forEach(([k, v]) =>
        setValue(`attributes[${beerify(k)}]`, v)
      )
    }
  )

  const onSubmit = async (user: UserRepresentation) => {
    try {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ])
      )
      await savePersonalInfo(context, { ...user, attributes })
      const locale = attributes["locale"]?.toString()
      if (locale) {
        await i18n.changeLanguage(locale, (error) => {
          if (error) {
            console.warn("Error(s) loading locale", locale, error)
          }
        })
      }
      await context.keycloak.updateToken()
      addAlert(t("accountUpdatedMessage"))
    } catch (error) {
      addAlert(t("accountUpdatedError"), "danger")

      setUserProfileServerError(
        { responseData: { errors: error as any } },
        (name: string | number, error: unknown) =>
          setError(name as string, error as ErrorOption),
        ((key: TFuncKey, param?: object) => t(key, param as any)) as TFunction
      )
    }
  }

  if (!userProfileMetadata) {
    return <Spinner />
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true)

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
  } = context.environment.features

  return (
    <Page title={t("personalInfo")} description={t("personalInfoDescription")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <UserProfileFields
          form={form}
          userProfileMetadata={userProfileMetadata}
          supportedLocales={supportedLocales}
          currentLocale={context.environment.locale}
          t={
            ((key: unknown, params) =>
              t(key as TFuncKey, params as any)) as TFunction
          }
          renderer={(attribute) => {
            const annotations = attribute.annotations
              ? attribute.annotations
              : {}
            return attribute.name === "email" &&
              updateEmailFeatureEnabled &&
              updateEmailActionEnabled &&
              annotations["kc.required.action.supported"] &&
              (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
              <Button
                id="update-email-btn"
                type="button"
                variant="link"
                onClick={() =>
                  context.keycloak.login({ action: "UPDATE_EMAIL" })
                }
              >
                {t("updateEmail")}
                <ArrowSquareOut size={16} />
              </Button>
            ) : undefined
          }}
        />
        {!allFieldsReadOnly() && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button data-testid="save" type="submit" id="save-btn">
              {t("save")}
            </Button>
            <Button
              data-testid="cancel"
              id="cancel-btn"
              type="button"
              variant="link"
              onClick={() => reset()}
            >
              {t("cancel")}
            </Button>
          </div>
        )}
        {context.environment.features.deleteAccountAllowed && (
          <div data-testid="delete-account">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => setDeleteOpen((o) => !o)}
              aria-expanded={deleteOpen}
            >
              {deleteOpen ? "▾" : "▸"} {t("deleteAccount")}
            </Button>
            {deleteOpen && (
              <div className="mt-2">
                <Alert variant="destructive">
                  <AlertTitle>{t("deleteAccount")}</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p>{t("deleteAccountWarning")}</p>
                    <Button
                      id="delete-account-btn"
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        context.keycloak.login({ action: "delete_account" })
                      }
                      className="delete-button"
                    >
                      {t("delete")}
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}
      </form>
    </Page>
  )
}

export default PersonalInfo
