"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  LogOut,
  Upload,
  Edit3,
  Calendar,
  Star,
  User,
  Mail,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Review {
  _id: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  itemName: string;
}

// Helper to render star rating
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dob, setDob] = useState<string>(""); // State for Date of Birth
  const [saving, setSaving] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!user?.email) return;
    setReviewsLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/reviews/user/${user.email}`);
        const data = await res.json();
        if (data.success) {
          // Sort reviews by creation date descending
          const sortedReviews = data.reviews.sort(
            (a: Review, b: Review) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setReviews(sortedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [user]);

  // --- Image Upload Handler ---
  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("email", user?.email || "");
    setSaving(true);
    try {
      const res = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update the session or notify user of success
        alert("Profile picture updated successfully!");
        // Re-fetch session or manually update image URL if possible
        // For simplicity, we just rely on the previewURL state for now
      } else {
        alert(`Upload failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setSaving(false);
    }
  };

  // --- Profile Detail Save Handler (For DOB or other future fields) ---
  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/update-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, dob }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Personal details updated successfully!");
      } else {
        alert(`Update failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while saving details.");
    } finally {
      setSaving(false);
    }
  };

  const hasPendingChanges = imageFile || (dob && dob !== user?.dob); // Add user?.dob if you fetch it

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 py-16 text-white text-center shadow-inner">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
          Hello, {user?.name?.split(" ")[0] || "Reviewer"}!
        </h1>
        <p className="text-emerald-100 text-lg sm:text-xl">
          Your personal dashboard to manage your reviewing life.
        </p>
      </section>

      {/* --- Main Content Layout --- */}
      <div className="max-w-7xl mx-auto -mt-10 px-4 pb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid lg:grid-cols-[350px_1fr] gap-12">
            {/* --- LEFT COLUMN: Profile & Account Management --- */}
            <div className="flex flex-col items-center lg:items-start lg:text-left text-center">
              {/* Profile Image & Upload */}
              <div className="relative mb-6">
                <Image
                  src={previewUrl || user?.image || "/default-profile.png"}
                  alt="Profile"
                  width={180}
                  height={180}
                  className="rounded-full object-cover border-4 border-white shadow-xl"
                />
                <label className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 p-3 rounded-full cursor-pointer transition transform hover:scale-105 shadow-md">
                  <Upload className="text-white w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {user?.name || "Anonymous User"}
              </h2>
              <p className="text-gray-500 text-md flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" /> {user?.email}
              </p>

              <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2">
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 flex items-center gap-1 ${
                    user?.is_verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {user?.is_verified ? "Verified" : "Unverified"}
                </span>
                <span className="text-xs font-medium rounded-full px-3 py-1 bg-gray-100 text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {user?.lastLogin
                    ? `Last Seen: ${new Date(
                        user.lastLogin
                      ).toLocaleDateString()}`
                    : "Login Data N/A"}
                </span>
              </div>

              <div className="mt-8 space-y-4 w-full">
                {/* Save Profile Picture Button */}
                {imageFile && (
                  <button
                    onClick={handleUpload}
                    disabled={saving}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    {saving ? "Uploading Image..." : "Save Profile Picture"}
                  </button>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Settings and Reviews --- */}
            <div className="space-y-12">
              {/* --- SECTION 1: Personal Details --- */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-600" /> Personal Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name (Read-only for this example) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base font-medium">
                      {user?.name || "N/A"}
                    </div>
                  </div>

                  {/* Email (Read-only for this example) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email Address
                    </label>
                    <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base font-medium">
                      {user?.email || "N/A"}
                    </div>
                  </div>

                  {/* Date of Birth (Editable) */}
                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-base focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Placeholder/Future Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Location (Future Field)
                    </label>
                    <input
                      type="text"
                      placeholder="Add your location"
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-400 text-base bg-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Save Details Button */}
                {dob && (
                  <button
                    onClick={handleSaveDetails}
                    disabled={saving}
                    className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 shadow-md flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Details"}
                  </button>
                )}
              </section>

              {/* --- SECTION 2: Your Reviews --- */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-emerald-600" /> Your Reviews (
                  {reviews.length})
                </h3>

                {reviewsLoading ? (
                  <div className="text-center p-10 text-gray-500">
                    <Zap className="w-6 h-6 animate-spin mx-auto mb-3" />
                    Loading reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-gray-600 text-md bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 flex flex-col items-center text-center">
                    <Edit3 className="w-8 h-8 text-gray-400 mb-3" />
                    <p className="mb-4">
                      You haven’t written any reviews yet. Share your
                      experience!
                    </p>
                    <Link
                      href="/submit-review"
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                    >
                      Write Your First Review
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((r) => (
                      <div
                        key={r._id}
                        className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-semibold text-gray-900">
                            {r.title}
                          </h4>
                          <StarRating rating={r.rating} />
                        </div>
                        <p className="text-sm text-emerald-600 font-medium mb-3">
                          Reviewed: **{r.itemName}**
                        </p>
                        <p className="text-gray-700 line-clamp-3 mb-3">
                          {r.content}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>
                            Posted on:{" "}
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/review/edit/${r._id}`}
                            className="text-emerald-500 hover:text-emerald-700 transition flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* --- SECTION 3: Security & Activity (Placeholder) --- */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-emerald-600" /> Security &
                  Activity
                </h3>
                <div className="text-gray-600 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="font-semibold mb-2">
                    Account Security Status:(Coming Soon)
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>**Two-Factor Authentication:**</li>
                    <li>
                      **Recent Logins:** Check your email for new device
                      notifications.
                    </li>
                    <li>**Password Strength:** Last changed 90 days ago.</li>
                  </ul>
                  <p className="mt-4 text-xs text-yellow-700">
                    *This section is a placeholder. Functionality for security
                    settings would be implemented here when updated.*
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
