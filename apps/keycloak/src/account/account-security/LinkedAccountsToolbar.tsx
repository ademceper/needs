/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccountsToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MagnifyingGlass, CaretLeft, CaretRight, X } from "@phosphor-icons/react"

import { Input } from "@needs/ui/components/input"
import { Button } from "@needs/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@needs/ui/components/select"

type LinkedAccountsToolbarProps = {
  onFilter: (nameFilter: string) => void
  count: number
  first: number
  max: number
  onNextClick: (page: number) => void
  onPreviousClick: (page: number) => void
  onPerPageSelect: (max: number, first: number) => void
  hasNext: boolean
}

export const LinkedAccountsToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  onFilter,
  hasNext,
}: LinkedAccountsToolbarProps) => {
  const { t } = useTranslation()
  const [nameFilter, setNameFilter] = useState("")

  const page = Math.round(first / max) + 1
  const itemCount = count + (page - 1) * max + (hasNext ? 1 : 0)
  const firstIndex = first + 1
  const lastIndex = Math.min(first + max - 1, itemCount)

  const perPageOptions = [
    { title: "5", value: 6 },
    { title: "10", value: 11 },
    { title: "20", value: 21 },
  ]

  const submitFilter = () => onFilter(nameFilter)
  const clearFilter = () => {
    setNameFilter("")
    onFilter("")
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <div className="relative flex-1 min-w-48">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          placeholder={t("filterByName")}
          aria-label={t("filterByName")}
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitFilter()
          }}
          className="pl-9 pr-9"
        />
        {nameFilter && (
          <button
            type="button"
            onClick={clearFilter}
            aria-label={t("clear")}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(max)}
          onValueChange={(v) => onPerPageSelect(1, Number(v))}
        >
          <SelectTrigger className="h-9 w-22">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((o) => (
              <SelectItem key={o.value} value={String(o.value)}>
                {o.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="px-2 text-sm tabular-nums text-muted-foreground">
          <b>
            {firstIndex} - {lastIndex}
          </b>
        </span>

        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={t("previous")}
          disabled={page <= 1}
          onClick={() => onPreviousClick((page - 1) * max)}
        >
          <CaretLeft size={16} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={t("next")}
          disabled={!hasNext}
          onClick={() => onNextClick((page - 1) * max)}
        >
          <CaretRight size={16} />
        </Button>
      </div>
    </div>
  )
}
