// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Star, Search, User, LogIn } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Placeholder: Replace with actual authentication state check
  const isLoggedIn = true;
  const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <nav>Loading...</nav>;
  // }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Items", href: "/items" },
    {
      name: "Write a Review",
      href: "/submit-review",
      icon: Star,
      highlight: true,
    },
  ];

  // Placeholder for user name/login status
  const userName =
    status === "loading"
      ? "Log In"
      : session?.user?.name
      ? session.user.name
      : "Log In";
  console.log("Session data:", session);

  return (
    <div>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center text-2xl font-extrabold text-gray-900 hover:text-emerald-600 transition"
              >
                <Star className="w-6 h-6 mr-1 text-emerald-600 fill-emerald-600" />
                Reviewed
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:space-x-4 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                    link.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Auth/Profile Button */}
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="ml-4 px-3 py-2 flex items-center bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition"
                >
                  <User className="w-4 h-4 mr-1" />
                  {userName}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ml-4 px-3 py-2 flex items-center bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="lg:hidden shadow-lg border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Links */}
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <User className="w-5 h-5 inline mr-2" />
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <LogIn className="w-5 h-5 inline mr-2" />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 hover:bg-emerald-50"
                  >
                    <Star className="w-5 h-5 inline mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
