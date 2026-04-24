/* eslint-disable */

// @ts-nocheck

import { Cube, Globe } from "@phosphor-icons/react"
import {
  SiGithub,
  SiFacebook,
  SiGitlab,
  SiGoogle,
  SiRedhatopenshift,
  SiStackoverflow,
  SiBitbucket,
  SiInstagram,
  SiPaypal,
} from "@icons-pack/react-simple-icons"

type IconMapperProps = {
  icon: string
}

export const IconMapper = ({ icon }: IconMapperProps) => {
  const SpecificIcon = getIcon(icon)
  return (
    <span className="inline-flex items-center justify-center">
      <SpecificIcon size={24} aria-label={icon} />
    </span>
  )
}

function getIcon(icon: string) {
  switch (icon) {
    case "github":
      return SiGithub
    case "facebook":
      return SiFacebook
    case "gitlab":
      return SiGitlab
    case "google":
      return SiGoogle
    case "linkedin":
    case "linkedin-openid-connect":
    case "twitter":
    case "microsoft":
      return Globe
    case "openshift-v4":
      return SiRedhatopenshift
    case "stackoverflow":
      return SiStackoverflow
    case "bitbucket":
      return SiBitbucket
    case "instagram":
      return SiInstagram
    case "paypal":
      return SiPaypal
    default:
      return Cube
  }
}
