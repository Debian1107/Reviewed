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

// app/api/reviews/route.ts

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Ensure required fields are present
    const { user, category, itemId, content, title, rating } = body;

    if (!user || !category || !itemId || !content) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: user, category, itemId, or content.",
        },
        { status: 400 }
      );
    }

    // Create the new review
    const newReview = await Review.create({
      user,
      category,
      itemId,
      content,
      title,
      rating,
    });

    // Optionally populate the user details before responding
    const createdReview = await Review.findById(newReview._id)
      .populate("user", "name email")
      .exec();

    return NextResponse.json(
      {
        success: true,
        data: createdReview,
        message: "Review created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors (e.g., rating out of range)
    // if (error.name === "ValidationError") {
    //   return NextResponse.json(
    //     { success: false, message: error.message },
    //     { status: 400 }
    //   );
    // }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create review." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    // For simplicity, we assume 'body' contains only the fields to update (content, title, rating).
    // In a real app, you would verify the current user is the author of the review before proceeding.

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: body }, // Only update the fields provided in the body
      { new: true, runValidators: true } // Return the new document and run Mongoose validators
    )
      .populate("user", "name email")
      .exec();

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: "Review updated successfully.",
    });
  } catch (error) {
    // if (error.name === "ValidationError") {
    //   return NextResponse.json(
    //     { success: false, message: error.message },
    //     { status: 400 }
    //   );
    // }
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    // Use findByIdAndDelete to return the document before it was removed
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
