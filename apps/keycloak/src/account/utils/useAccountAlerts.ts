/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "account/utils/useAccountAlerts.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useAlerts } from "../../shared/keycloak-ui-shared";

const AlertVariant = {
  default: "default",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
} as const;
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ApiError } from "../api/parse-response";

export function useAccountAlerts() {
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const addAccountError = useCallback(
    (messageKey: string, error: unknown) => {
      if (!(error instanceof ApiError)) {
        addError(messageKey, error);
        return;
      }

      const message = t(messageKey, { error: error.message });
      addAlert(message, AlertVariant.danger, error.description);
    },
    [addAlert, addError, t],
  );

  return useMemo(
    () => ({ addAlert, addError: addAccountError }),
    [addAccountError, addAlert],
  );
}
