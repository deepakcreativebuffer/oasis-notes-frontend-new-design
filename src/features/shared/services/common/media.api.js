/** @format */

import ENV from "../../config/env";
import { logger } from "@/utils";

/**
 * Build a CloudFront URL for a stored download path.
 * Replaces legacy admin/MainComponent/Api.js getObjectUrlFromDownloadUrl.
 */
export function getObjectUrlFromDownloadUrl(downloadUrl) {
  try {
    if (!downloadUrl) return null;
    const cloudfrontUrl = ENV.CLOUDFRONT_URL;
    return encodeURI(`${cloudfrontUrl}${downloadUrl}`);
  } catch (error) {
    logger.error("Error creating object URL", error);
    return null;
  }
}
