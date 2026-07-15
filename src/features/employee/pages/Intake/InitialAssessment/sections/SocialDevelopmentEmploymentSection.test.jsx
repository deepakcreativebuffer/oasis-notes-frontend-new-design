/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SocialDevelopmentEmploymentSection from "./SocialDevelopmentEmploymentSection";

// WHY: CustomMultiSelectInput wraps react-select/creatable (heavy, portal-based).
// Stub it to a light element surfacing only the props we assert on.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="multi-select">
      <span data-testid="multi-select-value">
        {(value || []).map((v) => v?.label).join(",")}
      </span>
      <span data-testid="multi-select-options">{(options || []).length}</span>
      <button
        type="button"
        data-testid="multi-select-add"
        onClick={() =>
          onChange?.([...(value || []), { label: "Added", value: "Added" }])
        }
      >
        add-option
      </button>
    </div>
  ),
}));

// WHY: component reads its entire state from the form context hook. Mock it so
// each test can seed controlled field values and spy on the setters.
const ctxHoisted = vi.hoisted(() => ({ value: null }));
vi.mock("../context/InitialAssessmentFormContext", () => ({
  __esModule: true,
  useInitialAssessmentFormContext: () => ctxHoisted.value,
}));

// Build a context object: real setters are jest.fn spies; values default empty.
const makeCtx = (overrides = {}) => ({
  significantSocialDevelopmentalHistory: "",
  setSignificantSocialDevelopmentalHistory: vi.fn(),
  educationalHistory: "",
  setEducationalHistory: vi.fn(),
  specialEducation: null,
  setSpecialEducation: vi.fn(),
  currentStudent: null,
  setCurrentStudent: vi.fn(),
  ifYesWhere: "",
  setIfYesWhere: vi.fn(),
  currentlyEmployed: null,
  setCurrentlyEmployed: vi.fn(),
  employmentLocation: "",
  setEmploymentLocation: vi.fn(),
  workHistory: "",
  setWorkHistory: vi.fn(),
  militaryService: null,
  setMilitaryService: vi.fn(),
  activeDuty: null,
  setActiveDuty: vi.fn(),
  selectedValue: [],
  diagnosisSelect: {
    selectedValueHandler: vi.fn(),
    selectedValueOption: [{ label: "DUI", value: "DUI" }],
    handleKeyDownSelectedValue: vi.fn(),
  },
  ...overrides,
});

const renderSection = (overrides = {}) => {
  ctxHoisted.value = makeCtx(overrides);
  return {
    ctx: ctxHoisted.value,
    ...renderWithProviders(<SocialDevelopmentEmploymentSection />),
  };
};

describe("SocialDevelopmentEmploymentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all the major section labels", () => {
    renderSection();

    expect(
      screen.getByText("Significant Social/Developmental History:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Childhood (include parents, siblings, family)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Highest level of education")).toBeInTheDocument();
    expect(screen.getByText("Special education")).toBeInTheDocument();
    expect(screen.getByText("Currently a student?")).toBeInTheDocument();
    expect(screen.getByText("Employment history")).toBeInTheDocument();
    expect(screen.getByText("Currently employed")).toBeInTheDocument();
    expect(
      screen.getByText("Work History (and barriers to employment)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Military History")).toBeInTheDocument();
    expect(
      screen.getByText("Criminal Justice Legal History"),
    ).toBeInTheDocument();
  });

  it("renders provided field values into the text inputs", () => {
    renderSection({
      significantSocialDevelopmentalHistory: "Raised by grandparents",
      educationalHistory: "High school",
      ifYesWhere: "Local college",
      employmentLocation: "Acme FT",
      workHistory: "Stable history",
    });

    expect(
      screen.getByDisplayValue("Raised by grandparents"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("High school")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Local college")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme FT")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Stable history")).toBeInTheDocument();
  });

  it("routes childhood text changes through the setter", () => {
    const { ctx } = renderSection();

    // Childhood placeholder is "Enter" (JSX collapses trailing whitespace).
    const input = screen.getByPlaceholderText("Enter");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(ctx.setSignificantSocialDevelopmentalHistory).toHaveBeenCalledWith(
      "abc",
    );
  });

  it("routes education text changes through the setter", () => {
    const { ctx } = renderSection();

    const input = screen.getByPlaceholderText("Enter here");
    fireEvent.change(input, { target: { value: "GED" } });

    expect(ctx.setEducationalHistory).toHaveBeenCalledWith("GED");
  });

  it("toggles special education Yes/No checkboxes via setSpecialEducation", () => {
    const { ctx } = renderSection();

    // educationYes / educationNo are the first two checkboxes in the DOM.
    const yes = document.getElementById("educationYes");
    const no = document.getElementById("educationNo");
    fireEvent.click(yes);
    expect(ctx.setSpecialEducation).toHaveBeenCalledWith(true);
    fireEvent.click(no);
    expect(ctx.setSpecialEducation).toHaveBeenCalledWith(false);
  });

  it("reflects boolean field values as checked checkboxes", () => {
    renderSection({
      specialEducation: true,
      currentStudent: false,
      currentlyEmployed: true,
      militaryService: false,
      activeDuty: true,
    });

    expect(document.getElementById("educationYes")).toBeChecked();
    expect(document.getElementById("educationNo")).not.toBeChecked();
    expect(document.getElementById("studentNO")).toBeChecked();
    expect(document.getElementById("currentlyEmployed")).toBeChecked();
    expect(document.getElementById("militaryServiceno")).toBeChecked();
    expect(document.getElementById("activeDuty")).toBeChecked();
  });

  it("toggles the student, employment, military and active-duty radios", () => {
    const { ctx } = renderSection();

    fireEvent.click(document.getElementById("studentYes"));
    expect(ctx.setCurrentStudent).toHaveBeenCalledWith(true);

    fireEvent.click(document.getElementById("currentlyEmployedno"));
    expect(ctx.setCurrentlyEmployed).toHaveBeenCalledWith(false);

    fireEvent.click(document.getElementById("militaryService"));
    expect(ctx.setMilitaryService).toHaveBeenCalledWith(true);

    fireEvent.click(document.getElementById("activeDutyno"));
    expect(ctx.setActiveDuty).toHaveBeenCalledWith(false);
  });

  it("routes the 'if yes, where' text change through setIfYesWhere", () => {
    const { ctx } = renderSection();

    // First "Enter text" placeholder belongs to the 'If yes, where?' field.
    fireEvent.change(screen.getAllByPlaceholderText("Enter text")[0], {
      target: { value: "where pt" },
    });
    expect(ctx.setIfYesWhere).toHaveBeenCalledWith("where pt");
  });

  it("routes work-history changes through setWorkHistory", () => {
    const { ctx } = renderSection();

    const textInputs = screen.getAllByPlaceholderText("Enter text");
    // Order in DOM: ifYesWhere, employmentLocation, workHistory.
    fireEvent.change(textInputs[textInputs.length - 1], {
      target: { value: "wh" },
    });
    expect(ctx.setWorkHistory).toHaveBeenCalledWith("wh");
  });

  it("renders the criminal justice multi-select with its configured options", () => {
    renderSection();

    expect(screen.getByTestId("multi-select")).toBeInTheDocument();
    // diagnosisSelect.selectedValueOption has 1 option (DUI).
    expect(screen.getByTestId("multi-select-options").textContent).toBe("1");
  });

  it("routes multi-select changes through the diagnosis handler", () => {
    const { ctx } = renderSection();

    fireEvent.click(screen.getByTestId("multi-select-add"));
    expect(ctx.diagnosisSelect.selectedValueHandler).toHaveBeenCalledWith([
      { label: "Added", value: "Added" },
    ]);
  });

  it("renders selected criminal-justice values", () => {
    renderSection({ selectedValue: [{ label: "DUI", value: "DUI" }] });

    expect(screen.getByTestId("multi-select-value").textContent).toContain(
      "DUI",
    );
  });

  it("renders without crashing when all values are empty/null", () => {
    expect(() => renderSection()).not.toThrow();
  });
});
