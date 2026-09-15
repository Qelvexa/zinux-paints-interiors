/**
 * Cache synchronization and cache invalidation utility.
 * Guarantees that public pages always fetch the latest persisted Supabase content
 * and never render stale cached data or images.
 */

const SYNC_CHANNEL_NAME = 'zinux_content_sync_v2';
const STORAGE_KEY = 'zinux_last_content_mutation';

export function broadcastContentUpdate(scope = 'all') {
  const timestamp = Date.now().toString();
  try {
    localStorage.setItem(STORAGE_KEY, timestamp);
  } catch {
    void 0;
  }

  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ type: 'CONTENT_UPDATED', scope, timestamp });
      channel.close();
    }
  } catch {
    void 0;
  }

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zinux_content_updated', { detail: { scope, timestamp } }));
    }
  } catch {
    void 0;
  }
}

export function subscribeToContentUpdates(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = () => {
        onUpdate();
      };
    }
  } catch {
    void 0;
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      onUpdate();
    }
  };

  const handleCustomEvent = () => {
    onUpdate();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onUpdate();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('zinux_content_updated', handleCustomEvent);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', onUpdate);

  return () => {
    try {
      channel?.close();
    } catch {
      void 0;
    }
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('zinux_content_updated', handleCustomEvent);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', onUpdate);
  };
}

/**
 * Perform a fresh fetch with cache-busting headers to prevent stale CDN or browser cache
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const separator = url.includes('?') ? '&' : '?';
  const freshUrl = `${url}${separator}_t=${Date.now()}`;

  const headers = new Headers(options.headers || {});
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  return fetch(freshUrl, {
    ...options,
    cache: 'no-store',
    headers,
  });
}

/**
 * Ensures media URLs from Supabase Storage never get stuck in browser image cache
 */
export function freshImageUrl(url: string | null | undefined, fallback = '', version?: string | number): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const cleanUrl = url.trim();

  // If already has query cache-buster, return clean
  if (cleanUrl.includes('?v=') || cleanUrl.includes('&v=')) {
    return cleanUrl;
  }

  // If local static asset in public/images, return directly unless version is provided
  if (cleanUrl.startsWith('/images/') && !version) {
    return cleanUrl;
  }

  // For Supabase storage URLs or external assets, append version
  const vParam = version ? encodeURIComponent(String(version)) : Date.now();
  const separator = cleanUrl.includes('?') ? '&' : '?';
  return `${cleanUrl}${separator}v=${vParam}`;
}
