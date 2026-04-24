/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HTMLProps } from "react"
import { FormTitle } from "./FormTitle"

type ScrollPanelProps = HTMLProps<HTMLFormElement> & {
  title: string
  scrollId: string
}

export const ScrollPanel = (props: ScrollPanelProps) => {
  const { title, children, scrollId, className, ...rest } = props
  return (
    <section {...rest} className={`mt-8 space-y-4 first:mt-0 ${className ?? ""}`}>
      <FormTitle id={scrollId} title={title} />
      {children}
    </section>
  )
}
