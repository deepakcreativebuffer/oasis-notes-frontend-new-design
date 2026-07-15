/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import UpdatePassword from "./UpdatePassword";
import { showNotification } from "@/utils";

// Mock the shared services barrel so authService.changePassword is observable
// and never issues a real HTTP request.
const mocks = vi.hoisted(() => ({
  changePassword: vi.fn(),
}));

vi.mock("@/features/shared/services", () => ({
  authService: { changePassword: mocks.changePassword },
}));

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-001", userType: "Admin" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-002", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const renderModal = (props = {}, preloadedState = employeeState) => {
  const onHide = props.onHide || vi.fn();
  return {
    onHide,
    ...renderWithProviders(<UpdatePassword show onHide={onHide} {...props} />, {
      preloadedState,
    }),
  };
};

// Helper to fill the three password fields by placeholder.
const fill = (oldPw, newPw, confirmPw) => {
  fireEvent.change(screen.getByPlaceholderText("Old Password"), {
    target: { value: oldPw },
  });
  fireEvent.change(screen.getByPlaceholderText("New Password"), {
    target: { value: newPw },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), {
    target: { value: confirmPw },
  });
};

describe("UpdatePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the three password inputs and action buttons", () => {
    renderModal();
    expect(screen.getByPlaceholderText("Old Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm New Password"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CANCEL" })).toBeInTheDocument();
  });

  it("shows the admin-specific title for Admin users", () => {
    renderModal({}, adminState);
    expect(screen.getByText("Change Admin Password")).toBeInTheDocument();
  });

  it("shows the generic title for non-admin users", () => {
    renderModal({}, employeeState);
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  it("blocks submit and warns when any field is empty", () => {
    renderModal();
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));
    // WHY: empty validation short-circuits before the service is called.
    expect(mocks.changePassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "Passwords fields cannot be empty",
      type: "danger",
    });
  });

  it("warns when the confirm password does not match", () => {
    renderModal();
    fill("OldPass1!", "NewPass1!", "Mismatch1!");
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));
    expect(mocks.changePassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "Confirm password does not match the password",
      type: "danger",
    });
  });

  it("warns when the new password fails the strength policy", () => {
    renderModal();
    // matching but too weak (no uppercase/number/special)
    fill("OldPass1!", "weakpass", "weakpass");
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));
    expect(mocks.changePassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "danger" }),
    );
  });

  it("forwards a valid payload to authService.changePassword and closes", () => {
    const { onHide } = renderModal();
    fill("OldPass1!", "NewPass1!", "NewPass1!");
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    // WHY: valid input reaches the service with the mapped payload shape.
    expect(mocks.changePassword).toHaveBeenCalledWith(
      {
        password: "OldPass1!",
        newPassword: "NewPass1!",
        confirmPassword: "NewPass1!",
      },
      expect.objectContaining({ setLoading: expect.any(Function) }),
    );
    expect(onHide).toHaveBeenCalled();
  });

  it("closes the modal when CANCEL is clicked without calling the service", () => {
    const { onHide } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));
    expect(mocks.changePassword).not.toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });

  it("toggles old-password visibility when the eye icon is clicked", async () => {
    const user = userEvent.setup();
    renderModal();
    const oldInput = screen.getByPlaceholderText("Old Password");
    // default masked
    expect(oldInput).toHaveAttribute("type", "password");
    // the InputGroup.Text icon wrapper is the clickable sibling
    await user.click(oldInput.parentElement.querySelector(".input-group-text"));
    expect(oldInput).toHaveAttribute("type", "text");
  });
});
