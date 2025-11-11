import { NextResponse } from "next/server";
// import mongoose from "mongoose";
import Review from "@/models/Review"; // adjust path
// import Like from "@/models/Like";
import "@/lib/mongodb"; // your db connection file
import Like from "@/models/Like";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path as needed
await dbConnect();

// GET /api/reviews
export async function GET(request: Request) {
  try {
    // Fetch all reviews with user details
    const { searchParams } = new URL(request.url);
    const itemid: string | null = searchParams.get("id");
    const trendingReviews: string | null = searchParams.get("trending");
    const userReviews: string | null = searchParams.get("userReviews");
    const session = await getServerSession(authOptions);

    if (trendingReviews) {
      const reviews = await Review.aggregate([
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "item",
          },
        },
        { $unwind: "$item" },
        {
          $addFields: {
            id: "$item.id",
            name: "$item.name",
            likesCount: { $size: "$likes" },
          },
        },
        {
          $project: {
            item: 0, // remove nested item field
            likes: 0, // optional
          },
        },
        {
          $sort: { likesCount: -1, createdAt: -1 },
        },
        { $limit: 5 },
      ]);

      // Populate user and item info
      await Review.populate(reviews, [
        { path: "user", select: "name" },
        { path: "itemId", select: "name id" },
      ]);

      return NextResponse.json({ success: true, data: reviews });
    } else if (userReviews) {
      if (!session || !session.user) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      const reviews = await Review.find({ user: session.user.id })
        .populate("itemId", "name id") // populate item fields
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ success: true, data: reviews });
    }
    if (!itemid) {
      return NextResponse.json(
        { success: false, message: "Missing itemid parameter." },
        { status: 400 }
      );
    }
    const itemIdData = await Item.findOne({ id: itemid });
    if (!itemIdData) {
      return NextResponse.json(
        { success: false, message: "Invalid itemId: No item found." },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ itemId: itemIdData })
      .populate("user", "name ") // populate user fields
      .sort({
        createdAt: -1,
      })
      .lean();

    // 2️⃣ Get all likes by current user for these comments
    const likedComments = await Like.find({
      user: session?.user.id,
      review: { $in: reviews.map((c) => c._id) },
    })
      .select("review")
      .lean();

    // 3️⃣ Add flag
    const likedSet = new Set(likedComments.map((l) => l.review.toString()));

    const modified_reviews = reviews.map((c) => ({
      ...c,
      isLikedByCurrentUser: likedSet.has(c._id.toString()),
    }));
    // .populate("likes") // populate likes if needed

    return NextResponse.json({ success: true, data: modified_reviews });
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

    // ✅ Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // ✅ Access user details
    // const userEmail = session.user.email; // default available field
    // const userName = session.user.name; // default available field
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
    // Additional validation for itemid
    const itemIdData = await Item.findOne({ id: itemId });

    if (!itemIdData || (itemIdData && itemIdData.category !== category)) {
      return NextResponse.json(
        {
          success: false,
          message: !itemIdData
            ? "Invalid itemId: No item found with the provided ID."
            : "Item category does not match the provided category.",
        },
        { status: 400 }
      );
    }

    // Create the new review
    const newReview = await Review.create({
      user,
      category,
      itemId: itemIdData._id, // Store the ObjectId reference
      content,
      title,
      rating,
    });

    // Optionally populate the user details before responding
    const createdReview = await Review.findById(newReview._id)
      .populate("user", "name email")
      .exec();

    console.log("Current item rating data:", itemIdData);
    const averageRating = itemIdData.averageRating || 0;
    const totalReviews = (itemIdData.reviewCount || 0) + 1;
    itemIdData.averageRating =
      (averageRating * (totalReviews - 1) + rating) / totalReviews;
    itemIdData.reviewCount = totalReviews;
    console.log(
      "Updated item rating:",
      averageRating,
      itemIdData.reviewCount,
      totalReviews
    );
    await itemIdData.save();

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
    console.log("Error creating review:", error);
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
