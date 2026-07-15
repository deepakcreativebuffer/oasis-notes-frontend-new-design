# Component Migration Checklist — one component, end to end

The canonical recipe for migrating **a single component** (UI + TypeScript together,
"side by side"). Do exactly one component (plus its direct helpers/tests) per change.

## Before you start

- [ ] Read [ui-migration.md](ui-migration.md), [typescript.md](typescript.md), and —
      if a design was provided — [figma-fidelity.md](figma-fidelity.md).
- [ ] Confirm the config groundwork exists (once, repo-wide): `tsconfig.json` present
      and Tailwind Preflight disabled. If not, that's the first execution step
      (see [typescript.md](typescript.md) step 0 and [ui-migration.md](ui-migration.md)).

## The recipe

1. **Extract the design.** If a Figma image/URL was given, pull tokens/layout first
   (Figma MCP or careful measurement).
2. **Swap UI to antd + Tailwind.** Replace each `react-bootstrap` component per the
   mapping table; move layout to Tailwind flex/grid; theme via antd tokens, not
   `!important`.
3. **Convert to TypeScript — bottom-up.** UI is done per component, but TS follows the
   dependency hierarchy: type this component's **imports first** (shared types,
   `utils`/`lib`, services, slices, child components), then rename this file
   `.jsx`→`.tsx` (`.js`→`.ts` if no JSX) and add props type, typed hooks/handlers, and
   typed service data (`ServiceResult<T>`). Never convert a parent before its
   children/imports — see [typescript.md](typescript.md).
4. **Remove now-unused Bootstrap imports — in this file only.** Do **not** touch the
   global `bootstrap.min.css` import or the `index.html` CDN scripts.
5. **Migrate colocated CSS.** Fold `./Foo.css` rules into Tailwind utilities / antd
   tokens where reasonable; delete the CSS file only when nothing references it.
6. **Keep architecture intact.** Service-layer calls only, Redux/Query in the right
   layer, path aliases, `logger.js` not `console.*`.
7. **Lint & format & test.** `npm run format` + `npm run lint`; update the colocated
   test to `.test.tsx` and keep it green.
8. **Visual diff** against the Figma reference (all states) if one was provided.

## Worked example (for reference)

`src/features/resident/components/Vitals/Vitals.jsx` imports `Offcanvas` from
`react-bootstrap` and `./Vitals.css`. Applying this checklist:

- `Offcanvas` → antd **`Drawer`** (mapping table), `show`/`onHide` → `open`/`onClose`.
- `Vitals.jsx` → **`Vitals.tsx`**; add `type VitalsProps`, type the vitals service
  data; `Vitals.test.jsx` → `Vitals.test.tsx`.
- Fold `Vitals.css` layout into Tailwind utilities; keep only what antd tokens can't
  express.
- Remove the `react-bootstrap` import from this file. Leave the global Bootstrap CSS.

## Definition of done

- [ ] **Behavior unchanged** — same props, events, state, conditionals, API calls, and
      outputs as before; only design + JS→TS changed. No logic/flow/feature edits.
- [ ] No new Bootstrap/jQuery usage; this file's Bootstrap imports removed.
- [ ] File is `.tsx`/`.ts` with real prop and service types (no gratuitous `any`).
- [ ] antd themed via tokens; layout via Tailwind (Preflight-off).
- [ ] Architecture rules honored; `logger.js` used, not `console.*`.
- [ ] Lint/format clean, tests green.
- [ ] Matches the Figma reference (all states) if provided.
- [ ] Global `bootstrap.min.css` and `index.html` CDN scripts untouched.
