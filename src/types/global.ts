interface Item {
  _id: string;
  id: string; // slug
  name: string;
  category: string;
  tags: string[];
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}
interface ProductData {
  id: string;
  name: string;
  category: string;
  description: string;
  overallRating: number;
  totalReviews: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  ratingBreakdown: { rating: number; count: number }[];
}
interface Comment {
  id: number;
  _id: string;
  userId: string | null;
  user: {
    name: string;
  };
  item: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number; // details of the likes in array form
  replies: Comment[];
  isLikedByCurrentUser?: boolean; // whether the current user liked this comment
  name?: string; // for the name of the item that has the comment
  likesCount?: number; // total number of likes
}

export type { Item, ProductData, Comment };
