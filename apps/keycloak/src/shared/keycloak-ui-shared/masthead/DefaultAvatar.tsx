/* eslint-disable */

// @ts-nocheck

type DefaultAvatarProps = {
  className?: string
  border?: "light" | "dark"
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClass = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
}

export const DefaultAvatar = ({
  className = "",
  border,
  size = "md",
}: DefaultAvatarProps) => (
  <svg
    className={`rounded-full bg-muted ${sizeClass[size]} ${
      border === "light" ? "ring-1 ring-white" : border === "dark" ? "ring-1 ring-foreground" : ""
    } ${className}`}
    enableBackground="new 0 0 36 36"
    version="1.1"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#FFFFFF" }}
      cx="18"
      cy="18.5"
      r="18"
    />
    <defs>
      <filter
        id="b"
        x="5.2"
        y="7.2"
        width="25.6"
        height="53.6"
        filterUnits="userSpaceOnUse"
      >
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </defs>
    <mask
      id="a"
      x="5.2"
      y="7.2"
      width="25.6"
      height="53.6"
      maskUnits="userSpaceOnUse"
    >
      <g style={{ filter: 'url("#b")' }}>
        <circle
          style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#FFFFFF" }}
          cx="18"
          cy="18.5"
          r="18"
        />
      </g>
    </mask>
    <g style={{ filter: 'url("#a")' }}>
      <g transform="translate(5.04 6.88)">
        <path
          style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#BBBBBB" }}
          d="m22.6 18.1c-1.1-1.4-2.3-2.2-3.5-2.6s-1.8-0.6-6.3-0.6-6.1 0.7-6.1 0.7 0 0 0 0c-1.2 0.4-2.4 1.2-3.4 2.6-2.3 2.8-3.2 12.3-3.2 14.8 0 3.2 0.4 12.3 0.6 15.4 0 0-0.4 5.5 4 5.5l-0.3-6.3-0.4-3.5 0.2-0.9c0.9 0.4 3.6 1.2 8.6 1.2 5.3 0 8-0.9 8.8-1.3l0.2 1-0.2 3.6-0.3 6.3c3 0.1 3.7-3 3.8-4.4s0.6-12.6 0.6-16.5c0.1-2.6-0.8-12.1-3.1-15z"
        />
        <path
          style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#BBBBBB" }}
          d="m12.7 13.2c-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4 6.4 2.9 6.4 6.4-2.8 6.4-6.4 6.4z"
        />
      </g>
    </g>
  </svg>
)
