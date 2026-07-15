/** @format */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { useAssessmentForm } from "./useAssessmentForm";

// Drive the hook through MemoryRouter so useLocation().pathname reflects the
// route under test. The hook is a thin wrapper around resolveAssessmentContext;
// we exercise the real helper (no IO) across the EHR's intake routes.
const renderAt = (route) =>
  renderHook(() => useAssessmentForm(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ),
  });

describe("useAssessmentForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should resolve CREATE mode on the employee create route", () => {
    const { result } = renderAt("/initial-assessment");
    // WHY: the bare create route starts a brand-new intake assessment.
    expect(result.current.mode).toBe("create");
    expect(result.current.portal).toBe("employee");
    expect(result.current.isCreate).toBe(true);
    expect(result.current.isView).toBe(false);
    expect(result.current.isEdit).toBe(false);
    expect(result.current.isReadOnly).toBe(false);
  });

  it("should resolve VIEW mode (read-only) on the employee view route", () => {
    const { result } = renderAt("/view-initial-assessment/res-test-001");
    // WHY: viewing an existing assessment must lock the form read-only.
    expect(result.current.mode).toBe("view");
    expect(result.current.portal).toBe("employee");
    expect(result.current.isView).toBe(true);
    expect(result.current.isReadOnly).toBe(true);
    expect(result.current.isCreate).toBe(false);
  });

  it("should resolve EDIT mode on the employee edit route", () => {
    const { result } = renderAt("/edit-initial-assessment/res-test-001");
    // WHY: edit route allows mutation but is neither create nor read-only.
    expect(result.current.mode).toBe("edit");
    expect(result.current.portal).toBe("employee");
    expect(result.current.isEdit).toBe(true);
    expect(result.current.isReadOnly).toBe(false);
    expect(result.current.isCreate).toBe(false);
  });

  it("should resolve the RESIDENT portal on resident view routes", () => {
    const { result } = renderAt(
      "/view-initial-assessment-resident/res-test-001",
    );
    // WHY: resident-portal routes change the API source the form reads from.
    expect(result.current.portal).toBe("resident");
    expect(result.current.mode).toBe("view");
    expect(result.current.isReadOnly).toBe(true);
  });

  it("should resolve the RESIDENT portal in EDIT mode on resident edit routes", () => {
    const { result } = renderAt(
      "/edit-initial-Assessment-resident/res-test-001",
    );
    expect(result.current.portal).toBe("resident");
    expect(result.current.mode).toBe("edit");
    expect(result.current.isEdit).toBe(true);
  });

  it("should return a stable memoized context reference for the same pathname", () => {
    const { result, rerender } = renderAt("/initial-assessment");
    const first = result.current;
    rerender();
    // WHY: context is useMemo'd on pathname so child renders don't churn.
    expect(result.current).toBe(first);
  });

  it("should expose mutually-exclusive mode flags matching the mode string", () => {
    const { result } = renderAt("/view-initial-assessment/res-test-001");
    const { mode, isCreate, isView, isEdit } = result.current;
    const trueCount = [isCreate, isView, isEdit].filter(Boolean).length;
    // WHY: exactly one of create/view/edit drives mode-based rendering.
    expect(trueCount).toBe(1);
    expect(mode).toBe("view");
  });
});
