/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./authSlice";

const emptySlot = () => ({
  staffLabel: "",
  signedData: "",
  signedDate: "",
  signedTime: "",
});

const initialState = {
  primary: emptySlot(),
  secondary: emptySlot(),
};

const signatureDraftSlice = createSlice({
  name: "signatureDraft",
  initialState,
  reducers: {
    setPrimarySignatureDraft: (state, action) => {
      state.primary = { ...emptySlot(), ...action.payload };
    },
    setSecondarySignatureDraft: (state, action) => {
      state.secondary = { ...emptySlot(), ...action.payload };
    },
    clearPrimarySignatureDraft: (state) => {
      state.primary = emptySlot();
    },
    clearSecondarySignatureDraft: (state) => {
      state.secondary = emptySlot();
    },
    clearAllSignatureDrafts: (state) => {
      state.primary = emptySlot();
      state.secondary = emptySlot();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGOUT, (state) => {
      state.primary = emptySlot();
      state.secondary = emptySlot();
    });
  },
});

export const {
  setPrimarySignatureDraft,
  setSecondarySignatureDraft,
  clearPrimarySignatureDraft,
  clearSecondarySignatureDraft,
  clearAllSignatureDrafts,
} = signatureDraftSlice.actions;

export const selectPrimarySignatureDraft = (state) =>
  state.signatureDraft.primary;
export const selectSecondarySignatureDraft = (state) =>
  state.signatureDraft.secondary;

/** Apply refrigerator/water-style saved* fields from primary draft. */
export function applySavedSignatureFields(target, draft) {
  if (!draft?.signedData && !draft?.signedDate && !draft?.signedTime) return;
  if (draft.signedData) target.savedSigned = draft.signedData;
  if (draft.signedDate) target.savedDate = draft.signedDate;
  if (draft.signedTime) target.savedTime = draft.signedTime;
}

export default signatureDraftSlice.reducer;
