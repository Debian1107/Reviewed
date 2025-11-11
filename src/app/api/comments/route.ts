import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Review from "@/models/Review"; // adjust path
import Comment, { CommentType } from "@/models/Comment";
import Like from "@/models/Like";
import "@/lib/mongodb"; // your db connection file
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path as needed
import mongoose, { Document } from "mongoose";

await dbConnect();
type CommentLean = Omit<CommentType, keyof Document> & {
  _id: mongoose.Types.ObjectId;
};
// GET /api/comments
export async function GET(request: Request) {
  try {
    // Fetch all comments with user details
    const { searchParams } = new URL(request.url);
    const commentid: string | null = searchParams.get("id");
    const itemId: string | null = searchParams.get("itemid");
    const parentComment: string | null = searchParams.get("parentComment");

    const session = await getServerSession(authOptions);

    let comments;
    if (commentid) {
      // incase a single comment is requested
      const commentidData = await Comment.findOne({ id: commentid });
      if (!commentidData) {
        return NextResponse.json(
          { success: false, message: "Invalid commentid: No item found." },
          { status: 400 }
        );
      }

      comments = await Comment.find({ commentid: commentidData }).sort({
        createdAt: -1,
      });
    } else if (parentComment) {
      // fetch replies to a comment
      const comments_inst = await Comment.find({
        parentComment: parentComment,
      })
        .populate("user", "name")
        .sort({
          createdAt: -1,
        })
        .lean<CommentLean[]>();

      // 2️⃣ Collect ALL comment IDs (for likes lookup)
      const allCommentIds = comments_inst.flatMap((c) => [
        c._id,
        ...(c.replies?.map((r) => r._id) || []),
      ]);

      const likedComments = await Like.find({
        user: session?.user.id,
        comment: { $in: allCommentIds },
      })
        .select("comment")
        .lean();

      const likedSet = new Set(likedComments.map((l) => l.comment.toString()));
      comments = comments_inst.map((c) => ({
        ...c,
        isLikedByCurrentUser: likedSet.has(c._id.toString()),
      }));
      if (!comments) {
        return NextResponse.json(
          { success: false, message: "No replies comments found" },
          { status: 400 }
        );
      }
    } else {
      // fetch comments for a product/item
      const productInst = await Item.findOne({ id: itemId });
      if (!productInst) {
        return NextResponse.json(
          { success: false, message: "Invalid itemId: No item found." },
          { status: 400 }
        );
      }
      // 1️⃣ Get all comments
      const comments_inst = await Comment.find({
        product: productInst._id,
        parentComment: null,
      })
        .populate("user", "name")
        .populate({
          path: "replies",
          populate: { path: "user", select: "name" }, // populate user inside replies
        })
        .sort({ createdAt: -1 })
        .lean<CommentLean[]>();

      // 2️⃣ Collect ALL comment IDs (for likes lookup)
      const allCommentIds = comments_inst.flatMap((c) => [
        c._id,
        ...(c.replies?.map((r) => r._id) || []),
      ]);

      // 3️⃣ Get likes for all of them
      const likedComments = await Like.find({
        user: session?.user.id,
        comment: { $in: allCommentIds },
      })
        .select("comment")
        .lean();

      const likedSet = new Set(likedComments.map((l) => l.comment.toString()));

      // 4️⃣ Attach liked flag to comments + replies
      comments = comments_inst.map((c) => ({
        ...c,
        isLikedByCurrentUser: likedSet.has(c._id.toString()),
        replies:
          c.replies?.map((r) => ({
            ...r,
            isLikedByCurrentUser: likedSet.has(r._id.toString()),
          })) || [],
      }));
    }
    // .populate("likes") // populate likes if needed

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// app/api/comments/route.ts

export async function POST(request: Request) {
  try {
    await dbConnect();

    // ✅ Get the current session
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //   return new Response(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    // ✅ Access user details
    const userID = session ? session.user.id : null; // default available field
    const body = await request.json();
    // Ensure required fields are present
    const { itemId, content, rating, parentid } = body;

    if (!itemId || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields:Item ID, content.",
        },
        { status: 400 }
      );
    }
    // Additional validation for commentid
    const ItemInst =
      (await Item.findOne({ id: itemId })) || (await Item.findById(itemId));

    if (!ItemInst) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid itemId: No item found.",
        },
        { status: 400 }
      );
    }

    // check if parent comment exists
    const parentComment = await Comment.findById(parentid);
    console.log("parentComment:", parentComment, parentid);

    // Create the new review
    const newComment = await Comment.create({
      user: userID,
      content,
      product: ItemInst._id,
      rating,
      parentComment: parentComment ? parentComment._id : null, // ✅ only IDs
    });

    return NextResponse.json(
      {
        success: true,
        message: "comment added successfully.",
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
    console.log("Error creating comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comment." },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
//     const { id } = params;
//     const body = await request.json();

//     // For simplicity, we assume 'body' contains only the fields to update (content, title, rating).
//     // In a real app, you would verify the current user is the author of the review before proceeding.

//     const updatedReview = await Review.findByIdAndUpdate(
//       id,
//       { $set: body }, // Only update the fields provided in the body
//       { new: true, runValidators: true } // Return the new document and run Mongoose validators
//     )
//       .populate("user", "name email")
//       .exec();

//     if (!updatedReview) {
//       return NextResponse.json(
//         { success: false, message: "Review not found." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: updatedReview,
//       message: "Review updated successfully.",
//     });
//   } catch (error) {
//     // if (error.name === "ValidationError") {
//     //   return NextResponse.json(
//     //     { success: false, message: error.message },
//     //     { status: 400 }
//     //   );
//     // }
//     console.error("Error updating review:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to update review." },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
//     const { id } = params;

//     // Use findByIdAndDelete to return the document before it was removed
//     const deletedReview = await Review.findByIdAndDelete(id);

//     if (!deletedReview) {
//       return NextResponse.json(
//         { success: false, message: "Review not found." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Review deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Error deleting review:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete review." },
//       { status: 500 }
//     );
//   }
// }
