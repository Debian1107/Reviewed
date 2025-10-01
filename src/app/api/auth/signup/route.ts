import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, username, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please enter all required fields." },
        { status: 400 }
      );
    }

    // Auto-generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      const randomNum = Math.floor(Math.random() * 10000);
      finalUsername = `${name.toLowerCase().replace(/\s+/g, "")}${randomNum}`;
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create User
    const newUser = await User.create({
      name,
      username: finalUsername,
      email,
      passwordHash,
    });

    // 4. Respond (don’t send hash back)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Signup error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "Username or email is already in use." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
