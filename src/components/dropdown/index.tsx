import { useState } from "react";
// import { ChevronDown, Search } from "@heroicons/react/solid";
import { itemCategoriesTypes } from "@/types/global";
import { ChevronDown, Search } from "lucide-react";
import { FC } from "react";

interface CategoryDropdownProps {
  CATEGORIES: itemCategoriesTypes[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
}

const CategoryDropdown: FC<CategoryDropdownProps> = ({
  CATEGORIES,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-sm">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      >
        <div className="flex items-center space-x-2">
          {selectedCategory ? (
            <>
              {(() => {
                const selectedCat = CATEGORIES.find(
                  (c) => c.value === selectedCategory
                );
                if (!selectedCat) return null;
                const Icon = selectedCat.icon; // 👈 Assign the component to a variable
                return <Icon className="w-4 h-4 text-emerald-600" />;
              })()}

              <span>
                {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Select Category</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          {/* Search Box */}
          <div className="flex items-center px-3 py-2 border-b border-gray-100 bg-gray-50">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
            />
          </div>

          {/* Category Options */}
          <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2.5 text-sm text-left transition ${
                    selectedCategory === cat.value
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-emerald-50"
                  }`}
                >
                  <cat.icon
                    className={`w-4 h-4 mr-2 ${
                      selectedCategory === cat.value
                        ? "text-white"
                        : "text-emerald-600"
                    }`}
                  />
                  {cat.label}
                </button>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-sm text-center">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
