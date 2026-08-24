type Bucket = Map<string, number[]>;

const globalForLimit = globalThis as typeof globalThis & {
  __katanicRateLimit?: Bucket;
};

const store: Bucket = globalForLimit.__katanicRateLimit ?? new Map();
globalForLimit.__katanicRateLimit = store;

/**
 * Best-effort in-process limiter. On Vercel this is per-instance; WAF rules
 * provide the platform-level limit after deploy.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const previous = store.get(key) ?? [];
  const fresh = previous.filter((stamp) => now - stamp < windowMs);
  if (fresh.length >= limit) {
    store.set(key, fresh);
    return false;
  }
  fresh.push(now);
  store.set(key, fresh);
  return true;
}
