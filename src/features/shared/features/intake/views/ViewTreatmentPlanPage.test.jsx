/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import ViewTreatmentPlanPage from "./ViewTreatmentPlanPage";

// The Print.css side-effect import is irrelevant to behaviour; stub it out so
// jsdom doesn't choke on raw CSS.
vi.mock("@/assets/styles/Print.css", () => ({}));

// Each child section reads the form context and renders its own (separately
// tested) markup. Stub them to light markers so this wrapper test stays focused
// on the page's own layout/wiring rather than section internals.
vi.mock("./sections/viewTreatmentPlan/ViewTreatmentPlanPatientSection", () => ({
  default: () => <div data-testid="patient-section" />,
}));
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanProvidersGoalsSection",
  () => ({ default: () => <div data-testid="providers-goals-section" /> }),
);
vi.mock("./sections/viewTreatmentPlan/ViewTreatmentPlanRiskSection", () => ({
  default: () => <div data-testid="risk-section" />,
}));
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanCounselingSection",
  () => ({ default: () => <div data-testid="counseling-section" /> }),
);
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanPsychosocialGoalsPart1",
  () => ({ default: () => <div data-testid="psychosocial-1-section" /> }),
);
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanPsychosocialGoalsPart2",
  () => ({ default: () => <div data-testid="psychosocial-2-section" /> }),
);
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanSupportMedicationsSection",
  () => ({ default: () => <div data-testid="support-medications-section" /> }),
);
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanIndividualParticipatingSection",
  () => ({
    default: () => <div data-testid="individual-participating-section" />,
  }),
);
vi.mock(
  "./sections/viewTreatmentPlan/ViewTreatmentPlanSignaturesPrintSection",
  () => ({ default: () => <div data-testid="signatures-print-section" /> }),
);

// The draft-saved modal is its own component; stub it so we can assert the
// page toggles it via f.draftModel and wires its onClose.
vi.mock("@/features/resident/components/Modal/Draftinmodel", () => ({
  default: ({ onClose }) => (
    <div data-testid="draft-modal">
      <button type="button" onClick={onClose}>
        close-draft
      </button>
    </div>
  ),
}));

// Builds a controlled `form` object matching the shape the page reads. Tests
// override individual fields. Fake PHI only.
const makeForm = (overrides = {}) => ({
  printRef: { current: null },
  componentRef: { current: null },
  navigate: vi.fn(),
  initialUpdate: "Initial",
  setInitialUpdate: vi.fn(),
  handlePost: vi.fn((e) => e?.preventDefault?.()),
  draftModel: false,
  setDraftModel: vi.fn(),
  ...overrides,
});

describe("ViewTreatmentPlanPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the treatment plan heading and all form sections", () => {
    renderWithProviders(<ViewTreatmentPlanPage form={makeForm()} />);

    // WHY: this is the Behavioral Health Treatment Plan view; the title bar
    // must identify the document for clinical staff.
    expect(
      screen.getByText("Behavioral Health Treatment Plan"),
    ).toBeInTheDocument();

    // WHY: the full treatment plan is composed of all clinical sections; a
    // missing section would mean lost chart data on print/review.
    expect(screen.getByTestId("patient-section")).toBeInTheDocument();
    expect(screen.getByTestId("providers-goals-section")).toBeInTheDocument();
    expect(screen.getByTestId("risk-section")).toBeInTheDocument();
    expect(screen.getByTestId("counseling-section")).toBeInTheDocument();
    expect(screen.getByTestId("psychosocial-1-section")).toBeInTheDocument();
    expect(screen.getByTestId("psychosocial-2-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("support-medications-section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("individual-participating-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("signatures-print-section")).toBeInTheDocument();
  });

  it("should reflect 'Initial' selection on the checkboxes and printable title", () => {
    renderWithProviders(
      <ViewTreatmentPlanPage form={makeForm({ initialUpdate: "Initial" })} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: the Initial/Update toggle records whether this is the first plan or
    // a revision; with "Initial" only the first box may be checked.
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    // WHY: the hidden print title prefixes the document type so the printed
    // chart states whether it is the Initial plan.
    expect(
      screen.getByText("Initial Behavioral Health Treatment Plan"),
    ).toBeInTheDocument();
  });

  it("should reflect 'Update' selection on the checkboxes and printable title", () => {
    renderWithProviders(
      <ViewTreatmentPlanPage form={makeForm({ initialUpdate: "Update" })} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();

    expect(
      screen.getByText("Update Behavioral Health Treatment Plan"),
    ).toBeInTheDocument();
  });

  it("should keep the Initial/Update checkboxes disabled (read-only view)", () => {
    renderWithProviders(<ViewTreatmentPlanPage form={makeForm()} />);

    // WHY: this is a View page — the plan type cannot be edited here, so both
    // toggles are disabled to prevent accidental mutation of a signed record.
    screen.getAllByRole("checkbox").forEach((cb) => {
      expect(cb).toBeDisabled();
    });
  });

  it("should navigate back when the back arrow is clicked", async () => {
    const user = userEvent.setup();
    const form = makeForm();
    const { container } = renderWithProviders(
      <ViewTreatmentPlanPage form={form} />,
    );

    // alt="" makes the back arrow a presentation image (no accessible name),
    // so it can't be queried by role; select it by its src instead.
    await user.click(container.querySelector('img[src="/back_button2.png"]'));

    // WHY: the back button returns the user to the prior chart view.
    expect(form.navigate).toHaveBeenCalledWith(-1);
  });

  it("should not render the draft modal when draftModel is false", () => {
    renderWithProviders(
      <ViewTreatmentPlanPage form={makeForm({ draftModel: false })} />,
    );

    expect(screen.queryByTestId("draft-modal")).not.toBeInTheDocument();
  });

  it("should render the draft modal and wire its close handler when draftModel is true", async () => {
    const user = userEvent.setup();
    const form = makeForm({ draftModel: true });
    renderWithProviders(<ViewTreatmentPlanPage form={form} />);

    expect(screen.getByTestId("draft-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "close-draft" }));

    // WHY: dismissing the "saved as draft" confirmation must flip the page's
    // draftModel flag back off.
    expect(form.setDraftModel).toHaveBeenCalledWith(false);
  });

  it("should render an empty printable title when no plan type is selected", () => {
    renderWithProviders(
      <ViewTreatmentPlanPage form={makeForm({ initialUpdate: "" })} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    // WHY: with no selection the prefix collapses, leaving the bare document
    // title — the page must not crash or print "undefined".
    expect(
      screen.getByText("Behavioral Health Treatment Plan", { selector: "h1" }),
    ).toBeInTheDocument();
  });

  it("should submit the form via the provided handlePost handler", () => {
    const form = makeForm();
    const { container } = renderWithProviders(
      <ViewTreatmentPlanPage form={form} />,
    );

    // No submit button is rendered by this wrapper; fire submit on the form
    // element directly to verify the handler is wired.
    const formEl = container.querySelector("form");
    expect(formEl).toBeTruthy();
    formEl.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    // WHY: saving the plan must route through the page's handlePost, which
    // persists/signs the treatment plan.
    expect(form.handlePost).toHaveBeenCalled();
  });
});
