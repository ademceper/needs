/* eslint-disable */

// @ts-nocheck

import {
  ContinueCancelModal,
  useEnvironment,
  label,
} from "../../shared/keycloak-ui-shared"
import {
  Desktop,
  DeviceMobile,
  ArrowsClockwise,
} from "@phosphor-icons/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@pangea/ui/components/button"
import { Badge } from "@pangea/ui/components/badge"
import { Spinner } from "@pangea/ui/components/spinner"

import { deleteSession, getDevices } from "../api/methods"
import {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../api/representations"
import { Page } from "../components/page/Page"
import { formatDate } from "../utils/formatDate"
import { useAccountAlerts } from "../utils/useAccountAlerts"
import { usePromise } from "../utils/usePromise"

export const DeviceActivity = () => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()

  const [devices, setDevices] = useState<DeviceRepresentation[]>()
  const [key, setKey] = useState(0)
  const refresh = () => setKey(key + 1)

  const moveCurrentToTop = (devices: DeviceRepresentation[]) => {
    let currentDevice = devices[0]

    const index = devices.findIndex(d => d.current)
    currentDevice = devices.splice(index, 1)[0]
    devices.unshift(currentDevice)

    const sessionIndex = currentDevice.sessions.findIndex(s => s.current)
    const currentSession = currentDevice.sessions.splice(sessionIndex, 1)[0]
    currentDevice.sessions.unshift(currentSession)

    setDevices(devices)
  }

  usePromise(signal => getDevices({ signal, context }), moveCurrentToTop, [key])

  const signOutAll = async () => {
    await deleteSession(context)
    await context.keycloak.logout()
  }

  const signOutSession = async (
    session: SessionRepresentation,
    device: DeviceRepresentation
  ) => {
    try {
      await deleteSession(context, session.id)
      addAlert(
        t("signedOutSession", { browser: session.browser, os: device.os })
      )
      refresh()
    } catch (error) {
      addError("errorSignOutMessage", error)
    }
  }

  const makeClientsString = (clients: ClientRepresentation[]): string => {
    let clientsString = ""
    clients.forEach((client, index) => {
      let clientName: string
      if (client.clientName !== "") {
        clientName = label(t, client.clientName)
      } else {
        clientName = client.clientId
      }

      clientsString += clientName

      if (clients.length > index + 1) clientsString += ", "
    })

    return clientsString
  }

  if (!devices) {
    return <Spinner />
  }

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
    >
      <div className="mb-6 flex items-start gap-4">
        <h2 className="flex-1 text-xl font-semibold">{t("signedInDevices")}</h2>
        <div className="flex items-center gap-2">
          <Button
            id="refresh-page"
            variant="link"
            onClick={() => refresh()}
          >
            <ArrowsClockwise size={16} />
            {t("refreshPage")}
          </Button>

          {(devices.length > 1 || devices[0].sessions.length > 1) && (
            <ContinueCancelModal
              buttonTitle={t("signOutAllDevices")}
              modalTitle={t("signOutAllDevices")}
              continueLabel={t("confirm")}
              cancelLabel={t("cancel")}
              onContinue={() => signOutAll()}
            >
              {t("signOutAllDevicesWarning")}
            </ContinueCancelModal>
          )}
        </div>
      </div>

      <ul
        className="signed-in-device-list space-y-3"
        aria-label={t("signedInDevices")}
      >
        {devices.map(device =>
          device.sessions.map((session, index) => (
            <li
              key={`${device.id}-${session.id ?? index}`}
              data-testid={`row-${index}`}
              className="rounded-md border bg-card p-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 text-muted-foreground">
                  {device.mobile ? (
                    <DeviceMobile size={24} />
                  ) : (
                    <Desktop size={24} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="session-title font-medium">
                      {device.os.toLowerCase().includes("unknown")
                        ? t("unknownOperatingSystem")
                        : device.os}{" "}
                      {!device.osVersion.toLowerCase().includes("unknown") &&
                        device.osVersion}{" "}
                      / {session.browser}
                    </span>
                    {session.current && (
                      <Badge className="bg-emerald-600 text-white">
                        {t("currentSession")}
                      </Badge>
                    )}
                  </div>
                  <dl className="signed-in-device-grid grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <dt className="text-muted-foreground">
                        {t("ipAddress")}
                      </dt>
                      <dd>{session.ipAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t("lastAccessedOn")}
                      </dt>
                      <dd>{formatDate(new Date(session.lastAccess * 1000))}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("clients")}</dt>
                      <dd>{makeClientsString(session.clients)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("started")}</dt>
                      <dd>{formatDate(new Date(session.started * 1000))}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t("expires")}</dt>
                      <dd>{formatDate(new Date(session.expires * 1000))}</dd>
                    </div>
                  </dl>
                </div>
                {!session.current && (
                  <div>
                    <ContinueCancelModal
                      buttonTitle={t("signOut")}
                      modalTitle={t("signOut")}
                      continueLabel={t("confirm")}
                      cancelLabel={t("cancel")}
                      buttonVariant="secondary"
                      onContinue={() => signOutSession(session, device)}
                    >
                      {t("signOutWarning")}
                    </ContinueCancelModal>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </Page>
  )
}

export default DeviceActivity
