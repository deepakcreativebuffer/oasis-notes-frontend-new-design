# Architecture Rule — structural guardrails

Read this before adding or moving files, services, state, or routes. This **extends**
`docs/ARCHITECTURE.md` (the ADRs) — never contradict it.

## Feature-sliced layout

Code is organized by domain, not by type:

```
src/features/<domain>/           # domain ∈ admin | employee | resident | shared
  components/                    # reusable UI for the domain
  pages/                         # route-level screens
  hooks/                         # useXxx hooks
  services/                      # API service modules
  constants/
src/features/shared/             # cross-domain: ui/, contexts/, config/, layout/,
                                 #   permissions/, features/, intake/, hooks/, services/
```

- Put new code in the **narrowest** owning domain. Only promote to `shared/` when a
  second domain actually needs it.
- Do **not** reintroduce a flat top-level `src/components` or `src/Pages` (the README's
  old structure is stale — ignore it).

## State management — pick the right layer

- **Server state → TanStack Query**, via the wrappers in `src/lib/`
  (`useServiceQuery`, `useServiceMutation`, `queryClient`, `queryKeys`). Do not call
  `useQuery`/axios directly in components when a wrapper fits.
- **App / client state → Redux Toolkit** slices in `src/store/` (`*Slice.js`), consumed
  with `useSelector`/`useDispatch`. Add selectors to the slice; don't inline them.
- **Cross-cutting UI state → Context** only (`ModalContext`, `LayoutContext`). Don't
  create new global contexts for data that belongs in Query or Redux.
- **Local component state → `useState`/`useReducer`.**

## API / service layer

- All network access goes through the **shared service layer**: the
  `src/features/shared/services` barrel and `common/common.api.js` helpers
  (`getApi`, `createApi`).
- Endpoints come from the centralized **`Apis`** constants — no hardcoded URLs.
- Services return the normalized shape `{ success, data, message, status }`. Consumers
  branch on `success`; don't parse raw axios responses in components.
- **Never** call axios ad hoc from a component or page.

## Naming & conventions

- Components: **PascalCase** file = component name (`Vitals.jsx` → `Vitals` / `Vitals.tsx`).
- Services `*.service.js(.ts)`, slices `*Slice.js(.ts)`, hooks `useXxx`, tests colocated
  `*.test.jsx(.tsx)`.
- **Flag, don't mass-rename**, the folders that contain spaces (e.g.
  `employee/pages/Time Off Request/`, `admin/pages/Group Notes/`) — note them as tech
  debt; renaming touches routes/imports and is out of scope for a component migration.
- Use **path aliases** (`@/`, `@shared/`, `@features/`, `@routes/`, `@utils/`).

## Routing

- Routes stay **modular** under `src/routes/{Admin,Employee,Resident}/`, aggregated via
  `index.js` → `AppRoutes.jsx`.
- Preserve **code-splitting** (`lazyWithRetry`) and **role guards**
  (`ProtectedRoute` + `panelBoundaries`). Don't eagerly import route components.

## Security / HIPAA (hard rules)

- **Never** raw `console.*` — use `src/utils/logger.js`.
- Use the existing encryption helpers (`CryptoUtils.js`); don't hand-roll crypto or log
  PHI.
- Sanitize any HTML with the existing `SafeHtml` / `sanitizeHtml` utilities.
