/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next"
import { Spinner } from "@pangea/ui/components/spinner"

export const KeycloakSpinner = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spinner aria-label={t("spinnerLoading")} />
    </div>
  )
}
