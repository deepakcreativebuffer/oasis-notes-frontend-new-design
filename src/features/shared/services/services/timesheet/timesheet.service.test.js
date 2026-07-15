/** @format */

import { describe, it, expect } from "vitest";
import { timesheetService } from "./timesheet.service";

describe("timesheetService", () => {
  it("exposes its operations as functions", () => {
    expect(timesheetService).toBeTypeOf("object");
    expect(Object.keys(timesheetService).length).toBeGreaterThan(0);
    Object.values(timesheetService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});
