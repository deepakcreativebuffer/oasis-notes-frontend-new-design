/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import Profile from "./Profile";
import { ROLES } from "@/features/shared/constants";

// --- hoisted mock fns referenced inside vi.mock factories ---
const h = vi.hoisted(() => ({
  getSubscriptionDetails: vi.fn(),
  getPatientAllergies: vi.fn(),
  openStripeInvoice: vi.fn(),
  openStripePaymentMethod: vi.fn(),
  UpdateProfile: vi.fn(() => ({ type: "auth/updateProfile" })),
  UpdateProfileLogo: vi.fn(() => ({ type: "auth/updateProfileLogo" })),
  getObjectUrlFromDownloadUrl: vi.fn((u) => `obj:${u}`),
  onSelectFile: vi.fn(),
  handleFileChange: vi.fn(() => true),
}));

// Bypass the layout HOC (Navbar/Sidebar pull in heavy deps) — render content only.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Services barrel the component imports from.
vi.mock("@/features/shared/services", () => ({
  getObjectUrlFromDownloadUrl: h.getObjectUrlFromDownloadUrl,
  profileService: {
    getSubscriptionDetails: h.getSubscriptionDetails,
    getPatientAllergies: h.getPatientAllergies,
    openStripeInvoice: h.openStripeInvoice,
    openStripePaymentMethod: h.openStripePaymentMethod,
  },
  UpdateProfile: h.UpdateProfile,
  UpdateProfileLogo: h.UpdateProfileLogo,
}));

// File-upload hook — controlled, no real File/Blob work.
vi.mock("@shared/hooks", () => ({
  useFileUpload: () => ({
    file: null,
    preview: "",
    onSelectFile: h.onSelectFile,
    handleFileChange: h.handleFileChange,
  }),
}));

// Sibling modal/section components — light stubs exposing asserted props.
vi.mock("./UpdatePassword", () => ({
  default: ({ show }) => (
    <div data-testid="update-password">{show ? "pw-open" : "pw-closed"}</div>
  ),
}));
vi.mock("./StaffFacility", () => ({
  default: ({ show }) => (
    <div data-testid="staff-facility">{show ? "fac-open" : "fac-closed"}</div>
  ),
}));
vi.mock("./ChangePlan", () => ({
  default: ({ show, plan }) => (
    <div data-testid="change-plan">
      {show ? `plan-open:${plan}` : "plan-closed"}
    </div>
  ),
}));
vi.mock("./CanclePlan", () => ({
  default: ({ show }) => (
    <div data-testid="cancle-plan">
      {show ? "cancel-open" : "cancel-closed"}
    </div>
  ),
}));

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: vi.fn(() => "06/10/2026"),
}));

// Asset barrel is also consumed by the constants barrel, so any image export
// must resolve — return a Proxy that yields a stub string for any key.
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      { get: (t, p) => (p in t ? t[p] : "asset-stub"), has: () => true },
    ),
);

const renderAs = (userProfile) =>
  renderWithProviders(<Profile />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile,
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    },
  });

const adminProfile = {
  _id: "adm-1",
  userType: ROLES.ADMIN,
  email: "admin@example.test",
  firstName: "Ada",
  lastName: "Min",
  companyName: "Acme Care",
  mobileNumber: "5550001111",
};

const employeeProfile = {
  _id: "emp-1",
  userType: ROLES.EMPLOYEE,
  email: "emp@example.test",
  firstName: "Eve",
  lastName: "Ployee",
  adminId: { companyName: "Acme Care", logo: "logo-key" },
};

const patientProfile = {
  _id: "pat-1",
  userType: ROLES.PATIENT,
  email: "pat@example.test",
  firstName: "Pat",
  lastName: "Ient",
};

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the profile headings and the user's name", () => {
    renderAs(adminProfile);
    expect(screen.getByText("Company & User Profile")).toBeInTheDocument();
    expect(screen.getByText("User Info")).toBeInTheDocument();
    // WHY: header renders firstName/lastName from the redux profile.
    expect(screen.getByText(/Ada/)).toBeInTheDocument();
    expect(screen.getByText(/Min/)).toBeInTheDocument();
  });

  it("seeds the form fields from the redux profile", () => {
    renderAs(adminProfile);
    expect(screen.getByDisplayValue("admin@example.test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ada")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5550001111")).toBeInTheDocument();
  });

  it("fetches subscription details on mount", () => {
    renderAs(adminProfile);
    expect(h.getSubscriptionDetails).toHaveBeenCalled();
  });

  it("shows admin-only controls for an Admin", () => {
    renderAs(adminProfile);
    expect(screen.getByText("Add Facility")).toBeInTheDocument();
    expect(screen.getByText("Change Logo")).toBeInTheDocument();
    expect(screen.getByText("Change Admin Password")).toBeInTheDocument();
    // Subscription section is admin-only.
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("Payment History")).toBeInTheDocument();
  });

  it("hides admin-only controls for an Employee", () => {
    renderAs(employeeProfile);
    expect(screen.queryByText("Add Facility")).not.toBeInTheDocument();
    expect(screen.queryByText("Change Logo")).not.toBeInTheDocument();
    expect(screen.queryByText("Subscription")).not.toBeInTheDocument();
    // Non-admin password button uses a different label.
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    // WHY: non-admins do not have hoursFormat select enabled.
    expect(h.getPatientAllergies).not.toHaveBeenCalled();
  });

  it("fetches allergies for a Patient and disables the time format select", () => {
    renderAs(patientProfile);
    expect(h.getPatientAllergies).toHaveBeenCalled();
    expect(screen.getByText("Allergies and reactions")).toBeInTheDocument();
  });

  it("opens the Add Facility modal when its button is clicked", async () => {
    const user = userEvent.setup();
    renderAs(adminProfile);
    expect(screen.getByTestId("staff-facility")).toHaveTextContent(
      "fac-closed",
    );
    await user.click(screen.getByText("Add Facility"));
    expect(screen.getByTestId("staff-facility")).toHaveTextContent("fac-open");
  });

  it("opens the change-password modal when its button is clicked", async () => {
    const user = userEvent.setup();
    renderAs(adminProfile);
    expect(screen.getByTestId("update-password")).toHaveTextContent(
      "pw-closed",
    );
    await user.click(screen.getByText("Change Admin Password"));
    expect(screen.getByTestId("update-password")).toHaveTextContent("pw-open");
  });

  it("dispatches UpdateProfile with the admin url on submit", async () => {
    renderAs(adminProfile);
    fireEvent.submit(
      screen.getByRole("button", { name: "Update" }).closest("form"),
    );
    // WHY: Admin submits go to the admin/updateProfile endpoint with isAdmin true.
    expect(h.UpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ url: "admin/updateProfile", isAdmin: true }),
    );
  });

  it("dispatches UpdateProfile with the employee url on submit", async () => {
    renderAs(employeeProfile);
    fireEvent.submit(
      screen.getByRole("button", { name: "Update" }).closest("form"),
    );
    expect(h.UpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "employee/updateProfile",
        isAdmin: false,
      }),
    );
  });

  it("triggers payment history via the stripe invoice service", async () => {
    const user = userEvent.setup();
    renderAs(adminProfile);
    await user.click(screen.getByText("Payment History"));
    expect(h.openStripeInvoice).toHaveBeenCalled();
  });

  it("renders without crashing when the profile is empty", () => {
    renderAs({});
    expect(screen.getByText("Company & User Profile")).toBeInTheDocument();
    // No role-gated sections appear for an unknown user type.
    expect(screen.queryByText("Subscription")).not.toBeInTheDocument();
  });
});
