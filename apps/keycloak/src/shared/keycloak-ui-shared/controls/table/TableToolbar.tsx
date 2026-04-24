/* eslint-disable */

// @ts-nocheck

import { KeyboardEvent, PropsWithChildren, ReactNode, useState } from "react"
import { useTranslation } from "react-i18next"
import { MagnifyingGlass, X } from "@phosphor-icons/react"

import { Input } from "@pangea/ui/components/input"

type TableToolbarProps = {
  toolbarItem?: ReactNode
  subToolbar?: ReactNode
  toolbarItemFooter?: ReactNode
  searchTypeComponent?: ReactNode
  inputGroupName?: string
  inputGroupPlaceholder?: string
  inputGroupOnEnter?: (value: string) => void
}

export const TableToolbar = ({
  toolbarItem,
  subToolbar,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
}: PropsWithChildren<TableToolbarProps>) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState<string>("")

  const onSearch = (v: string) => {
    setSearchValue(v.trim())
    inputGroupOnEnter?.(v.trim())
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(searchValue)
  }

  return (
    <>
      <div
        data-testid="table-toolbar"
        className="flex flex-wrap items-center gap-2 py-2"
      >
        {inputGroupName && (
          <div data-testid={inputGroupName} className="flex items-center gap-1">
            {searchTypeComponent}
            {inputGroupPlaceholder && (
              <div className="relative">
                <MagnifyingGlass
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  data-testid="table-search-input"
                  placeholder={inputGroupPlaceholder}
                  aria-label={t("search")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9 pr-9"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearch("")}
                    aria-label="clear"
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {toolbarItem}
      </div>
      {subToolbar && (
        <div className="flex flex-wrap items-center gap-2 py-2">
          {subToolbar}
        </div>
      )}
      <hr className="border-t" />
      {children}
      {toolbarItemFooter && (
        <div className="flex flex-wrap items-center gap-2 py-2">
          {toolbarItemFooter}
        </div>
      )}
    </>
  )
}
