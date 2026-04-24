/* eslint-disable */

// @ts-nocheck

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ArrowSquareOut,
  CaretRight,
  DotsThreeVertical,
  PencilSimple,
  Share,
  X,
} from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import { Badge } from "@pangea/ui/components/badge"
import { Spinner } from "@pangea/ui/components/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pangea/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pangea/ui/components/table"

import {
  ContinueCancelModal,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import { fetchPermission, fetchResources, updatePermissions } from "../api"
import { getPermissionRequests } from "../api/methods"
import { Links } from "../api/parse-links"
import { Permission, Resource } from "../api/representations"
import { useAccountAlerts } from "../utils/useAccountAlerts"
import { usePromise } from "../utils/usePromise"
import { EditTheResource } from "./EditTheResource"
import { PermissionRequest } from "./PermissionRequest"
import { ResourceToolbar } from "./ResourceToolbar"
import { ShareTheResource } from "./ShareTheResource"
import { SharedWith } from "./SharedWith"

type PermissionDetail = {
  contextOpen?: boolean
  rowOpen?: boolean
  shareDialogOpen?: boolean
  editDialogOpen?: boolean
  permissions?: Permission[]
}

type ResourcesTabProps = {
  isShared?: boolean
}

export const ResourcesTab = ({ isShared = false }: ResourcesTabProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()

  const [params, setParams] = useState<Record<string, string>>({
    first: "0",
    max: "5",
  })
  const [links, setLinks] = useState<Links | undefined>()
  const [resources, setResources] = useState<Resource[]>()
  const [details, setDetails] = useState<
    Record<string, PermissionDetail | undefined>
  >({})
  const [key, setKey] = useState(1)
  const refresh = () => setKey(key + 1)

  usePromise(
    async (signal) => {
      const result = await fetchResources(
        { signal, context },
        params,
        isShared
      )
      if (!isShared)
        await Promise.all(
          result.data.map(
            async (r) =>
              (r.shareRequests = await getPermissionRequests(r._id, {
                signal,
                context,
              }))
          )
        )
      return result
    },
    ({ data, links }) => {
      setResources(data)
      setLinks(links)
    },
    [params, key]
  )

  if (!resources) {
    return <Spinner />
  }

  const fetchPermissions = async (id: string) => {
    let permissions = details[id]?.permissions || []
    if (!details[id]) {
      permissions = await fetchPermission({ context }, id)
    }
    return permissions
  }

  const removeShare = async (resource: Resource) => {
    try {
      const permissions = (await fetchPermissions(resource._id)).map(
        ({ username }) =>
          ({
            username,
            scopes: [],
          }) as Permission
      )!
      await updatePermissions(context, resource._id, permissions)
      setDetails({})
      addAlert(t("unShareSuccess"))
    } catch (error) {
      addError("unShareError", error)
    }
  }

  const toggleOpen = async (
    id: string,
    field: keyof PermissionDetail,
    open: boolean
  ) => {
    const permissions = await fetchPermissions(id)

    setDetails({
      ...details,
      [id]: { ...details[id], [field]: open, permissions },
    })
  }

  return (
    <>
      <ResourceToolbar
        onFilter={(name) => setParams({ ...params, name })}
        count={resources.length}
        first={parseInt(params["first"])}
        max={parseInt(params["max"])}
        onNextClick={() => setParams(links?.next || {})}
        onPreviousClick={() => setParams(links?.prev || {})}
        onPerPageSelect={(first, max) =>
          setParams({ first: `${first}`, max: `${max}` })
        }
        hasNext={!!links?.next}
      />

      <Table aria-label={t("resources")}>
        <TableHeader>
          <TableRow>
            <TableHead aria-hidden="true" />
            <TableHead>{t("resourceName")}</TableHead>
            <TableHead>{t("application")}</TableHead>
            <TableHead aria-hidden={isShared}>
              {!isShared ? t("permissionRequests") : ""}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource, index) => {
            const expanded = details[resource._id]?.rowOpen
            return (
              <>
                <TableRow key={resource.name}>
                  <TableCell data-testid={`expand-${resource.name}`}>
                    {!isShared && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleOpen(
                            resource._id,
                            "rowOpen",
                            !details[resource._id]?.rowOpen
                          )
                        }
                        aria-expanded={expanded}
                        className="text-muted-foreground"
                      >
                        <CaretRight
                          size={16}
                          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                        />
                      </button>
                    )}
                  </TableCell>
                  <TableCell data-testid={`row[${index}].name`}>
                    {resource.name}
                  </TableCell>
                  <TableCell>
                    <a
                      href={resource.client.baseUrl}
                      className="inline-flex items-center gap-1 text-primary underline"
                    >
                      {resource.client.name || resource.client.clientId}
                      <ArrowSquareOut size={14} />
                    </a>
                  </TableCell>
                  <TableCell>
                    {resource.shareRequests &&
                      resource.shareRequests.length > 0 && (
                        <PermissionRequest
                          resource={resource}
                          refresh={() => refresh()}
                        />
                      )}
                    <ShareTheResource
                      resource={resource}
                      permissions={details[resource._id]?.permissions}
                      open={details[resource._id]?.shareDialogOpen || false}
                      onClose={() => setDetails({})}
                    />
                    {details[resource._id]?.editDialogOpen && (
                      <EditTheResource
                        resource={resource}
                        permissions={details[resource._id]?.permissions}
                        onClose={() => setDetails({})}
                      />
                    )}
                  </TableCell>
                  {isShared ? (
                    <TableCell>
                      {resource.scopes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="mr-1 text-sm text-muted-foreground">
                            {t("permissions")}
                          </span>
                          {resource.scopes.map((scope) => (
                            <Badge key={scope.name} variant="secondary">
                              {scope.displayName || scope.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          data-testid={`share-${resource.name}`}
                          variant="link"
                          onClick={() =>
                            toggleOpen(resource._id, "shareDialogOpen", true)
                          }
                        >
                          <Share size={14} /> {t("share")}
                        </Button>
                        <DropdownMenu
                          open={!!details[resource._id]?.contextOpen}
                          onOpenChange={(isOpen) =>
                            toggleOpen(resource._id, "contextOpen", isOpen)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="More"
                            >
                              <DotsThreeVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={
                                details[resource._id]?.permissions?.length ===
                                0
                              }
                              onClick={() =>
                                toggleOpen(
                                  resource._id,
                                  "editDialogOpen",
                                  true
                                )
                              }
                            >
                              <PencilSimple size={14} /> {t("edit")}
                            </DropdownMenuItem>
                            <ContinueCancelModal
                              buttonTitle={
                                <>
                                  <X size={14} /> {t("unShare")}
                                </>
                              }
                              modalTitle={t("unShare")}
                              continueLabel={t("confirm")}
                              cancelLabel={t("cancel")}
                              onContinue={() => removeShare(resource)}
                              isDisabled={
                                details[resource._id]?.permissions?.length ===
                                0
                              }
                            >
                              {t("unShareAllConfirm")}
                            </ContinueCancelModal>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
                {expanded && (
                  <TableRow key={`${resource.name}-expanded`}>
                    <TableCell colSpan={4} className="bg-muted/30">
                      <SharedWith
                        permissions={details[resource._id]?.permissions}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
