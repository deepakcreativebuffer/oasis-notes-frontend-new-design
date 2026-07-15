/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanPatientSection from "./TreatmentPlanPatientSection";
import { checkMultiValues } from "@/utils/utils";

// Hoisted mutable holder for the form-context value the component consumes.
// Tests overwrite ctx.value before rendering; the Proxy yields no-op
// functions for any set*/handle* setter key so render never crashes.
const { ctx } = vi.hoisted(() => ({ ctx: { value: {} } }));

vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => ctx.value,
}));

// WHY: PatientComponent wraps a search/network widget — stub to a marker that
// surfaces the wiring props so we can assert the create-mode branch renders it.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId, MainResidentName, setWholeData }) => (
    <div
      data-testid="patient-component"
      data-wired={String(
        typeof MainPatientId === "function" &&
          typeof MainResidentName === "function" &&
          typeof setWholeData === "function",
      )}
    />
  ),
}));

// react-datepicker is heavy/portal-based; stub to a plain input.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ selected, onChange, placeholderText, disabled }) => (
    <input
      data-testid="date-picker"
      disabled={disabled}
      placeholder={placeholderText}
      value={selected || ""}
      onChange={(e) => onChange && onChange(new Date("2026-06-10"))}
      readOnly
    />
  ),
}));

// SelectMultiPrint wraps a creatable multi-select; stub to a marker.
vi.mock("../components/TreatmentPlanPrintFields", () => ({
  __esModule: true,
  SelectMultiPrint: ({ value, options, onChange }) => (
    <div
      data-testid="select-multi-print"
      data-options={(options || []).length}
      onClick={() => onChange && onChange([{ label: "x", value: "x" }])}
    >
      {Array.isArray(value) ? value.map((v) => v?.label).join(",") : ""}
    </div>
  ),
}));

// BorderlessInput from Makers — stub to a text input bound to value/setState.
vi.mock("@/utils/Makers", () => ({
  __esModule: true,
  BorderlessInput: ({ value, setState, placeholder }) => (
    <input
      data-testid="borderless-input"
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => setState && setState(e.target.value)}
    />
  ),
}));

// utils helpers used in render/handlers — keep real-ish but safe stubs.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  formatDateToMMDDYYYY: (d) => (d ? "06/10/2026" : ""),
  checkMultiValues: vi.fn(),
}));

// Build a default context value. Any set*/handle* key falls through the Proxy
// to a no-op fn; explicit fields below drive the assertions.
const makeCtx = (overrides = {}) => {
  const fields = {
    id: null,
    residentName: "",
    ahcccsId: "",
    dob: "",
    diagnosis: "",
    date: "",
    admitDate: "",
    physicalService: "",
    behavior: "",
    medicationAdministation: "",
    medicationAssistance: "",
    presentingPrice: [],
    presentingPriceOption: [],
    mendelHealth: "",
    mentelText: "",
    mind: "",
    mindText: "",
    adls: "",
    adlsText: "",
    BHealth: "",
    Btext: "",
    primaryCare: "",
    psychiatricProvider: "",
    ...overrides,
  };
  return new Proxy(fields, {
    get(target, prop) {
      if (prop in target) return target[prop];
      // Setters / handlers default to spy no-ops.
      if (
        typeof prop === "string" &&
        (prop.startsWith("set") || prop.startsWith("handle"))
      ) {
        if (!target["__fns_" + prop]) target["__fns_" + prop] = vi.fn();
        return target["__fns_" + prop];
      }
      return undefined;
    },
    has: () => true,
  });
};

