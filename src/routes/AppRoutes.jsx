import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "@/features/shared/features/auth/ChangePassword";
import Profile from "@/features/employee/pages/Profile/Profile";
import {
  NotFound,
  Login,
  UnauthorizedPage,
  NotesLibrary2,
} from "./PublicRoutes";
import { adminRoutes, employeeRoutes, residentRoutes } from "./index";
import {
  ALLOWED_ROLES_BY_PANEL,
  ROUTE_PANELS,
} from "@/features/shared/permissions/panelBoundaries";
import ContentSuspense from "@/features/shared/ui/RouteProgressBar/ContentSuspense";
import AppLayout from "@/features/shared/layout/AppLayout/AppLayout";

const AppRoutes = ({ profile }) => {
  const dynamicAdminRoutes = useMemo(() => {
    const routes = [...adminRoutes];
    if (profile?.tier === "Growth" || profile?.permissionNoteLibrary === true) {
      routes.push({
        path: "/dashboard/notes",
        element: <NotesLibrary2 />,
      });
    }
    return routes;
  }, [profile?.tier, profile?.permissionNoteLibrary]);

  return (
    <Routes>
      {/* ─── Public Routes (no layout shell) ─────────────────────── */}
      <Route path="/" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* ─── Authenticated Routes (single persistent sidebar + navbar) ─── */}
      <Route element={<AppLayout />}>
        {/* Admin panel routes */}
        <Route
          element={
            <ContentSuspense>
              <ProtectedRoute
                allowedRoles={ALLOWED_ROLES_BY_PANEL[ROUTE_PANELS.ADMIN]}
              />
            </ContentSuspense>
          }
        >
          {dynamicAdminRoutes.map(({ path, element }, i) => (
            <Route key={`admin-${i}`} path={path} element={element} />
          ))}
        </Route>

        {/* Employee panel routes */}
        <Route
          element={
            <ContentSuspense>
              <ProtectedRoute
                allowedRoles={ALLOWED_ROLES_BY_PANEL[ROUTE_PANELS.EMPLOYEE]}
              />
            </ContentSuspense>
          }
        >
          {employeeRoutes.map(({ path, element }, i) => (
            <Route key={`employee-${i}`} path={path} element={element} />
          ))}
        </Route>

        {/* Resident panel routes */}
        <Route
          element={
            <ContentSuspense>
              <ProtectedRoute
                allowedRoles={ALLOWED_ROLES_BY_PANEL[ROUTE_PANELS.RESIDENT]}
              />
            </ContentSuspense>
          }
        >
          {residentRoutes.map(({ path, element }, i) => (
            <Route key={`resident-${i}`} path={path} element={element} />
          ))}
        </Route>

        {/* Profile route */}
        <Route
          element={
            <ContentSuspense>
              <ProtectedRoute
                allowedRoles={ALLOWED_ROLES_BY_PANEL[ROUTE_PANELS.PROFILE]}
              />
            </ContentSuspense>
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Unauthorized (inside layout but no role check) */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route
        path="*"
        element={
          <ContentSuspense>
            <NotFound />
          </ContentSuspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
