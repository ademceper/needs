/**
 * WARNING: Before modifying this file, run the following command:
 * 
 * $ npx keycloakify own --path "account/resources/Resources.tsx"
 * 
 * This file is provided by @keycloakify/keycloak-account-ui version 260502.0.2.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, TabTitleText } from "../../shared/@patternfly/react-core";

import { ResourcesTab } from "./ResourcesTab";
import { Page } from "../components/page/Page";

export const Resources = () => {
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState(0);

  return (
    <Page title={t("resources")} description={t("resourceIntroMessage")}>
      <Tabs
        activeKey={activeTabKey}
        onSelect={(_, key) => setActiveTabKey(key as number)}
        mountOnEnter
        unmountOnExit
      >
        <Tab
          data-testid="myResources"
          eventKey={0}
          title={<TabTitleText>{t("myResources")}</TabTitleText>}
        >
          <ResourcesTab />
        </Tab>
        <Tab
          data-testid="sharedWithMe"
          eventKey={1}
          title={<TabTitleText>{t("sharedWithMe")}</TabTitleText>}
        >
          <ResourcesTab isShared />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default Resources;
