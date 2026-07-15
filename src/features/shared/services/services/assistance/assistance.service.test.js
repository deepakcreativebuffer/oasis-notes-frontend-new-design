/** @format */

import { describe, it, expect } from "vitest";
// Imported via the public barrel: these factory-built services are part of a
// module cycle (service -> crudServiceFactory -> common.api -> @/utils -> barrel)
// that only resolves cleanly when entered through the barrel, as the app does.
import { assistanceService } from "@/features/shared/services";

describe("assistanceService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(assistanceService).toBeTypeOf("object");
    expect(assistanceService).not.toBeNull();
    const values = Object.values(assistanceService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});
