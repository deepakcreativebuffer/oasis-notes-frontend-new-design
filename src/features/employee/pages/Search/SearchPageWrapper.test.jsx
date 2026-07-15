/** @format */

import React from "react";
import { renderWithProviders, screen } from "@/test-utils";

import SearchPageWrapper from "./SearchPageWrapper";

// Hoisted spies so we can assert which HOC factory was selected and that
// SearchPage was passed in as the wrapped component.
const h = vi.hoisted(() => {
  const SearchPage = () => <div data-testid="search-page">SearchPage</div>;
  const hocFactory = (label) =>
    vi.fn(
      ({ Wcomponenet }) =>
        function Wrapped() {
          return (
            <div data-testid={`hoc-${label}`}>
              <Wcomponenet />
            </div>
          );
        },
    );
  return {
    SearchPage,
    outerHOC: hocFactory("outer"),
    barHOC: hocFactory("bar"),
  };
});

vi.mock("./SearchPage", () => ({ __esModule: true, default: h.SearchPage }));
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  __esModule: true,
  default: h.outerHOC,
}));
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  __esModule: true,
  default: h.barHOC,
}));

const stateFor = (userType) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "u1", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SearchPageWrapper", () => {
  it("uses the Outer HOC for Employee users", () => {
    renderWithProviders(<SearchPageWrapper />, {
      preloadedState: stateFor("Employee"),
    });

    // WHY: Employee branch selects the Outer-layout HOC factory.
    expect(h.outerHOC).toHaveBeenCalledTimes(1);
    expect(h.barHOC).not.toHaveBeenCalled();
    expect(screen.getByTestId("hoc-outer")).toBeInTheDocument();
    expect(screen.getByTestId("search-page")).toBeInTheDocument();
  });

  it("passes SearchPage as the wrapped component to the chosen HOC", () => {
    renderWithProviders(<SearchPageWrapper />, {
      preloadedState: stateFor("Employee"),
    });

    expect(h.outerHOC).toHaveBeenCalledWith({ Wcomponenet: h.SearchPage });
  });

  it("uses the EmployeeBar HOC for Admin users", () => {
    renderWithProviders(<SearchPageWrapper />, {
      preloadedState: stateFor("Admin"),
    });

    // WHY: non-Employee userType falls through to the EmployeeBar HOC factory.
    expect(h.barHOC).toHaveBeenCalledTimes(1);
    expect(h.outerHOC).not.toHaveBeenCalled();
    expect(screen.getByTestId("hoc-bar")).toBeInTheDocument();
    expect(screen.getByTestId("search-page")).toBeInTheDocument();
  });

  it("uses the EmployeeBar HOC for Patient users", () => {
    renderWithProviders(<SearchPageWrapper />, {
      preloadedState: stateFor("Patient"),
    });

    expect(h.barHOC).toHaveBeenCalledTimes(1);
    expect(h.outerHOC).not.toHaveBeenCalled();
  });

  it("falls back to the EmployeeBar HOC when no profile is present", () => {
    renderWithProviders(<SearchPageWrapper />, {
      preloadedState: { auth: { userProfile: null } },
    });

    // WHY: optional chaining yields undefined userType -> non-Employee branch.
    expect(h.barHOC).toHaveBeenCalledTimes(1);
    expect(h.outerHOC).not.toHaveBeenCalled();
    expect(screen.getByTestId("search-page")).toBeInTheDocument();
  });
});
