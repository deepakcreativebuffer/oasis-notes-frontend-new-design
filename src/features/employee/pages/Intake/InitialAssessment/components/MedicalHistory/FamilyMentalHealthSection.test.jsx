/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import FamilyMentalHealthSection, {
  FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS,
} from "./FamilyMentalHealthSection";

// WHY: react-select/creatable is heavy and not under test. CustomMultiSelectInput
// wraps it; stub it with a light input that surfaces the props we assert on so
// rendering doesn't pull in the real select machinery.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options, onKeyDown }) => (
    <input
      data-testid="multi-select"
      data-options={JSON.stringify(options || [])}
      value={Array.isArray(value) ? value.map((v) => v?.value).join(",") : ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      onKeyDown={onKeyDown}
      readOnly
    />
  ),
}));

const baseProps = (overrides = {}) => ({
  SignificantFamilyMedicalPsychiatricHistory: [],
  SignificantFamilyMedicalPsychiatricHistoryHandler: vi.fn(),
  SignificantFamilyMedicalPsychiatricHistoryOptions: [],
  handleKeySignificantFamilyMedicalPsychiatricHistory: vi.fn(),
  mentalHealthTreatmentHistoryTypeOfService: [],
  mentalHealthTreatmentHistoryTypeOfServiceHandler: vi.fn(),
  mentalHealthTreatmentHistoryTypeOfServiceOption: [],
  handleKeyMentalHealthTreatmentHistoryTypeOfService: vi.fn(),
  mentalHealthTreatmentHistoryWhere: "",
  setMentalHealthTreatmentHistoryWhere: vi.fn(),
  mentalHealthTreatmentHistoryDates: "",
  setMentalHealthTreatmentHistoryDates: vi.fn(),
  mentalHealthTreatmentHistoryDiagnosisReason: [],
  mentalHealthTreatmentHistoryDiagnosisReasonHandler: vi.fn(),
  mentalHealthTreatmentHistoryDiagnosisReasonOption: [],
  handleKeyDownMentalHealthTreatmentHistoryDiagnosisReason: vi.fn(),
  handleTypeOfService: vi.fn(),
  typeOfServiceArray: [],
  handleRemoveItem: vi.fn(),
  canDelete: false,
  ...overrides,
});

describe("FamilyMentalHealthSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the section labels and the Add button", () => {
    renderWithProviders(<FamilyMentalHealthSection {...baseProps()} />);

    expect(
      screen.getByText(/Significant Family Medical\/Psychiatric History:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Type of Service/i)).toBeInTheDocument();
    expect(screen.getByText("Where")).toBeInTheDocument();
    expect(screen.getByText("Dates")).toBeInTheDocument();
    expect(
      screen.getByText(/Diagnosis\/Reason for Treatment/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("renders without crashing when array/value props are empty", () => {
    renderWithProviders(<FamilyMentalHealthSection {...baseProps()} />);
    // WHY: empty typeOfServiceArray means the results table is not rendered at all.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("propagates the Where text field change to its setter", () => {
    const props = baseProps();
    renderWithProviders(<FamilyMentalHealthSection {...props} />);

    const whereInput = screen.getByPlaceholderText("Enter text");
    fireEvent.change(whereInput, { target: { value: "Clinic A" } });

    expect(props.setMentalHealthTreatmentHistoryWhere).toHaveBeenCalledWith(
      "Clinic A",
    );
  });

  it("propagates the Dates text field change to its setter", () => {
    const props = baseProps();
    renderWithProviders(<FamilyMentalHealthSection {...props} />);

    const dateInput = screen.getByPlaceholderText("Enter Date");
    fireEvent.change(dateInput, { target: { value: "2026-01-01" } });

    expect(props.setMentalHealthTreatmentHistoryDates).toHaveBeenCalledWith(
      "2026-01-01",
    );
  });

  it("invokes handleTypeOfService when Add is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<FamilyMentalHealthSection {...props} />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(props.handleTypeOfService).toHaveBeenCalled();
  });

  it("renders a results row from typeOfServiceArray", () => {
    const props = baseProps({
      typeOfServiceArray: [
        {
          typeOfService: [{ value: "Inpatient" }],
          where: "Clinic A",
          dates: "2026-01-01",
          diagnosisReason: [{ value: "Anxiety" }],
        },
      ],
    });
    renderWithProviders(<FamilyMentalHealthSection {...props} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Inpatient")).toBeInTheDocument();
    expect(screen.getByText("Clinic A")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
    expect(screen.getByText("Anxiety")).toBeInTheDocument();
  });

  it("hides the Action column when canDelete is false", () => {
    const props = baseProps({
      canDelete: false,
      typeOfServiceArray: [
        {
          typeOfService: [{ value: "Inpatient" }],
          where: "Clinic A",
          dates: "2026-01-01",
          diagnosisReason: [{ value: "Anxiety" }],
        },
      ],
    });
    renderWithProviders(<FamilyMentalHealthSection {...props} />);

    // WHY: the "Action" header only renders for users with delete permission.
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
  });

  it("shows the Action column and wires delete when canDelete is true", () => {
    const props = baseProps({
      canDelete: true,
      typeOfServiceArray: [
        {
          typeOfService: [{ value: "Inpatient" }],
          where: "Clinic A",
          dates: "2026-01-01",
          diagnosisReason: [{ value: "Anxiety" }],
        },
      ],
    });
    const { container } = renderWithProviders(
      <FamilyMentalHealthSection {...props} />,
    );

    expect(screen.getByText("Action")).toBeInTheDocument();

    // WHY: AiFillDelete renders an svg; click it to confirm the index is forwarded.
    const deleteIcon = container.querySelector(".del-btn svg");
    expect(deleteIcon).toBeTruthy();
    fireEvent.click(deleteIcon);
    expect(props.handleRemoveItem).toHaveBeenCalledWith(0);
  });

  it("exports the documented prop key list", () => {
    // WHY: the exported key list documents the controlled-prop contract callers rely on.
    expect(Array.isArray(FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS)).toBe(true);
    expect(FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS).toContain("canDelete");
    expect(FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS).toContain(
      "typeOfServiceArray",
    );
    expect(FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS).toHaveLength(20);
  });
});
