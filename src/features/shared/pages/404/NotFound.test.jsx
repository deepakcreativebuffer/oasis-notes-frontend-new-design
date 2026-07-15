/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import NotFound from "./NotFound";

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

describe("NotFound", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering", () => {
    it("should show the moved/deleted message and a homepage link", () => {
      renderWithProviders(<NotFound />);

      // WHY: a 404 in an EHR must tell staff the page is gone and give a clear
      // escape route rather than dead-ending on a blank screen.
      expect(
        screen.getByText(
          /unfortunately the page you are looking for has been moved or deleted/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /go to homepage/i }),
      ).toBeInTheDocument();
    });

    it("should render the 404 illustration", () => {
      const { container } = renderWithProviders(<NotFound />);

      // WHY: image has empty alt (decorative); query by tag/src since there is
      // no accessible name to target.
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/404.jpg");
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
        renderWithProviders(<NotFound />, {
          preloadedState: stateForRole(userType),
        });

        expect(
          screen.getByRole("link", { name: /go to homepage/i }),
        ).toHaveAttribute("href", expectedHref);
      },
    );

    it.each([["Patient"], ["Guardian"]])(
      "should fall back to root for %s (no dedicated 404 landing)",
      (userType) => {
        renderWithProviders(<NotFound />, {
          preloadedState: stateForRole(userType),
        });

        // WHY: residents/guardians have no admin/employee homepage; routing
        // them to "/" avoids stranding them on a 404 with no way back.
        expect(
          screen.getByRole("link", { name: /go to homepage/i }),
        ).toHaveAttribute("href", "/");
      },
    );
  });

  describe("edge cases", () => {
    it("should fall back to root when no profile/userType is present", () => {
      // Unauthenticated or partially-hydrated session — empty userProfile.
      renderWithProviders(<NotFound />);

      expect(
        screen.getByRole("link", { name: /go to homepage/i }),
      ).toHaveAttribute("href", "/");
    });
  });
});
