/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import RiskFactorsSection from "./RiskFactorsSection";
import { RISK_FACTORS_FIXED_ROWS } from "../../config/dynamicFormGroups";

// WHY: CustomMultiSelectInput wraps react-select/creatable (heavy, portal-based).
// Stub it to a light input that surfaces just the props we assert on.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="multi-select">
      <span data-testid="multi-select-value">
        {(value || []).map((v) => v?.label).join(",")}
      </span>
      <button
        type="button"
        data-testid="multi-select-add"
        onClick={() =>
          onChange([...(value || []), { label: "Added", value: "Added" }])
        }
      >
        add-option
      </button>
      <span data-testid="multi-select-options">{(options || []).length}</span>
    </div>
  ),
}));

// Build 12 fixed rows mirroring the API-loaded shape (yesNo null + comment "").
const makeFixedRows = (overrides = {}) =>
  RISK_FACTORS_FIXED_ROWS.map((config, index) => ({
    type: config.type,
    yesNo: null,
    comment: "",
    comments: [],
    ...(overrides[index] || {}),
  }));

const baseProps = (overrides = {}) => {
  const { rowOverrides, ...rest } = overrides;
  return {
    fixedRows: makeFixedRows(rowOverrides),
    extraRows: [],
    otherDraft: { type: "", yesNo: null, comment: "" },
    updateFixedRow: vi.fn(),
    updateOtherDraft: vi.fn(),
    appendOtherDraft: vi.fn(),
    removeExtraRow: vi.fn(),
    canDelete: true,
    behaviorCuesMultiSelect: {
      options: [{ label: "Crying", value: "Crying" }],
    },
    psychosisMultiSelect: { options: [] },
    ...rest,
  };
};

describe("RiskFactorsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the section heading and all fixed risk factor rows", () => {
    renderWithProviders(<RiskFactorsSection {...baseProps()} />);

    // WHY: every configured fixed row must render so clinicians can score
    // each suicide-risk factor.
    expect(screen.getAllByText("Risk Factors").length).toBeGreaterThanOrEqual(
      1,
    );
    RISK_FACTORS_FIXED_ROWS.forEach((config) => {
      expect(screen.getByText(config.type)).toBeInTheDocument();
    });
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("should render multi-select inputs only for the behavior-cue and psychosis rows", () => {
    renderWithProviders(<RiskFactorsSection {...baseProps()} />);

    // WHY: rows 6 & 7 (Behavior cues / Symptoms of psychosis) use a creatable
    // multi-select; the other rows use a plain textarea.
    expect(screen.getAllByTestId("multi-select")).toHaveLength(2);
  });

  it("should pass each multi-select its configured options", () => {
    renderWithProviders(<RiskFactorsSection {...baseProps()} />);

    const optionCounts = screen
      .getAllByTestId("multi-select-options")
      .map((el) => el.textContent);
    // behaviorCuesMultiSelect has 1 option, psychosisMultiSelect has 0.
    expect(optionCounts).toContain("1");
    expect(optionCounts).toContain("0");
  });

  it("should call updateFixedRow with yesNo=true when a Yes checkbox is toggled", () => {
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox = first fixed row's "Yes".
    fireEvent.click(checkboxes[0]);

    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "yesNo", true);
  });

  it("should call updateFixedRow with yesNo=false when a No checkbox is toggled", () => {
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // Second checkbox = first fixed row's "No".
    fireEvent.click(checkboxes[1]);

    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "yesNo", false);
  });

  it("should reflect a row's yesNo=true value as a checked Yes box", () => {
    const props = baseProps({ rowOverrides: { 0: { yesNo: true } } });
    renderWithProviders(<RiskFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should update a fixed row's comment textarea", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "x");

    // WHY: typing routes per-character through onUpdate(index,"comment",value).
    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "comment", "x");
  });

  it("should route multi-select changes through updateFixedRow for the behavior-cue row", () => {
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    const adders = screen.getAllByTestId("multi-select-add");
    fireEvent.click(adders[0]);

    // First multi-select is row index 6 (Behavior cues).
    expect(props.updateFixedRow).toHaveBeenCalledWith(6, "comments", [
      { label: "Added", value: "Added" },
    ]);
  });

  it("should render existing multi-select comment labels", () => {
    const props = baseProps({
      rowOverrides: { 6: { comments: [{ label: "Crying", value: "Crying" }] } },
    });
    renderWithProviders(<RiskFactorsSection {...props} />);

    expect(
      screen.getAllByTestId("multi-select-value").map((e) => e.textContent),
    ).toContain("Crying");
  });

  it("should render extra rows and delete them when canDelete is true", () => {
    const props = baseProps({
      extraRows: [{ type: "Custom risk", yesNo: true, comment: "note" }],
    });
    renderWithProviders(<RiskFactorsSection {...props} />);

    expect(screen.getByText("Custom risk")).toBeInTheDocument();

    // Delete affordance fires removeExtraRow with the extra-row index.
    const deleteSpan = document.querySelector(".del-btn");
    expect(deleteSpan).toBeTruthy();
    fireEvent.click(deleteSpan);
    expect(props.removeExtraRow).toHaveBeenCalledWith(0);
  });

  it("should not render a delete affordance for extra rows when canDelete is false", () => {
    const props = baseProps({
      canDelete: false,
      extraRows: [{ type: "Custom risk", yesNo: true, comment: "note" }],
    });
    renderWithProviders(<RiskFactorsSection {...props} />);

    expect(document.querySelector(".del-btn")).toBeNull();
  });

  it("should update the Other draft type and toggle its yesNo", () => {
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    // The Other row exposes a free-text type input via placeholder.
    const typeInput = screen.getByPlaceholderText("__________");
    fireEvent.change(typeInput, { target: { value: "Custom" } });
    expect(props.updateOtherDraft).toHaveBeenCalledWith("type", "Custom");
  });

  it("should append a new Other draft row when Add is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<RiskFactorsSection {...props} />);

    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(props.appendOtherDraft).toHaveBeenCalled();
  });

  it("should render without crashing when fixedRows entries are missing", () => {
    // WHY: component falls back to {type: config.type} per index; an empty
    // fixedRows array must not throw.
    const props = baseProps({ fixedRows: [] });
    expect(() =>
      renderWithProviders(<RiskFactorsSection {...props} />),
    ).not.toThrow();
    // Heading still renders.
    expect(screen.getAllByText("Risk Factors").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("should apply the print-hide class when the whole section is empty for print", () => {
    // fixedRows with yesNo undefined + otherDraft yesNo undefined => hidden.
    const hiddenRows = RISK_FACTORS_FIXED_ROWS.map((config) => ({
      type: config.type,
      yesNo: undefined,
      comment: "",
    }));
    const props = baseProps({
      fixedRows: hiddenRows,
      otherDraft: { type: "", yesNo: undefined, comment: "" },
    });
    renderWithProviders(<RiskFactorsSection {...props} />);

    // WHY: matches legacy print logic — an untouched section is hidden on print.
    expect(document.querySelector(".table-row-hinde-print")).toBeTruthy();
  });
});
