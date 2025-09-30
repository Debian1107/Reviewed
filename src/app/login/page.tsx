// app/login/page.tsx

import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Sign In - VeritComplete",
  description: "Sign in to access your secure accounting and tax dashboard.",
};

export default function LoginPage() {
  return (
    // Use a pleasant gradient background for the entire screen
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4 sm:p-6">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 transform transition duration-500 hover:shadow-emerald-300/60">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Sign in to access your dashboard.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              Sign up here
            </a>
          </p>
        </div>

        {/* The actual form component */}
        <LoginForm />
      </div>
    </div>
  );
}
