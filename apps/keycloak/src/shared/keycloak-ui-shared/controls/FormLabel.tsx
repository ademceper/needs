/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260502.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FormLabel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren, ReactNode } from "react"
import { FieldError, FieldValues, Merge } from "react-hook-form"

import { Label } from "@needs/ui/components/label"

import { FormErrorText } from "./FormErrorText"
import { HelpItem } from "./HelpItem"

export type FieldProps<T extends FieldValues = FieldValues> = {
  id?: string | undefined
  label?: string
  name: string
  labelIcon?: string | ReactNode
  error?: FieldError | Merge<FieldError, T>
  isRequired: boolean
}

type FormLabelProps = FieldProps & {
  className?: string
  helperText?: ReactNode
  [k: string]: any
}

export const FormLabel = ({
  id,
  name,
  label,
  labelIcon,
  error,
  isRequired,
  helperText,
  children,
  className,
}: PropsWithChildren<FormLabelProps>) => {
  const text = label || name
  const hasLabel = text !== ""
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      {hasLabel && (
        <div className="flex items-center gap-1">
          <Label htmlFor={id || name}>
            {text}
            {isRequired && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
          {labelIcon && (
            <HelpItem helpText={labelIcon} fieldLabelId={id || name} />
          )}
        </div>
      )}
      {children}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <FormErrorText data-testid={`${name}-helper`} message={error.message} />
      )}
    </div>
  )
}
