/** @format */

import { describe, it, expect } from "vitest";
import { adminAdmitLogsService } from "./admitLogs.service";

describe("adminAdmitLogsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminAdmitLogsService).toBeTypeOf("object");
    expect(adminAdmitLogsService).not.toBeNull();
    const values = Object.values(adminAdmitLogsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});
