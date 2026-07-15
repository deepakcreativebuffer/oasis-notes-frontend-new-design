import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT, isAuthenticated } from "@/store/authSlice";
import { ROUTES } from "../constants";
import { logger } from "@/utils";
// HIPAA Compliance standard: 15 minutes session inactivity timeout
const DEFAULT_TIMEOUT = 15 * 60 * 1000;
export const useInactivityTimeout = (timeoutMs = DEFAULT_TIMEOUT) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector(isAuthenticated);
  const timerRef = useRef(null);
  useEffect(() => {
    const logoutUser = () => {
      if (authenticated) {
        logger.info(
          "Session expired due to inactivity. Logging out for HIPAA compliance.",
        );
        dispatch(LOGOUT());
        navigate(ROUTES.HOME);
        window.location.replace("/");
      }
    };
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (authenticated) {
        timerRef.current = setTimeout(logoutUser, timeoutMs);
      }
    };
    if (!authenticated) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Initialize timer
    resetTimer();

    // Attach interaction listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [authenticated, timeoutMs, dispatch, navigate]);
};
export default useInactivityTimeout;
