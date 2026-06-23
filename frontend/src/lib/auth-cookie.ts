// ─────────────────────────────────────────────
// Cookie helpers for Next.js middleware
// ─────────────────────────────────────────────
// The middleware runs on Edge and can only read cookies,
// not localStorage. We mirror auth state to a cookie
// so the middleware can make routing decisions.
// ─────────────────────────────────────────────

export function setAuthCookie(token: string, role: string) {
  const data = JSON.stringify({ token, role });
  // Set cookie accessible to middleware (path=/, no httpOnly so JS can set it)
  document.cookie = `auth_data=${encodeURIComponent(data)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = "auth_data=; path=/; max-age=0; SameSite=Lax";
}
