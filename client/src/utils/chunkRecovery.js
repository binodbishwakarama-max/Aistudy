const CHUNK_RELOAD_KEY = 'mindflow-chunk-reload';

export function isChunkLoadError(error) {
  const message = String(error?.message || error || '');

  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
  );
}

export function reloadForStaleChunk(reason) {
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    return false;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
  console.warn('[MindFlow] Stale deployment asset detected, reloading once…', reason);
  window.location.reload();
  return true;
}

export function markChunkRecoverySuccess() {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
}

export function setupChunkRecovery() {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadForStaleChunk('vite:preloadError');
  });

  let refreshing = false;
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
