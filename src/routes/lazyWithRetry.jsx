import { lazy } from "react";

const CHUNK_RETRY_DELAY_MS = 1500;
const CHUNK_RETRY_COUNT = 3;

const isChunkLoadError = (error) =>
  error?.name === "ChunkLoadError" ||
  /Loading chunk [\w-]+ failed/i.test(error?.message || "") ||
  /Failed to fetch dynamically imported module/i.test(error?.message || "");

const loadWithRetry = async (importFunc, attempt = 0) => {
  try {
    return await importFunc();
  } catch (error) {
    if (!isChunkLoadError(error) || attempt >= CHUNK_RETRY_COUNT - 1) {
      if (isChunkLoadError(error)) {
        window.location.reload();
      }
      throw error;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, CHUNK_RETRY_DELAY_MS * (attempt + 1)),
    );
    return loadWithRetry(importFunc, attempt + 1);
  }
};

export const lazyWithRetry = (importFunc) =>
  lazy(() => loadWithRetry(importFunc));
