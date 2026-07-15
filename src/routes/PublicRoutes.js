import { lazyWithRetry } from "./lazyWithRetry";

export const NotFound = lazyWithRetry(
  () => import("@/features/shared/pages/404/NotFound"),
);
export const Login = lazyWithRetry(
  () => import("@/features/shared/pages/Login/Login"),
);
export const UnauthorizedPage = lazyWithRetry(
  () => import("@/features/shared/pages/UnauthorizedPage/UnauthorizedPage"),
);
export const NotesLibrary2 = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/NotesLibrary2"),
);
