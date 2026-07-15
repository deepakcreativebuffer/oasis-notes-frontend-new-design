/* eslint-disable no-unused-vars */
/** @format */
import React, { Suspense, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import "@/assets/styles/Print.css";

import Loader from "@/features/shared/ui/Loader/Loader";
import { userProfile, LoginSlice, isAuthenticated } from "./store/authSlice";
import { applyActiveOrganization } from "./utils/applyActiveOrganization";
import { pickActiveOrganizationId } from "./utils/organizationContext";
import AppRoutes from "@/routes/AppRoutes";
import { useFetchProfile } from "@shared/hooks";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query";
import { ErrorFallback } from "./utils/ErrorFallBack";
import NetworkStatus from "@/features/shared/ui/common/NetworkStatus";
import { ModalProvider } from "@/features/shared/contexts/ModalContext";
import { clearLegacyAuthStorage } from "./store/authStorage";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useSelector(userProfile);
  const isLoggedIn = useSelector(isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    clearLegacyAuthStorage();
  }, []);

  useEffect(() => {
    // Clear React Query error cache on route changes so a subsequent visit forces a fresh fetch
    queryClient.resetQueries({ status: "error" });
  }, [location.pathname, queryClient]);

  const { profileData, checkingRefreshToken } = useFetchProfile(
    location,
    navigate,
  );

  useEffect(() => {
    if (checkingRefreshToken) return;
    if (!profileData) return;
    dispatch(LoginSlice(profileData));
    const user = profileData.profile?.data;
    const activeOrgId = pickActiveOrganizationId(user);
    if (activeOrgId) {
      applyActiveOrganization(dispatch, user, activeOrgId);
    }
  }, [checkingRefreshToken, dispatch, profileData]);

  /** Wait for Redux hydration after refresh before showing routes (avoids blank ProtectedRoute).
   *  Also allow rendering when user is logged out so the login page can display. */
  const sessionHydrated =
    !checkingRefreshToken &&
    (!profileData || Boolean(profile?._id) || !isLoggedIn);

  const hasProfileId = Boolean(profile?._id);
  const hasTrackingFunction = typeof window.s247r === "function";

  useEffect(() => {
    if (!hasProfileId || !hasTrackingFunction) return;

    const displayName = [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .join(" ");

    window.s247r("userId", displayName || profile._id);
  }, [profile, hasProfileId, hasTrackingFunction]);

  return (
    <ModalProvider>
      <NetworkStatus />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={reset}
            resetKeys={[location.pathname]}
          >
            <Suspense fallback={<Loader />}>
              {!sessionHydrated ? <Loader /> : <AppRoutes profile={profile} />}
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </ModalProvider>
  );
}

export default App;
