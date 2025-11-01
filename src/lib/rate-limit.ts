// lib/rate-limit.ts
const rateMap = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests/minute per user

export async function rateLimit(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = ip;

  const current = rateMap.get(key);
  const now = Date.now();

  if (!current) {
    rateMap.set(key, { count: 1, lastRequest: now });
    return { ok: true };
  }

  if (now - current.lastRequest < RATE_LIMIT_WINDOW) {
    if (current.count >= RATE_LIMIT_MAX) {
      return { ok: false };
    }
    current.count++;
  } else {
    // Reset window
    rateMap.set(key, { count: 1, lastRequest: now });
  }

  return { ok: true };
}
