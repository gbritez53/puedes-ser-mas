import { createHash } from 'node:crypto';

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipMap = new Map<string, RateLimitEntry>();

function getLimit(): number {
  const envLimit = import.meta.env.ADMISSION_RATE_LIMIT_PER_HOUR;
  const parsed = parseInt(envLimit as string, 10);
  return isNaN(parsed) ? 5 : parsed;
}

function hashIp(ip: string): string {
  const salt = (import.meta.env.IP_HASH_SALT as string | undefined) ?? 'default-salt';
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}

/**
 * Check if the given IP is rate-limited.
 * Returns true if the request is ALLOWED, false if BLOCKED.
 */
export function checkRateLimit(ip: string): boolean {
  const hashed = hashIp(ip);
  const now = Date.now();
  const limit = getLimit();

  const entry = ipMap.get(hashed);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // New window
    ipMap.set(hashed, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) {
    return false; // blocked
  }

  entry.count += 1;
  return true;
}

// Cleanup old entries periodically to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipMap.entries()) {
    if (now - entry.windowStart >= WINDOW_MS) {
      ipMap.delete(key);
    }
  }
}, WINDOW_MS);
