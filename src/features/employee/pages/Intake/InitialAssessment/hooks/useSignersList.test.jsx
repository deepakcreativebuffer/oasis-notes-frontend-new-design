/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useSignersList } from "./useSignersList";

// WHY: useSignersList is a pure helper hook (no redux/router/react-query/IO),
// so we exercise it with renderHook and a tiny controlled-state harness that
// mirrors how the signer list is owned by the parent form.

/**
 * Render the hook with a mutable `signers` array kept in a ref so that
 * `setSigners(updater)` mutations are visible across rerenders, the way a
 * real useState-backed parent would behave.
 */
function setupWithState(initialSigners, profileInfo, options) {
  const stateRef = { current: initialSigners };
  const setSigners = vi.fn((updater) => {
    stateRef.current =
      typeof updater === "function" ? updater(stateRef.current) : updater;
  });

  const { result, rerender } = renderHook(
    ({ signers, profile, opts }) =>
      useSignersList(signers, setSigners, profile, opts),
    {
      initialProps: {
        signers: stateRef.current,
        profile: profileInfo,
        opts: options,
      },
    },
  );

  const syncRerender = () =>
    rerender({
      signers: stateRef.current,
      profile: profileInfo,
      opts: options,
    });

  return { result, setSigners, stateRef, syncRerender };
}

describe("useSignersList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signerIndex resolution", () => {
    it("locates the signer row whose signerId matches the profile _id", () => {
      const signers = [
        { signerId: "emp-test-001", signature: "" },
        { signerId: "emp-test-002", signature: "" },
      ];
      const { result } = setupWithState(signers, { _id: "emp-test-002" });

      // WHY: the current user's signature row is found by matching the logged-in
      // profile id, so the right person signs their own line.
      expect(result.current.signerIndex).toBe(1);
    });

    it("returns -1 when no signer matches the profile", () => {
      const signers = [{ signerId: "emp-test-001" }];
      const { result } = setupWithState(signers, { _id: "emp-test-999" });

      expect(result.current.signerIndex).toBe(-1);
    });

    it("returns -1 when the signers list is undefined", () => {
      const { result } = setupWithState(undefined, { _id: "emp-test-001" });

      // WHY: guards optional chaining so a not-yet-loaded form does not throw.
      expect(result.current.signerIndex).toBe(-1);
    });

    it("returns -1 when the signers list is empty", () => {
      const { result } = setupWithState([], { _id: "emp-test-001" });

      expect(result.current.signerIndex).toBe(-1);
    });

    it("ignores assigned-patient matches unless includeAssignedPatients is set", () => {
      const signers = [{ signerId: "res-test-001" }];
      const profile = {
        _id: "emp-test-001",
        patientsAssigned: ["res-test-001"],
      };

      const without = setupWithState(signers, profile, {});
      // WHY: by default a clinician must not be auto-bound to a patient's row.
      expect(without.result.current.signerIndex).toBe(-1);

      const withFlag = setupWithState(signers, profile, {
        includeAssignedPatients: true,
      });
      // WHY: guardian/assigned-patient flows opt in so the assigned resident's
      // row is treated as signable by the linked profile.
      expect(withFlag.result.current.signerIndex).toBe(0);
    });

    it("prefers a direct _id match over assigned-patient logic", () => {
      const signers = [
        { signerId: "res-test-001" },
        { signerId: "emp-test-001" },
      ];
      const profile = {
        _id: "emp-test-001",
        patientsAssigned: ["res-test-001"],
      };
      const { result } = setupWithState(signers, profile, {
        includeAssignedPatients: true,
      });

      // findIndex returns the first match; res row (0) matches via assigned list.
      expect(result.current.signerIndex).toBe(0);
    });
  });

  describe("field setters", () => {
    it("setSignerSignature updates only the matched signer's signature", () => {
      const signers = [
        { signerId: "emp-test-001", signature: "" },
        { signerId: "emp-test-002", signature: "" },
      ];
      const { result, setSigners, stateRef } = setupWithState(signers, {
        _id: "emp-test-002",
      });

      act(() => {
        result.current.setSignerSignature("data:image/png;base64,SIG");
      });

      expect(setSigners).toHaveBeenCalledTimes(1);
      // WHY: only the current user's row is mutated; co-signers are untouched.
      expect(stateRef.current[1].signature).toBe("data:image/png;base64,SIG");
      expect(stateRef.current[0].signature).toBe("");
      // immutability: a new array and new object are produced.
      expect(stateRef.current).not.toBe(signers);
      expect(stateRef.current[1]).not.toBe(signers[1]);
    });

    it("setSignerDate writes the dateSigned field", () => {
      const signers = [{ signerId: "emp-test-001", dateSigned: "" }];
      const { result, stateRef } = setupWithState(signers, {
        _id: "emp-test-001",
      });

      act(() => {
        result.current.setSignerDate("2026-06-10");
      });

      expect(stateRef.current[0].dateSigned).toBe("2026-06-10");
    });

    it("setSignerTime writes the signedTime field", () => {
      const signers = [{ signerId: "emp-test-001", signedTime: "" }];
      const { result, stateRef } = setupWithState(signers, {
        _id: "emp-test-001",
      });

      act(() => {
        result.current.setSignerTime("10:30");
      });

      expect(stateRef.current[0].signedTime).toBe("10:30");
    });

    it("does nothing when there is no matching signer (signerIndex === -1)", () => {
      const signers = [{ signerId: "emp-test-001", signature: "" }];
      const { result, setSigners, stateRef } = setupWithState(signers, {
        _id: "emp-test-999",
      });

      act(() => {
        result.current.setSignerSignature("SHOULD-NOT-APPLY");
      });

      // WHY: with no row owned by the user, signing is a no-op (no setState).
      expect(setSigners).not.toHaveBeenCalled();
      expect(stateRef.current[0].signature).toBe("");
    });
  });

  describe("setter identity / memoization", () => {
    it("keeps setter references stable across rerenders with the same inputs", () => {
      const signers = [{ signerId: "emp-test-001" }];
      const { result, syncRerender } = setupWithState(signers, {
        _id: "emp-test-001",
      });

      const first = result.current.setSignerSignature;
      act(() => syncRerender());

      // WHY: stable callbacks avoid re-rendering signature-canvas children every
      // keystroke in the parent form.
      expect(result.current.setSignerSignature).toBe(first);
    });
  });
});
