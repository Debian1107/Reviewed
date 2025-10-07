// app/products/page.tsx
"use client";

import { useState, useMemo, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Search,
  Zap,
  Car,
  MonitorPlay,
  Plane,
  Truck,
  ListFilter,
  Star,
  PlusCircle, // Added for the new card
} from "lucide-react";
import Link from "next/link";
import { useItemStore } from "@/utils/store";

// --- MOCK DATA ---
interface Item {
  id: string;
  name: string;
  category: string;
  reviewCount: number;
  averageRating: number;
  tags: string[];
}

const MOCK_ITEMS: Item[] = [
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro Max",
    category: "tech",
    reviewCount: 1245,
    averageRating: 4.6,
    tags: ["smartphone", "apple", "flagship"],
  },
  {
    id: "cybertruck",
    name: "Tesla Cybertruck",
    category: "auto",
    reviewCount: 450,
    averageRating: 3.1,
    tags: ["truck", "electric", "tesla"],
  },
  {
    id: "dune-2",
    name: "Dune: Part Two",
    category: "media",
    reviewCount: 980,
    averageRating: 4.9,
    tags: ["movie", "scifi", "imax"],
  },
  {
    id: "a380-seat",
    name: "Airbus A380 Economy Seat",
    category: "travel",
    reviewCount: 450,
    averageRating: 2.1,
    tags: ["airplane", "comfort", "long-haul"],
  },
  {
    id: "i95-va",
    name: "I-95 Southbound (VA)",
    category: "infrastructure",
    reviewCount: 2100,
    averageRating: 1.9,
    tags: ["road", "highway", "pothole"],
  },
  {
    id: "wh-1000xm6",
    name: "Sony WH-1000XM6 Headphones",
    category: "tech",
    reviewCount: 650,
    averageRating: 4.4,
    tags: ["audio", "anc", "wireless"],
  },
  {
    id: "macbook-pro-m4",
    name: 'MacBook Pro 16" (M4)',
    category: "tech",
    reviewCount: 300,
    averageRating: 4.8,
    tags: ["laptop", "apple", "pro"],
  },
  {
    id: "toyota-prius-2024",
    name: "Toyota Prius (2024)",
    category: "auto",
    reviewCount: 120,
    averageRating: 4.2,
    tags: ["hybrid", "car", "economy"],
  },
];

const CATEGORIES = [
  { value: "all", label: "All Items", icon: ListFilter },
  { value: "tech", label: "Tech & Gadgets", icon: Zap },
  { value: "auto", label: "Automotive", icon: Car },
  { value: "media", label: "Movies & Media", icon: MonitorPlay },
  { value: "travel", label: "Travel / Seats", icon: Plane },
  { value: "infrastructure", label: "Roads / Places", icon: Truck },
];

// --- COMPONENTS ---

// 1. Item Card Component
const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
  <Link
    href={`/reviews/${item.id}`}
    className="block p-5 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-0.5"
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
        {item.name}
      </h3>
      <div className="flex items-center space-x-1 text-yellow-500">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-base font-semibold text-gray-700">
          {item.averageRating.toFixed(1)}
        </span>
      </div>
    </div>

    <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">
      {item.category}
    </p>

    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        {item.reviewCount.toLocaleString()} Reviews
      </span>
      <span className="text-emerald-600 font-medium text-sm">
        View Details →
      </span>
    </div>
  </Link>
);

// --- MAIN PAGE COMPONENT ---

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "latest" | "highest_rating" | "most_reviews"
  >("most_reviews");
  const { items, fetchItems, isLoading } = useItemStore();

  // console.log("this is the items ", items);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  // --- FILTERING AND SORTING LOGIC ---
  const filteredAndSortedItems = useMemo(() => {
    let results = items;

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // 2. Filter by Search Term (Item Name or Tags)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // 3. Sorting
    results.sort((a, b) => {
      if (sortBy === "highest_rating") {
        return b.averageRating - a.averageRating;
      }
      if (sortBy === "most_reviews") {
        return b.reviewCount - a.reviewCount;
      }
      // Default/Latest placeholder sorting (can be based on product creation date)
      return a.name.localeCompare(b.name);
    });

    return results;
  }, [selectedCategory, searchTerm, sortBy, items]);

  useEffect(() => {
    fetchItems();
  }, []);

  // useEffect(() => {}, [items]);

  console.log(items);
  // ... inside ProductsPage() return ...

  // Display a loading indicator while fetching
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <svg
            className="animate-spin h-8 w-8 text-emerald-500 mx-auto mb-3"
            viewBox="0 0 24 24"
          >
            {/* Spinner SVG path */}
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
          <p className="text-lg font-medium text-gray-700">
            Loading reviewable items...
          </p>
        </div>
      </div>
    );
  }

  // ... rest of the render logic (after the loading check)

  return (
    <div className="bg-gray-50 h-full py-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Reviewable Items Index
          </h1>
          <p className="text-lg text-gray-600">
            Browse thousands of products, services, and places available for
            review.
          </p>
        </div>

        {/* Main Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-4xl mx-auto mb-12"
        >
          <input
            type="search"
            placeholder="Search for 'phone', 'road', 'SUV', or 'movie'..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-4 pl-14 pr-4 text-gray-900 bg-white border border-gray-300 rounded-2xl text-lg shadow-xl focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        </form>

        {/* --- CATEGORIES & SORTING --- */}
        <div className="lg:flex lg:justify-between lg:items-center mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Category Navigation (Horizontal Scroll on Mobile) */}
          <div className="flex flex-wrap gap-2 lg:gap-4 overflow-x-auto pb-2 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
            <label
              htmlFor="sortBy"
              className="text-sm font-medium text-gray-700"
            >
              Sort By:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "latest" | "highest_rating" | "most_reviews"
                )
              }
              className="py-2 px-3 border border-gray-300 bg-white rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 appearance-none pr-8"
            >
              <option value="most_reviews">Most Reviews</option>
              <option value="highest_rating">Highest Rated</option>
              <option value="latest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* --- RESULTS GRID --- */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Showing {filteredAndSortedItems.length} Items
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.length > 0 ? (
            filteredAndSortedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            // --- UPDATED: No Results & Suggest Item Section ---
            <>
              <div className="col-span-full p-10 text-center bg-white rounded-xl border border-gray-200 text-gray-600">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium">
                  We couldn&apos;t find any items matching your search.
                </p>
                <p className="text-sm mt-2">
                  Try a broader search term or select All Items to browse.
                </p>
              </div>

              {/* --- NEW CARD: Suggest Item for Review --- */}
              <Link
                href="/suggest-item" // Assuming a route for suggestions
                className="col-span-full lg:col-span-2 xl:col-span-4 p-8 text-center bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl hover:bg-emerald-100 transition duration-300 flex flex-col items-center justify-center shadow-inner"
              >
                <PlusCircle className="w-10 h-10 mb-3 text-emerald-600" />
                <p className="text-xl font-bold text-emerald-800 mb-1">
                  Item Not Found? Add It for Review!
                </p>
                <p className="text-md text-emerald-600 font-medium">
                  Click here to suggest a new product, service, or place to our
                  index.
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
