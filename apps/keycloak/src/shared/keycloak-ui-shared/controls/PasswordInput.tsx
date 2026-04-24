/* eslint-disable */

// @ts-nocheck

import { MutableRefObject, Ref, forwardRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Eye, EyeSlash } from "@phosphor-icons/react"

import { Button } from "@pangea/ui/components/button"
import { Input } from "@pangea/ui/components/input"

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasReveal?: boolean
}

const PasswordInputBase = ({
  hasReveal = true,
  innerRef,
  className,
  ...rest
}: PasswordInputProps & { innerRef?: MutableRefObject<any> }) => {
  const { t } = useTranslation()
  const [hidePassword, setHidePassword] = useState(true)
  return (
    <div className={`flex ${className ?? ""}`}>
      <Input
        {...rest}
        type={hidePassword ? "password" : "text"}
        ref={innerRef}
        className={hasReveal ? "rounded-r-none" : ""}
      />
      {hasReveal && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("showPassword")}
          onClick={() => setHidePassword(!hidePassword)}
          className="rounded-l-none border-l-0"
        >
          {hidePassword ? <Eye size={16} /> : <EyeSlash size={16} />}
        </Button>
      )}
    </div>
  )
}

export const PasswordInput = forwardRef(
  (props: PasswordInputProps, ref: Ref<HTMLInputElement>) => (
    <PasswordInputBase {...props} innerRef={ref as MutableRefObject<any>} />
  )
)
PasswordInput.displayName = "PasswordInput"
