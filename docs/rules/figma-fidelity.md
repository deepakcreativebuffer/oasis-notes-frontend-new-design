# Figma Fidelity Rule — pixel-perfect from a screenshot or URL

Read this when implementing UI from a Figma image or figma.com link. Goal: an
**exact carbon copy** — spacing, sizing, colors, typography, radii, shadows, and all
interaction states.

## Extraction workflow

1. **If a Figma URL is given** — use the Figma MCP tools to pull exact values instead
   of eyeballing:
   - `get_design_context` — structure, layout, and generated code hints.
   - `get_variable_defs` — exact design tokens (colors, spacing, type scale).
   - `get_screenshot` — the visual reference to diff against.
2. **If only a screenshot is given** — measure carefully: spacing, font sizes/weights,
   border radii, colors (sample exact hex), and shadows. Map each to the nearest
   **Tailwind scale** value or a defined **antd token** — do not invent arbitrary
   pixel values when a token already covers it.

## Encode tokens into the system, not one-off styles

For "future UI perspective," design values must be **reusable**, not inline:

- Global brand colors, radius, control height, font → **antd `ConfigProvider` theme
  tokens**.
- Layout spacing / colors used as utilities → **Tailwind `theme.extend`**
  (colors, `fontSize`, `spacing`) so classes like `text-brand` / `p-4.5` stay consistent.
- Avoid one-off `style={{ … }}` and magic numbers when a token exists. Inline styles
  are a last resort for a genuinely unique value.

## Fidelity checklist (before you call it done)

- [ ] Matches the reference at the **specified breakpoint** (ask which one if unclear).
- [ ] Typography: family, size, weight, line-height, letter-spacing all match.
- [ ] Colors sampled exactly (background, text, border, accent) — not "close enough."
- [ ] Spacing/padding/margins and border-radius match the measurements.
- [ ] Shadows/elevation match.
- [ ] **All states** covered: default, hover, active/pressed, focus, disabled, and
      empty/loading where applicable.
- [ ] Side-by-side visual diff against the Figma screenshot — no visible drift.

## Guardrails

- Fidelity does **not** override the other rules: still use the antd/Tailwind stack
  ([ui-migration.md](ui-migration.md)), the architecture
  ([architecture.md](architecture.md)), and convert to TS
  ([typescript.md](typescript.md)) as part of the same change.
- If the Figma design conflicts with an existing antd token or shared component,
  prefer extending the theme token so the whole app benefits — raise it rather than
  silently forking a component.
