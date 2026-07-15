/** @format */

import { useLocation, useNavigate } from "react-router-dom";

/**
 * Navigate while preserving current query string (e.g. employment application flow).
 */
export default function useNavigateWithParams() {
  const location = useLocation();
  const searchParams = location.search;
  const navigate = useNavigate();
  const navigateWithParams = (url) => navigate(`${url}${searchParams}`);

  return { navigateWithParams, searchParams };
}
