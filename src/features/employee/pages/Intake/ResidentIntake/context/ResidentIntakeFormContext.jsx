/** @format */

import React, { createContext, useContext } from "react";

const ResidentIntakeFormContext = createContext(null);

export const ResidentIntakeFormProvider = ({ value, children }) => (
  <ResidentIntakeFormContext.Provider value={value}>
    {children}
  </ResidentIntakeFormContext.Provider>
);

export const useResidentIntakeFormContext = () => {
  const ctx = useContext(ResidentIntakeFormContext);
  if (!ctx) {
    throw new Error(
      "useResidentIntakeFormContext must be used within ResidentIntakeFormProvider",
    );
  }
  return ctx;
};
