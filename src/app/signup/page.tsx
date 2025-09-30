// app/signup/page.tsx

import SignupForm from "@/components/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - VeritComplete",
  description: "Create a new account to start using VeritComplete.",
};

export default function SignupPage() {
  return (
    // Uses the same pleasant background gradient as the login page
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4 sm:p-6">
      <div className="w-full max-w-lg p-8 sm:p-10 space-y-8 bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 transform transition duration-500 hover:shadow-emerald-300/60">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Start your 14-day free trial today.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              Log in here
            </a>
          </p>
        </div>

        {/* The actual form component */}
        <SignupForm />
      </div>
    </div>
  );
}
