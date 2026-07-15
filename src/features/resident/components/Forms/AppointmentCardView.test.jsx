/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import AppointmentCardViews from "./AppointmentCardView";

const baseModalData = () => ({
  name: "Test Patient",
  time: "09:30 AM",
  date: "2026-06-10",
  contactNumber: "555-0100",
  reasonForVisit: "Routine checkup",
});

describe("AppointmentCardViews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the booking details with provided modal data", () => {
    renderWithProviders(
      <AppointmentCardViews
        show
        modalData={baseModalData()}
        onHide={vi.fn()}
      />,
    );

    expect(screen.getByText("Booking Details")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("09:30 AM")).toBeInTheDocument();
    expect(screen.getByText("555-0100")).toBeInTheDocument();
    expect(screen.getByText("Routine checkup")).toBeInTheDocument();
    // WHY: the real formatDateToMMDDYYYY util converts ISO date to MM/DD/YYYY.
    expect(screen.getByText("06/10/2026")).toBeInTheDocument();
  });

  it("should render the static field labels", () => {
    renderWithProviders(
      <AppointmentCardViews
        show
        modalData={baseModalData()}
        onHide={vi.fn()}
      />,
    );

    expect(screen.getByText(/Name :/)).toBeInTheDocument();
    expect(screen.getByText(/From :/)).toBeInTheDocument();
    expect(screen.getByText(/Date :/)).toBeInTheDocument();
    expect(screen.getByText(/Contact Number :/)).toBeInTheDocument();
    expect(screen.getByText(/Visit :/)).toBeInTheDocument();
  });

  it("should render dashes for missing data fields", () => {
    renderWithProviders(
      <AppointmentCardViews show modalData={{}} onHide={vi.fn()} />,
    );

    // WHY: each optional field falls back to "-" when absent; name/time/
    // contactNumber/reasonForVisit are each "-".
    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(4);
  });

  it("should not render the modal body when show is false", () => {
    renderWithProviders(
      <AppointmentCardViews
        show={false}
        modalData={baseModalData()}
        onHide={vi.fn()}
      />,
    );

    // WHY: a closed bootstrap modal does not mount its body content.
    expect(screen.queryByText("Booking Details")).not.toBeInTheDocument();
  });

  it("should invoke onHide when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onHide = vi.fn();
    renderWithProviders(
      <AppointmentCardViews show modalData={baseModalData()} onHide={onHide} />,
    );

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onHide).toHaveBeenCalled();
  });
});
