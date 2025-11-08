// app/reviews/[id]/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Star, MessageCircle, User, Clock, ThumbsUp, Send } from "lucide-react";
import Image from "next/image";
import { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useItemStore,
  useReviewStore,
  useCommentStore,
  useLikeStore,
} from "@/utils/store";
import { Comment, ProductData, Item } from "@/types/global";
import { useSession } from "next-auth/react";

// --- COMPONENTS ---
const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          rating >= star ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-1 text-sm font-semibold text-gray-700">{rating}.0</span>
  </div>
);

// 1. Full Star Rating Display
const FullRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-6 h-6 ${
          rating >= star ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-2 text-2xl font-bold text-gray-900">
      {rating?.toFixed(1)}
    </span>
  </div>
);

// 2. Individual Comment/Review Component
interface CommentProps {
  comment: Comment;
  isReply?: boolean;
  commentType: "review" | "general";
  onCommentAdded: (
    parentId: number | undefined,
    content: string,
    rating: number | null
  ) => void;
}

const CommentItem: React.FC<CommentProps> = ({
  comment,
  isReply = false,
  onCommentAdded,
  commentType = "review",
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const { postLike } = useLikeStore();
  const [liked, setLiked] = useState<boolean>(
    comment?.isLikedByCurrentUser || false
  );
  // const [replyContent, setReplyContent] = useState("");

  // Placeholder function for handling like/delete
  const handleAction = (action: string) => {
    console.log(`${action} clicked for comment ${comment.id}`);
    if (action === "like") {
      if (commentType === "review") postLike(null, comment._id);
      else postLike(comment._id, null);
      setLiked(!liked);
    }
  };

  return (
    <div
      className={`p-5 rounded-xl ${
        isReply
          ? "bg-gray-50 border border-gray-100 mt-3"
          : "bg-white border border-gray-200 shadow-md"
      }`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <User
          className={`w-8 h-8 rounded-full ${
            isReply ? "text-gray-500" : "text-emerald-600"
          }`}
        />
        <div>
          <p className="font-semibold text-gray-900">
            {comment?.user?.name || "Random User"}
          </p>
          <p className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
        {comment.rating > 0 && <RatingDisplay rating={comment.rating} />}
      </div>

      {comment.title && (
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          {comment.title}
        </h4>
      )}
      <p className="text-gray-700 leading-relaxed">{comment.content}</p>

      <div
        className={`mt-4 pt-3 flex items-center space-x-4 ${
          isReply ? "border-t border-gray-200" : ""
        }`}
      >
        <button
          onClick={() => handleAction("like")}
          className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 transition"
        >
          <ThumbsUp fill={liked ? "green" : "white"} className="w-4 h-4 mr-1" />{" "}
          {comment.likes}
        </button>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition"
        >
          <MessageCircle className="w-4 h-4 mr-1" /> Reply
        </button>
        {/* Optional: Delete button shown only for the user's own reviewComments */}
        {/* <button onClick={() => handleAction('delete')} className="flex items-center text-sm text-red-500 hover:text-red-700 transition ml-auto">
                    <Trash2 className="w-4 h-4 mr-1" />
                </button> */}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <AddCommentForm
          parentId={comment.id}
          isReplyForm={true}
          onCommentAdded={onCommentAdded}
        />
      )}

      {/* Display Replies */}
      {comment?.replies?.length > 0 && (
        <div className="ml-6 border-l pl-4 border-gray-300 mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply?.id}
              comment={reply}
              isReply={true}
              commentType={commentType}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Add Comment Form Component (for main reviews and replies)
interface AddCommentFormProps {
  parentId?: number;
  isReplyForm?: boolean;
  itemID?: string;
  onCommentAdded: (
    parentId: number | undefined,
    content: string,
    rating: number | null
  ) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  parentId,
  isReplyForm = false,
  itemID,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const [commentRating, setCommentRating] = useState<number | null>(0);
  const { postComments } = useCommentStore();
  const { data: session, status } = useSession();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const commentData = {
      content: content,
      userid: session?.user?.id,
      parentid: parentId || null,
      itemId: itemID,
      rating: commentRating || null,
    };
    if (content.trim()) {
      const postingComment = await postComments(commentData);
      if (postingComment) {
        console.log("Comment posted successfully");
      } else {
        alert("Failed to post comment");
        return;
      }
      onCommentAdded(parentId, content, commentRating);
      setContent("");
      setCommentRating(null);
    }
  };
  const handleRatingChange = (ratingValue: number) => {
    // alert(`You rated this comment ${ratingValue} -- ${commentRating} stars`);
    if (ratingValue === 1 && commentRating === 1) setCommentRating(0);
    else setCommentRating(ratingValue);
  };

  // if (!isLoggedIn) {
  //   return (
  //     <div
  //       className={`p-5 mt-6 border-2 border-dashed border-gray-200 rounded-xl text-center ${
  //         isReplyForm ? "mt-3 bg-white" : "bg-gray-50"
  //       }`}
  //     >
  //       <p className="text-gray-600">
  //         Please{" "}
  //         <Link
  //           href="/login"
  //           className="text-emerald-600 font-semibold hover:underline"
  //         >
  //           log in
  //         </Link>{" "}
  //         to add a comment or reply.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-6 ${
        isReplyForm
          ? "p-3 bg-white rounded-lg shadow-inner"
          : "p-6 bg-gray-50 rounded-xl shadow-inner"
      }`}
    >
      <h4 className="font-semibold text-gray-800 mb-2">
        {isReplyForm ? "Add your reply" : "Add Your Comment"}
      </h4>
      {!isReplyForm && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Overall Rating ({commentRating} / 5)
          </label>
          <div className="flex p-2 space-x-2 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  commentRating && commentRating >= rating
                    ? "text-yellow-500 bg-yellow-500/20 shadow-md scale-110"
                    : "text-gray-300 bg-gray-100 hover:text-gray-400"
                }`}
                // disabled={loading}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={isReplyForm ? 2 : 3}
        required
        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        placeholder={
          isReplyForm
            ? "Write your reply here..."
            : "Share your full opinion on this product..."
        }
      />
      <button
        type="submit"
        className="mt-3 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center text-sm"
      >
        <Send className="w-4 h-4 mr-1" /> Post{" "}
        {isReplyForm ? "Reply" : "Comment"}
      </button>
    </form>
  );
};

