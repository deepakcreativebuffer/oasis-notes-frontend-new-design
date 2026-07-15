/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import IndependentLivingSkillsSection from "./IndependentLivingSkillsSection";
import { INDEPENDENT_LIVING_SKILLS_FIXED_ROWS } from "../../config/dynamicFormGroups";

// WHY: this section is purely presentational — it reads the fixed-row schema
// (a real pure config) and drives all state through controlled callbacks, so
// no services/contexts/hooks need mocking.

const makeFixedRow = (type, overrides = {}) => ({
  type,
  good: false,
  fair: false,
  otherCurrentNotSoGood: false,
  needAssist: false,
  comments: "",
  ...overrides,
});

// Build a 10-row fixed array matching the schema order.
const makeFixedRows = (perRowOverrides = {}) =>
  INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map(({ type }, index) =>
    makeFixedRow(type, perRowOverrides[index] || {}),
  );

const baseProps = (overrides = {}) => ({
  fixedRows: makeFixedRows(),
  extraRows: [],
  otherDraft: {
    type: "",
    good: false,
    fair: false,
    otherCurrentNotSoGood: false,
    needAssist: false,
    comments: "",
  },
  showTakingMedications: true,
  updateFixedRow: vi.fn(),
  updateOtherDraft: vi.fn(),
  appendOtherDraft: vi.fn(),
  removeExtraRow: vi.fn(),
  canDelete: true,
  ...overrides,
});

describe("IndependentLivingSkillsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the section heading and column headers", () => {
    renderWithProviders(<IndependentLivingSkillsSection {...baseProps()} />);

    expect(
      screen.getByText("Current Independent Living Skills"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Type of Activity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Comments" }),
    ).toBeInTheDocument();
  });

  it("should render every fixed skill row when Taking medications is shown", () => {
    renderWithProviders(<IndependentLivingSkillsSection {...baseProps()} />);

    // WHY: with showTakingMedications true, all 10 schema rows render, including
    // the medication row gated behind requiresIndependent10.
    INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.forEach(({ type }) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it("should hide the Taking medications row when showTakingMedications is false", () => {
    renderWithProviders(
      <IndependentLivingSkillsSection
        {...baseProps({ showTakingMedications: false })}
      />,
    );

    // WHY: the row flagged requiresIndependent10 returns null when the flag is off.
    expect(screen.queryByText("Taking medications")).not.toBeInTheDocument();
    expect(screen.getByText("Bathing/Showering")).toBeInTheDocument();
  });

  it("should call updateFixedRow when a fixed-row checkbox is toggled", () => {
    const props = baseProps();
    renderWithProviders(<IndependentLivingSkillsSection {...props} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // WHY: first checkbox is the "Good" cell of the first fixed row (index 0),
    // toggled to the inverse of its current false value.
    expect(props.updateFixedRow).toHaveBeenCalledWith(0, "good", true);
  });

  it("should render an extra row with its type and a delete control when canDelete", () => {
    const props = baseProps({
      extraRows: [
        {
          type: "Gardening",
          good: true,
          fair: false,
          otherCurrentNotSoGood: false,
          needAssist: true,
          comments: "extra note",
        },
      ],
    });
    renderWithProviders(<IndependentLivingSkillsSection {...props} />);

    expect(screen.getByText(/Gardening/)).toBeInTheDocument();
    expect(screen.getByText("extra note")).toBeInTheDocument();
  });

  it("should call removeExtraRow with the row index when its delete icon is clicked", () => {
    const props = baseProps({
      extraRows: [{ type: "Gardening", comments: "note", needAssist: false }],
    });
    const { container } = renderWithProviders(
      <IndependentLivingSkillsSection {...props} />,
    );

    const delBtn = container.querySelector(".del-btn");
    expect(delBtn).toBeTruthy();
    fireEvent.click(delBtn);

    expect(props.removeExtraRow).toHaveBeenCalledWith(0);
  });

  it("should not render delete controls when canDelete is false", () => {
    const props = baseProps({
      canDelete: false,
      extraRows: [{ type: "Gardening", comments: "note", needAssist: false }],
    });
    const { container } = renderWithProviders(
      <IndependentLivingSkillsSection {...props} />,
    );

    expect(container.querySelector(".del-btn")).toBeNull();
  });

  it("should call updateOtherDraft when the Other type input changes", () => {
    const props = baseProps();
    renderWithProviders(<IndependentLivingSkillsSection {...props} />);

    const input = screen.getByPlaceholderText("___________");
    fireEvent.change(input, { target: { value: "Knitting" } });

    expect(props.updateOtherDraft).toHaveBeenCalledWith("type", "Knitting");
  });

  it("should call appendOtherDraft when the Add button is clicked", () => {
    const props = baseProps();
    renderWithProviders(<IndependentLivingSkillsSection {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(props.appendOtherDraft).toHaveBeenCalledTimes(1);
  });

  it("should render without crashing when extraRows is undefined", () => {
    const props = baseProps({ extraRows: undefined });
    renderWithProviders(<IndependentLivingSkillsSection {...props} />);

    // WHY: extraRows?.map guards against a missing array; the Add button still renders.
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
