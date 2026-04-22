#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"

const files = execSync(
  "grep -rlE '<Button' src/login",
  { cwd: new URL("..", import.meta.url).pathname },
)
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean)

const projectRoot = new URL("..", import.meta.url).pathname

let changed = 0
for (const rel of files) {
  const path = `${projectRoot}${rel}`
  const src = readFileSync(path, "utf8")

  const updated = src.replace(
    /<Button(\s[\s\S]*?)(\/?>)/g,
    (match, attrs, close) => {
      if (/\bsize\s*=/.test(attrs)) return match
      if (/variant\s*=\s*"link"/.test(attrs)) return match
      if (/variant\s*=\s*"ghost"/.test(attrs)) return match
      return `<Button size="xl"${attrs}${close}`
    },
  )

  if (updated !== src) {
    writeFileSync(path, updated)
    changed++
  }
}

console.log(`✓ Updated ${changed} files`)
