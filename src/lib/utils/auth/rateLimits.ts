const requests = new Map<string, { count: number; start: number }>();

export function isRateLimited(ip: string, limit = 3, windowMs = 3600000) {
  const now = Date.now();
  const user = requests.get(ip) || { count: 0, start: now };

  if (now - user.start > windowMs) {
    user.count = 1;
    user.start = now;
    requests.set(ip, user);
    return false;
  }

  user.count++;
  requests.set(ip, user);

  return user.count > limit;
}
