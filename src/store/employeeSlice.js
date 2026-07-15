import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    activeEmployee: null,
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setActiveEmployee: (state, action) => {
      state.activeEmployee = action.payload;
    },
  },
});

export const { setEmployees, setActiveEmployee } = employeeSlice.actions;
export const selectEmployees = (state) => state.employee.employees;
export const selectActiveEmployee = (state) => state.employee.activeEmployee;

export default employeeSlice.reducer;
