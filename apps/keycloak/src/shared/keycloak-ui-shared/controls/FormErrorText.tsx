/* eslint-disable */

// @ts-nocheck

import { Warning } from "@phosphor-icons/react"

export type FormErrorTextProps = {
  message: string
  className?: string
}

export const FormErrorText = ({ message, className }: FormErrorTextProps) => {
  return (
    <p
      className={`mt-1 flex items-center gap-1 text-xs text-destructive ${className ?? ""}`}
    >
      <Warning size={12} />
      {message}
    </p>
  )
}
