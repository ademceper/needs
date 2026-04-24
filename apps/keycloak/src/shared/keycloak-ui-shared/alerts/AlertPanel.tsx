/* eslint-disable */

// @ts-nocheck

import { X } from "@phosphor-icons/react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@pangea/ui/components/alert"

import type { AlertEntry } from "./Alerts"

export type AlertPanelProps = {
  alerts: AlertEntry[]
  onCloseAlert: (id: number) => void
}

const variantClass = {
  success: "border-emerald-500/50 text-emerald-900 dark:text-emerald-200",
  danger: "border-destructive/50 text-destructive",
  warning: "border-amber-500/50 text-amber-900 dark:text-amber-200",
  info: "border-blue-500/50 text-blue-900 dark:text-blue-200",
  default: "",
}

export function AlertPanel({ alerts, onCloseAlert }: AlertPanelProps) {
  return (
    <div
      data-testid="global-alerts"
      style={{ whiteSpace: "pre-wrap" }}
      className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex max-w-lg flex-col gap-2 p-4"
    >
      {alerts.map(({ id, variant, message, description }, index) => (
        <Alert
          key={id}
          data-testid={index === 0 ? "last-alert" : undefined}
          role="alert"
          className={`pointer-events-auto relative ${variantClass[variant] ?? ""}`}
        >
          <AlertTitle>{message}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
          <button
            type="button"
            aria-label={`Close ${message}`}
            title={message}
            onClick={() => onCloseAlert(id)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </Alert>
      ))}
    </div>
  )
}
