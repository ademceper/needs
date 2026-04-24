/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren } from "react"
import { FieldValues, FormState } from "react-hook-form"

import { Button } from "@pangea/ui/components/button"

export type FormSubmitButtonProps = {
  formState: FormState<FieldValues>
  allowNonDirty?: boolean
  allowInvalid?: boolean
  isDisabled?: boolean
  [k: string]: any
}

const isSubmittable = (
  formState: FormState<FieldValues>,
  allowNonDirty: boolean,
  allowInvalid: boolean
) => {
  return (
    (formState.isValid || allowInvalid) &&
    (formState.isDirty || allowNonDirty) &&
    !formState.isLoading &&
    !formState.isValidating &&
    !formState.isSubmitting
  )
}

export const FormSubmitButton = ({
  formState,
  isDisabled = false,
  allowInvalid = false,
  allowNonDirty = false,
  children,
  ...rest
}: PropsWithChildren<FormSubmitButtonProps>) => {
  return (
    <Button
      disabled={
        (formState && !isSubmittable(formState, allowNonDirty, allowInvalid)) ||
        isDisabled
      }
      {...rest}
      type="submit"
    >
      {children}
    </Button>
  )
}
