import DOMPurify from "dompurify";

/**
 * Safely sanitizes HTML content to prevent XSS attacks.
 * @param {string} html - Raw HTML content.
 * @returns {string} Sanitized safe HTML content.
 */
export const sanitizeHtml = (html) => {
  if (html === null || html === undefined) {
    return "";
  }
  if (typeof html !== "string") {
    return "";
  }
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
};
