export interface CachedItem<T> {
  data: T;
  expiry: number;
}

export const CACHE_KEY_SUPER_MATCHES = "superMatches";
export const CACHE_DURATION_MS = 60_000;

export function setCachedData<T>(key: string, data: T, ttlMs: number = CACHE_DURATION_MS): void {
  const expiry = Date.now() + ttlMs;
  const item: CachedItem<T> = { data, expiry };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCachedData<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item: CachedItem<T> = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function clearCachedData(key: string): void {
  localStorage.removeItem(key);
}

export function cleanupExpiredCache(key: string): void {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return;
  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
}
