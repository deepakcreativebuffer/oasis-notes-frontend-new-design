/** @format */

/**
 * Validates a file based on size and type.
 * @param {File} file - The file to validate.
 * @param {Object} options - Validation options.
 * @param {number} options.maxSizeMB - Maximum size in MB.
 * @param {string[]} options.allowedTypes - Allowed MIME types.
 * @returns {Object} - { isValid, message }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSizeMB = 2,
    allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
  } = options;

  if (!file) return { isValid: false, message: "No file selected." };

  // Check type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  // Check size
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      message: `File size should be less than ${maxSizeMB} MB.`,
    };
  }

  return { isValid: true, message: "File is valid." };
};

/**
 * Standardized allowed types constants
 */
export const ALLOWED_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALL: [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
