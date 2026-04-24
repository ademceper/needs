/* eslint-disable */

// @ts-nocheck

import { ReactNode, useRef, useState } from "react"
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { X } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import { Input } from "@pangea/ui/components/input"

import { getRuleValue } from "../utils/getRuleValue"
import { FormLabel } from "./FormLabel"

export type FileUploadControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> & {
  label: string
  labelIcon?: string | ReactNode
  isDisabled?: boolean
  "data-testid"?: string
  [k: string]: any
}

export const FileUploadControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: FileUploadControlProps<T, P>
) => {
  const { labelIcon } = props
  const required = !!getRuleValue(props.rules?.required)
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>)

  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState<string>("")

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  })

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <div className="flex items-center gap-2">
        <Input
          type="text"
          readOnly
          value={filename}
          data-testid={props["data-testid"] || props.name}
          className={fieldState.error ? "border-destructive" : ""}
          disabled={props.isDisabled}
        />
        <Button
          type="button"
          variant="outline"
          disabled={props.isDisabled}
          onClick={() => inputRef.current?.click()}
        >
          {t("browse")}
        </Button>
        {filename && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              field.onChange(null)
              setFilename("")
            }}
          >
            <X size={14} />
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              field.onChange(file)
              setFilename(file.name)
            }
          }}
        />
      </div>
    </FormLabel>
  )
}
