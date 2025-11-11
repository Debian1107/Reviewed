import { ForwardRefExoticComponent } from "react";
import { LucideProps } from "lucide-react";
import { RefAttributes } from "react";

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
  itemId: string;
  product?: string; // alias for item
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number; // details of the likes in array form
  replies: Comment[];
  isLikedByCurrentUser?: boolean; // whether the current user liked this comment
  name?: string; // for the name of the item that has the comment
  likesCount?: number; // total number of likes
  parentComment?: string | null; // for replies
}

interface itemCategoriesTypes {
  value: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

interface UserDataType {
  id: string;
  name: string;
  email: string;
  dob: string;
  profilePicture: string;
  location: string;
  user_verified: boolean;
}

export type { Item, ProductData, Comment, itemCategoriesTypes, UserDataType };
