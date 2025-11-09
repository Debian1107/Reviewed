// import Link from "next/link";
// import { Item } from "@/types/global";
// import { Star } from "lucide-react";

// type ItemCardProps = {
//   item: Item;
//   onItemClick?: (item: Item) => void;
// };

export const Loader = ({ loadingText = "Loading data" }) => {
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
        <p className="text-lg font-medium text-gray-700">{loadingText}...</p>
      </div>
    </div>
  );
};
