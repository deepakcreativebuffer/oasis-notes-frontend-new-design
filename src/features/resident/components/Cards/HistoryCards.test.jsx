/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import HistoryCard from "./HistoryCards";
import { formatDateToMMDDYYYY } from "@/utils/utils";

// Mock the shared services barrel: only residentService.deleteAppointment /
// cancelAppointment are used by the source. NEVER real HTTP.
const mocks = vi.hoisted(() => ({
  deleteAppointment: vi.fn(() => Promise.resolve()),
  cancelAppointment: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/features/shared/services", () => ({
  residentService: {
    deleteAppointment: mocks.deleteAppointment,
    cancelAppointment: mocks.cancelAppointment,
  },
}));

// Mock the date formatter so we assert on a deterministic, recognizable value.
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: vi.fn(() => "06/10/2026"),
}));

const baseProps = (overrides = {}) => ({
  name: "Test Patient",
  imageUrl: "",
  from: "2026-06-10T00:00:00.000Z",
  visit: "Routine checkup",
  referenceId: "ref-test-001",
  status: null,
  id: "appt-test-001",
  again_Call_appointment: vi.fn(() => Promise.resolve()),
  deleteAppoinment: false,
  modelHandler: vi.fn(),
  modalData: vi.fn(),
  data: { _id: "res-test-001" },
  address: "123 Test Street",
  ...overrides,
});

describe("HistoryCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the appointment name, reason, address and formatted date", () => {
    renderWithProviders(<HistoryCard {...baseProps()} />);

    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("Routine checkup")).toBeInTheDocument();
    // WHY: source delegates date display to formatDateToMMDDYYYY(from).
    expect(formatDateToMMDDYYYY).toHaveBeenCalledWith(
      "2026-06-10T00:00:00.000Z",
    );
    expect(screen.getByText("06/10/2026")).toBeInTheDocument();
  });

  it("hides the status row when status is null and shows it otherwise", () => {
    const { unmount } = renderWithProviders(<HistoryCard {...baseProps()} />);
    expect(screen.queryByText(/Status :/)).not.toBeInTheDocument();
    unmount();

    renderWithProviders(
      <HistoryCard {...baseProps({ status: "Cancelled" })} />,
    );
    expect(screen.getByText(/Status :\s*Cancelled/)).toBeInTheDocument();
  });

  it("truncates a long reason to 50 chars with an ellipsis", () => {
    const longVisit = "A".repeat(60);
    renderWithProviders(<HistoryCard {...baseProps({ visit: longVisit })} />);

    // WHY: source slices visits longer than 50 chars and appends "...".
    expect(screen.getByText(`${"A".repeat(50)}...`)).toBeInTheDocument();
  });

  it("opens the modal with the card data when the card body is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<HistoryCard {...props} />);

    await user.click(screen.getByText("Test Patient"));

    expect(props.modelHandler).toHaveBeenCalledWith(true);
    expect(props.modalData).toHaveBeenCalledWith(props.data);
  });

  it("cancels the appointment by default when the delete icon is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    const { container } = renderWithProviders(<HistoryCard {...props} />);

    const deleteIcon = container.querySelector(".delete_button");
    await user.click(deleteIcon);

    await waitFor(() => {
      expect(mocks.cancelAppointment).toHaveBeenCalledWith("appt-test-001");
    });
    // WHY: deleteAppoinment is false -> cancel path, not hard delete.
    expect(mocks.deleteAppointment).not.toHaveBeenCalled();
    expect(props.again_Call_appointment).toHaveBeenCalled();
  });

  it("hard-deletes the appointment when deleteAppoinment is true", async () => {
    const user = userEvent.setup();
    const props = baseProps({ deleteAppoinment: true });
    const { container } = renderWithProviders(<HistoryCard {...props} />);

    const deleteIcon = container.querySelector(".delete_button");
    await user.click(deleteIcon);

    await waitFor(() => {
      expect(mocks.deleteAppointment).toHaveBeenCalledWith("appt-test-001");
    });
    expect(mocks.cancelAppointment).not.toHaveBeenCalled();
  });

  it("does not open the modal when the delete icon is clicked (stopPropagation)", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    const { container } = renderWithProviders(<HistoryCard {...props} />);

    const deleteIcon = container.querySelector(".delete_button");
    await user.click(deleteIcon);

    // WHY: delete icon calls e.stopPropagation() so the card onClick never runs.
    expect(props.modelHandler).not.toHaveBeenCalled();
    expect(props.modalData).not.toHaveBeenCalled();
  });
});
