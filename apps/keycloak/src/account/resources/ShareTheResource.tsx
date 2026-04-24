/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ShareTheResource.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEffect } from "react"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"

import { cn } from "@needs/ui/lib/utils"
import { Button } from "@needs/ui/components/button"
import { Input } from "@needs/ui/components/input"
import { Label } from "@needs/ui/components/label"
import { Badge } from "@needs/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@needs/ui/components/dialog"

import {
  FormErrorText,
  SelectControl,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import { updateRequest } from "../api"
import { Permission, Resource } from "../api/representations"
import { useAccountAlerts } from "../utils/useAccountAlerts"
import { SharedWith } from "./SharedWith"

type ShareTheResourceProps = {
  resource: Resource
  permissions?: Permission[]
  open: boolean
  onClose: () => void
}

type FormValues = {
  permissions: string[]
  usernames: { value: string }[]
}

export const ShareTheResource = ({
  resource,
  permissions,
  open,
  onClose,
}: ShareTheResourceProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()
  const form = useForm<FormValues>()
  const {
    control,
    register,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
    handleSubmit,
  } = form
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "usernames",
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" })
    }
  }, [fields])

  const watchFields = useWatch({
    control,
    name: "usernames",
    defaultValue: [],
  })

  const isDisabled = watchFields.every(
    ({ value }) => value.trim().length === 0
  )

  const addShare = async ({ usernames, permissions }: FormValues) => {
    try {
      await Promise.all(
        usernames
          .filter(({ value }) => value !== "")
          .map(({ value: username }) =>
            updateRequest(context, resource._id, username, permissions)
          )
      )
      addAlert(t("shareSuccess"))
      onClose()
    } catch (error) {
      addError("shareError", error)
    }
    reset({})
  }

  const validateUser = async () => {
    const userOrEmails = fields.map((f) => f.value).filter((f) => f !== "")
    const userPermission = permissions
      ?.map((p) => [p.username, p.email])
      .flat()

    const hasUsers = userOrEmails.length > 0
    const alreadyShared =
      userOrEmails.filter((u) => userPermission?.includes(u)).length !== 0

    if (!hasUsers || alreadyShared) {
      setError("usernames", {
        message: !hasUsers ? t("required") : t("resourceAlreadyShared"),
      })
    } else {
      clearErrors()
    }

    return hasUsers && !alreadyShared
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("shareTheResource", { name: resource.name })}
          </DialogTitle>
        </DialogHeader>

        <form
          id="share-form"
          onSubmit={handleSubmit(addShare)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="users">
              {t("shareUser")}
              <span className="ml-0.5 text-destructive">*</span>
            </Label>
            <div className="flex">
              <Input
                id="users"
                data-testid="users"
                placeholder={t("usernamePlaceholder")}
                className={cn(
                  "rounded-r-none",
                  errors.usernames && "border-destructive"
                )}
                {...register(`usernames.${fields.length - 1}.value`, {
                  validate: validateUser,
                })}
              />
              <Button
                type="button"
                data-testid="add"
                onClick={() => append({ value: "" })}
                disabled={isDisabled}
                className="rounded-l-none"
              >
                {t("add")}
              </Button>
            </div>

            {fields.length > 1 && (
              <div className="flex flex-wrap items-center gap-1 pt-2">
                <span className="text-sm text-muted-foreground">
                  {t("shareWith") + " "}
                </span>
                {fields.map(
                  (field, index) =>
                    index !== fields.length - 1 && (
                      <Badge
                        key={field.id}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => remove(index)}
                      >
                        {field.value} ×
                      </Badge>
                    )
                )}
              </div>
            )}
            {errors.usernames && (
              <FormErrorText message={errors.usernames.message!} />
            )}
          </div>

          <FormProvider {...form}>
            <div
              id="permissions-selected"
              data-testid="permissions"
              className="space-y-1.5"
            >
              <SelectControl
                name="permissions"
                variant="typeaheadMulti"
                controller={{ defaultValue: [] }}
                options={resource.scopes.map(({ name, displayName }) => ({
                  key: name,
                  value: displayName || name,
                }))}
              />
            </div>
          </FormProvider>

          <div>
            <SharedWith permissions={permissions} />
          </div>
        </form>

        <DialogFooter>
          <Button variant="link" type="button" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            data-testid="done"
            disabled={!isValid}
            type="submit"
            form="share-form"
          >
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
