# CLAUDE.md — Agent rules router

> **Read this first, every session.** It routes you to the rule file that governs
> whatever you are about to change. Do not edit code, styling, or config until you
> have read the matching rule file below.

## What this project is

`oasisnotes-dev-repo-employee-website` — a **Vite + React 18** healthcare / employee
management SPA. **Plain JavaScript (JSX/JS), no TypeScript yet.** Feature-sliced
architecture under `src/features/{admin,employee,resident,shared}`. App/client state
via **Redux Toolkit** (`src/store/`), server state via **TanStack Query** wrappers
(`src/lib/`), API through a shared **Axios service layer**, routing via
**react-router v6** (`src/routes/`).

## The migration we are in the middle of

This repo is undergoing a long, multi-session refactor. Every change must move it
toward these targets — never against them:

1. **Remove Bootstrap** (`bootstrap` CSS + `react-bootstrap`, ~407 files, plus the
   jQuery/FontAwesome CDN in `index.html`). Standardize on **Ant Design v6 + Tailwind v3**.
2. **Pixel-match Figma** — UI is being rebuilt screen by screen to exactly match
   Figma screenshots/URLs the user provides.
3. **Convert JS/JSX → TS/TSX incrementally**, alongside the UI work ("side by side").
   Note the two traversals differ: **UI is done component by component**, but
   **TypeScript follows the dependency hierarchy — bottom-up (types/services/leaves
   before parents)** so each file is typed against typed imports. See
   [docs/rules/typescript.md](docs/rules/typescript.md).
4. **Do not break the architecture** (Redux / React Query / service layer / aliases /
   HIPAA rules).

## Before you change anything, read the matching rule

| If you are about to…                                            | Read this rule file                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Touch UI, styling, or any `react-bootstrap` / `bootstrap` usage | [docs/rules/ui-migration.md](docs/rules/ui-migration.md)               |
| Convert a file to TypeScript (`.jsx`→`.tsx`, `.js`→`.ts`)       | [docs/rules/typescript.md](docs/rules/typescript.md)                   |
| Add / move files, services, state, or routes                    | [docs/rules/architecture.md](docs/rules/architecture.md)               |
| Implement UI from a Figma screenshot or URL                     | [docs/rules/figma-fidelity.md](docs/rules/figma-fidelity.md)           |
| Migrate one component end-to-end (UI + TS together)             | [docs/rules/component-checklist.md](docs/rules/component-checklist.md) |

For established architecture decisions (API constants, error handling, security),
also see the existing [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The rule files
above **extend** it; they must never contradict it.

## ⚠️ MOST IMPORTANT — do not change behavior

**This effort is _only_ (1) design/UI changes and (2) JS→TS conversion. Nothing else.**

- **Do NOT change business logic, data flow, feature behavior, API calls, or
  conditionals.** The app must behave exactly the same before and after your change —
  same inputs, same outputs, same side effects.
- The **only** allowed reason to touch logic is when TypeScript _requires_ a minimal
  mechanical adjustment to type-check (e.g. a null guard the code already implied, a
  cast, reordering an import). Keep it as small as possible and preserve behavior.
- **When in doubt, preserve the existing behavior.** Do not "improve," refactor,
  rename, delete dead branches, or "fix" logic while migrating — even if it looks
  wrong. Flag it separately; don't change it here.
- If a migration seems to require a real logic/flow change, **stop and ask** rather
  than changing it.
- Keep the same props, events, state transitions, and rendered output. A UI swap
  (Bootstrap→antd) must be visually equivalent (or match Figma), never functionally
  different.
- **Additive UI is allowed:** you MAY add new UI elements the design calls for (a new
  field, section, button, layout the Figma shows). What you may NOT do is alter or
  break any **existing** flow or behavior. New UI is fine; changed/removed behavior is
  not. If a new UI element would need new business logic/flow to work, **stop and
  ask** before wiring it up.

## Non-negotiables (apply to every change)

- **Behavior is frozen** (see above): design + JS→TS only, no logic/flow/feature changes.
- **HIPAA / logging:** never use raw `console.*`. Use `src/utils/logger.js`.
  Encryption helpers live in `CryptoUtils.js`.
- **Function components + hooks only.** There are zero class components — keep it that way.
- **Path aliases**, not deep relative imports: `@/`, `@shared/`, `@features/`,
  `@routes/`, `@utils/` (defined in `vite.config.js` / `jsconfig.json`).
- **Prettier is authoritative** (`.prettierrc`: double quotes, 2-space, trailing
  commas, LF). Husky + lint-staged enforce on commit — run `npm run format` /
  `npm run lint` before finishing.
- **Colocate tests** as `*.test.jsx` / `*.test.tsx` next to the source.
- **Service layer only** for API calls — never call Axios ad hoc from a component.
- **Incremental migration:** do **not** remove the global `bootstrap.min.css` import
  (`src/index.jsx`) or the CDN scripts in `index.html` while files still depend on
  them. That is a tracked final-cleanup step, not something you do mid-migration.