// 4. Main Page Component
export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  // const product = MOCK_PRODUCT; // Fetched using params.id
  const { reviews: reviewComments, fetchReviews } = useReviewStore();
  const { comments: commentData, fetchComments } = useCommentStore();
  // const [reviewComments, setReviewComments] = useState<Comment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [product, setProduct] = useState<ProductData>();
  const [showReview, setShowReview] = useState<boolean>(true);
  const { getSingleItem } = useItemStore();
  const router = useRouter();

  // Dynamic function to handle adding a new comment or reply
  const handleNewComment = (
    parentId: number | undefined,
    content: string,
    rating: number | null
  ) => {
    const newComment: Comment = {
      _id: Math.random().toString(36).substring(2, 15),
      id: Date.now(),
      userId: "currentUser", // Replace with actual logged-in user
      user: {
        name: "LoggedInUser",
      },
      item: product ? product.id : "unknown",
      rating: parentId ? 0 : rating || 0, // Only main reviewComments get a rating here for simplicity
      title: parentId ? "" : "Quick Comment",
      content: content,
      createdAt: new Date().toISOString(),
      likes: 0,
      name: "",
      likesCount: 0,
      replies: [],
    };

    setComments((prevComments) => {
      if (parentId) {
        // Handle reply
        return prevComments.map((c) => {
          if (c.id === parentId) {
            return { ...c, replies: [...c.replies, newComment] };
          }
          return c;
        });
      } else {
        // Handle new main comment
        return [newComment, ...prevComments];
      }
    });
  };

  const getRatingBarWidth = (count: number) => {
    if (!product) return "0%";
    const maxCount = Math.max(...product.ratingBreakdown.map((b) => b.count));
    return `${(count / maxCount) * 100}%`;
  };

  useEffect(() => {
    const fetchSingleProd = async () => {
      const { id } = await params; // ✅ unwrap it
      const data: ProductData | Item = await getSingleItem(id);
      // console.log("this is the single item data ", data);
      // if (data && "overallrating" in data)
      setProduct(data as ProductData);
      fetchComments(id);
    };
    const fetchReviewsData = async () => {
      const { id } = await params; // ✅ unwrap it
      const data = await fetchReviews(id);

      console.log("this is the reviews data ", data, id);
      // if (typeof data != "boolean" || data == true) setReviewComments(data);
    };
    fetchReviewsData();
    fetchSingleProd();
    // const paramsId=await params; // ✅ unwrap it
  }, []);

  useEffect(() => {
    setComments(commentData);
  }, [commentData]);

  return (
    <div className="bg-gray-50 py-12 md:py-16 min-h-screen">
      {product && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- 1. PRODUCT HEADER & STATS --- */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
            <div className="lg:flex lg:space-x-8">
              {/* Product Image */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <Image
                  src={product?.imageUrl || "/img/pog.jpg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-xl object-cover shadow-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-1">
                  {product.category}
                </p>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                  {product?.name}
                </h1>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {/* Overall Rating Score */}
                <div className="flex items-center space-x-4 border-t pt-4 border-gray-100">
                  <FullRatingDisplay rating={product.overallRating} />
                  <span className="text-lg text-gray-700">
                    Based on **{product?.totalReviews?.toLocaleString() || 0}**
                    Reviews
                  </span>
                </div>
                <button
                  onClick={() => {
                    router.push("/submit-review?id=" + product.id);
                  }}
                  className="mt-8 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center text-sm"
                >
                  Review this product
                </button>
              </div>

              {/* Rating Breakdown */}
              <div className="w-full lg:w-72 flex-shrink-0 mt-8 lg:mt-0">
                {product?.ratingBreakdown?.map((breakdown) => (
                  <div
                    key={breakdown.rating}
                    className="flex items-center mb-1"
                  >
                    <span className="text-sm font-medium w-4 mr-2">
                      {breakdown.rating}
                    </span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full"
                        style={{ width: getRatingBarWidth(breakdown.count) }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 w-10 text-right">
                      {breakdown.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 2. USER REVIEWS / COMMENTS SECTION --- */}
          <div className="max-w-4xl mx-auto py-8">
            {/* --- 1. Navigation Links (The JUMP links) --- */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg flex space-x-6 border-b border-gray-200 sticky top-0 z-10">
              <a
                className={`text-lg font-semibold ${
                  showReview
                    ? "text-emerald-600 hover:text-emerald-800 "
                    : "text-blue-600 hover:text-blue-800"
                } transition cursor-pointer`}
                onClick={() => setShowReview(true)}
              >
                Review Comments
              </a>
              <a
                className={`text-lg font-semibold ${
                  !showReview
                    ? "text-emerald-600 hover:text-emerald-800 "
                    : "text-blue-600 hover:text-blue-800"
                } transition cursor-pointer`}
                onClick={() => setShowReview(false)}
              >
                General Discussion
              </a>
            </div>

            {/* --- 2. Review Comments Section --- */}
            {reviewComments && showReview && (
              <div id="review-comments" className="pt-2">
                {" "}
                {/* Added ID for anchoring */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-emerald-600" />
                  Review Comments ({reviewComments.length})
                </h2>
                {/* <AddCommentForm onCommentAdded={handleNewComment} /> */}
                <div className="mt-8 space-y-6 pb-12">
                  {" "}
                  {/* Added padding bottom to prevent jump issues */}
                  {reviewComments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      commentType="review"
                      onCommentAdded={handleNewComment}
                    />
                  ))}
                  {reviewComments.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-600">
                      <p className="text-lg">No review comments yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 3. General Comments Section --- */}
            {comments && !showReview && (
              <div id="general-comments" className="mt-12 pt-2">
                {" "}
                {/* Added ID for anchoring and top margin */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                  General Discussion Comments ({comments.length})
                </h2>
                <AddCommentForm
                  itemID={product?.id}
                  onCommentAdded={handleNewComment}
                />
                <div className="mt-8 space-y-6">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      commentType="general"
                      onCommentAdded={handleNewComment}
                    />
                  ))}

                  {comments.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-600">
                      <p className="text-lg">
                        Be the first to start a general discussion!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
