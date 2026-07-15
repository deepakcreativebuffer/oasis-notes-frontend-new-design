# TypeScript Migration Rule — JS/JSX → TS/TSX (incremental)

Read this before renaming a file to `.ts`/`.tsx` or adding types.

> **⚠️ Behavior is frozen.** Conversion must not change business logic, data flow, or
> feature behavior — same inputs, same outputs, same side effects. The only logic you
> may touch is a **minimal, mechanical** adjustment TypeScript _requires_ to type-check
> (a null guard the code already implied, a cast). Do not refactor, rename, delete
> "dead" branches, or "fix" anything while converting. If a real logic change seems
> required, **stop and ask**.

## Strategy: incremental, loose-then-strict

The repo has ~1,100 `.jsx` files. We convert **one component at a time**, letting
`.jsx` and `.tsx` coexist, and only tighten strictness once a domain is mostly TS.

### Step 0 — config (first execution step, do once, not per file)

Add a root `tsconfig.json` that mirrors the existing `jsconfig.json` path aliases:

```jsonc
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "allowJs": true, // .jsx and .tsx coexist
    "checkJs": false, // don't type-check remaining JS
    "strict": false, // start loose; tighten per-domain later
    "noEmit": true, // Vite/esbuild handles the build
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      /* copy from jsconfig.json: @/*, @shared/*, @features/*, @routes/*, @utils/* */
    },
  },
  "include": ["src"],
}
```

Also (as a **documented follow-up**, not silently): widen the lint/format script
globs from `*.{js,jsx}` to `*.{js,jsx,ts,tsx}` in `package.json`, and install
`typescript` + `@types/react` `@types/react-dom` `@types/node` as devDependencies.

## Two different traversal orders — UI vs TypeScript

These two migrations move through the codebase differently. Keep them distinct:

- **UI (Bootstrap→antd+Tailwind): go component by component.** Each screen/component
  is migrated and verified in isolation against its Figma reference. Order is driven
  by the design work, not by imports.
- **TypeScript: follow the dependency hierarchy — bottom-up (leaves first).** Convert
  a file only after the things it imports are already typed, so each file is checked
  against real types instead of `any`. Recommended order:
  1. **Leaf/foundation first** — shared types, constants, `src/utils/*`, `src/lib/*`
     wrappers, and `*.service.js` (define `ServiceResult<T>` + domain `data` types here).
  2. **Redux slices** (`src/store/*Slice.js`) and hooks (`useXxx`) that consume services.
  3. **Leaf/presentational components** (no or few child components).
  4. **Container/page components**, then **route files** last — by the time you reach a
     parent, its children, hooks, and services already export types.

Rule of thumb: **never convert a parent before its children/imports.** If a file you
need isn't typed yet, convert that dependency first (or, if it's out of scope for this
change, type the import locally and leave a `// TODO: type` — don't convert it half-way).

When a single component is being done "side by side" (UI + TS together per the
[component checklist](component-checklist.md)), still convert that component's **own
dependencies bottom-up first** so its `.tsx` compiles against typed imports.

## Per-file conversion rules

1. Rename `.jsx` → `.tsx`; `.js` → `.ts` when the file has **no JSX**.
2. Add a **props type**: `type` for plain prop bags, `interface` for shapes meant to
   be extended. Example:
   ```tsx
   type VitalsProps = { residentId: string; onClose: () => void };
   export const Vitals = ({ residentId, onClose }: VitalsProps) => { … };
   ```
3. Type **hooks** and **event handlers** (`useState<T>()`, `React.ChangeEvent<HTMLInputElement>`,
   `React.FormEvent`, etc.).
4. Type **service responses** against the normalized shape from
   [architecture.md](architecture.md) / `docs/ARCHITECTURE.md`:
   ```ts
   type ServiceResult<T> = {
     success: boolean;
     data: T;
     message: string;
     status?: number;
   };
   ```
   Define the domain `data` type near the service or in a colocated `types.ts`.
5. Keep imports on **path aliases** — do not switch to deep relative paths.
6. Update the colocated test to `.test.tsx` when you convert its component; keep it green.

## What NOT to do (yet)

- **Do not** flip `strict: true` globally. That comes at the tightening milestone.
- **Do not** block progress on perfect types. Where a real type is cheap, use it;
  otherwise `unknown` or a `// TODO: type` marker is acceptable early. Avoid `any`
  when a quick type exists, but don't rabbit-hole.
- **Do not** mass-rename or convert unrelated files in the same change — one component
  (and its direct helpers/tests) at a time.

## Tightening milestone (later)

Once a domain (e.g. `src/features/resident`) is mostly `.tsx`, enable `strict` for
that scope (via a scoped tsconfig `include` or a project reference) and fix the
fallout. Repeat per domain until the whole repo is strict, then flip `strict: true`
globally and drop `allowJs`.
