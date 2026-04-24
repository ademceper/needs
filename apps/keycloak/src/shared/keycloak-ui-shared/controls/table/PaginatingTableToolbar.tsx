/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren, ReactNode } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pangea/ui/components/select"

import { TableToolbar } from "./TableToolbar"

type KeycloakPaginationProps = {
  id?: string
  count: number
  first: number
  max: number
  onNextClick: (page: number) => void
  onPreviousClick: (page: number) => void
  onPerPageSelect: (max: number, first: number) => void
  variant?: "top" | "bottom"
}

type TableToolbarProps = KeycloakPaginationProps & {
  searchTypeComponent?: ReactNode
  toolbarItem?: ReactNode
  subToolbar?: ReactNode
  inputGroupName?: string
  inputGroupPlaceholder?: string
  inputGroupOnEnter?: (value: string) => void
}

const KeycloakPagination = ({
  id,
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
}: KeycloakPaginationProps) => {
  const page = Math.round(first / max)
  const itemCount = count + page * max
  const firstIndex = first + 1
  const lastIndex = Math.min(first + max, itemCount)
  const perPageOptions = [5, 10, 20, 50, 100]

  return (
    <div id={id} className="flex items-center gap-2">
      <Select
        value={String(max)}
        onValueChange={(v) => onPerPageSelect(1, Number(v))}
      >
        <SelectTrigger className="h-9 w-22">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {perPageOptions.map((o) => (
            <SelectItem key={o} value={String(o)}>
              {o}
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
        variant="outline"
        size="icon"
        disabled={page <= 0}
        onClick={() => onPreviousClick(page * max)}
      >
        <CaretLeft size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={lastIndex >= itemCount}
        onClick={() => onNextClick(page * max)}
      >
        <CaretRight size={16} />
      </Button>
    </div>
  )
}

export const PaginatingTableToolbar = ({
  count,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  children,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
  ...rest
}: PropsWithChildren<TableToolbarProps>) => {
  return (
    <TableToolbar
      searchTypeComponent={searchTypeComponent}
      toolbarItem={
        <>
          {toolbarItem}
          <KeycloakPagination count={count} {...rest} />
        </>
      }
      subToolbar={subToolbar}
      toolbarItemFooter={
        count !== 0 ? (
          <KeycloakPagination count={count} variant="bottom" {...rest} />
        ) : null
      }
      inputGroupName={inputGroupName}
      inputGroupPlaceholder={inputGroupPlaceholder}
      inputGroupOnEnter={inputGroupOnEnter}
    >
      {children}
    </TableToolbar>
  )
}
