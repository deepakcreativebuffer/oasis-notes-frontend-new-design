/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import MedicalConditionsSection, {
  MEDICAL_CONDITIONS_SECTION_PROP_KEYS,
} from "./MedicalConditionsSection";

// WHY: CustomMultiSelectInput renders react-select/creatable which is heavy and
// not under test here. Stub it with a light input that surfaces onChange so we
// can assert the thyroid/infection handlers are wired without the real widget.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  default: ({ value, onChange, options }) => (
    <input
      data-testid="multi-select"
      data-options={JSON.stringify(options || [])}
      value={Array.isArray(value) ? value.map((v) => v?.label).join(",") : ""}
      onChange={(e) =>
        onChange?.([{ label: e.target.value, value: e.target.value }])
      }
    />
  ),
}));

// A Proxy-backed props object: any `setX` key returns a vi.fn() no-op so the
// controlled checkboxes/textareas have handlers and render doesn't crash.
function makeProps(overrides = {}) {
  const explicit = {
    otherConditionArray: [],
    canDelete: false,
    handleAddCondition: vi.fn(),
    removehandleAddCondition: vi.fn(),
    handleKeyInfectionDiseases: vi.fn(),
    handleKeyThyroidDisorder: vi.fn(),
    infectionDiseasesHandler: vi.fn(),
    thyroiddisorderhnadler: vi.fn(),
    thyroidOptions: [],
    infectionDiseasesOptions: [],
    ...overrides,
  };
  return new Proxy(explicit, {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      if (typeof prop === "string" && prop.startsWith("set")) return vi.fn();
      return undefined;
    },
    has: () => true,
  });
}

describe("MedicalConditionsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports the component and the prop-keys catalog", () => {
    // WHY: the prop-keys list is consumed elsewhere to wire the parent form, so
    // its shape is part of the public contract.
    expect(typeof MedicalConditionsSection).toBe("function");
    expect(Array.isArray(MEDICAL_CONDITIONS_SECTION_PROP_KEYS)).toBe(true);
    expect(MEDICAL_CONDITIONS_SECTION_PROP_KEYS).toContain("yesDiabetes");
    expect(MEDICAL_CONDITIONS_SECTION_PROP_KEYS).toContain("setYesDiabetes");
    expect(MEDICAL_CONDITIONS_SECTION_PROP_KEYS.length).toBeGreaterThan(100);
  });

  it("renders the section header and condition rows", () => {
    renderWithProviders(<MedicalConditionsSection {...makeProps()} />);

    expect(screen.getByText("SECTION II")).toBeInTheDocument();
    expect(screen.getByText("Diabetes")).toBeInTheDocument();
    expect(screen.getByText("High Blood Pressure")).toBeInTheDocument();
    expect(screen.getByText("Schizophrenia")).toBeInTheDocument();
    expect(screen.getByText("Infection or Diseases")).toBeInTheDocument();
    // WHY: column headers anchor the table structure.
    expect(screen.getByText("Conditions")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("renders without crashing when given only the minimal proxy props (empty data)", () => {
    // WHY: undefined Yes/No values are valid (unanswered) and must not throw.
    renderWithProviders(<MedicalConditionsSection {...makeProps()} />);
    expect(screen.getByText("SECTION II")).toBeInTheDocument();
  });

  it("reflects a true Yes checkbox from props", () => {
    renderWithProviders(
      <MedicalConditionsSection {...makeProps({ yesDiabetes: true })} />,
    );
    // WHY: checked maps to yesDiabetes === true on the "Yes" checkbox.
    const yes = document.getElementById("diabetes");
    expect(yes).toBeChecked();
    expect(document.getElementById("diabetesno")).not.toBeChecked();
  });

  it("invokes the Yes setter when a condition checkbox is toggled", async () => {
    const user = userEvent.setup();
    const setYesHeart = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection {...makeProps({ setYesHeart })} />,
    );

    await user.click(document.getElementById("yesHeart"));
    expect(setYesHeart).toHaveBeenCalledWith(true);

    await user.click(document.getElementById("yesHeartno"));
    expect(setYesHeart).toHaveBeenCalledWith(false);
  });

  it("invokes the comment setter when typing in a condition textarea", () => {
    const setCommentCancer = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection
        {...makeProps({ commentCancer: "x", setCommentCancer })}
      />,
    );

    const textarea = screen.getByDisplayValue("x");
    fireEvent.change(textarea, { target: { value: "tumor noted" } });
    expect(setCommentCancer).toHaveBeenCalledWith("tumor noted");
  });

  it("calls handleAddCondition when the Add button is clicked", async () => {
    const user = userEvent.setup();
    const handleAddCondition = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection {...makeProps({ handleAddCondition })} />,
    );

    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(handleAddCondition).toHaveBeenCalledTimes(1);
  });

  it("renders extra dynamic conditions and supports delete when allowed", async () => {
    const user = userEvent.setup();
    const removehandleAddCondition = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection
        {...makeProps({
          canDelete: true,
          removehandleAddCondition,
          otherConditionArray: [
            { condition: "Migraine", yes: true, comments: "weekly" },
          ],
        })}
      />,
    );

    expect(screen.getByText("Migraine")).toBeInTheDocument();
    expect(screen.getByText("weekly")).toBeInTheDocument();

    // WHY: canDelete renders the delete affordance; clicking removes by index 0.
    const delBtn = document.querySelector(".del-btn");
    expect(delBtn).toBeTruthy();
    await user.click(delBtn);
    expect(removehandleAddCondition).toHaveBeenCalledWith(0);
  });

  it("hides the delete control for dynamic rows when canDelete is false", () => {
    renderWithProviders(
      <MedicalConditionsSection
        {...makeProps({
          canDelete: false,
          otherConditionArray: [
            { condition: "Migraine", yes: false, comments: "" },
          ],
        })}
      />,
    );
    expect(screen.getByText("Migraine")).toBeInTheDocument();
    expect(document.querySelector(".del-btn")).toBeNull();
  });

  it("wires the multi-select handlers for thyroid and infection rows", () => {
    const thyroiddisorderhnadler = vi.fn();
    const infectionDiseasesHandler = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection
        {...makeProps({ thyroiddisorderhnadler, infectionDiseasesHandler })}
      />,
    );

    const selects = screen.getAllByTestId("multi-select");
    // WHY: two CustomMultiSelectInput instances — thyroid disorder + infection.
    expect(selects.length).toBe(2);
    fireEvent.change(selects[0], { target: { value: "Hypothyroidism" } });
    expect(thyroiddisorderhnadler).toHaveBeenCalled();
    fireEvent.change(selects[1], { target: { value: "MRSA" } });
    expect(infectionDiseasesHandler).toHaveBeenCalled();
  });

  it("updates the free-text Other condition name", () => {
    const setOtherConditionOther = vi.fn();
    renderWithProviders(
      <MedicalConditionsSection
        {...makeProps({
          OtherConditionOther: "Gout",
          setOtherConditionOther,
        })}
      />,
    );

    const input = screen.getByDisplayValue("Gout");
    fireEvent.change(input, { target: { value: "Gout flare" } });
    expect(setOtherConditionOther).toHaveBeenCalledWith("Gout flare");
  });
});
