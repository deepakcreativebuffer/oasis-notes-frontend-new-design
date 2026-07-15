/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import * as employeeBarrel from "./index";

// The barrel pulls in six heavy page modules (sockets, react-quill, services,
// etc.). We mock each one to a tiny stub so this test exercises ONLY the
// re-export contract of the barrel, never the children's transitive IO.
// Mock paths must match the SOURCE's relative import specifiers exactly.
vi.mock("./pages/Chat/Chat", () => ({
  default: () => null,
}));
vi.mock("./pages/Employee Tracking/EmployeeTracking", () => ({
  default: () => null,
}));
vi.mock("./pages/Profile/Profile", () => ({
  default: () => null,
}));
vi.mock("./pages/Search/SearchPage", () => ({
  default: () => null,
}));
vi.mock("./pages/Time Off Request/TimeOfRequest", () => ({
  default: () => null,
}));
vi.mock("./pages/Time Sheet/TimeSheet", () => ({
  default: () => null,
}));

describe("features/employee barrel (index.js)", () => {
  beforeEach(() => vi.clearAllMocks());

  // WHY: routing config imports these page components by name from the barrel;
  // a missing/renamed export would silently break an employee route at build.
  const expectedExports = [
    "Chat",
    "EmployeeTracking",
    "Profile",
    "Search",
    "TimeOffRequest",
    "TimeSheet",
  ];

  it("re-exports exactly the six expected employee page components", () => {
    expect(Object.keys(employeeBarrel).sort()).toEqual(
      [...expectedExports].sort(),
    );
  });

  it.each(expectedExports)(
    "exposes %s as a defined, component-like export",
    (name) => {
      const exported = employeeBarrel[name];
      // WHY: each barrel entry must resolve to the page module's default
      // (a React component => function), not undefined.
      expect(exported).toBeDefined();
      expect(typeof exported).toBe("function");
    },
  );

  it("does not leak any unexpected named exports", () => {
    // WHY: keeps the public surface of the feature minimal and intentional.
    const unexpected = Object.keys(employeeBarrel).filter(
      (k) => !expectedExports.includes(k),
    );
    expect(unexpected).toEqual([]);
  });
});
