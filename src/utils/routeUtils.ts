/**
 * Reject dynamic segments that look like static assets (e.g. installHook.js.map
 * wrongly requested under /profile/...), so we don't run auth-heavy pages for them.
 */
const FILE_LIKE_SUFFIX =
  /\.(map|js|mjs|cjs|jsx|ts|tsx|json|css|html?|svg|png|jpe?g|gif|webp|ico|woff2?|txt|xml)$/i;

export function isPlausibleProfileUsername(username: string): boolean {
  const u = username.trim();
  if (!u) return false;
  if (u.includes("/")) return false;
  if (FILE_LIKE_SUFFIX.test(u)) return false;
  return true;
}
