/** @format */

import React from "react";
import { render, screen, fireEvent } from "@/test-utils";
import userEvent from "@testing-library/user-event";

import SubstanceAbuseSection, {
  SUBSTANCE_ABUSE_SECTION_PROP_KEYS,
} from "./SubstanceAbuseSection";

// Mock the heavy print-aware select child so we don't pull in react-select /
// the shared Search widget. We expose a lightweight stub that surfaces its
// current value and forwards onChange — enough to assert wiring without
// rendering a real combobox.
vi.mock("../common/SelectSinglePrint", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <span data-testid="select-single-print">{value?.label ?? ""}</span>
  ),
}));

/**
 * Build a complete-but-empty props bag from the exported prop-key list so the
 * component never reads `undefined` setters/handlers. Setters & handlers become
 * vi.fn(); value props default to "". Callers override the few they assert on.
 */
function makeProps(overrides = {}) {
  const props = {};
  for (const key of SUBSTANCE_ABUSE_SECTION_PROP_KEYS) {
    if (
      key.startsWith("set") ||
      key.startsWith("handle") ||
      key.startsWith("hnadle") ||
      key === "removeTypeArray"
    ) {
      props[key] = vi.fn();
    } else if (key === "typeArray") {
      props[key] = [];
    } else {
      props[key] = "";
    }
  }
  return { ...props, ...overrides };
}

describe("SubstanceAbuseSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exports the prop-key contract used by the parent form", () => {
    // WHY: the IntakeForm builds this section's props from this list; a drift
    // would silently drop a substance field, so we lock the shape.
    expect(Array.isArray(SUBSTANCE_ABUSE_SECTION_PROP_KEYS)).toBe(true);
    expect(SUBSTANCE_ABUSE_SECTION_PROP_KEYS).toContain(
      "substanceAbuseHistory",
    );
    expect(SUBSTANCE_ABUSE_SECTION_PROP_KEYS).toContain("typeArray");
  });

  it("renders the substance-abuse checkboxes and the substance table headers", () => {
    render(<SubstanceAbuseSection {...makeProps()} />);

    // WHY: clinicians toggle between affirming a history and denying it.
    expect(
      screen.getByLabelText("Substance Abuse history"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Denies")).toBeInTheDocument();

    // WHY: the assessment table must always show the five clinical columns.
    expect(screen.getByText("Age of First use")).toBeInTheDocument();
    expect(screen.getByText("Last Use")).toBeInTheDocument();
    expect(screen.getByText("Length of Sobriety")).toBeInTheDocument();
  });

  it("renders a row for each known substance", () => {
    render(<SubstanceAbuseSection {...makeProps()} />);

    // WHY: each substance row must be present so a value can be recorded.
    for (const substance of [
      "Alcohol",
      "Benzodiazepines",
      "Crack",
      "Heroin",
      "Inhalants",
      "Cocaine",
    ]) {
      expect(screen.getByText(substance)).toBeInTheDocument();
    }
  });

  it("reflects the checkbox state from props", () => {
    render(
      <SubstanceAbuseSection
        {...makeProps({
          substanceAbuseHistory: true,
          substanceAbuseDenies: false,
        })}
      />,
    );
    // WHY: checkbox state is controlled by parent state, not internal.
    expect(screen.getByLabelText("Substance Abuse history")).toBeChecked();
    expect(screen.getByLabelText("Denies")).not.toBeChecked();
  });

  it("toggles 'Substance Abuse history' via its setter", () => {
    const setSubstanceAbuseHistory = vi.fn();
    render(
      <SubstanceAbuseSection
        {...makeProps({
          substanceAbuseHistory: false,
          setSubstanceAbuseHistory,
        })}
      />,
    );
    fireEvent.click(screen.getByLabelText("Substance Abuse history"));
    // WHY: clicking flips the controlled boolean for the parent to persist.
    expect(setSubstanceAbuseHistory).toHaveBeenCalledWith(true);
  });

  it("toggles 'Denies' via its setter", () => {
    const setSubstanceAbuseDenies = vi.fn();
    render(
      <SubstanceAbuseSection
        {...makeProps({ substanceAbuseDenies: false, setSubstanceAbuseDenies })}
      />,
    );
    fireEvent.click(screen.getByLabelText("Denies"));
    expect(setSubstanceAbuseDenies).toHaveBeenCalledWith(true);
  });

  it("edits a free-text 'age of first use' field through its setter", async () => {
    const user = userEvent.setup();
    const setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol = vi.fn();
    render(
      <SubstanceAbuseSection
        {...makeProps({
          setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
        })}
      />,
    );
    // The first textarea in the table is Alcohol's age-of-first-use.
    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "30");
    // WHY: each keystroke is pushed up to the parent's controlled value.
    expect(setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol).toHaveBeenCalled();
  });

  it("invokes handleTypeOfArray when the Add button is clicked", () => {
    const handleTypeOfArray = vi.fn();
    render(<SubstanceAbuseSection {...makeProps({ handleTypeOfArray })} />);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    // WHY: 'Add' appends a custom substance row to the dynamic table.
    expect(handleTypeOfArray).toHaveBeenCalledTimes(1);
  });

  it("renders dynamic typeArray rows and deletes them when permitted", () => {
    const removeTypeArray = vi.fn();
    render(
      <SubstanceAbuseSection
        {...makeProps({
          canDelete: true,
          removeTypeArray,
          typeArray: [
            {
              types: "Kratom",
              ageOfFirstUse: "21",
              lastUse: "2026",
              frequency: "Daily",
              lengthOfSobriety: "1y",
            },
          ],
        })}
      />,
    );
    // WHY: custom substances added by staff appear as their own rows.
    expect(screen.getByText("Kratom")).toBeInTheDocument();

    const delIcon = document.querySelector(".del-btn");
    expect(delIcon).toBeTruthy();
    fireEvent.click(delIcon);
    // WHY: removing a dynamic row calls back with its index.
    expect(removeTypeArray).toHaveBeenCalledWith(0);
  });

  it("hides the delete control when canDelete is false", () => {
    render(
      <SubstanceAbuseSection
        {...makeProps({
          canDelete: false,
          typeArray: [
            {
              types: "Kratom",
              ageOfFirstUse: "21",
              lastUse: "",
              frequency: "",
              lengthOfSobriety: "",
            },
          ],
        })}
      />,
    );
    // WHY: read-only viewers must not be able to delete recorded history.
    expect(screen.getByText("Kratom")).toBeInTheDocument();
    expect(document.querySelector(".del-btn")).toBeNull();
  });

  it("renders without crashing when typeArray is undefined (missing data)", () => {
    // WHY: legacy/partial assessments may omit the dynamic array entirely.
    const props = makeProps();
    delete props.typeArray;
    expect(() => render(<SubstanceAbuseSection {...props} />)).not.toThrow();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("edits the free-text 'Other' substance name via its setter", async () => {
    const user = userEvent.setup();
    const setOtherTypeOther = vi.fn();
    render(<SubstanceAbuseSection {...makeProps({ setOtherTypeOther })} />);
    // The plain <input> for 'Other' uses a placeholder of underscores.
    const otherInput = screen.getByPlaceholderText("___________");
    await user.type(otherInput, "x");
    // WHY: the 'Other' row lets staff capture substances not pre-listed.
    expect(setOtherTypeOther).toHaveBeenCalled();
  });
});
