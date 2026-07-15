/** @format */

/**
 * Builds a URL query string from a params object.
 * Skips null, undefined, and empty-string values.
 */
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

/**
 * Appends pagination and search params to a base path.
 */
export const withPagination = (
  basePath,
  { page, limit, search, ...rest } = {},
) => {
  const query = buildQueryString({ page, limit, search, ...rest });
  return `${basePath}${query}`;
};

/**
 * Joins path segments safely, avoiding duplicate slashes.
 */
export const joinPath = (...segments) =>
  segments
    .filter(Boolean)
    .map((segment, index) => {
      const value = String(segment);
      if (index === 0) return value.replace(/\/+$/, "");
      return value.replace(/^\/+|\/+$/g, "");
    })
    .join("/");
