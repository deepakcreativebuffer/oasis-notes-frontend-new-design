/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import HOC from "./HOC";
import { LayoutProvider } from "@/features/shared/contexts/LayoutContext";

// Navbar/Sidebar pull in sockets, services and react-bootstrap — none of which
// are under test here. Stub them to light elements that surface only the props
// the HOC wires through (routesMob count for the Navbar's mobile nav).
vi.mock("./Navbar/Navbar", () => ({
  default: ({ routesMob }) => (
    <nav data-testid="navbar" data-routes={routesMob ? routesMob.length : 0}>
      Navbar
    </nav>
  ),
}));

vi.mock("./Sidebar", () => ({
  default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

// A trivial page component to wrap so we can assert the HOC renders content.
const WrappedPage = () => <div data-testid="wrapped">Wrapped Content</div>;

// Seeds auth.userProfile so the HOC's useSelector(userProfile) resolves a role
// without dispatching a real login. Fake PHI only.
const stateForRole = (userType, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "user-test-001",
      name: "Test User",
      userType,
      ...extra,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("HOC", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("standalone layout (no parent shell)", () => {
    it("should render the sidebar, navbar and the wrapped component", () => {
      const Component = HOC({ Wcomponenet: WrappedPage });
      renderWithProviders(<Component />, {
        preloadedState: stateForRole("Admin"),
      });

      // WHY: when no AppLayout shell exists, the HOC must supply the full
      // chrome (sidebar + navbar) around the protected page.
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("wrapped")).toBeInTheDocument();
    });

    it("should omit the navbar when isNavbar is false", () => {
      const Component = HOC({ Wcomponenet: WrappedPage, isNavbar: false });
      renderWithProviders(<Component />, {
        preloadedState: stateForRole("Admin"),
      });

      // WHY: some pages (e.g. full-screen flows) opt out of the top navbar but
      // still keep the sidebar and content.
      expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("wrapped")).toBeInTheDocument();
    });
  });

  describe("role-based mobile nav items (routesMob)", () => {
    // The HOC derives the mobile nav list from the authenticated user's role
    // and passes it to the Navbar via routesMob. We assert the list is non-empty
    // for known roles (exact entries belong to the constants, not this HOC).
    it.each([["Admin"], ["Employee"], ["Patient"], ["Guardian"]])(
      "should populate routesMob for %s",
      (userType) => {
        const Component = HOC({ Wcomponenet: WrappedPage });
        renderWithProviders(<Component />, {
          preloadedState: stateForRole(userType),
        });

        // WHY: each role gets its own sidebar; an empty mobile nav would leave
        // staff/residents unable to navigate on small screens.
        expect(
          Number(screen.getByTestId("navbar").getAttribute("data-routes")),
        ).toBeGreaterThan(0);
      },
    );

    it("should add the Notes Library entry for Growth-tier admins", () => {
      const BaseAdmin = HOC({ Wcomponenet: WrappedPage });
      renderWithProviders(<BaseAdmin />, {
        preloadedState: stateForRole("Admin"),
      });
      const baseCount = Number(
        screen.getByTestId("navbar").getAttribute("data-routes"),
      );

      const GrowthAdmin = HOC({ Wcomponenet: WrappedPage });
      renderWithProviders(<GrowthAdmin />, {
        preloadedState: stateForRole("Admin", { tier: "Growth" }),
      });
      const growthCount = Number(
        screen.getAllByTestId("navbar").at(-1).getAttribute("data-routes"),
      );

      // WHY: Growth-tier admins unlock the Notes Library, which injects one
      // extra sidebar/nav entry beyond the base admin set.
      expect(growthCount).toBe(baseCount + 1);
    });
  });

  describe("parent layout shell present", () => {
    it("should render content only, skipping its own sidebar and navbar", () => {
      const Component = HOC({ Wcomponenet: WrappedPage });
      renderWithProviders(
        <LayoutProvider>
          <Component />
        </LayoutProvider>,
        { preloadedState: stateForRole("Admin") },
      );

      // WHY: when a persistent AppLayout already renders the chrome, the HOC
      // must NOT double-render sidebar/navbar — only the page content.
      expect(screen.getByTestId("wrapped")).toBeInTheDocument();
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should still render the wrapped component with no profile/userType", () => {
      const Component = HOC({ Wcomponenet: WrappedPage });
      renderWithProviders(<Component />);

      // WHY: a partially-hydrated session must not crash the layout; the page
      // content (and chrome) should still mount.
      expect(screen.getByTestId("wrapped")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      // No role -> empty mobile nav list rather than an error.
      expect(
        Number(screen.getByTestId("navbar").getAttribute("data-routes")),
      ).toBe(0);
    });
  });
});
