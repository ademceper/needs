/* eslint-disable */

// @ts-nocheck

type EmptyRowProps = {
  message: string
}

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <li
      className="flex items-center justify-center px-4 py-6 text-sm text-muted-foreground"
      {...props}
    >
      {message}
    </li>
  )
}
