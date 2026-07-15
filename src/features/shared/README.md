# Shared (cross-panel)

Single source of truth for UI primitives and intake helpers used by **Admin**, **Employee**, **Resident (Patient)**, and **Guardian**.

## Layout

```
shared/
  hooks/              usePrint, useNavigateWithParams
  permissions/        portalRoles.js, panelBoundaries.js (Tier D — roles only, not merged routes)
  intake/             intakeLinks, assessmentConstants, assessmentContext, appointmentLinks
  features/
    auth/             ChangePassword
    appointments/     BookAppointment (employee + resident portals)
    intake/           Intake forms (employee + resident), views, face sheet, safety plan
    clinical/vitals/  Vitals form, list, resident panel
    training/         TrainingAssignModal
    scheduling/       Activity schedule, staff schedule (admin + employee)
    employment/       Reference check, job desc, performance, offer letter
    clinical/         Patient vitals (admin list), incident report update
  ui/selectors/       CustomSelect, CustomMultiSelect, CustomMultiSelectInput
  ui/forms/           AutoSize, AssessmentTypeHeader
```

Tier B pages stay **separate admin vs employee UIs** where behavior differs; routes import the canonical file under `shared/features/…` (e.g. `ReferenceCheckAdminPage`, `OfferLetterEmployeePage`).

Tier C: intake modules under `shared/features/intake/`; lists stay in `Pages/Intake/*List.js`. Assessment routing: `shared/features/intake/AssessmentFormRoutes.jsx`.

**Tier D (do not merge):** `adminRoutes`, `employeeRoutes`, and `residentRoutes` stay in `src/Route/*`. Sidebars, `ProtectedRoute`, and panel-specific form hooks stay in place. Use `panelBoundaries.js` for allowed roles and Guardian vs employee document links only. See `permissions/TIER_D.md`.

## Import paths

Use the `@/` alias (`jsconfig.json` + `craco.config.js`) for anything under `src/`:

```javascript
import { usePrint } from "@/shared/hooks/usePrint";
import CustomSelect from "@/shared/ui/selectors/CustomSelect";
import { ROLES } from "@/constants";
import HOC from "@/Layout/Inner/HOC";
import { getIntakeDocumentLinks } from "@/shared/intake/intakeLinks";
```

Avoid long `../../../../` chains in `shared/` — run `node scripts/migrate-alias-imports.js` after adding new deep imports.

## Intentional thin wrappers (not duplicates)

| File                                                                | Why it stays                                      |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| `Pages/Intake/PatientPanel/FormUpper.js`                            | Re-exports `shared/features/intake/FormsUpperbar` |
| `resident/Components/Forms/FormsUpperbar.jsx`                       | Same                                              |
| `Pages/Intake/InitialAssessment/components/AssessmentFormRoute.jsx` | Re-exports `AssessmentFormRoutes`                 |
| `Pages/PatientVitals/Vitals2.jsx`                                   | Re-exports `VitalsFormPage`                       |

## Prevent duplicate creep

```bash
npm run verify:panels
```

Runs shared canonical checks, Tier D separation, and duplicate component audit.
