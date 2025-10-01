// components/SignupForm.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { JSX } from "react";

export default function SignupForm(): JSX.Element {
  // State for all required form fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Typed handler for input changes
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setter(e.target.value);
    };

  // Explicitly typing the form submission event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    // --- Signup Logic (Replace with your actual API call) ---
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Successful signup, redirect to login or a verification page
        router.push("/login?message=success");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Signup failed. Email may already be in use."
        );
      }
    } catch (err) {
      setError("A connection error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* Full Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 text-base"
            placeholder="John Doe"
            value={name}
            onChange={handleChange(setName)}
            disabled={loading}
          />
        </div>

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
            onChange={handleChange(setEmail)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 text-base"
              placeholder="••••••••"
              value={password}
              onChange={handleChange(setPassword)}
              disabled={loading}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 
                            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 text-base"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Terms and Conditions Checkbox */}
      <div className="pt-2 flex items-center">
        <input
          id="terms-conditions"
          name="terms-conditions"
          type="checkbox"
          required
          className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label
          htmlFor="terms-conditions"
          className="ml-2 block text-sm text-gray-700"
        >
          I agree to the
          <a
            href="#"
            className="font-medium text-emerald-600 hover:text-emerald-700 ml-1"
          >
            Terms and Conditions
          </a>
        </label>
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
            "Sign Up & Start Trial"
          )}
        </button>
      </div>
    </form>
  );
}
