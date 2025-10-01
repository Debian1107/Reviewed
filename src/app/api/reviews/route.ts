import { NextResponse } from "next/server";
// import mongoose from "mongoose";
import Review from "@/models/Review"; // adjust path
import "@/lib/mongodb"; // your db connection file
import dbConnect from "@/lib/mongodb";
await dbConnect();

// GET /api/reviews
export async function GET() {
  try {
    // Fetch all reviews with user details
    const reviews = await Review.find()
      .populate("user", "name email") // populate user fields
      .populate("likes") // populate likes if needed
      .sort({ createdAt: -1 }); // latest first

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
