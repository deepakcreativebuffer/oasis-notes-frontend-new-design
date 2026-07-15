import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LoginSlice, userProfile, isAuthenticated } from "@/store/authSlice";
import { selectCurrentOrgId } from "@/store/organizationSlice";
import { useEffect, useRef, useState } from "react";
import { getProfileByUserType } from "@/features/shared/services";
import { PageLoader } from "@/features/shared/ui/Loader/Loaders";
import { ROUTES, ROLES } from "@/features/shared/constants";
import { redirectAuthenticatedUserFromHome } from "@/utils/authRedirect";
import { showNotification, logger } from "@/utils";
const useTitle = (title) => {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(
    documentDefined ? document.title : "OASIS NOTES",
  );
  useEffect(() => {
    if (!documentDefined) return;
    const newTitle = title || "OASIS NOTES";
    if (document.title !== newTitle) {
      document.title = newTitle;
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.title = originalTitle.current;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);
};
const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const isLoggedIn = useSelector(isAuthenticated);
  const location = useLocation();
  const profile = useSelector(userProfile);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const userType = profile?.userType;
  const orgId = useSelector(selectCurrentOrgId);

  const getDocumentTitle = () => {
    if (!profile) return null;
    if (userType === ROLES.ADMIN) {
      return profile.companyName;
    } else if (userType === ROLES.EMPLOYEE) {
      const activeOrg = profile.organizations?.find((org) => org._id === orgId);
      return activeOrg?.companyName || profile.adminId?.companyName;
    }
    return profile.adminId?.companyName;
  };

  useTitle(getDocumentTitle());
  useEffect(() => {
    let intervalId;
    const fetchProfile = async (showLoading = false) => {
      if (!userType) {
        if (showLoading) setLoading(false);
        return;
      }
      if (showLoading) setLoading(true);
      try {
        const result = await getProfileByUserType(userType);
        if (!result.success) {
          throw result;
        }
        const data = {
          profile: {
            data: result.data,
          },
        };
        setResponse(data);
        const existingProfile = profileRef.current;
        const hasChanged =
          JSON.stringify(existingProfile) !== JSON.stringify(result.data);
        if (hasChanged) {
          dispatch(LoginSlice(data));
        }
      } catch (e) {
        setResponse(
          e?.data || {
            message: e.message,
            success: false,
          },
        );
        logger.error("Failed to fetch profile in ProtectedRoute", e, {
          userType,
        });
      } finally {
        if (showLoading) setLoading(false);
      }
    };
    if (userType) {
      fetchProfile(true);
      // Poll every 40 seconds to keep permissions up to date
      intervalId = setInterval(() => fetchProfile(false), 40000);
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch, userType, orgId]);
  useEffect(() => {
    if (loading) return;
    if (
      response?.message ===
      "Your account has been temporarily suspended. Kindly, contact your admin."
    ) {
      navigate(ROUTES.HOME);
      showNotification({ message: response?.message, type: "danger" });
    } else if (isLoggedIn && location.pathname === ROUTES.HOME) {
      redirectAuthenticatedUserFromHome(userType, location.pathname, navigate);
    }
  }, [loading, response, isLoggedIn, navigate, location.pathname, userType]);
  if (loading) {
    return <PageLoader />;
  }
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  if (
    response?.message ===
    "Your account has been temporarily suspended. Kindly, contact your admin."
  ) {
    return <Navigate to="/" />;
  }
  const roleAllowed =
    Array.isArray(allowedRoles) && allowedRoles.includes(userType);
  if (!roleAllowed && location.pathname !== ROUTES.CHANGE_PASSWORD) {
    return <Navigate to="/unauthorized" />;
  }
  return Component ? Component : <Outlet />;
};
export default ProtectedRoute;
