/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { assessmentService, intakeService } from "./assessment.service";

// Mock the shared services barrel so the wrapper delegates to a controllable
// intakeService stub instead of the real API layer. Hoisted because the mock
// factory references these spies.
const { mockIntakeService } = vi.hoisted(() => ({
  mockIntakeService: {
    initialAssessment: {
      list: vi.fn(() => Promise.resolve("list-result")),
      create: vi.fn(() => Promise.resolve("create-result")),
      update: vi.fn(() => Promise.resolve("update-result")),
      remove: vi.fn(() => Promise.resolve("remove-result")),
    },
    getInitialAssessment: vi.fn(() => Promise.resolve("getById-result")),
  },
}));

vi.mock("@/features/shared/services/index", () => ({
  intakeService: mockIntakeService,
}));

beforeEach(() => vi.clearAllMocks());

describe("assessmentService wrapper", () => {
  it("re-exports the global intakeService", () => {
    expect(intakeService).toBe(mockIntakeService);
  });

  it("exposes the expected method surface", () => {
    expect(typeof assessmentService.list).toBe("function");
    expect(typeof assessmentService.getById).toBe("function");
    expect(typeof assessmentService.create).toBe("function");
    expect(typeof assessmentService.update).toBe("function");
    expect(typeof assessmentService.remove).toBe("function");
  });

  it("list delegates to intakeService.initialAssessment.list and returns its result", async () => {
    const options = { page: 1, resident: "res-test-001" };
    const result = await assessmentService.list(options);

    expect(mockIntakeService.initialAssessment.list).toHaveBeenCalledTimes(1);
    expect(mockIntakeService.initialAssessment.list).toHaveBeenCalledWith(
      options,
    );
    expect(result).toBe("list-result");
  });

  it("getById delegates to intakeService.getInitialAssessment", async () => {
    const options = { id: "ia-test-001" };
    const result = await assessmentService.getById(options);

    expect(mockIntakeService.getInitialAssessment).toHaveBeenCalledTimes(1);
    expect(mockIntakeService.getInitialAssessment).toHaveBeenCalledWith(
      options,
    );
    expect(result).toBe("getById-result");
  });

  it("create delegates to intakeService.initialAssessment.create", async () => {
    const options = { payload: { patient: "Test Patient" } };
    const result = await assessmentService.create(options);

    expect(mockIntakeService.initialAssessment.create).toHaveBeenCalledTimes(1);
    expect(mockIntakeService.initialAssessment.create).toHaveBeenCalledWith(
      options,
    );
    expect(result).toBe("create-result");
  });

  it("update forwards id, payload, and options positionally", async () => {
    const id = "ia-test-001";
    const payload = { mrn: "MRN-TEST-001" };
    const options = { signal: "sig" };
    const result = await assessmentService.update(id, payload, options);

    expect(mockIntakeService.initialAssessment.update).toHaveBeenCalledTimes(1);
    // WHY: wrapper must preserve positional arg order id -> payload -> options.
    expect(mockIntakeService.initialAssessment.update).toHaveBeenCalledWith(
      id,
      payload,
      options,
    );
    expect(result).toBe("update-result");
  });

  it("remove forwards id and options", async () => {
    const id = "ia-test-001";
    const options = { hard: true };
    const result = await assessmentService.remove(id, options);

    expect(mockIntakeService.initialAssessment.remove).toHaveBeenCalledTimes(1);
    expect(mockIntakeService.initialAssessment.remove).toHaveBeenCalledWith(
      id,
      options,
    );
    expect(result).toBe("remove-result");
  });

  it("passes through undefined options without crashing", async () => {
    await assessmentService.list();
    expect(mockIntakeService.initialAssessment.list).toHaveBeenCalledWith(
      undefined,
    );
  });
});
