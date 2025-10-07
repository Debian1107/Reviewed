// app/page.tsx
"use client";

import {
  Search,
  MonitorPlay,
  Car,
  Plane,
  ShoppingBag,
  Truck,
  Zap,
  Star,
} from "lucide-react";
import Link from "next/link";

// Helper component for the featured categories
interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  title,
  href,
}) => (
  <Link
    href={href}
    className="group p-6 bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start space-y-3"
  >
    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-2">
      <Icon className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition">
      {title}
    </h3>
    <p className="text-sm text-gray-500">
      See the latest user reviews and ratings.
    </p>
  </Link>
);

export default function HomePage() {
  return (
    <main className="bg-gray-50 ">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION: Search Focused */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative pt-24 pb-32 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Review <span className="text-emerald-400">Anything.</span> Find the
            Truth.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            From the latest smartphones to airplane seat comfort and city
            roads—get unbiased user reviews on literally everything.
          </p>

          {/* Main Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="search"
              placeholder="Search for a product, movie, road, or service..."
              className="w-full py-4 pl-14 pr-4 text-gray-900 bg-white border border-gray-300 rounded-xl text-lg shadow-2xl focus:ring-emerald-500 focus:border-emerald-500"
              // In a real app, this input would be connected to a dynamic search function
            />
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Popular searches: iPhone 16 Pro, Tesla Cybertruck, Dune Part Two,
            Delta Economy Seats.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. CORE CATEGORIES/DISCOVERY SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore All Review Categories
          </h2>
          <p className="text-lg text-gray-600">
            A platform where the content *is* the review. Start your discovery
            here.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <CategoryCard
            icon={Zap}
            title="Tech & Gadgets"
            href="/reviews/tech"
          />
          <CategoryCard
            icon={MonitorPlay}
            title="Movies & Media"
            href="/reviews/media"
          />
          <CategoryCard icon={Car} title="Automotive" href="/reviews/cars" />
          <CategoryCard
            icon={Plane}
            title="Travel & Aviation"
            href="/reviews/travel"
          />
          <CategoryCard
            icon={Truck}
            title="Infrastructure"
            href="/reviews/roads"
          />
          <CategoryCard
            icon={ShoppingBag}
            title="Consumer Goods"
            href="/reviews/goods"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. FEATURED REVIEWS / SOCIAL PROOF */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white py-20 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Reviews This Week
            </h2>
            <p className="text-lg text-gray-600">
              See what everyone is reviewing right now.
            </p>
          </div>

          {/* Placeholder for 3 featured review cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Review Card 1 */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <Star
                className="w-5 h-5 text-yellow-500 inline-block mr-1"
                fill="currentColor"
              />
              <span className="text-sm font-semibold text-gray-700">
                4.8/5 (1,200 reviews)
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                iPhone 16 Pro Battery Life
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                &quot;The battery life on the 16 Pro is a game changer. I can
                easily go two full days without needing a charge, something no
                previous iPhone could manage...&quot;
              </p>
              <Link
                href="/review/iphone-16-pro"
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Read Full Review →
              </Link>
            </div>

            {/* Featured Review Card 2 */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <Star
                className="w-5 h-5 text-yellow-500 inline-block mr-1"
                fill="currentColor"
              />
              <span className="text-sm font-semibold text-gray-700">
                3.1/5 (450 reviews)
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                Airbus A380 Economy Seat
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                &quot;While the A380 is quiet, the seat pitch in the last row is
                absolutely brutal for anyone over 6 feet tall. Avoid seat 88A at
                all costs...&quot;
              </p>
              <Link
                href="/review/a380-economy-seat"
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Read Full Review →
              </Link>
            </div>

            {/* Featured Review Card 3 */}
            <div className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <Star
                className="w-5 h-5 text-yellow-500 inline-block mr-1"
                fill="currentColor"
              />
              <span className="text-sm font-semibold text-gray-700">
                1.9/5 (2,100 reviews)
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                I-95 Southbound (Richmond, VA)
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                &quot;The road surface is deplorable. Potholes large enough to
                swallow a small car. Maintenance is non-existent. A terrible,
                nerve-wracking commute...&quot;
              </p>
              <Link
                href="/review/i95-southbound"
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Read Full Review →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. CALL TO ACTION: Write a Review */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can&apos;t Find It? Be the First.
          </h2>
          <p className="text-lg mb-8 text-emerald-100">
            If it exists, you can review it. Share your unique experience with
            the world.
          </p>
          <Link
            href="/submit-review"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-700 text-lg font-bold rounded-full shadow-2xl shadow-emerald-900/50 hover:bg-gray-100 transition transform hover:scale-[1.02]"
          >
            <Star className="w-5 h-5 mr-2" fill="currentColor" />
            Write Your First Review
          </Link>
        </div>
      </section>
    </main>
  );
}
