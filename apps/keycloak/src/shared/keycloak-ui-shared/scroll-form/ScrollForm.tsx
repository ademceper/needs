/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollForm.tsx" --revert
 */

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
  label?: string
  sections: ScrollSection[]
  borders?: boolean
  className?: string
}

const spacesToHyphens = (string: string): string => {
  return string.replace(/\s+/g, "-")
}

export const ScrollForm = ({
  sections,
  borders = false,
  className,
}: ScrollFormProps) => {
  const shownSections = useMemo(
    () => sections.filter(({ isHidden }) => !isHidden),
    [sections]
  )

  return (
    <div className={className}>
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
  )
}
