/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore } from "@/test-utils";

import useFetchProfile from "./useFetchProfile";
import { refreshSession } from "../services";
import { redirectAuthenticatedUserFromHome } from "@/utils/authRedirect";
import { clearClientPersistence } from "@/store/authStorage";
import { ROUTES } from "../constants";

vi.mock("../services", () => ({ refreshSession: vi.fn() }));
vi.mock("@/utils/authRedirect", () => ({
  redirectAuthenticatedUserFromHome: vi.fn(),
}));
vi.mock("@/store/authStorage", () => ({ clearClientPersistence: vi.fn() }));
vi.mock("@/utils", () => ({ logger: { warn: vi.fn(), info: vi.fn() } }));

const makeWrapper = (authenticated) => {
  const store = setupStore(
    authenticated
      ? {
          auth: {
            isAuthenticated: true,
            userProfile: { _id: "user-test-001", userType: "Admin" },
            unreadMessages: 0,
            unreadNotifications: 0,
          },
        }
      : undefined,
  );
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

// The hook's sync effect clears profileData while logged-out, so the success
// case is rendered against an authenticated store (as it is in the real app
// once login has been dispatched).
const render = (pathname, navigate = vi.fn(), authenticated = false) =>
  renderHook(() => useFetchProfile({ pathname }, navigate), {
    wrapper: makeWrapper(authenticated),
  });

describe("useFetchProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should skip the refresh on password-reset / unauthorized routes", async () => {
    const { result } = render(ROUTES.CHANGE_PASSWORD);
    await waitFor(() =>
      expect(result.current.checkingRefreshToken).toBe(false),
    );
    // WHY: those public routes must not trigger a session refresh/redirect loop.
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("should hydrate the profile and redirect on a successful refresh", async () => {
    const user = { _id: "user-test-001", userType: "Admin" };
    refreshSession.mockResolvedValue({ success: true, data: { user } });
    const navigate = vi.fn();

    const { result } = render(ROUTES.HOME, navigate, true);

    await waitFor(() =>
      expect(result.current.checkingRefreshToken).toBe(false),
    );
    expect(result.current.profileData).toEqual({ profile: { data: user } });
    expect(redirectAuthenticatedUserFromHome).toHaveBeenCalledWith(
      "Admin",
      ROUTES.HOME,
      navigate,
    );
  });

  it("should clear the session and redirect home when the refresh token is invalid", async () => {
    refreshSession.mockResolvedValue({ success: false, message: "expired" });
    const navigate = vi.fn();

    const { result } = render("/some/protected/page", navigate);

    await waitFor(() =>
      expect(result.current.checkingRefreshToken).toBe(false),
    );
    // WHY: an invalid refresh token means the session is dead — wipe client
    // state and bounce the user to the public home route.
    expect(clearClientPersistence).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME, { replace: true });
    expect(result.current.profileData).toBeNull();
  });

  it("should not redirect again when already on the home route after a failed refresh", async () => {
    refreshSession.mockResolvedValue({ success: false });
    const navigate = vi.fn();

    const { result } = render(ROUTES.HOME, navigate);

    await waitFor(() =>
      expect(result.current.checkingRefreshToken).toBe(false),
    );
    expect(clearClientPersistence).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
