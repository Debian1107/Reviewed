// app/submit-review/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent, JSX } from "react";
import { Send, Zap, MonitorPlay, Car, Star, Plane } from "lucide-react";
import Link from "next/link";

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

  const itemTypes = [
    { value: "tech", label: "Tech / Gadget", icon: Zap },
    { value: "auto", label: "Car / Truck", icon: Car },
    { value: "media", label: "Movie / Media", icon: MonitorPlay },
    { value: "infrastructure", label: "Road / Seat / Place", icon: Plane },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue: number) => {
    setFormState((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    if (formState.rating === 0 || !formState.itemName || !formState.title) {
      setError("Please select a rating, item name, and title.");
      setLoading(false);
      return;
    }

    // --- API Submission Logic (Placeholder) ---
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
        </div>

        {/* Review Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 1. Item Identification */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="itemType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                What are you reviewing?
              </label>
              <select
                id="itemType"
                name="itemType"
                required
                value={formState.itemType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base appearance-none bg-white pr-8"
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {itemTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of Item/Product
              </label>
              <input
                id="itemName"
                name="itemName"
                type="text"
                required
                value={formState.itemName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base"
                placeholder="e.g., iPhone 17 Pro Max or I-95 South"
                disabled={loading}
              />
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
