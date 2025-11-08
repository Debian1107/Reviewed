// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: ["/dashboard/:path*", "/submit-review"],
// };

// ------------------------------------------

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { rateLimit } from "./lib/rate-limit";

/**
 * Handle API routes manually — NextAuth token is stored in cookies,
 * so we can read it using getToken() instead of withAuth().
 */
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

// 1️⃣ Handle API routes manually
export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Apply custom logic only to /api routes
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const ratelimit = await rateLimit(req);
    if (!ratelimit.ok) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
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
  })(req, event);
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/submit-review"],
};
