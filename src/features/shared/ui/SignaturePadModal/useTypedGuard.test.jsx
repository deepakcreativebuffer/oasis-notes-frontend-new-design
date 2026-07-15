/** @format */

import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypedGuard } from "./useTypedGuard";

describe("useTypedGuard", () => {
  describe("hasAnyPenOrPanel", () => {
    it("should be false when no role has a pen image or typed name", () => {
      const { result } = renderHook(() =>
        useTypedGuard({
          signatures: { admin: {}, bhp: {} },
          updateSignature: vi.fn(),
        }),
      );
      expect(result.current.hasAnyPenOrPanel).toBe(false);
    });

    it("should be true when any role has a raw pen signature", () => {
      const { result } = renderHook(() =>
        useTypedGuard({
          signatures: {
            bht: { rawSignatureImage: "data:image/png;base64,xx" },
          },
          updateSignature: vi.fn(),
        }),
      );
      // WHY: the guard tracks whether any pen/panel signature exists so the form
      // knows a typed-vs-pen conflict is possible.
      expect(result.current.hasAnyPenOrPanel).toBe(true);
    });

    it("should be true when any role has a typed name", () => {
      const { result } = renderHook(() =>
        useTypedGuard({
          signatures: { resident: { name: "Test Signer" } },
          updateSignature: vi.fn(),
        }),
      );
      expect(result.current.hasAnyPenOrPanel).toBe(true);
    });

    it("should be false when signatures is undefined", () => {
      const { result } = renderHook(() =>
        useTypedGuard({ signatures: undefined, updateSignature: vi.fn() }),
      );
      expect(result.current.hasAnyPenOrPanel).toBe(false);
    });
  });

  describe("guardTyped", () => {
    it("should invoke the open callback (mutex currently disabled, pass-through)", () => {
      const { result } = renderHook(() =>
        useTypedGuard({
          signatures: { admin: { name: "Test" } },
          updateSignature: vi.fn(),
        }),
      );
      const openTyped = vi.fn();
      act(() => {
        result.current.guardTyped(openTyped);
      });
      expect(openTyped).toHaveBeenCalledTimes(1);
    });
  });

  it("should expose a dialog element to render once in the form", () => {
    const { result } = renderHook(() =>
      useTypedGuard({ signatures: {}, updateSignature: vi.fn() }),
    );
    expect(result.current.dialog).toBeTruthy();
  });
});
