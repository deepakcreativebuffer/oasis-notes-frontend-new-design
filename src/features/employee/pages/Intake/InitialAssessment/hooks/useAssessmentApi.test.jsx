/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useAssessmentApi } from "./useAssessmentApi";

// MOCK the global shared services barrel — the hook reads employeeService.getProfile.
const mocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/features/shared/services/index", () => ({
  employeeService: { getProfile: mocks.getProfile },
}));

vi.mock("../servicesApi/assessment.service", () => ({
  assessmentService: {
    getById: mocks.getById,
    create: mocks.create,
    update: mocks.update,
  },
}));

const baseProps = {
  id: undefined,
  patientId: undefined,
  isCreateRoute: false,
  setGetApiData: vi.fn(),
  setLoading: vi.fn(),
  setUserData: vi.fn(),
};

describe("useAssessmentApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should fetch the profile on mount via employeeService", () => {
    const setUserData = vi.fn();
    renderHook(() => useAssessmentApi({ ...baseProps, setUserData }));
    // WHY: the assessment form always needs the current employee's profile to
    // stamp the assessor, so getProfile must fire regardless of route.
    expect(mocks.getProfile).toHaveBeenCalledTimes(1);
    expect(mocks.getProfile).toHaveBeenCalledWith({ setResponse: setUserData });
  });

  it("should prefetch existing patient data on the create route", () => {
    const setGetApiData = vi.fn();
    const setLoading = vi.fn();
    renderHook(() =>
      useAssessmentApi({
        ...baseProps,
        patientId: "res-test-001",
        isCreateRoute: true,
        setGetApiData,
        setLoading,
      }),
    );
    // WHY: on a fresh assessment we still pull the patient's known data by
    // patientId to pre-populate the form.
    expect(mocks.getById).toHaveBeenCalledWith({
      patientId: "res-test-001",
      setResponse: setGetApiData,
      setLoading,
    });
  });

  it("should NOT prefetch by patientId when not on the create route", () => {
    renderHook(() =>
      useAssessmentApi({
        ...baseProps,
        patientId: "res-test-001",
        isCreateRoute: false,
      }),
    );
    // WHY: only the create flow prefetches by patientId; the create-branch
    // getById call must not happen here.
    expect(mocks.getById).not.toHaveBeenCalledWith(
      expect.objectContaining({ patientId: "res-test-001" }),
    );
  });

  it("should load an existing assessment by id when id is present", () => {
    const setGetApiData = vi.fn();
    renderHook(() =>
      useAssessmentApi({ ...baseProps, id: "rec-test-001", setGetApiData }),
    );
    // WHY: editing an existing record loads it by its own id (not patientId).
    expect(mocks.getById).toHaveBeenCalledWith({
      id: "rec-test-001",
      setResponse: setGetApiData,
    });
  });

  it("should not load by id when no id is provided", () => {
    renderHook(() => useAssessmentApi({ ...baseProps }));
    expect(mocks.getById).not.toHaveBeenCalled();
  });

  it("submitCreate should delegate to assessmentService.create with the success message", () => {
    const { result } = renderHook(() => useAssessmentApi({ ...baseProps }));
    const navigate = vi.fn();
    const setLoad = vi.fn();
    const payload = { note: "Test Patient intake" };

    act(() => {
      result.current.submitCreate({
        patientId: "res-test-001",
        payload,
        setLoading: setLoad,
        navigate,
      });
    });

    expect(mocks.create).toHaveBeenCalledWith({
      patientId: "res-test-001",
      payload,
      setLoading: setLoad,
      successMsg: "Success!",
      navigate,
    });
  });

  it("submitUpdate should delegate to assessmentService.update with id, payload and options", () => {
    const { result } = renderHook(() => useAssessmentApi({ ...baseProps }));
    const navigate = vi.fn();
    const setLoad = vi.fn();
    const payload = { note: "updated" };

    act(() => {
      result.current.submitUpdate({
        id: "rec-test-001",
        payload,
        setLoading: setLoad,
        navigate,
      });
    });

    // WHY: update uses the positional (id, payload, options) service signature.
    expect(mocks.update).toHaveBeenCalledWith("rec-test-001", payload, {
      setLoading: setLoad,
      navigate,
    });
  });

  it("should expose stable submit callbacks across re-renders", () => {
    const { result, rerender } = renderHook(() =>
      useAssessmentApi({ ...baseProps }),
    );
    const first = result.current;
    rerender();
    // WHY: callbacks are memoized with empty deps so consumers can use them in
    // effect deps without re-triggering.
    expect(result.current.submitCreate).toBe(first.submitCreate);
    expect(result.current.submitUpdate).toBe(first.submitUpdate);
  });
});
