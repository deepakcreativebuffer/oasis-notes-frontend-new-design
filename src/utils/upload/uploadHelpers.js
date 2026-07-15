/** @format */

/**
 * Creates a FormData object from a key and a file/set of files.
 * @param {string} key - The key for the file in FormData (e.g., 'image' or 'file').
 * @param {File | File[]} files - The file(s) to append.
 * @param {Object} [additionalData] - Other fields to append to FormData.
 * @returns {FormData}
 */
export const createFormData = (key, files, additionalData = {}) => {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((file) => formData.append(key, file));
  } else {
    formData.append(key, files);
  }

  Object.keys(additionalData).forEach((k) => {
    if (additionalData[k] !== undefined && additionalData[k] !== null) {
      formData.append(k, additionalData[k]);
    }
  });

  return formData;
};

/**
 * Creates a temporary preview URL for a file.
 * @param {File} file
 * @returns {string}
 */
export const getFilePreview = (file) => {
  if (!file) return "";
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to free up memory.
 * @param {string} url
 */
export const revokeFilePreview = (url) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};
