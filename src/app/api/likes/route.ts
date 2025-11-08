import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Review from "@/models/Review"; // adjust path
import Comment from "@/models/Comment";
import Item from "@/models/Item";
import Like from "@/models/Like";
import "@/lib/mongodb"; // your db connection file
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path as needed
import Review from "@/models/Review";

await dbConnect();

// GET /api/comments
// export async function GET(request: Request) {
//   try {
//     // Fetch all comments with user details
//     const { searchParams } = new URL(request.url);
//     const commentid: string | null = searchParams.get("id");
//     const itemId: string | null = searchParams.get("itemid");
//     let comments;
//     if (commentid) {
//       const commentidData = await Comment.findOne({ id: commentid });
//       if (!commentidData) {
//         return NextResponse.json(
//           { success: false, message: "Invalid commentid: No item found." },
//           { status: 400 }
//         );
//       }

//       comments = await Comment.find({ commentid: commentidData }).sort({
//         createdAt: -1,
//       });
//       // return NextResponse.json({ success: true, data: comments });
//     } else {
//       const productInst = await Item.findOne({ id: itemId });
//       if (!productInst) {
//         return NextResponse.json(
//           { success: false, message: "Invalid itemId: No item found." },
//           { status: 400 }
//         );
//       }
//       // console.log(itemId, "  Product Instance:", productInst);
//       comments = await Comment.find({ product: productInst._id })
//         .populate("user", "name")
//         .sort({
//           createdAt: -1,
//         });
//     }
//     // .populate("likes") // populate likes if needed

//     return NextResponse.json({ success: true, data: comments });
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch comments" },
//       { status: 500 }
//     );
//   }
// }

// app/api/comments/route.ts

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
    const userID = session ? session.user.id : null; // default available field
    const body = await request.json();
    // Ensure required fields are present
    const { comment, review } = body;

    console.log("Like body:", body);

    if (comment) {
      const comment_inst = await Comment.findById(comment);
      if (!comment_inst) throw new Error("Invalid comment id");

      const existingLike = await Like.findOne({
        user: userID,
        comment: comment_inst._id,
      });

      if (existingLike) {
        // If already liked, remove (unlike)
        await Like.deleteOne({ _id: existingLike._id });
        return NextResponse.json({ message: "Like removed" });
      } else {
        // Otherwise, create a new like
        const new_like_inst = await Like.create({
          user: userID,
          comment: comment_inst._id,
          type: "comment",
        });
        if (!new_like_inst) throw new Error("Like creation failed");
      }
    } else {
      const review_inst = await Review.findById(review);
      if (!review_inst) throw new Error("Invalid review id");

      // Check if the user already liked this review
      const existingLike = await Like.findOne({
        user: userID,
        review: review_inst._id,
      });

      if (existingLike) {
        // Remove (unlike)
        await Like.deleteOne({ _id: existingLike._id });
        return NextResponse.json({ message: "Like removed" });
      } else {
        const new_like_inst = await Like.create({
          user: userID,
          review: review_inst._id,
          type: "review",
        });
        if (!new_like_inst) throw new Error("Like creation failed");
        return NextResponse.json({ message: "Like added" });
      }
    }
    // Additional validation for commentid

    // Create the new review

    return NextResponse.json(
      {
        success: true,
        message: "like added successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating like:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create like." },
      { status: 500 }
    );
  }
}
