/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Suspense, useState } from "react"
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom"

import { Spinner } from "@needs/ui/components/spinner"

import {
  ErrorPage,
  useEnvironment,
  KeycloakContext,
} from "../../shared/keycloak-ui-shared"
import fetchContentJson from "../content/fetchContent"
import { Environment, environment } from "../environment"
import { usePromise } from "../utils/usePromise"
import { Header } from "./Header"
import { MenuItem, PageNav } from "./PageNav"
import { routes } from "../routes"

function mapRoutes(
  context: KeycloakContext<Environment>,
  content: MenuItem[]
): RouteObject[] {
  return content
    .map((item) => {
      if ("children" in item) {
        return mapRoutes(context, item.children)
      }

      if (item.isVisible && !context.environment.features[item.isVisible]) {
        return null
      }

      return {
        ...item,
        element:
          "path" in item
            ? routes.find((r) => r.path === (item.id ?? item.path))?.element
            : undefined,
      }
    })
    .filter((item) => !!item)
    .flat()
}

const Shell = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="flex flex-1">
      <PageNav />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  </div>
)

export const Root = () => {
  const context = useEnvironment<Environment>()
  const [content, setContent] = useState<RouteObject[]>()

  usePromise(
    (signal) => fetchContentJson({ signal, context }),
    (content) => {
      setContent([
        {
          path: decodeURIComponent(new URL(environment.baseUrl).pathname),
          element: <Shell />,
          errorElement: <ErrorPage />,
          children: mapRoutes(context, content),
        },
      ])
    }
  )

  if (!content) {
    return <Spinner />
  }
  return <RouterProvider router={createBrowserRouter(content)} />
}
