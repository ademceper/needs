/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren } from "react"

type PageProps = {
  title: string
  description: string
}

export const Page = ({
  title,
  description,
  children,
}: PropsWithChildren<PageProps>) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header className="space-y-1">
        <h1
          className="text-2xl font-semibold tracking-tight"
          data-testid="page-heading"
        >
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <section>{children}</section>
    </div>
  )
}
