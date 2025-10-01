"use server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  // console.log("Middleware check for token----------:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/reviews/:path*",
    "/dashboard/:path*",
    "/reviews",
    "/submit-review",
  ], // protected routes
};
