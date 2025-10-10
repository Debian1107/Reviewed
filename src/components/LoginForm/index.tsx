// components/LoginForm.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm(): JSX.Element {
  // Explicitly typing the state variables
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Explicitly typing the form submission event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // --- Authentication Logic (Replace with your actual API call) ---
    try {
      const response = await signIn("credentials", {
        redirect: true, // prevent full page reload
        email,
        password,
        callbackUrl: "/",
      });

      console.log("Response status:", response);

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Invalid email or password. Please check your credentials."
        );
      }
    } catch (err) {
      // Type 'any' used here for generic catch error
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Explicitly typing the change event handler
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 text-base"
            placeholder="you@company.com"
            value={email}
            onChange={handleEmailChange} // Using the typed handler
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 text-base"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange} // Using the typed handler
            disabled={loading}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Options (Remember Me / Forgot Password) */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3.5 px-4 mt-6 border border-transparent text-lg font-bold rounded-xl text-white 
                     bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500/50 
                     transition duration-300 shadow-lg shadow-emerald-500/30"
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
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
}
