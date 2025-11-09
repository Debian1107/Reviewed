// ------------------------------------------

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { rateLimit } from "./lib/rate-limit";
import type { NextRequestWithAuth } from "next-auth/middleware";
/**
 * Handle API routes manually — NextAuth token is stored in cookies,
 * so we can read it using getToken() instead of withAuth().
 */
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

const publicApiRules = [
  { path: "/api/reviews", methods: ["GET"] },
  { path: "/api/comments", methods: ["GET"] },
  { path: "/api/items", methods: ["GET"] },
  { path: "/api/auth", methods: ["GET", "POST"] }, // typical NextAuth endpoints
];

// 1️⃣ Handle API routes manually
export async function middleware(
  req: NextRequest | NextRequestWithAuth,
  event: NextFetchEvent
) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // Apply custom logic only to /api routes
  if (pathname.startsWith("/api")) {
    const ratelimit = await rateLimit(req);
    if (!ratelimit.ok) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    }

    // check for public url if any
    const isPublic = publicApiRules.some(
      (rule) =>
        (pathname.startsWith(rule.path) || rule.path.startsWith(pathname)) &&
        rule.methods.includes(method)
    );

    if (isPublic) {
      return NextResponse.next();
    }
    // Check authentication
    const token = await getToken({ req, secret });
    // console.log("Middleware triggered for:", pathname, token, ratelimit);

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Apply rate limiting
    // const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";

    return NextResponse.next();
  }

  // Let `withAuth` handle page routes
  return withAuth({
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  })(req as NextRequestWithAuth, event);
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/submit-review"],
};
