/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import SignerEmployee from "./SignerEmployee";
import { employeeService } from "../../services";

// Stub the Select wrapper to expose options + onChange.
vi.mock("./Search", () => ({
  default: ({ options, onChange }) => (
    <div>
      {options?.map((o) => (
        <span key={o.value}>{o.label}</span>
      ))}
      <button onClick={() => onChange([options[0]])}>pick first</button>
    </div>
  ),
}));
vi.mock("../../services", () => ({
  employeeService: { getEmployee: vi.fn() },
}));
vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (i) => `Name-${i._id}`,
}));

const meState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-me" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("SignerEmployee", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should map provided signer options excluding the current user", () => {
    renderWithProviders(
      <SignerEmployee
        setValue={vi.fn()}
        value={[]}
        options={{ data: [{ _id: "emp-1" }, { _id: "emp-me" }] }}
      />,
      { preloadedState: meState },
    );

    // WHY: a user can't be their own co-signer, so they're filtered out of the
    // signer list.
    expect(screen.getByText("Name-emp-1")).toBeInTheDocument();
    expect(screen.queryByText("Name-emp-me")).not.toBeInTheDocument();
  });

  it("should fetch employees when no options are provided", () => {
    renderWithProviders(<SignerEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });
    expect(employeeService.getEmployee).toHaveBeenCalledTimes(1);
  });

  it("should forward a selection to setValue", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    renderWithProviders(
      <SignerEmployee
        setValue={setValue}
        value={[]}
        options={{ data: [{ _id: "emp-1" }] }}
      />,
      { preloadedState: meState },
    );

    await user.click(screen.getByRole("button", { name: /pick first/i }));
    expect(setValue).toHaveBeenCalledWith([
      { value: "emp-1", label: "Name-emp-1" },
    ]);
  });
});
