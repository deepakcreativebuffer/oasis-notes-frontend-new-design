import { createSlice } from "@reduxjs/toolkit";

const residentSlice = createSlice({
  name: "resident",
  initialState: {
    residents: [],
    activeResident: null,
  },
  reducers: {
    setResidents: (state, action) => {
      state.residents = action.payload;
    },
    setActiveResident: (state, action) => {
      state.activeResident = action.payload;
    },
  },
});

export const { setResidents, setActiveResident } = residentSlice.actions;
export const selectResidents = (state) => state.resident.residents;
export const selectActiveResident = (state) => state.resident.activeResident;

export default residentSlice.reducer;
