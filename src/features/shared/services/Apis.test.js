/** @format */

import { describe, it, expect } from "vitest";
import {
  ADMIN_APIS,
  EMPLOYEE_APIS,
  COMMON_APIS,
  AUTH_APIS,
  RESIDENT_APIS,
} from "./Apis";

describe("Apis barrel", () => {
  it("re-exports all endpoint maps as non-empty objects", () => {
    for (const map of [
      ADMIN_APIS,
      EMPLOYEE_APIS,
      COMMON_APIS,
      AUTH_APIS,
      RESIDENT_APIS,
    ]) {
      expect(map).toBeTypeOf("object");
      expect(Object.keys(map).length).toBeGreaterThan(0);
    }
  });
});
