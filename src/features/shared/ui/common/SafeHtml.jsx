import React, { memo } from "react";
import { sanitizeHtml } from "@/utils/security/sanitizeHtml";

/**
 * Reusable wrapper component to securely render raw HTML strings.
 */
export const SafeHtml = memo(
  ({ html = "", className = "", as: Tag = "div", ...props }) => {
    return (
      <Tag
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        {...props}
      />
    );
  },
);

export default SafeHtml;
