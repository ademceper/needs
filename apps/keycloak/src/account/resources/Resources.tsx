/* eslint-disable */

// @ts-nocheck

import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@pangea/ui/components/tabs"

import { ResourcesTab } from "./ResourcesTab"
import { Page } from "../components/page/Page"

export const Resources = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my")

  return (
    <Page title={t("resources")} description={t("resourceIntroMessage")}>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "my" | "shared")}
      >
        <TabsList>
          <TabsTrigger value="my" data-testid="myResources">
            {t("myResources")}
          </TabsTrigger>
          <TabsTrigger value="shared" data-testid="sharedWithMe">
            {t("sharedWithMe")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my">
          <ResourcesTab />
        </TabsContent>
        <TabsContent value="shared">
          <ResourcesTab isShared />
        </TabsContent>
      </Tabs>
    </Page>
  )
}

export default Resources
