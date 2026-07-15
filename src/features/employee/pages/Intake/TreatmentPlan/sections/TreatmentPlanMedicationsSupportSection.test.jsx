/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanMedicationsSupportSection from "./TreatmentPlanMedicationsSupportSection";
import { TreatmentPlanFormProvider } from "../context/TreatmentPlanFormContext";

// WHY: SelectMultiPrint wraps CustomMultiSelectInput (react-select/creatable) +
// ReactQuill — heavy/portal-based. Stub it to a light surface that exposes the
// onChange + the rendered value/options so we can assert wiring.
vi.mock("../components/TreatmentPlanPrintFields", () => ({
  __esModule: true,
  SelectMultiPrint: ({ value, onChange, options }) => (
    <div data-testid="select-multi">
      <span data-testid="select-multi-value">
        {Array.isArray(value)
          ? value.map((v) => v?.label ?? v).join(",")
          : (value?.label ?? value ?? "")}
      </span>
      <span data-testid="select-multi-options">{(options || []).length}</span>
      <button
        type="button"
        data-testid="select-multi-add"
        onClick={() => onChange([{ label: "Added", value: "Added" }])}
      >
        add
      </button>
    </div>
  ),
}));

// WHY: react-datepicker is heavy and not under test — stub to a plain input.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange?.(new Date(e.target.value))}
    />
  ),
}));

// WHY: BorderlessInput lives in a barrel of asset/helper exports; stub just it.
vi.mock("@/utils/Makers", () => ({
  __esModule: true,
  BorderlessInput: ({ value, setState, placeholder }) => (
    <input
      data-testid="borderless-input"
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => setState?.(e.target.value)}
    />
  ),
}));

// WHY: @/utils/utils pulls in services/notifications; provide light impls of
// only the two helpers this component imports.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  formatDateToMMDDYYYY: (d) => (d ? new Date(d) : null),
  checkMultiValues: (setter, current, value) => {
    const arr = Array.isArray(current) ? current : [];
    setter(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    );
  },
}));

// Build a form-context value. Setters/handlers default to vi.fn() via Proxy so
// the component never crashes on an unmocked setX/handleX; explicit overrides
// supply controlled values for fields we assert on.
function makeFormValue(overrides = {}) {
  const base = {
    supportSystem: [],
    supportSystemOtherTextBoolean: false,
    supportSystemOtherText: "",
    supportSystemPhoneNumber: "",
    currentMedications: "",
    religiousPreference: [],
    religiousPreferenceText: "",
    nutritionAndWellnessPlanning: [],
    isRequiresAssistance: null,
    personalFinancesComment: "",
    isFallRisk: null,
    fallRiskComment: "",
    recommendationToExtendResidentialTreatment: [],
    services: [],
    dynamicServices: [],
    FREQUENCY_DAILY: [],
    FREQUENCY_WEEKLY: [],
    FREQUENCY_MONTHLY: [],
    FREQUENCY_AS_NEEDED: [],
    canDelete: true,
    dischargePlanning: [],
    isAdditionalDischargePlanningChecked: null,
    additionalComment: "",
    readinessDischarge: "",
    recommendationsForFurtherPrograms: [],
    recommendationsForFurtherProgramsBoolean: false,
    recommendationsForFurtherProgramsOther: "",
    afterCareAndTransitionPlanning: [],
    clinicalSummary: [],
    clinicalSummaryOption: [],
    clientCareCoordinationTeam: "",
    treatmentPlanReviewDate: "",
    dischargePlanDate: "",
    resident: "",
    guardian: "",
    staff: "",
    bpn: "",
    otherIndividual: "",
    commentIndividual: "",
    ...overrides,
  };

  return new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop];
      // Any unspecified setX/handleX/updateX/addX/removeX/clinicalSummaryHandler
      // resolves to a no-op fn so render never throws.
      if (typeof prop === "string") return vi.fn();
      return undefined;
    },
    has() {
      return true;
    },
  });
}

function renderSection(overrides = {}) {
  const value = makeFormValue(overrides);
  const utils = renderWithProviders(
    <TreatmentPlanFormProvider value={value}>
      <TreatmentPlanMedicationsSupportSection />
    </TreatmentPlanFormProvider>,
  );
  return { value, ...utils };
}

describe("TreatmentPlanMedicationsSupportSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the core section labels", () => {
    renderSection();
    expect(screen.getByText("Support System")).toBeInTheDocument();
    expect(screen.getByText("Current List of medication")).toBeInTheDocument();
    expect(
      screen.getByText("Religious/Cultural Preference"),
    ).toBeInTheDocument();
    expect(screen.getByText("Fall Risk")).toBeInTheDocument();
    expect(screen.getByText("Services Provided")).toBeInTheDocument();
  });

  it("renders without crashing when all collection fields are empty/undefined", () => {
    // WHY: API may return undefined arrays; the `?? []` guards must hold.
    expect(() =>
      renderSection({
        supportSystem: undefined,
        dischargePlanning: undefined,
        afterCareAndTransitionPlanning: undefined,
        services: undefined,
        dynamicServices: undefined,
      }),
    ).not.toThrow();
    expect(screen.getByText("Support System")).toBeInTheDocument();
  });

  it("reflects checked support-system checkboxes from context value", () => {
    renderSection({ supportSystem: ["Family", "Guardian"] });
    expect(screen.getByLabelText("Family")).toBeChecked();
    expect(screen.getByLabelText("Guardian")).toBeChecked();
    expect(screen.getByLabelText("Friends")).not.toBeChecked();
  });

  it("invokes handleCheckboxChangeSupportSystem when a support box is toggled", () => {
    const handleCheckboxChangeSupportSystem = vi.fn();
    renderSection({ handleCheckboxChangeSupportSystem });
    fireEvent.click(screen.getByLabelText("Friends"));
    expect(handleCheckboxChangeSupportSystem).toHaveBeenCalledWith("Friends");
  });

  it("shows the support-system Other free-text input only when boolean flag is set", () => {
    renderSection({ supportSystemOtherTextBoolean: false });
    expect(screen.queryByTestId("borderless-input")).not.toBeInTheDocument();

    renderSection({
      supportSystemOtherTextBoolean: true,
      supportSystemOtherText: "neighbor",
    });
    expect(screen.getAllByTestId("borderless-input").length).toBeGreaterThan(0);
  });

  it("updates the phone number through setSupportSystemPhoneNumber", () => {
    const setSupportSystemPhoneNumber = vi.fn();
    renderSection({ setSupportSystemPhoneNumber });
    fireEvent.change(screen.getByPlaceholderText("Type number"), {
      target: { value: "5551234" },
    });
    expect(setSupportSystemPhoneNumber).toHaveBeenCalledWith("5551234");
  });

  it("updates current medications through setCurrentMedications", () => {
    const setCurrentMedications = vi.fn();
    renderSection({ setCurrentMedications });
    fireEvent.change(screen.getByPlaceholderText("Enter medication"), {
      target: { value: "Aspirin" },
    });
    expect(setCurrentMedications).toHaveBeenCalledWith("Aspirin");
  });

  it("routes religious-preference toggle through checkMultiValues into the setter", () => {
    const setreligiousPreference = vi.fn();
    renderSection({ setreligiousPreference, religiousPreference: [] });
    fireEvent.click(screen.getByLabelText("Christian"));
    // checkMultiValues (mocked) adds the value to the empty array.
    expect(setreligiousPreference).toHaveBeenCalledWith(["Christian"]);
  });

  it("shows religious-preference Other text input when 'Other' is selected", () => {
    renderSection({ religiousPreference: ["Other"] });
    expect(screen.getAllByTestId("borderless-input").length).toBeGreaterThan(0);
  });

  it("toggles 'requires assistance' Yes/No checkboxes", () => {
    const setIsRequiresAssistance = vi.fn();
    renderSection({ setIsRequiresAssistance, isRequiresAssistance: true });
    // WHY: "Yes" label repeats across Yes/No groups; target by unique id.
    const yesBox = document.getElementById("AssistanceYes");
    expect(yesBox).toBeChecked();
    fireEvent.click(yesBox);
    expect(setIsRequiresAssistance).toHaveBeenCalled();
  });

  it("renders fixed services rows from the services array", () => {
    renderSection({
      services: [
        {
          serviceProvided: "Case Management",
          daily: [],
          weekly: [],
          monthly: [],
          asNeeded: [],
          additionalNotes: "",
        },
      ],
    });
    expect(screen.getByText("Case Management")).toBeInTheDocument();
  });

  it("renders dynamic services with a delete affordance when canDelete is true", () => {
    renderSection({
      canDelete: true,
      dynamicServices: [
        {
          serviceProvided: "Custom Service",
          daily: [],
          weekly: [],
          monthly: [],
          asNeeded: [],
          additionalNotes: "",
        },
      ],
    });
    expect(screen.getByDisplayValue("Custom Service")).toBeInTheDocument();
    expect(document.querySelector(".del-btn")).toBeTruthy();
  });

  it("hides the dynamic-service delete affordance when canDelete is false", () => {
    renderSection({
      canDelete: false,
      dynamicServices: [
        {
          serviceProvided: "Custom Service",
          daily: [],
          weekly: [],
          monthly: [],
          asNeeded: [],
          additionalNotes: "",
        },
      ],
    });
    expect(document.querySelector(".del-btn")).toBeNull();
  });

  it("calls removeDynamicService when the delete icon is clicked", () => {
    const removeDynamicService = vi.fn();
    renderSection({
      removeDynamicService,
      dynamicServices: [
        {
          serviceProvided: "Custom Service",
          daily: [],
          weekly: [],
          monthly: [],
          asNeeded: [],
          additionalNotes: "",
        },
      ],
    });
    // WHY: onClick handler sits on the AiFillDelete svg, inside the .del-btn span.
    fireEvent.click(document.querySelector(".del-btn svg"));
    expect(removeDynamicService).toHaveBeenCalledWith(0);
  });

  it("calls addNewService when the ADD button is clicked", () => {
    const addNewService = vi.fn();
    renderSection({ addNewService });
    fireEvent.click(screen.getByRole("button", { name: "ADD" }));
    expect(addNewService).toHaveBeenCalled();
  });

  it("invokes handleCheckboxChanges for discharge planning options", () => {
    const handleCheckboxChanges = vi.fn();
    renderSection({ handleCheckboxChanges });
    fireEvent.click(
      screen.getByLabelText("Follow-up Medical appointments upon discharge"),
    );
    expect(handleCheckboxChanges).toHaveBeenCalledWith(
      "Follow-up Medical appointments upon discharge",
    );
  });

  it("shows the additional-discharge comment box only when the Yes flag is set", () => {
    renderSection({ isAdditionalDischargePlanningChecked: null });
    expect(screen.queryByText("Specify ( If Others )")).not.toBeInTheDocument();

    renderSection({ isAdditionalDischargePlanningChecked: true });
    expect(screen.getByText("Specify ( If Others )")).toBeInTheDocument();
  });

  it("invokes recommendations-for-further-programs handler", () => {
    const handleCheckboxChangerecommendationsForFurtherPrograms = vi.fn();
    renderSection({
      handleCheckboxChangerecommendationsForFurtherPrograms,
    });
    fireEvent.click(screen.getByLabelText("PHP"));
    expect(
      handleCheckboxChangerecommendationsForFurtherPrograms,
    ).toHaveBeenCalledWith("PHP");
  });

  it("invokes afterCareAndTransitionPlanning handler", () => {
    const handleCheckboxChangeafterCareAndTransitionPlanning = vi.fn();
    renderSection({ handleCheckboxChangeafterCareAndTransitionPlanning });
    fireEvent.click(screen.getByLabelText("Emergency care 911"));
    expect(
      handleCheckboxChangeafterCareAndTransitionPlanning,
    ).toHaveBeenCalledWith("Emergency care 911");
  });

  it("routes nutrition multi-select changes through its setter", () => {
    const setNutritionAndWellnessPlanning = vi.fn();
    renderSection({ setNutritionAndWellnessPlanning });
    // First SelectMultiPrint is the nutrition planning field.
    fireEvent.click(screen.getAllByTestId("select-multi-add")[0]);
    expect(setNutritionAndWellnessPlanning).toHaveBeenCalledWith([
      { label: "Added", value: "Added" },
    ]);
  });

  it("updates the participant fields (resident/guardian/staff)", () => {
    const setResident = vi.fn();
    renderSection({ setResident });
    const residentInputs = screen.getAllByPlaceholderText("Type here");
    fireEvent.change(residentInputs[0], { target: { value: "Test Patient" } });
    expect(setResident).toHaveBeenCalledWith("Test Patient");
  });

  it("renders the two date pickers for review and discharge dates", () => {
    renderSection();
    expect(screen.getAllByTestId("date-picker")).toHaveLength(2);
  });
});
