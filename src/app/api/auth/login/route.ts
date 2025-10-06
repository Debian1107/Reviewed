import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
await dbConnect();

export async function checkUserLoggedIn(email: string, password: string) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found");
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || "");
    if (!isMatch) {
      console.log("Password does not match");
      return null;
    }
    return { id: user._id, name: user.name, email: user.email };
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || "");
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Set cookie
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return res;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
