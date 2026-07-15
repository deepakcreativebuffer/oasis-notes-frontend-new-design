/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import TrainingAssignModal from "./TrainingAssignModal";
import {
  adminPortalService,
  removeApi,
  ADMIN_APIS,
} from "../../services/index";

// Mock the services index the component imports from ("../../services/index").
// getUsersByPermission writes its response back via the setResponse callback,
// so the mock lets each test seed the employee list deterministically.
vi.mock("../../services/index", () => ({
  adminPortalService: {
    getUsersByPermission: vi.fn(),
    addCreatePermission: vi.fn(),
  },
  removeApi: vi.fn(),
  ADMIN_APIS: {
    ADMIN_REMOVE_CREATE_PERMISSION: vi.fn(
      (id, formkey) => `/admin/remove/${id}/${formkey}`,
    ),
  },
}));

// MultiEmployee does its own data-fetch + heavy react-multi-select-component
// render. Stub it to a controllable button that drives setValue so we can
// assert what gets passed to addCreatePermission.
vi.mock("../../ui/Search/MultiEmployee", () => ({
  default: ({ setValue, value }) => (
    <button
      type="button"
      data-count={value?.length ?? 0}
      onClick={() =>
        setValue([
          { value: "emp-test-002", label: "Test Two", isPermitted: true },
        ])
      }
    >
      pick-employee
    </button>
  ),
}));

const baseProps = () => ({
  show: true,
  onHide: vi.fn(),
  formkey: "training-form-key",
});

// Helper: make getUsersByPermission resolve with a given employee list by
// invoking the setResponse callback the component passes in.
const seedEmployees = (data) => {
  adminPortalService.getUsersByPermission.mockImplementation(
    (_formkey, { setResponse }) => {
      setResponse({ data });
    },
  );
};

describe("TrainingAssignModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    seedEmployees([]);
  });

  it("should render the assign modal header and labels", () => {
    renderWithProviders(<TrainingAssignModal {...baseProps()} />);

    // WHY: react-bootstrap Modal does not always wire the title as the dialog
    // accessible name, so assert the visible heading text directly.
    expect(screen.getByText("Assign Employee")).toBeInTheDocument();
    expect(screen.getByText("Select Employee")).toBeInTheDocument();
    expect(screen.getByText("Assigned Employee")).toBeInTheDocument();
  });

  it("should fetch users for the given form permission key on mount", () => {
    renderWithProviders(<TrainingAssignModal {...baseProps()} />);

    // WHY: the modal must load who already has the create-permission for THIS
    // training form, keyed by formkey.
    expect(adminPortalService.getUsersByPermission).toHaveBeenCalledWith(
      "training-form-key",
      expect.objectContaining({ setResponse: expect.any(Function) }),
    );
  });

  it("should show the empty state when no employees are assigned", () => {
    seedEmployees([]);
    renderWithProviders(<TrainingAssignModal {...baseProps()} />);

    expect(screen.getByText("No assigned employees")).toBeInTheDocument();
  });

  it("should list already-permitted employees as disabled fields", async () => {
    seedEmployees([
      {
        _id: "emp-test-001",
        firstName: "Test",
        lastName: "Patient",
        isPermitted: true,
      },
      {
        _id: "emp-test-003",
        firstName: "Not",
        lastName: "Allowed",
        isPermitted: false,
      },
    ]);
    renderWithProviders(<TrainingAssignModal {...baseProps()} />);

    // WHY: only employees with isPermitted=true are rendered as currently
    // assigned; non-permitted ones must not appear in the assigned list.
    await screen.findByDisplayValue("Test Patient");
    expect(screen.queryByDisplayValue("Not Allowed")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Patient")).toBeDisabled();
  });

  it("should submit selected employees to addCreatePermission on APPLY", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    seedEmployees([
      {
        _id: "emp-test-001",
        firstName: "Test",
        lastName: "Patient",
        isPermitted: true,
      },
    ]);
    renderWithProviders(<TrainingAssignModal {...props} />);

    // Wait for the pre-permitted employee to load into the selection state.
    await screen.findByDisplayValue("Test Patient");

    // Add another employee via the stubbed MultiEmployee selector.
    await user.click(screen.getByRole("button", { name: "pick-employee" }));
    await user.click(screen.getByRole("button", { name: "APPLY" }));

    // WHY: submitting must grant the create-permission for the chosen employees
    // against this form, then refresh + close via additionalFunctions.
    expect(adminPortalService.addCreatePermission).toHaveBeenCalledWith(
      {
        employeesId: [{ _id: "emp-test-002", isPermitted: true }],
        permission: "training-form-key",
      },
      expect.objectContaining({
        additionalFunctions: expect.arrayContaining([props.onHide]),
      }),
    );
  });

  it("should remove an assigned employee via removeApi with the composed url", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    seedEmployees([
      {
        _id: "emp-test-001",
        firstName: "Test",
        lastName: "Patient",
        isPermitted: true,
      },
    ]);
    renderWithProviders(<TrainingAssignModal {...props} />);

    const field = await screen.findByDisplayValue("Test Patient");

    // The delete icon is the react-icons svg wrapped in a clickable span (no
    // role). react-bootstrap Modal renders into a portal, so scope from the
    // assigned-employee row up to its sibling span that wraps the svg.
    const row = field.closest("div");
    const deleteSpan = row.querySelector("span");
    expect(deleteSpan).toBeTruthy();
    await user.click(deleteSpan);

    // WHY: removing an assignee revokes their create-permission server-side via
    // the REST url keyed by employee id + formkey.
    expect(ADMIN_APIS.ADMIN_REMOVE_CREATE_PERMISSION).toHaveBeenCalledWith(
      "emp-test-001",
      "training-form-key",
    );
    expect(removeApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/admin/remove/emp-test-001/training-form-key",
        additionalFunctions: expect.arrayContaining([props.onHide]),
      }),
    );
  });

  it("should close the modal when CANCEL is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<TrainingAssignModal {...props} />);

    await user.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(props.onHide).toHaveBeenCalled();
    // WHY: cancelling must not grant any permission.
    expect(adminPortalService.addCreatePermission).not.toHaveBeenCalled();
  });
});
