/** @format */

import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import { ModalOpner } from "./ModalOpner";

const draftState = (staffLabel) => ({
  signatureDraft: {
    primary: {
      staffLabel,
      signedData: "",
      signedDate: "",
      signedTime: "",
    },
    secondary: {
      staffLabel: "",
      signedData: "",
      signedDate: "",
      signedTime: "",
    },
  },
});

describe("ModalOpner", () => {
  it("should render the save-and-sign trigger button", () => {
    renderWithProviders(<ModalOpner />, {
      preloadedState: draftState(""),
    });
    expect(
      screen.getByRole("button", { name: /saved and signed/i }),
    ).toBeInTheDocument();
  });

  it("should show the digitally-signed summary when a primary draft exists", () => {
    renderWithProviders(<ModalOpner />, {
      preloadedState: draftState("Test_Staff 01-01-1990 10:00:00"),
    });
    // WHY: once a signature draft is saved, the staff member + date/time are
    // surfaced as an attestation summary on the form.
    expect(
      screen.getByText(
        /digitally signed by test_staff on 01-01-1990 10:00:00/i,
      ),
    ).toBeInTheDocument();
  });

  it("should not show a signed summary when there is no draft", () => {
    renderWithProviders(<ModalOpner />, {
      preloadedState: draftState(""),
    });
    expect(screen.queryByText(/digitally signed by/i)).not.toBeInTheDocument();
  });
});
