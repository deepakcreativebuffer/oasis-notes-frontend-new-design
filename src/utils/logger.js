/** @format */

/**
 * Centralized Logger
 *
 * Rules:
 * 1. structured logs
 * 2. console.error only in development (or if explicitly enabled)
 * 3. includes endpoint, payload, status, stack trace, timestamp
 */

const isDev = import.meta.env.MODE === "development";

const logger = {
  info: (message, context = {}) => {
    if (isDev) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, context);
    }
  },

  warn: (message, context = {}) => {
    if (isDev) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, context);
    }
  },

  error: (message, error = null, context = {}) => {
    const errorLog = {
      message,
      timestamp: new Date().toISOString(),
      status: error?.response?.status || error?.status || "UNKNOWN",
      endpoint: context?.endpoint || error?.config?.url || "UNKNOWN",
      payload: context?.payload || error?.config?.data || null,
      stack: error?.stack || new Error().stack,
      context,
    };

    if (isDev) {
      console.error(`[ERROR] ${errorLog.timestamp}: ${message}`, errorLog);
    }

    // Future: send to Sentry, LogRocket, or Backend logging service
    // if (!isDev) { ... }
  },

  debug: (message, context = {}) => {
    if (isDev) {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, context);
    }
  },
};

export default logger;
