"use client";
// app/submit-review/page.tsx

import { useState, FormEvent, ChangeEvent, JSX, useEffect } from "react";
import {
  Send,
  Star,
  Zap,
  Car,
  MonitorPlay,
  Plane,
  Truck,
  ListFilter,
  Utensils,
  Sofa,
  BookOpen,
  Banknote,
  Dumbbell,
  Palette,
  School,
  Heart,
  Gem,
  Code,
  Scissors,
  Gift,
  Factory,
  Lightbulb,
  Microscope,
  MapPin,
  Ruler,
  Headphones,
  Feather,
  Handshake,
  Shield,
  Globe,
  ShoppingBag,
  X,
} from "lucide-react";

import Link from "next/link";
import { useItemStore, useReviewStore } from "@/utils/store";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ProductData, Item } from "@/types/global";
import { ItemCard } from "@/components/card";
import Image from "next/image";
// import Loadingimage from "next/loading.svg";

// Interface for form state
interface ReviewFormState {
  itemType: string;
  itemName: string;
  rating: number;
  title: string;
  content: string;
}

export default function SubmitReviewPage(): JSX.Element {
  const [formState, setFormState] = useState<ReviewFormState>({
    itemType: "",
    itemName: "",
    rating: 0,
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchItem, setSearchItem] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [product, setProduct] = useState<Item>();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const { getSingleItem, searchItems } = useItemStore();
  const { postReviews } = useReviewStore();
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id"); // →
  const { data: session, status } = useSession();

  const itemTypes = [
    { value: "tech", label: "Tech & Gadgets", icon: Zap },
    { value: "auto", label: "Automotive", icon: Car },
    { value: "media", label: "Movies & Media", icon: MonitorPlay },
    { value: "travel", label: "Travel / Destinations", icon: Plane },
    { value: "infrastructure", label: "Roads / Places", icon: Truck },
    { value: "food", label: "Food & Restaurants", icon: Utensils },
    { value: "home", label: "Home & Furniture", icon: Sofa },
    { value: "books", label: "Books & Literature", icon: BookOpen },
    { value: "finance", label: "Finance & Services", icon: Banknote },
    { value: "health", label: "Health & Fitness", icon: Dumbbell },

    { value: "art", label: "Art & Supplies", icon: Palette },
    { value: "education", label: "Learning & Courses", icon: School },
    { value: "dating", label: "Dating Apps & Services", icon: Heart },
    { value: "jewelry", label: "Jewelry & Luxury Goods", icon: Gem },
    { value: "software", label: "Software & Apps", icon: Code },
    { value: "beauty", label: "Beauty & Personal Care", icon: Scissors },
    { value: "toys", label: "Toys & Games", icon: Gift },
    { value: "industrial", label: "Industrial & Tools", icon: Factory },
    { value: "startup", label: "Startups & Concepts", icon: Lightbulb },
    { value: "science", label: "Science & Research", icon: Microscope },
    { value: "real_estate", label: "Real Estate & Housing", icon: MapPin },
    { value: "fashion", label: "Clothing & Apparel", icon: ShoppingBag },
    { value: "sports", label: "Sports Equipment", icon: Dumbbell }, // Reused icon
    { value: "music", label: "Music & Audio Gear", icon: Headphones }, // Reused icon
    { value: "pets", label: "Pet Supplies & Food", icon: Feather },
    { value: "legal", label: "Legal & Consulting", icon: Handshake },
    { value: "security", label: "Security & Antivirus", icon: Shield },
    { value: "gov", label: "Government Services", icon: Globe },
    { value: "measurement", label: "Tools & Measurement", icon: Ruler },
    { value: "other", label: "Other / Uncategorized", icon: ListFilter },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue: number) => {
    if (ratingValue === 1 && formState.rating === 1) ratingValue = 0;
    setFormState((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    if (!formState.itemName || !formState.title) {
      setError("Please select a rating, item name, and title.");
      setLoading(false);
      return;
    }

    // --- API Submission Logic (Placeholder) ---
    try {
      // Simulate API call delay
      const reviewPostData = {
        userid: session?.user?.id,
        category: formState.itemType,
        itemId: id || product?.id,
        content: formState.content,
        title: formState.title,
        rating: formState.rating,
      };
      const response = await postReviews(reviewPostData);
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!response) {
        throw new Error("Failed to submit review. Please try again.");
      }
      // Assume success if no critical errors are found client-side
      // In a real app, send formState data to /api/reviews

      setSuccess(true);
      // Optional: Redirect the user after a brief pause
      // setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError("Failed to submit review. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelection = async (item: Item) => {
    setSearchResults([]);
    setFormState((prev) => ({
      ...prev,
      ["itemType"]: item?.category || "",
      ["itemName"]: item?.name || "",
    }));
    const data: ProductData | Item = await getSingleItem(item.id, true);
    setProduct(data as Item);
  };

  // const handleSearch = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormState((prev) => ({ ...prev, [name]: value }));
  // };

  useEffect(() => {
    const fetchSingleProd = async () => {
      if (!id) return;
      const data: ProductData | Item = await getSingleItem(id, true);
      console.log("this is the single item data ", data, id);
      setProduct(data as Item);

      setFormState((prev) => ({
        ...prev,
        ["itemType"]: data?.category || "",
        ["itemName"]: data?.name || "",
      }));
    };
    fetchSingleProd();
  }, []);

  useEffect(() => {
    if (!searchItem.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    const delayDebounce = setTimeout(() => {
      searchItems(searchItem)
        .then((res) => {
          setSearchLoading(false);
          setSearchResults(res);
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    }, 1000); // 400ms debounce delay

    return () => {
      clearTimeout(delayDebounce);
      controller.abort(); // cancel old request
    };
  }, [searchItem]);

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4">
        <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 text-center">
          <Star
            className="w-16 h-16 text-emerald-600 mx-auto"
            fill="currentColor"
          />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Review Submitted!
          </h2>
          <p className="text-lg text-gray-600">
            Thank you for sharing your experience. Your review will be live
            shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4 sm:p-6">
      <div className="w-full max-w-2xl p-8 sm:p-10 space-y-8 bg-white rounded-3xl shadow-2xl shadow-emerald-200/50">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Submit Your Review
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Be the first to share your rating and experience on **Reviewed**.
          </p>
          {product && (
            <p className="p-5 text-lg text-emerald-600 flex justify-center">
              Reviewing for: <strong>{product?.name}</strong>
              <span
                className="px-3  text-2xl text-red-300 flex  items-center cursor-pointer"
                onClick={() => setProduct(undefined)}
              >
                <X />
              </span>
            </p>
          )}
        </div>

        {/* Review Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 1. Item Identification */}

          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search of Item/Product
            </label>
            {/* {formState.itemName} */}
            {product ? (
              <p className="">{formState.itemName} </p>
            ) : (
              <input
                id="itemName"
                name="itemName"
                type="text"
                required
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base"
                placeholder="e.g., iPhone 17 Pro Max or I-95 South"
                disabled={loading}
              />
            )}
            {searchLoading && (
              <div
                className="w-full flex gap-7 justify-center py-3.5 px-4 mt-4 border border-transparent text-lg font-bold rounded-xl text-white 
                         bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500/50 
                         transition duration-300 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {/* <Image src="/loading.svg" alt="Logo" width={200} height={200} /> */}
                <p>Searching . . . . </p>
              </div>
            )}
            {searchResults && searchResults.length != 0 && (
              <div>
                {searchResults.map((item: Item) => {
                  return (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onItemClick={handleSearchSelection}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="itemType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Item category
              </label>
              {formState.itemType}
            </div>
            <div>
              <label
                htmlFor="itemType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Item rating
              </label>
              {product && "⭐".repeat(product.averageRating || 0)}
              <span> {product?.averageRating} </span>
            </div>
          </div>

          {/* 2. Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Overall Rating ({formState.rating} / 5)
            </label>
            <div className="flex space-x-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    formState.rating >= rating
                      ? "text-yellow-500 bg-yellow-500/20 shadow-md scale-110"
                      : "text-gray-300 bg-gray-100 hover:text-gray-400"
                  }`}
                  disabled={loading}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Review Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Review Title (e.g., &quot;Best in Class&quot; or &quot;Major
              Flaw&quot;)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formState.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base"
              placeholder="A concise, attention-grabbing title"
              disabled={loading}
            />
          </div>

          {/* 4. Review Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Detailed Review
            </label>
            <textarea
              id="content"
              name="content"
              rows={5}
              required
              value={formState.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base resize-none"
              placeholder="Share your experience, what you loved, and what could be improved..."
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 mt-4 border border-transparent text-lg font-bold rounded-xl text-white 
                         bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500/50 
                         transition duration-300 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
