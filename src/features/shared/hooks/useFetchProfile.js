import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isAuthenticated, userProfile } from "@/store/authSlice";
import { ROUTES } from "../constants";
import { refreshSession } from "../services";
import { redirectAuthenticatedUserFromHome } from "@/utils/authRedirect";
import { clearClientPersistence } from "@/store/authStorage";
import { logger } from "@/utils";

const useFetchProfile = (location, navigate) => {
  const [profileData, setProfileData] = useState(null);
  const [checkingRefreshToken, setCheckingRefreshToken] = useState(true);
  const isLoggedIn = useSelector(isAuthenticated);
  const profile = useSelector(userProfile);

  const [hasFetched, setHasFetched] = useState(false);

  // Synchronize Redux authentication state to clear local profile state on logout
  useEffect(() => {
    if (!isLoggedIn && profileData !== null) {
      setProfileData(null);
    }
  }, [isLoggedIn, profileData]);

  useEffect(() => {
    if (hasFetched) return;

    const skipRefresh =
      location.pathname === ROUTES.CHANGE_PASSWORD ||
      location.pathname === ROUTES.UNAUTHORIZED;

    if (skipRefresh) {
      setCheckingRefreshToken(false);
      setHasFetched(true);
      return;
    }

    const checkAndFetchProfile = async () => {
      try {
        const result = await refreshSession();
        const user = result.data?.user || result.data;

        if (!result.success || !user) {
          throw new Error(result.message || "Invalid or expired refresh token");
        }

        const data = {
          profile: {
            data: user,
          },
        };
        setProfileData(data);
        redirectAuthenticatedUserFromHome(
          user?.userType,
          location.pathname,
          navigate,
        );
      } catch (error) {
        logger.warn("Refresh token invalid, clearing local session", {
          error: error.message,
        });
        clearClientPersistence();
        if (location.pathname !== ROUTES.HOME) {
          navigate(ROUTES.HOME, { replace: true });
        }
        setProfileData(null);
      } finally {
        setCheckingRefreshToken(false);
        setHasFetched(true);
      }
    };

    checkAndFetchProfile();
  }, [hasFetched, location.pathname, navigate]);

  // Handle redirect if user navigates back to login page while already authenticated
  useEffect(() => {
    if (
      hasFetched &&
      isLoggedIn &&
      profile?.userType &&
      location.pathname === ROUTES.HOME
    ) {
      redirectAuthenticatedUserFromHome(
        profile.userType,
        location.pathname,
        navigate,
      );
    }
  }, [hasFetched, isLoggedIn, profile, location.pathname, navigate]);

  return {
    profileData,
    checkingRefreshToken,
  };
};

export default useFetchProfile;
