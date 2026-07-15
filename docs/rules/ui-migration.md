# UI Migration Rule — Bootstrap → Ant Design v6 + Tailwind v3

Read this before touching any UI, styling, or `react-bootstrap` / `bootstrap` code.

> **⚠️ Behavior is frozen.** This is a **visual** swap only. Keep the same props,
> events, state, conditionals, and rendered output — the component must behave
> identically (or match the Figma reference), never functionally differently. Do not
> change business logic, data flow, or features while restyling. If a swap seems to
> require a real logic change, **stop and ask**. You MAY **add** new UI elements the
> design calls for (a field, section, button, layout the Figma shows) — just don't
> alter or break any **existing** flow/behavior, and stop and ask if a new element
> needs new business logic.

## Target stack

- **Ant Design v6** (`antd`) for components (buttons, forms, modals, tables, menus…).
- **Tailwind v3** for layout, spacing, and color **utilities only**.
- **Being removed:** `bootstrap`, `react-bootstrap`, jQuery, and the FontAwesome CDN.

**Do not add new** `react-bootstrap`, `bootstrap`, `reactstrap`, or `jQuery` usage.
Every UI change should reduce Bootstrap surface area, never grow it.

Align with the one existing antd touchpoint: `src/utils/SearchAndSelect.jsx`
(uses antd `Select`).

## react-bootstrap → Ant Design mapping

| react-bootstrap             | Ant Design v6                                                               | Notes                                                                          |
| --------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Button`                    | `Button`                                                                    | Map variants → `type`/`danger` (e.g. `variant="primary"` → `type="primary"`).  |
| `Modal`                     | `Modal`                                                                     | `show`→`open`, `onHide`→`onCancel`.                                            |
| `Offcanvas`                 | `Drawer`                                                                    | `placement` maps directly.                                                     |
| `Form`, `Form.Control`…     | `Form`, `Input`, `InputNumber`, `Select`, `Checkbox`, `Radio`, `DatePicker` | Prefer antd `Form` + `Form.Item` validation over manual state where practical. |
| `Table`                     | `Table`                                                                     | Use `columns` + `dataSource`; move render logic into column `render`.          |
| `Card`                      | `Card`                                                                      |                                                                                |
| `Nav`, `Navbar`             | `Menu`                                                                      |                                                                                |
| `Tabs`, `Tab`               | `Tabs` (with `items`)                                                       |                                                                                |
| `Row`, `Col`                | Tailwind flex/grid **or** antd `Row`/`Col`                                  | See layout rule below.                                                         |
| `Dropdown`                  | `Dropdown`                                                                  |                                                                                |
| `Spinner`                   | `Spin`                                                                      |                                                                                |
| `Alert`                     | `Alert`                                                                     |                                                                                |
| Toast / transient message   | `message` or `notification` (imperative API)                                |                                                                                |
| `Badge`                     | `Badge`                                                                     |                                                                                |
| `Tooltip`, `OverlayTrigger` | `Tooltip` / `Popover`                                                       |                                                                                |
| `Accordion`                 | `Collapse`                                                                  |                                                                                |
| `Pagination`                | `Pagination`                                                                |                                                                                |
| `ProgressBar`               | `Progress`                                                                  |                                                                                |

If a component isn't in this table, pick the closest antd equivalent and note it in
the PR/commit; don't reach back to Bootstrap.

## antd + Tailwind coexistence (important)

**Tailwind Preflight is disabled** so the two don't fight over base styles:

- Config target (applied at first execution, see `docs/rules/typescript.md` for the
  same "config is step 0" convention): `corePlugins: { preflight: false }` in
  `tailwind.config.js`. This makes Tailwind **utilities-only**; **antd owns the base
  reset and component styling**.
- **Use Tailwind for**: layout (`flex`, `grid`, `gap-*`), spacing (`p-*`, `m-*`),
  sizing (`w-*`, `max-w-*`), responsive breakpoints, one-off color/typography utilities.
- **Use antd for**: component internals and theming — set colors, radius, font, and
  control sizes through the **`ConfigProvider` theme tokens**, not ad hoc CSS.
- **Never** use `!important` to override antd. If a token exists, theme it; if not,
  use antd's component-level `styles`/`classNames` props or a scoped class.

## Layout & spacing

- Replace Bootstrap grid (`container`, `row`, `col-*`, `d-flex`, `justify-content-*`)
  with **Tailwind flex/grid utilities**.
- Reach for antd `Row`/`Col` only when you genuinely need a data-grid gutter system;
  otherwise Tailwind is lighter.

## Icons

- Standardize on **`@ant-design/icons`** and the already-present **`lucide-react`**.
- Phase out FontAwesome CDN reliance gradually; do not add new FontAwesome usages.
- Do not remove the FontAwesome/jQuery CDN from `index.html` yet — final-cleanup step.

## Removal discipline (do NOT over-reach)

- When a file's **last** `react-bootstrap` import is gone, remove that import from
  **that file only**.
- **Do NOT** remove the global `import "bootstrap/dist/css/bootstrap.min.css";` from
  `src/index.jsx`, and **do NOT** remove the jQuery/FontAwesome CDN `<script>`s from
  `index.html`, while any file still depends on them. Removing the global Bootstrap
  CSS mid-migration will visually break hundreds of not-yet-migrated screens. These
  are reserved for a single tracked **final cleanup** once the last `react-bootstrap`
  import is gone repo-wide.

## Definition of done for a UI change

- No new Bootstrap/jQuery usage introduced.
- antd components themed via tokens, not `!important` overrides.
- Layout uses Tailwind utilities (Preflight-off assumptions hold).
- Matches the Figma reference if one was provided (see
  [figma-fidelity.md](figma-fidelity.md)).
