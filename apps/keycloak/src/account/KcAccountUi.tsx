/**
 * WARNING: Before modifying this file, run the following command:
 * 
 * $ npx keycloakify own --path "account/KcAccountUi.tsx"
 * 
 * This file is provided by @keycloakify/keycloak-account-ui version 260502.0.2.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { useReducer, useEffect } from "react";
import { startColorSchemeManagement } from "./colorScheme";
import { KeycloakProvider } from "../shared/keycloak-ui-shared";
import { environment } from "./environment";
import { i18n } from "./i18n/i18n";
import { Root } from "./root/Root";
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay";

document.title = "Account Management";

const prI18nInitialized = i18n.init();
startColorSchemeManagement();

export default function KcAccountUi() {
    const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);

    useEffect(() => {
        prI18nInitialized.then(() => setI18nInitialized());
    }, []);

    if (!isI18nInitialized) {
        return null;
    }

    return (
        <KeycloakProvider environment={environment}>
            <Root />
            <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
        </KeycloakProvider>
    );
}
