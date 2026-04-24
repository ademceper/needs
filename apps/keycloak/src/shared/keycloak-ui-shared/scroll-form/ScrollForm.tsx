/* eslint-disable */

// @ts-nocheck

import { Fragment, ReactNode, useMemo } from "react"
import { FormPanel } from "./FormPanel"
import { ScrollPanel } from "./ScrollPanel"

import style from "./scroll-form.module.css"

export const mainPageContentId = "kc-main-content-page-container"

type ScrollSection = {
  title: string
  panel: ReactNode
  isHidden?: boolean
}

type ScrollFormProps = {
  label: string
  sections: ScrollSection[]
  borders?: boolean
  className?: string
}

const spacesToHyphens = (string: string): string => {
  return string.replace(/\s+/g, "-")
}

export const ScrollForm = ({
  label,
  sections,
  borders = false,
}: ScrollFormProps) => {
  const shownSections = useMemo(
    () => sections.filter(({ isHidden }) => !isHidden),
    [sections]
  )

  const scrollTo = (scrollId: string) => {
    const element = document.getElementById(scrollId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="order-2 md:order-1 md:col-span-8">
        {shownSections.map(({ title, panel }) => {
          const scrollId = spacesToHyphens(title.toLowerCase())

          return (
            <Fragment key={title}>
              {borders ? (
                <FormPanel
                  scrollId={scrollId}
                  title={title}
                  className={style.panel}
                >
                  {panel}
                </FormPanel>
              ) : (
                <ScrollPanel scrollId={scrollId} title={title}>
                  {panel}
                </ScrollPanel>
              )}
            </Fragment>
          )
        })}
      </div>
      <div className="order-1 md:order-2 md:col-span-4">
        <nav
          aria-label={label}
          className={`${style.sticky ?? ""} sticky top-4 rounded-md border bg-card p-4`}
        >
          <p className="mb-2 text-sm font-semibold text-muted-foreground">
            {label}
          </p>
          <ul className="space-y-1">
            {shownSections.map(({ title }) => {
              const scrollId = spacesToHyphens(title.toLowerCase())
              return (
                <li key={title}>
                  <button
                    type="button"
                    onClick={() => scrollTo(scrollId)}
                    data-testid={`jump-link-${scrollId}`}
                    className="text-left text-sm text-primary hover:underline"
                  >
                    {title}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
