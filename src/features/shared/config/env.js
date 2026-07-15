import { logger } from "@/utils";
/**
 * Centralized and secure environment configuration.
 * Validates required environment variables at runtime.
 *
 * @format
 */

const getEnvVar = (value, name, defaultValue = undefined, required = true) => {
  if (value === undefined || value === "") {
    if (required) {
      const errorMsg = `Missing required environment variable: ${name}`;
      if (import.meta.env.MODE === "development") {
        throw new Error(errorMsg);
      } else {
        logger.warn(errorMsg);
      }
    }
    return defaultValue;
  }
  return value;
};
const getEnvFallbacks = () => {
  const hostname = window.location.hostname || "";

  // 1. Localhost Development Environment
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return {
      BASE_URL: "http://localhost:4002/api/v1/",
      SOCKET_URL: "http://localhost:4002/",
      CLOUDFRONT_URL: "https://d2u4q4ytylw93t.cloudfront.net/",
    };
  }

  // 2. Staging / Test Environment
  if (
    hostname.includes("dev") ||
    hostname.includes("staging") ||
    hostname.includes("test")
  ) {
    return {
      BASE_URL: "https://dev.api.oasisnotes.com/api/v1/",
      SOCKET_URL: "https://dev.api.oasisnotes.com/",
      CLOUDFRONT_URL: "https://d2u4q4ytylw93t.cloudfront.net/",
    };
  }

  // 3. Main Production Environment
  return {
    // Assuming api.oasisnotes.com is your production URL
    BASE_URL: "https://api.oasisnotes.com/api/v1/",
    SOCKET_URL: "https://api.oasisnotes.com/",
    CLOUDFRONT_URL: "https://d2u4q4ytylw93t.cloudfront.net/",
  };
};

const fallbacks = getEnvFallbacks();

export const ENV = {
  NODE_ENV: import.meta.env.MODE || "development",
  BASE_URL: getEnvVar(
    import.meta.env.REACT_APP_BASE_URL,
    "REACT_APP_BASE_URL",
    fallbacks.BASE_URL,
  ),
  SOCKET_URL: getEnvVar(
    import.meta.env.REACT_APP_SOCKET_URL,
    "REACT_APP_SOCKET_URL",
    fallbacks.SOCKET_URL,
  ),
  CLOUDFRONT_URL: getEnvVar(
    import.meta.env.REACT_APP_CLOUDFRONT_URL,
    "REACT_APP_CLOUDFRONT_URL",
    fallbacks.CLOUDFRONT_URL,
  ),
};

// Validate critical configuration on startup
if (ENV.NODE_ENV === "development") {
  if (!ENV.BASE_URL)
    logger.error("REACT_APP_BASE_URL is missing in environment configuration");
  if (!ENV.SOCKET_URL)
    logger.error(
      "REACT_APP_SOCKET_URL is missing in environment configuration",
    );
  if (!ENV.CLOUDFRONT_URL)
    logger.error(
      "REACT_APP_CLOUDFRONT_URL is missing in environment configuration",
    );
}
export default ENV;
