/** @format */

import { describe, it, expect, vi } from "vitest";

import * as Entry from "./AssessmentFormEntry";

// AssessmentFormEntry is a barrel/entry module: it re-exports the shared
// Initial Assessment public API (constants, payload mappers, context, section
// components, route wrappers and hooks). The test contract for a barrel is
// that every advertised symbol is re-exported with the expected type, so a
// downstream import never resolves to `undefined`.
//
// Importing the barrel transitively pulls in heavy presentational leaves
// (react-datepicker, react-to-print). Those never run in this shape test, so
// stub them to keep the import graph resolvable in jsdom without real DOM/print
// work. Light stubs only — we assert nothing about their behavior here.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock("react-to-print", () => ({
  __esModule: true,
  useReactToPrint: () => vi.fn(),
}));

describe("AssessmentFormEntry barrel", () => {
  it("re-exports the assessment mode/portal constant objects", () => {
    // WHY: callers branch on these enums; they must be live objects, not undefined.
    expect(Entry.ASSESSMENT_MODES).toBeTruthy();
    expect(typeof Entry.ASSESSMENT_MODES).toBe("object");
    expect(Entry.ASSESSMENT_PORTALS).toBeTruthy();
    expect(typeof Entry.ASSESSMENT_PORTALS).toBe("object");
  });

  it("re-exports the payload mapper builders as functions", () => {
    expect(typeof Entry.buildAssessmentPayload).toBe("function");
    expect(typeof Entry.buildAssessmentPayloadForResident).toBe("function");
  });

  it("re-exports the form context provider and its hooks", () => {
    // WHY: the provider drives every section's controlled state; both the
    // required and optional context hooks must be wired for resident/employee.
    expect(typeof Entry.AssessmentFormProvider).toBe("function");
    expect(typeof Entry.useAssessmentFormContext).toBe("function");
    expect(typeof Entry.useAssessmentFormContextOptional).toBe("function");
  });

  it("re-exports the section components", () => {
    expect(typeof Entry.NotificationCard).toBe("function");
    expect(typeof Entry.PatientInformationSection).toBe("function");
    expect(typeof Entry.MedicalConditionsSection).toBe("function");
    expect(typeof Entry.SubstanceAbuseSection).toBe("function");
    expect(typeof Entry.AssessmentForm).toBe("function");
    expect(typeof Entry.SelectSinglePrint).toBe("function");
  });

  it("re-exports the portal-aware route wrappers", () => {
    expect(typeof Entry.AssessmentFormRoute).toBe("function");
    expect(typeof Entry.EmployeeAssessmentRoute).toBe("function");
    expect(typeof Entry.ResidentAssessmentRoute).toBe("function");
  });

  it("re-exports the assessment hooks", () => {
    expect(typeof Entry.useSignersList).toBe("function");
    expect(typeof Entry.useResidentStrengths).toBe("function");
    expect(typeof Entry.useAssessmentForm).toBe("function");
    expect(typeof Entry.useAssessmentApi).toBe("function");
    expect(typeof Entry.usePrintAssessment).toBe("function");
    expect(typeof Entry.useSignatureManagement).toBe("function");
  });

  it("does not leak unexpected default export", () => {
    // WHY: this module is a named-export barrel only; a stray default would
    // signal an accidental component/default re-export creeping in.
    expect(Entry.default).toBeUndefined();
  });
});
