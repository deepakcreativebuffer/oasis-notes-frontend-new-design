/** @format */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useSignatureManagement } from "./useSignatureManagement";

// NOTE: The hook composes the real useSignatures + useTypedGuard + validators.
// None of those perform IO (no HTTP/sockets) and the guard renders only a
// plain-div SignatureConflictDialog, so we exercise the real implementations.

const render = () => renderHook(() => useSignatureManagement());

describe("useSignatureManagement", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exposes the expected API surface", () => {
    const { result } = render();
    // WHY: forms rely on this exact shape to wire pen + typed signature flows.
    expect(result.current.signatures).toBeTruthy();
    expect(typeof result.current.updateSignature).toBe("function");
    expect(typeof result.current.loadSignaturesFromApi).toBe("function");
    expect(typeof result.current.guardTyped).toBe("function");
    expect(typeof result.current.hasAnyTypedSignature).toBe("function");
    expect(result.current.typedGuardDialog).toBeTruthy();
  });

  it("seeds all five signature roles as empty sections", () => {
    const { result } = render();
    const roles = ["admin", "bhp", "bht", "resident", "witness"];
    // WHY: every signing role must exist up-front so the UI can bind inputs.
    roles.forEach((role) => {
      expect(result.current.signatures[role]).toEqual({
        name: "",
        signature: "",
        date: "",
        time: "",
        rawSignatureImage: "",
      });
    });
  });

  it("updates a single role's section via updateSignature", () => {
    const { result } = render();
    act(() => {
      result.current.updateSignature("bhp", {
        name: "Test Provider",
        rawSignatureImage: "data:image/png;base64,abc",
      });
    });
    expect(result.current.signatures.bhp.name).toBe("Test Provider");
    expect(result.current.signatures.bhp.rawSignatureImage).toBe(
      "data:image/png;base64,abc",
    );
    // WHY: other roles must be untouched by a targeted update.
    expect(result.current.signatures.admin.name).toBe("");
  });

  it("loads signatures from an API payload, filling missing fields", () => {
    const { result } = render();
    act(() => {
      result.current.loadSignaturesFromApi({
        admin: { name: "Admin User", rawSignatureImage: "img" },
      });
    });
    expect(result.current.signatures.admin.name).toBe("Admin User");
    expect(result.current.signatures.admin.rawSignatureImage).toBe("img");
    // WHY: roles absent from the payload still get a fully-shaped empty section.
    expect(result.current.signatures.witness).toEqual({
      name: "",
      signature: "",
      date: "",
      time: "",
      rawSignatureImage: "",
    });
  });

  it("flags witnessIncomplete when a witness signs but has no name", () => {
    const { result } = render();
    act(() => {
      result.current.updateSignature("witness", {
        rawSignatureImage: "data:image/png;base64,xyz",
      });
    });
    // WHY: a witness pen mark without a printed name is an invalid attestation.
    expect(result.current.witnessIncomplete).toBe(true);
  });

  it("clears witnessIncomplete once the witness name is provided", () => {
    const { result } = render();
    act(() => {
      result.current.updateSignature("witness", {
        rawSignatureImage: "data:image/png;base64,xyz",
        name: "Test Witness",
      });
    });
    expect(result.current.witnessIncomplete).toBe(false);
  });

  it("reports allPenSigsHaveNames false when a pen signature lacks a name", () => {
    const { result } = render();
    expect(result.current.allPenSigsHaveNames).toBe(true);
    act(() => {
      result.current.updateSignature("bht", {
        rawSignatureImage: "data:image/png;base64,bht",
      });
    });
    // WHY: a drawn signature with no name fails the print-name requirement.
    expect(result.current.allPenSigsHaveNames).toBe(false);
  });

  it("hasAnyTypedSignature reflects pen signatures and extra typed flags", () => {
    const { result } = render();
    // No signatures and no extra typed flags => false.
    expect(result.current.hasAnyTypedSignature()).toBe(false);
    // Extra typed flag with no pen signature => true.
    expect(
      result.current.hasAnyTypedSignature({ adminSignature: "typed" }),
    ).toBe(true);

    act(() => {
      result.current.updateSignature("resident", {
        rawSignatureImage: "data:image/png;base64,res",
      });
    });
    // WHY: a present pen signature alone should count as a signature.
    expect(result.current.hasAnyTypedSignature()).toBe(true);
  });

  it("guardTyped invokes the provided opener (pass-through while mutex disabled)", () => {
    const { result } = render();
    const open = vi.fn();
    act(() => {
      result.current.guardTyped(open);
    });
    // WHY: the typed-vs-pen mutex is currently disabled, so guardTyped is a
    // pass-through that simply opens the typed flow.
    expect(open).toHaveBeenCalledTimes(1);
  });
});
