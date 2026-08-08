import { lazy } from 'react';
import { isChunkLoadError, reloadForStaleChunk } from './chunkRecovery';

export function lazyWithRetry(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      if (isChunkLoadError(error) && reloadForStaleChunk('lazy import')) {
        return new Promise(() => {});
      }

      throw error;
    }),
  );
}
