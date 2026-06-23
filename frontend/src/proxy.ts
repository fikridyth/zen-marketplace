import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────
// Route Protection via Next.js Middleware
// ─────────────────────────────────────────────
// We read a lightweight cookie/localStorage proxy.
// Since middleware runs on Edge, we can't access
// localStorage directly. Instead, we use a cookie
// that mirrors the auth state.
// ─────────────────────────────────────────────

// Routes that require authentication
const protectedRoutes = ["/cart", "/admin"];

// Routes only for sellers
const sellerRoutes = ["/admin"];

// Routes only for guests (redirect away if logged in)
const guestOnlyRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth cookie (set by the client after login)
  const authCookie = request.cookies.get("auth_data")?.value;

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      isAuthenticated = !!authData.token;
      userRole = authData.role || null;
    } catch {
      // Invalid cookie
    }
  }

  // ── Guest-only routes (login, register) ──
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirect logged-in users away from login/register
      const redirectUrl =
        userRole === "seller" ? "/admin/dashboard" : "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes ──
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Store the intended URL for post-login redirect
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── Seller-only routes ──
    if (sellerRoutes.some((route) => pathname.startsWith(route))) {
      if (userRole !== "seller") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match protected and guest-only routes
    "/cart/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
