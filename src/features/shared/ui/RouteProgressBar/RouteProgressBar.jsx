/** @format */

import React from "react";
import "./RouteProgressBar.css";

/**
 * Slim top progress bar shown while lazy route chunks load.
 * Pure CSS — no external dependencies.
 */
const RouteProgressBar = () => (
  <div
    className="route-progress-bar"
    role="progressbar"
    aria-label="Loading page"
  >
    <div className="route-progress-bar__track" />
  </div>
);

export default RouteProgressBar;
