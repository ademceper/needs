#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"

const projectRoot = new URL("..", import.meta.url).pathname

const files = execSync(
  `grep -rl 'asChild variant="link"' src/login || true`,
  { cwd: projectRoot, encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter(Boolean)

const RE =
  /<Button\s+asChild\s+variant="link"\s+className="h-auto p-0([^"]*)"[^>]*>\s*<a\s+([^>]*?)>([\s\S]*?)<\/a>\s*<\/Button>/g

let changed = 0
for (const rel of files) {
  const path = `${projectRoot}${rel}`
  const src = readFileSync(path, "utf8")
  const updated = src.replace(RE, (_, extra, attrs, content) => {
    const extraTrim = extra.trim()
    const cls = extraTrim ? ` className="${extraTrim}"` : ""
    return `<AnimatedLink ${attrs.trim()}${cls}>${content.trim()}</AnimatedLink>`
  })
  if (updated === src) continue

  const lines = updated.split("\n")
  const hasImport = lines.some((l) => l.includes("components/animated-link"))
  if (!hasImport) {
    let idx = -1
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith("import ") && lines[i].includes('"../')) {
        idx = i
        break
      }
    }
    if (idx >= 0) {
      lines.splice(
        idx + 1,
        0,
        `import { AnimatedLink } from "../components/animated-link"`
      )
    }
  }

  writeFileSync(path, lines.join("\n"))
  changed++
}

console.log(`✓ Updated ${changed} files`)
