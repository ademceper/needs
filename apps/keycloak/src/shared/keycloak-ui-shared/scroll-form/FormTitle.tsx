/* eslint-disable */

// @ts-nocheck

import style from "./form-title.module.css"

type FormTitleProps = {
  id?: string
  title: string
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: string
  className?: string
}

export const FormTitle = ({
  id,
  title,
  headingLevel = "h1",
  className,
  ...rest
}: FormTitleProps) => {
  const Tag = headingLevel as any
  return (
    <Tag
      id={id}
      tabIndex={0}
      className={`${style.title ?? ""} text-xl font-semibold ${className ?? ""}`}
      {...rest}
    >
      {title}
    </Tag>
  )
}
