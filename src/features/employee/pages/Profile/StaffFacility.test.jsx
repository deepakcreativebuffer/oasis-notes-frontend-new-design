/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import StaffFacility from "./StaffFacility";
import {
  facilityService,
  removeApi,
  ADMIN_APIS,
} from "@/features/shared/services";
import { showNotification } from "@/utils";

// Mock the shared services barrel the component imports from. We mock the
// concrete helpers/services so no real HTTP happens and we can assert calls.
vi.mock("@/features/shared/services", () => ({
  facilityService: {
    list: vi.fn(),
    create: vi.fn(),
  },
  removeApi: vi.fn(),
  ADMIN_APIS: {
    ADMIN_DELETE_FACILITY: vi.fn((id) => `admin/delete-facility/${id}`),
  },
}));

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const baseProps = (overrides = {}) => ({
  show: true,
  onHide: vi.fn(),
  ...overrides,
});

describe("StaffFacility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the facility modal heading and form fields", () => {
    renderWithProviders(<StaffFacility {...baseProps()} />);

    expect(screen.getByText("Facility")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Facility Name"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Location Address"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
  });

  it("fetches the facility list on mount", () => {
    renderWithProviders(<StaffFacility {...baseProps()} />);

    // WHY: useEffect runs fetchHandler which delegates to facilityService.list.
    expect(facilityService.list).toHaveBeenCalledTimes(1);
    expect(facilityService.list).toHaveBeenCalledWith(
      expect.objectContaining({ setResponse: expect.any(Function) }),
    );
  });

  it("shows the empty-state message when no facilities are present", () => {
    renderWithProviders(<StaffFacility {...baseProps()} />);
    expect(screen.getByText("No Facility Found")).toBeInTheDocument();
  });

  it("renders facilities returned via the list setResponse callback", () => {
    // Drive setResponse with fake data and assert the list renders it.
    facilityService.list.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [
          { _id: "fac-1", name: "North Wing", location: "123 Main St" },
          { _id: "fac-2", name: "South Wing", location: "456 Oak Ave" },
        ],
      });
    });

    renderWithProviders(<StaffFacility {...baseProps()} />);

    expect(
      screen.getByDisplayValue("North Wing, 123 Main St"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("South Wing, 456 Oak Ave"),
    ).toBeInTheDocument();
    expect(screen.queryByText("No Facility Found")).not.toBeInTheDocument();
  });

  it("blocks submit and notifies when required fields are empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StaffFacility {...baseProps()} />);

    await user.click(screen.getByRole("button", { name: "SAVE" }));

    // WHY: name/location are blank, so create is never called and a danger
    // notification is shown.
    expect(showNotification).toHaveBeenCalledWith({
      message: "All fields are required.",
      type: "danger",
    });
    expect(facilityService.create).not.toHaveBeenCalled();
  });

  it("creates a facility with the entered values on submit", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<StaffFacility {...props} />);

    await user.type(
      screen.getByPlaceholderText("Enter Facility Name"),
      "East Clinic",
    );
    await user.type(
      screen.getByPlaceholderText("Enter Location Address"),
      "789 Pine Rd",
    );
    await user.click(screen.getByRole("button", { name: "SAVE" }));

    expect(facilityService.create).toHaveBeenCalledWith(
      { name: "East Clinic", location: "789 Pine Rd", isActive: true },
      expect.objectContaining({ setLoading: expect.any(Function) }),
    );
    expect(props.onHide).toHaveBeenCalled();
  });

  it("removes a facility via removeApi with the composed delete url", async () => {
    const user = userEvent.setup();
    facilityService.list.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [{ _id: "fac-9", name: "Old Site", location: "1 Closed Ln" }],
      });
    });
    const props = baseProps();
    renderWithProviders(<StaffFacility {...props} />);

    // The delete icon is the only span with an onClick next to the row input.
    const row = screen.getByDisplayValue("Old Site, 1 Closed Ln");
    const deleteIcon = row.parentElement.querySelector("span");
    await user.click(deleteIcon);

    expect(ADMIN_APIS.ADMIN_DELETE_FACILITY).toHaveBeenCalledWith("fac-9");
    expect(removeApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "admin/delete-facility/fac-9",
        successMsg: "Facility removed successfully",
      }),
    );
  });

  it("closes without creating when CANCEL is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<StaffFacility {...props} />);

    await user.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(facilityService.create).not.toHaveBeenCalled();
    expect(props.onHide).toHaveBeenCalled();
  });
});
