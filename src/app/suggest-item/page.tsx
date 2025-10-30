"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import {
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
  PlusCircle,
} from "lucide-react";

// Define the structure for the form data
interface SuggestionForm {
  name: string;
  category: string;
  description: string;
  imageFile?: File | null;
}

// Mock categories for the dropdown
const CATEGORIES = [
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

export default function SuggestItemPage() {
  const [formData, setFormData] = useState<SuggestionForm>({
    name: "",
    category: "tech",
    description: "",
    imageFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // NOTE: Ensure your CATEGORIES array is accessible (it should be, since it's in the same file)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    // Basic Client-side Validation
    if (!formData.name || !formData.category || !formData.description) {
      setSubmitMessage("Please fill out all required fields.");
      return;
    }
    const formData2 = new FormData();
    formData2.append("name", formData.name);
    formData2.append("category", formData.category);
    formData2.append("description", formData.description);
    if (imageFile) {
      formData2.append("image", imageFile);
    }
    // if (imageFile) {
    //   formData["imageFile"] = imageFile;
    // }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        body: formData2,
      });
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // // Send the form data (name, category, description)
      // body: JSON.stringify(formData),

      const result = await response.json();

      if (response.ok && result.success) {
        // API call succeeded (HTTP 201 Created)
        setSubmitMessage(
          `🎉 Success! Item '${result.data.name}' has been suggested and added to the index.`
        );
        setImageFile(null);

        // Reset form fields
        setFormData({
          name: "",
          category: CATEGORIES[0].value, // Use the first category value for reset
          description: "",
        });
      } else {
        // API call failed (e.g., HTTP 400 Bad Request, 409 Conflict, or 500 Server Error)
        const errorMessage =
          result.message || "An unknown error occurred during submission.";
        setSubmitMessage(`❌ Submission Failed: ${errorMessage}`);
      }
    } catch (error) {
      // Network or other non-HTTP error
      console.error("Fetch error:", error);
      setSubmitMessage(
        "🛑 A network error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <PlusCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Suggest a New Item for Review
            </h1>
            <p className="text-gray-600">
              Can&apos;t find what you&apos;re looking for? Help us expand our
              index by submitting details for a new product, service, or place.
            </p>
          </div>

          {/* Submission Message */}
          {submitMessage && (
            <div
              className={`p-4 mb-6 rounded-lg font-medium ${
                submitMessage.startsWith("🎉")
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Item Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name (e.g., &apos; Google Pixel 9 &apos;, &apos;The Great
                Wall&apos;) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter the full name of the item"
                />
              </div>
            </div>

            {/* 2. Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Description/URL */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Brief Description or Official URL{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Tell us a little about the item, or provide an official link to help us verify it."
                />
              </div>
            </div>

            {/* 5. Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload an Image (optional)
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 
               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-base"
                disabled={isSubmitting}
              />
              {imageFile && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected file:{" "}
                  <span className="font-medium">{imageFile.name}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white transition duration-200 ${
                isSubmitting
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : (
                "Submit Item Suggestion"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
