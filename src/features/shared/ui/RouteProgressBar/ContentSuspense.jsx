/** @format */

import React, { Suspense } from "react";
import Loader from "../Loader/Loader";

/**
 * Suspense boundary for lazy-loaded route content.
 *
 * This renders the original Loader spinner but scoped to the content area
 * since the layout shell now persists the sidebar and navbar.
 */
const ContentSuspense = ({ children }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

export default ContentSuspense;