describe("TreatmentPlanPatientSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ctx.value = makeCtx();
  });

  it("renders the PatientComponent search in create mode (no id)", () => {
    ctx.value = makeCtx({ id: null });
    renderWithProviders(<TreatmentPlanPatientSection />);

    const pc = screen.getByTestId("patient-component");
    expect(pc).toBeInTheDocument();
    // WHY: create mode must wire the three setters through to the search widget.
    expect(pc).toHaveAttribute("data-wired", "true");
    // The resident-name read-only card must NOT render in create mode.
    expect(screen.queryByLabelText("Resident Name :")).not.toBeInTheDocument();
  });

  it("renders the read-only resident name card in edit mode (id present)", () => {
    ctx.value = makeCtx({ id: "tp-test-001", residentName: "Test Patient" });
    renderWithProviders(<TreatmentPlanPatientSection />);

    // WHY: with an id, the existing-record name field replaces the search.
    expect(screen.queryByTestId("patient-component")).not.toBeInTheDocument();
    const nameInput = screen.getByLabelText("Resident Name :");
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("Test Patient");
  });

  it("renders patient demographic fields with provided values", () => {
    ctx.value = makeCtx({
      id: "tp-test-001",
      ahcccsId: "AHCCCS-123",
      diagnosis: "Continuing",
    });
    renderWithProviders(<TreatmentPlanPatientSection />);

    expect(screen.getByText("AHCCCS ID")).toBeInTheDocument();
    expect(screen.getByDisplayValue("AHCCCS-123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Continuing")).toBeInTheDocument();
    expect(
      screen.getByText("Diagnosis (specify if new or continuing)"),
    ).toBeInTheDocument();
  });

  it("renders the section labels for care, medication, mental status, mood, ADLS and providers", () => {
    renderWithProviders(<TreatmentPlanPatientSection />);

    expect(screen.getByText("Care")).toBeInTheDocument();
    expect(screen.getByText("Physical Services")).toBeInTheDocument();
    expect(screen.getByText("Behavioral Services")).toBeInTheDocument();
    expect(screen.getByText("Medication Services")).toBeInTheDocument();
    expect(screen.getByText("Mental Status")).toBeInTheDocument();
    expect(screen.getByText("Mood Level")).toBeInTheDocument();
    expect(screen.getByText("ADLS")).toBeInTheDocument();
    expect(screen.getByText("Behavioral Health Services")).toBeInTheDocument();
    expect(screen.getByText("Primary Care Provider ")).toBeInTheDocument();
  });

  it("passes presenting-problem options through to the multi-select", () => {
    ctx.value = makeCtx({
      presentingPriceOption: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
      ],
      presentingPrice: [{ label: "A", value: "A" }],
    });
    renderWithProviders(<TreatmentPlanPatientSection />);

    const sel = screen.getByTestId("select-multi-print");
    expect(sel).toHaveAttribute("data-options", "2");
    // selected value labels render.
    expect(sel.textContent).toContain("A");
  });

  it("toggles the Physical Services checkbox via its setter", () => {
    const setPhysicalService = vi.fn();
    ctx.value = makeCtx({ setPhysicalService });
    renderWithProviders(<TreatmentPlanPatientSection />);

    const checkbox = screen.getByLabelText("Physical Services");
    fireEvent.click(checkbox);
    // WHY: unchecked -> sets sentinel string "f.physicalService".
    expect(setPhysicalService).toHaveBeenCalledWith("f.physicalService");
  });

  it("routes a Mental Status checkbox change through checkMultiValues", () => {
    renderWithProviders(<TreatmentPlanPatientSection />);

    const oriented = screen.getByLabelText("Oriented");
    fireEvent.click(oriented);
    expect(checkMultiValues).toHaveBeenCalled();
    // The value argument for the Oriented box is "oriented".
    const call = checkMultiValues.mock.calls.find((c) => c[2] === "oriented");
    expect(call).toBeTruthy();
  });

  it("reflects checked state from mendelHealth and shows the Other free-text input", () => {
    ctx.value = makeCtx({ mendelHealth: "oriented,other", mentelText: "note" });
    renderWithProviders(<TreatmentPlanPatientSection />);

    expect(screen.getByLabelText("Oriented")).toBeChecked();
    // WHY: selecting "other" reveals the BorderlessInput for free text.
    const borderless = screen.getAllByTestId("borderless-input");
    expect(borderless.some((i) => i.value === "note")).toBe(true);
  });

  it("does not render the Other free-text input when 'other' is not selected", () => {
    ctx.value = makeCtx({ mendelHealth: "oriented", mind: "Normal" });
    renderWithProviders(<TreatmentPlanPatientSection />);

    // Neither mental-status nor mood "other" selected => no borderless inputs.
    expect(screen.queryByTestId("borderless-input")).not.toBeInTheDocument();
  });

  it("renders provider text fields bound to context values", () => {
    ctx.value = makeCtx({
      primaryCare: "Dr Primary",
      psychiatricProvider: "Dr Psych",
    });
    renderWithProviders(<TreatmentPlanPatientSection />);

    expect(screen.getByDisplayValue("Dr Primary")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dr Psych")).toBeInTheDocument();
  });

  it("renders without crashing when all context fields are empty/default", () => {
    ctx.value = makeCtx();
    expect(() =>
      renderWithProviders(<TreatmentPlanPatientSection />),
    ).not.toThrow();
    expect(screen.getByText("Care")).toBeInTheDocument();
  });
});
