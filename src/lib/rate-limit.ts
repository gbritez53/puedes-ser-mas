import { createHash } from 'node:crypto';

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipMap = new Map<string, RateLimitEntry>();

// Cada scope tiene su propio balde: /api/diagnostico hace 2 requests por intento
// completo (checkpoint + resultado), así que comparte límite con /api/admission
// lo agotaba después de 2-3 intentos.
const DEFAULT_LIMITS: Record<string, number> = {
  admission: 5,
  diagnostico: 20,
};

function getLimit(scope: string): number {
  const envKey = `${scope.toUpperCase()}_RATE_LIMIT_PER_HOUR`;
  const envLimit = (import.meta.env as Record<string, string | undefined>)[envKey];
  const parsed = parseInt(envLimit ?? '', 10);
  return isNaN(parsed) ? (DEFAULT_LIMITS[scope] ?? 5) : parsed;
}

function hashIp(ip: string): string {
  const salt = (import.meta.env.IP_HASH_SALT as string | undefined) ?? 'default-salt';
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}

/**
 * Check if the given IP is rate-limited for a given scope (ej. "admission", "diagnostico").
 * Cada scope lleva su propio contador, para que un flujo con varias requests por intento
 * no agote el límite de otro. Returns true if the request is ALLOWED, false if BLOCKED.
 */
export function checkRateLimit(ip: string, scope: string): boolean {
  const key = `${scope}:${hashIp(ip)}`;
  const now = Date.now();
  const limit = getLimit(scope);

  const entry = ipMap.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // New window
    ipMap.set(key, { count: 1, windowStart: now });
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
