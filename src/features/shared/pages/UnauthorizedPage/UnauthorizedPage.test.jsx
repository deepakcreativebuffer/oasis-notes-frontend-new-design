/** @format */

import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import UnauthorizedPage from "./UnauthorizedPage";

// Seeds auth.userProfile so the component's useSelector(userProfile) resolves a
// role without dispatching a real login. Fake PHI only.
const stateForRole = (userType) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "user-test-001", name: "Test User", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("UnauthorizedPage", () => {
  describe("rendering", () => {
    it("should show the access-denied message and a homepage link", () => {
      renderWithProviders(<UnauthorizedPage />);

      // WHY: an EHR must clearly tell staff they lack access rather than
      // silently rendering a blank/partial protected page.
      expect(
        screen.getByText(/unauthorized - you do not have access to this page/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /go to homepage/i }),
      ).toBeInTheDocument();
    });
  });

  describe("role-based homepage routing", () => {
    // The homepage link target is derived from the authenticated user's role.
    it.each([
      ["Admin", "/dashboard/homepage"],
      ["Employee", "/Home"],
    ])(
      "should point the homepage link to %s's dashboard",
      (userType, expectedHref) => {
        renderWithProviders(<UnauthorizedPage />, {
          preloadedState: stateForRole(userType),
        });

        expect(
          screen.getByRole("link", { name: /go to homepage/i }),
        ).toHaveAttribute("href", expectedHref);
      },
    );

    it.each([
      ["Patient", "resident"],
      ["Guardian", "guardian"],
    ])(
      "should fall back to root for %s (no dedicated unauthorized landing)",
      (userType) => {
        renderWithProviders(<UnauthorizedPage />, {
          preloadedState: stateForRole(userType),
        });

        // WHY: residents/guardians have no admin/employee homepage; routing
        // them to "/" avoids dead-ending on a 403 with no escape.
        expect(
          screen.getByRole("link", { name: /go to homepage/i }),
        ).toHaveAttribute("href", "/");
      },
    );
  });

  describe("edge cases", () => {
    it("should fall back to root when no profile/userType is present", () => {
      // Unauthenticated or partially-hydrated session — empty userProfile.
      renderWithProviders(<UnauthorizedPage />);

      expect(
        screen.getByRole("link", { name: /go to homepage/i }),
      ).toHaveAttribute("href", "/");
    });
  });
});
