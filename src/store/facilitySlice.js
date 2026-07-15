import { createSlice } from "@reduxjs/toolkit";

const facilitySlice = createSlice({
  name: "facility",
  initialState: {
    selectedFacilityId: null,
    selectedFacility: null,
    facilities: [],
  },
  reducers: {
    setSelectedFacilityId: (state, action) => {
      state.selectedFacilityId = action.payload;
    },
    setSelectedFacility: (state, action) => {
      state.selectedFacility = action.payload;
    },
    setFacilities: (state, action) => {
      state.facilities = action.payload;
    },
  },
});

export const { setSelectedFacilityId, setSelectedFacility, setFacilities } =
  facilitySlice.actions;
export const selectSelectedFacilityId = (state) =>
  state.facility.selectedFacilityId;
export const selectSelectedFacility = (state) =>
  state.facility.selectedFacility;
export const selectFacilities = (state) => state.facility.facilities;

export default facilitySlice.reducer;
