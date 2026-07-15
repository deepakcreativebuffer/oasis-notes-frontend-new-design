/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import HOC from "./HOC";
import { LayoutProvider } from "../../contexts/LayoutContext";

// Mock the heavy Inner-layout children so we can assert the HOC's wiring
// (which shell renders, which props pass through) without their data fetching.
vi.mock("./Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../Outer/Navbar/Navbar", () => ({
  default: ({ routesMob }) => (
    <div data-testid="navbar" data-routelen={routesMob?.length ?? 0}>
      Navbar
    </div>
  ),
}));

// Simple wrapped page so we can prove the HOC renders the inner content.
const Wrapped = () => <div data-testid="page-content">Page Content</div>;

const stateForRole = (userType) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("HOC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("standalone layout (no parent shell)", () => {
    it("should render the full Inner shell: sidebar, navbar and wrapped content", () => {
      const Composed = HOC({ Wcomponenet: Wrapped });
      renderWithProviders(<Composed />, {
        preloadedState: stateForRole("Employee"),
      });

      // WHY: a top-level page must paint its own chrome (sidebar + navbar) plus
      // the page content when no persistent AppLayout is present.
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("should omit the navbar when isNavbar is false but still render content", () => {
      const Composed = HOC({ Wcomponenet: Wrapped, isNavbar: false });
      renderWithProviders(<Composed />, {
        preloadedState: stateForRole("Employee"),
      });

      // WHY: some pages embed their own header, so the shared Navbar is opt-out.
      expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("should pass employee employment nav to the navbar on /employment", () => {
      const Composed = HOC({ Wcomponenet: Wrapped });
      renderWithProviders(<Composed />, {
        preloadedState: stateForRole("Employee"),
        route: "/employment",
      });

      // WHY: employees on the employment route get the employment-specific
      // mobile nav set, which must be forwarded to the Navbar (routesMob).
      expect(
        Number(screen.getByTestId("navbar").dataset.routelen),
      ).toBeGreaterThan(0);
    });

    it.each([["Admin"], ["Employee"], ["Patient"], ["Guardian"]])(
      "should render the shell for %s without crashing",
      (userType) => {
        const Composed = HOC({ Wcomponenet: Wrapped });
        renderWithProviders(<Composed />, {
          preloadedState: stateForRole(userType),
        });

        // WHY: every role resolves a different sidebar nav set; the HOC must
        // mount cleanly for all of them.
        expect(screen.getByTestId("page-content")).toBeInTheDocument();
      },
    );

    it("should render even when no userProfile/userType is present", () => {
      const Composed = HOC({ Wcomponenet: Wrapped });
      renderWithProviders(<Composed />);

      // WHY: a partially-hydrated session (empty profile) must not blank the page.
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });
  });

  describe("nested under a parent AppLayout shell", () => {
    it("should render content only (no own sidebar/navbar)", () => {
      const Composed = HOC({ Wcomponenet: Wrapped });
      renderWithProviders(
        <LayoutProvider>
          <Composed />
        </LayoutProvider>,
        { preloadedState: stateForRole("Employee") },
      );

      // WHY: when a persistent AppLayout already provides the shell, the HOC
      // must avoid double-rendering the sidebar/navbar and only emit content.
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    });
  });
});
