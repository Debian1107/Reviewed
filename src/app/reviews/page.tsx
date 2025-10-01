// app/reviews/page.tsx
"use client";

import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  ListFilter,
  Star,
  Clock,
  Zap,
  Car,
  MonitorPlay,
  Truck,
  Plane,
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA (Replace with your actual API fetch) ---
interface Review {
  id: number;
  itemName: string;
  category: string;
  rating: number;
  title: string;
  summary: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    itemName: "iPhone 17 Pro",
    category: "tech",
    rating: 5,
    title: "Unbeatable Camera",
    summary:
      "The new sensor is incredible, although the price is staggering...",
    date: "2025-09-25",
  },
  {
    id: 2,
    itemName: "Tesla Cybertruck",
    category: "auto",
    rating: 3,
    title: "Great Concept, Rough Finish",
    summary: "Drives well but the panel gaps are a real issue.",
    date: "2025-09-20",
  },
  {
    id: 3,
    itemName: "Dune: Part Two",
    category: "media",
    rating: 5,
    title: "A Cinematic Masterpiece",
    summary: "Visually stunning and perfectly paced. Must-see.",
    date: "2025-09-15",
  },
  {
    id: 4,
    itemName: "Airbus A380 Seat 88A",
    category: "travel",
    rating: 1,
    title: "Brutal Legroom",
    summary: "Avoid this bulkhead seat at all costs if you are over 6ft.",
    date: "2025-09-10",
  },
  {
    id: 5,
    itemName: "I-95 South (VA)",
    category: "infrastructure",
    rating: 2,
    title: "Pothole City",
    summary: "The surface quality is deplorable; needs immediate maintenance.",
    date: "2025-09-05",
  },
  {
    id: 6,
    itemName: "Sony WH-1000XM6",
    category: "tech",
    rating: 4,
    title: "ANC is King",
    summary:
      "Excellent noise cancellation, slightly tight fit after a few hours.",
    date: "2025-08-28",
  },
];

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: ListFilter },
  { value: "tech", label: "Tech & Gadgets", icon: Zap },
  { value: "auto", label: "Automotive", icon: Car },
  { value: "media", label: "Movies & Media", icon: MonitorPlay },
  { value: "travel", label: "Travel / Seats", icon: Plane },
  { value: "infrastructure", label: "Roads / Places", icon: Truck },
];

// --- COMPONENTS ---

// 1. Star Rating Display Component
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

// 2. Review Card Component
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
        {review.itemName}
      </h3>
      <RatingDisplay rating={review.rating} />
    </div>
    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">
      {review.category}
    </p>
    <p className="text-gray-700 font-semibold mb-2 line-clamp-2">
      {review.title}
    </p>
    <p className="text-gray-500 text-sm mb-3 line-clamp-3">{review.summary}</p>
    <div className="flex justify-between items-center text-xs text-gray-400">
      <span>{new Date(review.date).toLocaleDateString()}</span>
      <Link
        href={`/reviews/${review.id}`}
        className="text-emerald-600 hover:text-emerald-700 font-medium"
      >
        Read More →
      </Link>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"latest" | "highest_rating">("latest");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic here could trigger an API call based on searchTerm
    console.log("Searching for:", searchTerm);
  };

  // --- FILTERING AND SORTING LOGIC ---
  const filteredAndSortedReviews = useMemo(() => {
    let results = MOCK_REVIEWS;

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      results = results.filter(
        (review) => review.category === selectedCategory
      );
    }

    // 2. Filter by Rating
    if (minRating > 0) {
      results = results.filter((review) => review.rating >= minRating);
    }

    // 3. Filter by Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (review) =>
          review.itemName.toLowerCase().includes(term) ||
          review.title.toLowerCase().includes(term) ||
          review.summary.toLowerCase().includes(term)
      );
    }

    // 4. Sorting
    if (sortBy === "latest") {
      results.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "highest_rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [selectedCategory, minRating, searchTerm, sortBy]);

  return (
    <div className="bg-gray-50 py-12 md:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Discover Reviews
          </h1>
          <p className="text-lg text-gray-600">
            Browse user feedback on everything from gadgets to infrastructure.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* --- LEFT COLUMN: FILTERS (Fixed Sidebar on Desktop) --- */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0 lg:sticky lg:top-8 self-start">
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ListFilter className="w-5 h-5 mr-2 text-emerald-600" />
                Filter Reviews
              </h2>

              {/* Filter 1: Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === cat.value
                          ? "bg-emerald-500 text-white font-semibold shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <cat.icon className="w-4 h-4 mr-2" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Minimum Rating */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center justify-center w-1/4 py-2 rounded-lg transition-colors duration-150 ${
                        minRating >= rating
                          ? "bg-yellow-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                  <button
                    onClick={() => setMinRating(0)}
                    className={`flex items-center justify-center w-1/4 py-2 rounded-lg transition-colors duration-150 ${
                      minRating === 0
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Any
                  </button>
                </div>
              </div>

              {/* Filter 3: Sort By */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                      sortBy === "latest"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" /> Latest
                  </button>
                  <button
                    onClick={() => setSortBy("highest_rating")}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                      sortBy === "highest_rating"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Star className="w-4 h-4 mr-2" /> Top Rated
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* --- RIGHT COLUMN: SEARCH & RESULTS (9/12 width) --- */}
          <div className="lg:col-span-9">
            {/* Main Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-8">
              <input
                type="search"
                placeholder="Search by item name, review title, or keyword..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-xl text-lg shadow-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Showing {filteredAndSortedReviews.length} Results
              </h2>
              <span className="text-gray-500 text-sm">
                Filters applied:{" "}
                {selectedCategory === "all" ? "All" : selectedCategory},{" "}
                {minRating > 0 ? `${minRating}+ Stars` : "Any Rating"}
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="md:col-span-2 p-10 text-center bg-white rounded-xl border border-gray-200 text-gray-600">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium">
                    No reviews found matching your criteria.
                  </p>
                  <p className="text-sm mt-2">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
