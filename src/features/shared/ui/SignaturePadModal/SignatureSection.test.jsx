/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import SignatureSection from "./SignatureSection";

// The pen modal is React.lazy-loaded and pulls in react-signature-canvas /
// date-fns. It is not the unit under test, so replace it with a light stub that
// surfaces its show flag and the override prop the section computes.
vi.mock("./SignaturePadModal", () => ({
  default: ({ show, signerNameOverride }) =>
    show ? (
      <div data-testid="pen-modal" data-override={String(signerNameOverride)}>
        Pen Modal Open
      </div>
    ) : null,
}));

// Admin user profile: userType drives the auto-populate / externalName rules.
const adminProfile = {
  _id: "emp-test-001",
  userType: "Admin",
  firstName: "Test",
  lastName: "Admin",
};
const nonAdminProfile = {
  _id: "emp-test-002",
  userType: "Employee",
  firstName: "Test",
  lastName: "Employee",
};

const authState = (userProfile) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const baseProps = (overrides = {}) => ({
  role: "bht",
  label: "BHT Signature",
  variant: "green",
  signature: {},
  onUpdate: vi.fn(),
  mode: "edit",
  ...overrides,
});

describe("SignatureSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the inline signature box with its label in edit mode", () => {
    renderWithProviders(<SignatureSection {...baseProps()} />, {
      preloadedState: authState(nonAdminProfile),
    });
    // WHY: every signature section must surface its role label so the signer
    // knows which line they are signing on the EHR form.
    expect(screen.getByText("BHT Signature")).toBeInTheDocument();
    // Unsigned box shows the xSign placeholder.
    expect(screen.getByText("xSign")).toBeInTheDocument();
  });

  it("should render nothing when visible is false", () => {
    const { container } = renderWithProviders(
      <SignatureSection {...baseProps({ visible: false })} />,
      { preloadedState: authState(nonAdminProfile) },
    );
    // WHY: sections hidden by the form (e.g. role not applicable to this note)
    // must not leak an empty signature line into the document.
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing in view mode when there is no captured signature image", () => {
    const { container } = renderWithProviders(
      <SignatureSection {...baseProps({ mode: "view", signature: {} })} />,
      { preloadedState: authState(nonAdminProfile) },
    );
    // WHY: a read-only signed document must not display an empty pen box for a
    // section that was never signed.
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the captured signature image and print name in view mode", () => {
    renderWithProviders(
      <SignatureSection
        {...baseProps({
          mode: "view",
          signature: {
            rawSignatureImage: "data:image/png;base64,TESTIMG",
            name: "Test Patient",
            date: "2026-06-10",
          },
        })}
      />,
      { preloadedState: authState(nonAdminProfile) },
    );
    // WHY: a signed record must render the saved pen drawing and the signer's
    // printed name for audit/legal review.
    const img = screen.getByAltText("BHT Signature signature");
    expect(img).toHaveAttribute("src", "data:image/png;base64,TESTIMG");
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should fall back to signerNameOverride for print name when the saved name is missing", () => {
    renderWithProviders(
      <SignatureSection
        {...baseProps({
          mode: "view",
          signerNameOverride: "Test Patient",
          signature: {
            rawSignatureImage: "data:image/png;base64,TESTIMG",
            name: "",
          },
        })}
      />,
      { preloadedState: authState(nonAdminProfile) },
    );
    // WHY: legacy records signed before the name-capture fix have an empty
    // name; the form-supplied override keeps the audit print-name populated.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should open the pen modal when the inline box is clicked in edit mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignatureSection {...baseProps()} />, {
      preloadedState: authState(nonAdminProfile),
    });

    expect(screen.queryByTestId("pen-modal")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button"));

    // WHY: clicking an editable signature line must launch the pen capture
    // modal so the user can draw their signature.
    await screen.findByTestId("pen-modal");
  });

  it("should pass the form-supplied signerNameOverride through to the pen modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SignatureSection
        {...baseProps({ role: "resident", signerNameOverride: "Test Patient" })}
      />,
      { preloadedState: authState(nonAdminProfile) },
    );

    await user.click(screen.getByRole("button"));

    // WHY: the resident's name known to the form must be prefilled in the pen
    // modal so the captured signature is attributed correctly.
    await waitFor(() =>
      expect(screen.getByTestId("pen-modal")).toHaveAttribute(
        "data-override",
        "Test Patient",
      ),
    );
  });

  it("should derive the bht override from the saved name for an admin user when no override is given", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SignatureSection
        {...baseProps({ role: "bht", signature: { name: "Test Patient" } })}
      />,
      { preloadedState: authState(adminProfile) },
    );

    await user.click(screen.getByRole("button"));

    // WHY: when an Admin signs a BHT line, externalName is on, so the section
    // forwards the saved BHT name as the modal override instead of undefined.
    await waitFor(() =>
      expect(screen.getByTestId("pen-modal")).toHaveAttribute(
        "data-override",
        "Test Patient",
      ),
    );
  });

  it("should display the saved date in the inline box", () => {
    renderWithProviders(
      <SignatureSection
        {...baseProps({ signature: { date: "2026-06-10" } })}
      />,
      { preloadedState: authState(nonAdminProfile) },
    );
    // WHY: the signed date drives the Date row; a populated date must not show
    // the "Date Signed" placeholder.
    expect(screen.queryByText("Date Signed")).not.toBeInTheDocument();
  });
});
