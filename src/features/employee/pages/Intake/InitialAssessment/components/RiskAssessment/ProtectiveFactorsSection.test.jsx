/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ProtectiveFactorsSection from "./ProtectiveFactorsSection";
import { PROTECTIVE_FACTORS_FIXED_ROWS } from "../../config/dynamicFormGroups";

// The component is purely presentational: it receives row state + callbacks as
// props. Config (PROTECTIVE_FACTORS_FIXED_ROWS) and the print-hide utils are
// pure modules, so we exercise them for real rather than mocking.

const makeFixedRows = (overrides = {}) =>
  PROTECTIVE_FACTORS_FIXED_ROWS.map((config, index) => ({
    type: config.type,
    // default yesNo undefined would hide for print; set null so rows are visible
    yesNo: overrides[index]?.yesNo ?? null,
    comment: overrides[index]?.comment ?? "",
  }));

const baseProps = (over = {}) => ({
  fixedRows: makeFixedRows(),
  extraRows: [],
  otherDraft: { type: "", yesNo: undefined, comment: "" },
  updateFixedRow: vi.fn(),
  updateOtherDraft: vi.fn(),
  appendOtherDraft: vi.fn(),
  removeExtraRow: vi.fn(),
  canDelete: true,
  ...over,
});

describe("ProtectiveFactorsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the section header, table headers and all fixed rows", () => {
    renderWithProviders(<ProtectiveFactorsSection {...baseProps()} />);

    expect(screen.getByText("Protective factors")).toBeInTheDocument();
    expect(
      screen.getByText("Protective factors that apply"),
    ).toBeInTheDocument();
    // WHY: each configured protective-factor label is rendered as a row.
    PROTECTIVE_FACTORS_FIXED_ROWS.forEach((config) => {
      expect(screen.getByText(config.type)).toBeInTheDocument();
    });
  });

  it("should call updateFixedRow with yesNo=true when a Yes checkbox is toggled", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: first checkbox in the first fixed row is the "Yes" cell.
    await user.click(checkboxes[0]);

    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "yesNo", true);
  });

  it("should call updateFixedRow with yesNo=false when the No checkbox is toggled", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: second checkbox in the first fixed row is the "No" cell.
    await user.click(checkboxes[1]);

    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "yesNo", false);
  });

  it("should reflect a checked Yes box from row state", () => {
    const props = baseProps({
      fixedRows: makeFixedRows({ 0: { yesNo: true } }),
    });
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: row[0].yesNo === true -> Yes checkbox checked, No checkbox unchecked.
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should call updateFixedRow when a fixed row comment changes", () => {
    const props = baseProps();
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    const textareas = screen.getAllByRole("textbox");
    // WHY: first textarea is the comment field of the first fixed row.
    fireEvent.change(textareas[0], { target: { value: "Strong family" } });

    expect(props.updateFixedRow).toHaveBeenCalledWith(
      0,
      "comment",
      "Strong family",
    );
  });

  it("should render extra rows and delete them when canDelete is true", async () => {
    const user = userEvent.setup();
    const props = baseProps({
      extraRows: [{ type: "Custom support", yesNo: true, comment: "note" }],
    });
    const { container } = renderWithProviders(
      <ProtectiveFactorsSection {...props} />,
    );

    expect(screen.getByText("Custom support")).toBeInTheDocument();

    const delBtn = container.querySelector(".del-btn");
    expect(delBtn).toBeTruthy();
    await user.click(delBtn);
    expect(props.removeExtraRow).toHaveBeenCalledWith(0);
  });

  it("should not render a delete control for extra rows when canDelete is false", () => {
    const props = baseProps({
      canDelete: false,
      extraRows: [{ type: "Custom support", yesNo: true, comment: "note" }],
    });
    const { container } = renderWithProviders(
      <ProtectiveFactorsSection {...props} />,
    );

    // WHY: delete affordance is gated behind canDelete.
    expect(container.querySelector(".del-btn")).toBeNull();
  });

  it("should drive the Other draft type/comment and checkboxes", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    const otherInput = screen.getByPlaceholderText("__________");
    fireEvent.change(otherInput, { target: { value: "Pets" } });
    expect(props.updateOtherDraft).toHaveBeenCalledWith("type", "Pets");

    // Last two checkboxes belong to the Other row (Yes then No).
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[checkboxes.length - 2]);
    expect(props.updateOtherDraft).toHaveBeenCalledWith("yesNo", true);
    await user.click(checkboxes[checkboxes.length - 1]);
    expect(props.updateOtherDraft).toHaveBeenCalledWith("yesNo", false);
  });

  it("should call appendOtherDraft when Add is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<ProtectiveFactorsSection {...props} />);

    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(props.appendOtherDraft).toHaveBeenCalledTimes(1);
  });

  it("should render without crashing when extraRows is missing", () => {
    const props = baseProps({ extraRows: undefined });
    renderWithProviders(<ProtectiveFactorsSection {...props} />);
    // WHY: extraRows?.map guards the optional array.
    expect(screen.getByText("Protective factors")).toBeInTheDocument();
  });
});
