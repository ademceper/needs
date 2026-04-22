# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm 9.15.9** (enforced via `packageManager`). Node >= 20.

- `pnpm dev` — run all dev servers via Turbo (Next.js with `--turbopack` for the `web` app)
- `pnpm build` — build all workspaces
- `pnpm lint` — Biome lint across workspaces (via `turbo lint`)
- `pnpm format` — Biome format-write across workspaces (via `turbo format`)
- `pnpm typecheck` — `tsc --noEmit` across workspaces
- `pnpm check` / `pnpm check:fix` — root-level `biome check` (lint + format + import organize) against the whole repo

Single-workspace commands: `pnpm --filter web dev`, `pnpm --filter @pangea/ui typecheck`, etc.

Adding shadcn/ui components (run from repo root):

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

The shadcn CLI is configured via two `components.json` files:
- `apps/web/components.json` — app-specific: writes `components/*` and `hooks/*` into `apps/web/`, but `ui` and `utils` aliases point to `@pangea/ui`. Use this config when adding a shared UI primitive — it lands in `packages/ui/src/components/`.
- `packages/ui/components.json` — all aliases under `@pangea/ui/*`; used when running shadcn inside the UI package.

## Architecture

Turborepo + pnpm workspaces monorepo. Workspaces: `apps/*`, `packages/*`.

### Workspace layout

- `apps/web` — Next.js 16 App Router, React 19, Tailwind CSS v4 (via `@tailwindcss/postcss`). Imports shared UI from `@pangea/ui` and re-exports the Tailwind PostCSS config via `@pangea/ui/postcss.config`. `next.config.mjs` declares `transpilePackages: ["@pangea/ui"]` — shared UI ships as source TSX, not compiled.
- `apps/keycloak` — Keycloakify 11 theme (Vite + React 18 + Storybook). Build the theme jar with `pnpm --filter keycloak build-keycloak-theme`; output lands in `dist_keycloak/`. Pinned to React 18 because Keycloakify has not yet validated React 19.
- `packages/ui` — shared component library built on shadcn/ui (style: `radix-nova`, icon lib: `phosphor`). Exposed via package `exports`:
  - `@pangea/ui/components/*` → `src/components/*.tsx`
  - `@pangea/ui/hooks/*` → `src/hooks/*.ts`
  - `@pangea/ui/lib/*` → `src/lib/*.ts`
  - `@pangea/ui/globals.css` → `src/styles/globals.css`
  - `@pangea/ui/postcss.config` → `postcss.config.mjs`
- `packages/ts-cfg` — shared TypeScript base configs (`base.json`, `nextjs.json`, `react-library.json`, `vite.json`) consumed via `extends: "@pangea/ts-cfg/*"`. `vite.json` disables `noUncheckedIndexedAccess` (inherited from `base.json`) because bundler-mode React apps typically don't tolerate it.

### Cross-workspace conventions

- Internal package scope is `@pangea/*` (not `@workspace/*`).
- Tailwind v4 is configured via CSS (`packages/ui/src/styles/globals.css`) — no `tailwind.config.*`. The web app reuses the UI package's PostCSS config.
- Path aliases inside each workspace's `tsconfig.json`:
  - `apps/web`: `@/*` → `./*`, plus a dev-time shortcut `@pangea/ui/*` → `../../packages/ui/src/*`
  - `packages/ui`: `@pangea/ui/*` → `./src/*`

### Tooling

- **Biome** is the sole linter and formatter (ESLint and Prettier have been removed). Config: `biome.json` — 2-space indent, line width 80, double quotes, `semicolons: "asNeeded"`, `trailingCommas: "es5"`, `organizeImports` on, Tailwind class sorting enabled for `cn` and `cva`. CSS parser has `tailwindDirectives` enabled.
- Biome honors `.gitignore` (`vcs.useIgnoreFile: true`) plus explicit excludes for `node_modules`, `.next`, `.turbo`, `dist`, `build`, `coverage`, `pnpm-lock.yaml`.
- Turbo pipeline (`turbo.json`): `build` depends on upstream `^build`; `lint`, `format`, `typecheck` also fan out to dependencies; `dev` is non-cached and persistent.
