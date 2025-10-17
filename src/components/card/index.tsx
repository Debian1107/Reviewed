import Link from "next/link";
import { Item } from "@/types/global";
import { Star } from "lucide-react";

type ItemCardProps = {
  item: Item;
  onItemClick?: (item: Item) => void;
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onItemClick) {
      e.preventDefault(); // 👈 stops the Link navigation
      e.stopPropagation(); // 👈 stops event bubbling
      onItemClick(item); // 👈 pass the item data
    }
  };
  return (
    <Link
      href={`/reviews/${item.id}`}
      onClick={handleClick}
      className="block p-5 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-200 transform hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-base font-semibold text-gray-700">
            {item.averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">
        {item.category}
      </p>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          {item.reviewCount.toLocaleString()} Reviews
        </span>
        <span className="text-emerald-600 font-medium text-sm">
          View Details →
        </span>
      </div>
    </Link>
  );
};
