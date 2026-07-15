/** @format */

import { describe, it, expect, vi } from "vitest";

import reducer, {
  setPrimarySignatureDraft,
  setSecondarySignatureDraft,
  clearPrimarySignatureDraft,
  clearSecondarySignatureDraft,
  clearAllSignatureDrafts,
  selectPrimarySignatureDraft,
  selectSecondarySignatureDraft,
  applySavedSignatureFields,
} from "./signatureDraftSlice";
import { LOGOUT } from "./authSlice";

// LOGOUT action creator is used to drive extraReducers; mock storage so the
// auth module import stays side-effect free.
vi.mock("./authStorage", () => ({
  clearClientPersistence: vi.fn(),
  clearLegacyAuthStorage: vi.fn(),
}));

const EMPTY = {
  staffLabel: "",
  signedData: "",
  signedDate: "",
  signedTime: "",
};
const INITIAL = { primary: EMPTY, secondary: EMPTY };

describe("signatureDraftSlice", () => {
  it("should return the initial state with two empty slots", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  describe("setting drafts", () => {
    it("should fill missing fields from the empty slot when setting the primary draft", () => {
      const state = reducer(
        INITIAL,
        setPrimarySignatureDraft({ signedData: "Test_Staff" }),
      );
      // WHY: a partial draft is normalized to a full slot shape so consumers
      // never read undefined signature fields.
      expect(state.primary).toEqual({
        staffLabel: "",
        signedData: "Test_Staff",
        signedDate: "",
        signedTime: "",
      });
    });

    it("should set the secondary draft independently of the primary", () => {
      const state = reducer(
        INITIAL,
        setSecondarySignatureDraft({ signedData: "Test_Cosigner" }),
      );
      expect(state.secondary.signedData).toBe("Test_Cosigner");
      expect(state.primary).toEqual(EMPTY);
    });
  });

  describe("clearing drafts", () => {
    const filled = {
      primary: { ...EMPTY, signedData: "Test_A" },
      secondary: { ...EMPTY, signedData: "Test_B" },
    };

    it("should clear only the primary draft", () => {
      const state = reducer(filled, clearPrimarySignatureDraft());
      expect(state.primary).toEqual(EMPTY);
      expect(state.secondary.signedData).toBe("Test_B");
    });

    it("should clear only the secondary draft", () => {
      const state = reducer(filled, clearSecondarySignatureDraft());
      expect(state.secondary).toEqual(EMPTY);
      expect(state.primary.signedData).toBe("Test_A");
    });

    it("should clear both drafts at once", () => {
      const state = reducer(filled, clearAllSignatureDrafts());
      expect(state).toEqual(INITIAL);
    });

    it("should clear both drafts on logout", () => {
      const state = reducer(filled, LOGOUT());
      // WHY: an unsubmitted signature is the signer's identity attestation; it
      // must never persist into another user's session after logout.
      expect(state).toEqual(INITIAL);
    });
  });

  describe("selectors", () => {
    it("should select the primary and secondary drafts", () => {
      const root = {
        signatureDraft: {
          primary: { ...EMPTY, signedData: "P" },
          secondary: { ...EMPTY, signedData: "S" },
        },
      };
      expect(selectPrimarySignatureDraft(root).signedData).toBe("P");
      expect(selectSecondarySignatureDraft(root).signedData).toBe("S");
    });
  });

  describe("applySavedSignatureFields helper", () => {
    it("should copy signed fields from the draft onto the target", () => {
      const target = {};
      applySavedSignatureFields(target, {
        signedData: "Test_Staff",
        signedDate: "01-01-1990",
        signedTime: "10:00:00",
      });
      expect(target).toEqual({
        savedSigned: "Test_Staff",
        savedDate: "01-01-1990",
        savedTime: "10:00:00",
      });
    });

    it("should leave the target untouched when the draft is empty", () => {
      const target = {};
      applySavedSignatureFields(target, EMPTY);
      expect(target).toEqual({});
    });

    it("should only copy the fields that are present", () => {
      const target = {};
      applySavedSignatureFields(target, { signedData: "Test_Staff" });
      expect(target).toEqual({ savedSigned: "Test_Staff" });
    });
  });
});
