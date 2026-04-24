/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/PermissionRequest.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { UserCheck } from "@phosphor-icons/react"

import { Button } from "@needs/ui/components/button"
import { Badge } from "@needs/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@needs/ui/components/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@needs/ui/components/table"

import { useEnvironment } from "../../shared/keycloak-ui-shared"
import { fetchPermission, updateRequest } from "../api"
import { Permission, Resource } from "../api/representations"
import { useAccountAlerts } from "../utils/useAccountAlerts"

type PermissionRequestProps = {
  resource: Resource
  refresh: () => void
}

export const PermissionRequest = ({
  resource,
  refresh,
}: PermissionRequestProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()

  const [open, setOpen] = useState(false)

  const toggle = () => setOpen(!open)

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false
  ) => {
    try {
      const permissions = await fetchPermission({ context }, resource._id)
      const { scopes, username } = permissions.find(
        (p) => p.username === shareRequest.username
      ) || { scopes: [], username: shareRequest.username }

      await updateRequest(
        context,
        resource._id,
        username,
        approve
          ? [...(scopes as string[]), ...(shareRequest.scopes as string[])]
          : scopes
      )
      addAlert(t("shareSuccess"))
      toggle()
      refresh()
    } catch (error) {
      addError("shareError", error)
    }
  }

  return (
    <>
      <Button variant="link" onClick={toggle} className="relative">
        <UserCheck size={20} />
        <Badge className="ml-1">{resource.shareRequests?.length}</Badge>
      </Button>

      <Dialog open={open} onOpenChange={(o) => !o && toggle()}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t("permissionRequest", { name: resource.name })}
            </DialogTitle>
          </DialogHeader>

          <Table aria-label={t("resources")}>
            <TableHeader>
              <TableRow>
                <TableHead>{t("requestor")}</TableHead>
                <TableHead>{t("permissionRequests")}</TableHead>
                <TableHead aria-hidden="true"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resource.shareRequests?.map((shareRequest) => (
                <TableRow key={shareRequest.username}>
                  <TableCell>
                    {shareRequest.firstName} {shareRequest.lastName}{" "}
                    {shareRequest.lastName ? "" : shareRequest.username}
                    <br />
                    <small className="text-muted-foreground">
                      {shareRequest.email}
                    </small>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {shareRequest.scopes.map((scope) => (
                        <Badge key={scope.toString()} variant="secondary">
                          {scope as string}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          await approveDeny(shareRequest, true)
                        }}
                      >
                        {t("accept")}
                      </Button>
                      <Button
                        onClick={async () => {
                          await approveDeny(shareRequest)
                        }}
                        variant="destructive"
                      >
                        {t("deny")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DialogFooter>
            <Button variant="link" onClick={toggle}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
