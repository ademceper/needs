/* eslint-disable */

// @ts-nocheck

import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Checkbox } from "@pangea/ui/components/checkbox"
import { Label } from "@pangea/ui/components/label"

import { useEnvironment } from "../../shared/keycloak-ui-shared"
import { getGroups } from "../api/methods"
import { Group } from "../api/representations"
import { Page } from "../components/page/Page"
import { usePromise } from "../utils/usePromise"

export const Groups = () => {
  const { t } = useTranslation()
  const context = useEnvironment()

  const [groups, setGroups] = useState<Group[]>([])
  const [directMembership, setDirectMembership] = useState(false)

  usePromise(
    (signal) => getGroups({ signal, context }),
    (groups) => {
      if (!directMembership) {
        groups.forEach((el) =>
          getParents(
            el,
            groups,
            groups.map(({ path }) => path)
          )
        )
      }
      setGroups(groups)
    },
    [directMembership]
  )

  const getParents = (el: Group, groups: Group[], groupsPaths: string[]) => {
    const parentPath = el.path.slice(0, el.path.lastIndexOf("/"))
    if (parentPath && !groupsPaths.includes(parentPath)) {
      el = {
        name: parentPath.slice(parentPath.lastIndexOf("/") + 1),
        path: parentPath,
      }
      groups.push(el)
      groupsPaths.push(parentPath)

      getParents(el, groups, groupsPaths)
    }
  }

  return (
    <Page title={t("groups")} description={t("groupDescriptionLabel")}>
      <div
        id="groups-list"
        aria-label={t("groups")}
        className="rounded-md border bg-card"
      >
        <div
          id="groups-list-header"
          aria-label={t("groupsListHeader")}
          className="flex items-center border-b px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="directMembership-checkbox"
              data-testid="directMembership-checkbox"
              checked={directMembership}
              onCheckedChange={(checked) =>
                setDirectMembership(checked === true)
              }
            />
            <Label htmlFor="directMembership-checkbox">
              {t("directMembership")}
            </Label>
          </div>
        </div>

        <div
          id="groups-list-columns-names"
          aria-label={t("groupsListColumnsNames")}
          className="grid grid-cols-3 gap-4 border-b px-4 py-3 text-sm font-semibold text-muted-foreground"
        >
          <span>{t("name")}</span>
          <span>{t("path")}</span>
          <span>{t("directMembership")}</span>
        </div>

        {groups.map((group, appIndex) => (
          <div
            id={`${appIndex}-group`}
            key={"group-" + appIndex}
            aria-labelledby="groups-list"
            className="grid grid-cols-3 items-center gap-4 border-b px-4 py-3 last:border-b-0 text-sm"
          >
            <span data-testid={`group[${appIndex}].name`}>{group.name}</span>
            <span id={`${appIndex}-group-path`}>{group.path}</span>
            <span id={`${appIndex}-group-directMembership`}>
              <Checkbox
                id={`${appIndex}-checkbox-directMembership`}
                checked={group.id != null}
                disabled
              />
            </span>
          </div>
        ))}
      </div>
    </Page>
  )
}

export default Groups
