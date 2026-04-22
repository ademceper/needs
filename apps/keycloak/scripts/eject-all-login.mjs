#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, "..")
const kcRoot = join(projectRoot, "node_modules/keycloakify")
const pagesSrc = join(kcRoot, "src/login/pages")
const storiesSrc = join(kcRoot, "stories/login/pages")
const pagesDst = join(projectRoot, "src/login/pages")
const loginDst = join(projectRoot, "src/login")

mkdirSync(pagesDst, { recursive: true })

const pascalToKebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

const pageFiles = readdirSync(pagesSrc).filter(
  (f) => f.endsWith(".tsx") && !f.includes(".useScript") && f !== "PageProps.tsx",
)

const entries = []

for (const file of pageFiles) {
  const base = file.replace(/\.tsx$/, "")
  const kebab = pascalToKebab(base)
  const pageId = `${kebab}.ftl`

  const pageCode = readFileSync(join(pagesSrc, file), "utf8")
  writeFileSync(join(pagesDst, file), pageCode)

  const storyFile = `${base}.stories.tsx`
  const storySrcPath = join(storiesSrc, storyFile)
  if (existsSync(storySrcPath)) {
    let storyCode = readFileSync(storySrcPath, "utf8")
    storyCode = storyCode
      .replace(/import React from "react";\n/g, "")
      .replace(/from "[./]+dist\//g, 'from "keycloakify/')
    writeFileSync(join(pagesDst, storyFile), storyCode)
  }

  entries.push({ base, pageId })
}

for (const extra of ["Template.tsx", "UserProfileFormFields.tsx"]) {
  const code = readFileSync(join(kcRoot, "src/login", extra), "utf8")
  writeFileSync(join(loginDst, extra), code)
}

entries.sort((a, b) => a.base.localeCompare(b.base))

const imports = entries
  .map((e) => `const ${e.base} = lazy(() => import("./pages/${e.base}"))`)
  .join("\n")

const cases = entries
  .map(
    (e) =>
      `        case "${e.pageId}":\n          return (\n            <${e.base}\n              {...{ kcContext, i18n, classes }}\n              Template={Template}\n              doUseDefaultCss={false}\n${
        needsUserProfile(e.pageId)
          ? "              UserProfileFormFields={UserProfileFormFields}\n              doMakeUserConfirmPassword={doMakeUserConfirmPassword}\n"
          : ""
      }            />\n          )`,
  )
  .join("\n")

function needsUserProfile(pageId) {
  return [
    "register.ftl",
    "login-update-profile.ftl",
    "update-email.ftl",
    "idp-review-user-profile.ftl",
  ].includes(pageId)
}

const kcPage = `import { Suspense, lazy } from "react"
import type { ClassKey } from "keycloakify/login"
import type { KcContext } from "./KcContext"
import { useI18n } from "./i18n"
import Template from "./Template"
import UserProfileFormFields from "./UserProfileFormFields"

${imports}

const doMakeUserConfirmPassword = true

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props
  const { i18n } = useI18n({ kcContext })

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
${cases}
          default:
            return null
        }
      })()}
    </Suspense>
  )
}

const classes = {} satisfies { [key in ClassKey]?: string }
`

writeFileSync(join(loginDst, "KcPage.tsx"), kcPage)

console.log(`✓ Copied ${entries.length} pages + stories`)
console.log(`✓ Copied Template.tsx + UserProfileFormFields.tsx`)
console.log(`✓ Rewrote KcPage.tsx with ${entries.length} cases`)
