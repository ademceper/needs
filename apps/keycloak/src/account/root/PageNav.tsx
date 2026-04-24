/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/PageNav.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  PropsWithChildren,
  MouseEvent as ReactMouseEvent,
  Suspense,
  useMemo,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import {
  matchPath,
  useHref,
  useLinkClickHandler,
  useLocation,
} from "react-router-dom"
import { CaretDown, CaretRight } from "@phosphor-icons/react"

import { cn } from "@needs/ui/lib/utils"
import { Spinner } from "@needs/ui/components/spinner"

import { useEnvironment } from "../../shared/keycloak-ui-shared"
import fetchContentJson from "../content/fetchContent"
import { environment, type Environment, type Feature } from "../environment"
import { TFuncKey } from "../i18n"
import { usePromise } from "../utils/usePromise"

type RootMenuItem = {
  id?: string
  label: TFuncKey
  path: string
  isVisible?: keyof Feature
  modulePath?: string
}

type MenuItemWithChildren = {
  label: TFuncKey
  children: MenuItem[]
  isVisible?: keyof Feature
}

export type MenuItem = RootMenuItem | MenuItemWithChildren

export const PageNav = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>()
  const context = useEnvironment<Environment>()

  usePromise((signal) => fetchContentJson({ signal, context }), setMenuItems)
  return (
    <aside
      aria-label="Main navigation"
      className="hidden w-64 shrink-0 border-r md:block"
    >
      <div className="p-3">
        <nav>
          <ul className="flex flex-col gap-1">
            <Suspense fallback={<Spinner className="size-5" />}>
              {menuItems
                ?.filter((menuItem) =>
                  menuItem.isVisible
                    ? context.environment.features[menuItem.isVisible]
                    : true
                )
                .map((menuItem) => (
                  <NavMenuItem
                    key={menuItem.label as string}
                    menuItem={menuItem}
                  />
                ))}
            </Suspense>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

type NavMenuItemProps = {
  menuItem: MenuItem
}

function NavMenuItem({ menuItem }: NavMenuItemProps) {
  const { t } = useTranslation()
  const {
    environment: { features },
  } = useEnvironment<Environment>()
  const { pathname } = useLocation()
  const isActive = useMemo(
    () => matchMenuItem(pathname, menuItem),
    [pathname, menuItem]
  )
  const [open, setOpen] = useState<boolean>(isActive)

  if ("path" in menuItem) {
    return (
      <NavLink path={menuItem.path} isActive={isActive}>
        {t(menuItem.label)}
      </NavLink>
    )
  }

  return (
    <li data-testid={menuItem.label}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted",
          isActive && "font-medium"
        )}
      >
        {open ? <CaretDown size={14} /> : <CaretRight size={14} />}
        <span className="flex-1 text-left">{t(menuItem.label)}</span>
      </button>
      {open && (
        <ul className="ml-4 mt-1 flex flex-col gap-1 border-l pl-2">
          {menuItem.children
            .filter((menuItem) =>
              menuItem.isVisible ? features[menuItem.isVisible] : true
            )
            .map((child) => (
              <NavMenuItem key={child.label as string} menuItem={child} />
            ))}
        </ul>
      )}
    </li>
  )
}

function getFullUrl(path: string) {
  return `${new URL(environment.baseUrl).pathname}${path}`
}

function matchMenuItem(currentPath: string, menuItem: MenuItem): boolean {
  if ("path" in menuItem) {
    return !!matchPath(getFullUrl(menuItem.path), currentPath)
  }

  return menuItem.children.some((child) => matchMenuItem(currentPath, child))
}

type NavLinkProps = {
  path: string
  isActive: boolean
}

export const NavLink = ({
  path,
  isActive,
  children,
}: PropsWithChildren<NavLinkProps>) => {
  const menuItemPath = getFullUrl(path) + location.search
  const href = useHref(menuItemPath)
  const handleClick = useLinkClickHandler(menuItemPath)

  return (
    <li>
      <a
        data-testid={path}
        href={href}
        onClick={(event) =>
          handleClick(event as unknown as ReactMouseEvent<HTMLAnchorElement>)
        }
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "block rounded-md px-3 py-2 text-sm hover:bg-muted",
          isActive && "bg-muted font-medium"
        )}
      >
        {children}
      </a>
    </li>
  )
}
