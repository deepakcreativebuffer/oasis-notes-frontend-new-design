/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import CancelAppointment from "./CancelAppointment";

// Asset barrel exports images that resolve to real files at build time; stub
// them so the import does not pull binary assets into jsdom.
vi.mock("@/assets", () => ({
  ibutton: "ibutton.png",
  formupload: "formupload.png",
}));

// CSS side-effect import is meaningless under jsdom.
vi.mock("./CancelAppointment.css", () => ({}));

// HOC wraps the page in the full Sidebar/Navbar shell (heavy, Redux + router
// driven). Replace it with a passthrough that simply renders the inner
// component so we exercise CancelAppointment in isolation.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function MockHOC() {
      return <Wcomponenet />;
    },
}));

// NavWrapper requires routing/sidebar context; stub to a minimal title banner.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

describe("CancelAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the cancel-appointment confirmation form", () => {
    renderWithProviders(<CancelAppointment />, {
      preloadedState: {
        auth: { userProfile: { _id: "res-test-001", userType: "Patient" } },
      },
    });

    // WHY: the explanatory copy is the core of the cancellation consent screen.
    expect(
      screen.getByText(/Please Confirm and Provide details to Cancel/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I do not require medical care at this time/i),
    ).toBeInTheDocument();
  });

  it("passes the page title to the nav wrapper", () => {
    renderWithProviders(<CancelAppointment />);
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Cancel Appointment",
    );
  });

  it("renders the terms checkbox and resident name field", () => {
    renderWithProviders(<CancelAppointment />);

    // The checkbox label is not associated via htmlFor in the component, so
    // match the consent copy by text rather than by label association.
    expect(
      screen.getByText(/I agree to the ‘Terms & Conditions’ above/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Resident Full Name")).toBeInTheDocument();
    // Signature label is reused as an htmlFor target; assert it is present.
    expect(screen.getByText("Resident Signature")).toBeInTheDocument();
  });

  it("toggles the terms checkbox when clicked", () => {
    renderWithProviders(<CancelAppointment />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("exposes the draft, signed and submit action buttons", () => {
    renderWithProviders(<CancelAppointment />);

    expect(
      screen.getByRole("button", { name: /SAVED AS DRAFT/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /SAVED AND SIGNED/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^SUBMIT$/i }),
    ).toBeInTheDocument();
  });
});
