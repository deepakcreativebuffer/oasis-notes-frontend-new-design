/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setEmployees,
  setActiveEmployee,
  selectEmployees,
  selectActiveEmployee,
} from "./employeeSlice";

const INITIAL = { employees: [], activeEmployee: null };

// Fake staff records only — never real PHI/PII.
const EMPLOYEES = [
  { _id: "emp-test-001", name: "Test Employee A" },
  { _id: "emp-test-002", name: "Test Employee B" },
];

describe("employeeSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the employee list", () => {
    const state = reducer(INITIAL, setEmployees(EMPLOYEES));
    expect(state.employees).toEqual(EMPLOYEES);
  });

  it("should set the active employee", () => {
    const state = reducer(INITIAL, setActiveEmployee(EMPLOYEES[0]));
    expect(state.activeEmployee).toEqual(EMPLOYEES[0]);
  });

  it("should select employees and the active employee", () => {
    const root = {
      employee: { employees: EMPLOYEES, activeEmployee: EMPLOYEES[1] },
    };
    expect(selectEmployees(root)).toEqual(EMPLOYEES);
    expect(selectActiveEmployee(root)).toEqual(EMPLOYEES[1]);
  });
});
