/** @format */

import React, { createContext, useContext } from "react";

/**
 * When a persistent AppLayout shell is already rendering the sidebar + navbar,
 * individual page HOCs should skip their own layout and render content only.
 */
const LayoutContext = createContext(false);

/** Returns true when a parent <AppLayout /> is providing the shell. */
export const useHasParentLayout = () => useContext(LayoutContext);

/** Provider that signals "layout shell is already rendered". */
export const LayoutProvider = ({ children }) => (
  <LayoutContext.Provider value={true}>{children}</LayoutContext.Provider>
);
