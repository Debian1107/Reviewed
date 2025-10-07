import { create } from "zustand";

// Define the structure of an Item based on your Mongoose schema/mock data
interface Item {
  _id: string;
  id: string; // slug
  name: string;
  category: string;
  tags: string[];
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}
interface ProductData {
  id: string;
  name: string;
  category: string;
  description: string;
  overallRating: number;
  totalReviews: number;
  imageUrl: string;
  ratingBreakdown: { rating: number; count: number }[];
}

// Define the structure of the store's state
interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp to track when data was last loaded
}

// Define the actions (functions to update the state)
interface ItemActions {
  fetchItems: (force?: boolean) => Promise<void>;
  searchItems: (query: string, force?: boolean) => Promise<void>;
  getSingleItem: (id: string, force?: boolean) => Promise<ProductData>;
  resetError: () => void;
}

// Combine state and actions into the full store type
type ItemStore = ItemState & ItemActions;

// Helper to check if data is stale (e.g., older than 5 minutes)
const STALE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useItemStore = create<ItemStore>((set, get) => ({
  // --- Initial State ---
  items: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // --- Actions ---
  resetError: () => set({ error: null }),

  fetchItems: async (force = false) => {
    console.log("in fetch items");
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().items.length > 0) {
      console.log("Using cached item data.");
      return;
    }

    set({ isLoading: true, error: null });
    console.log("in fetch items -4");

    try {
      const response = await fetch("/api/items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      set({
        items: result.data as Item[],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
    }
  },
  searchItems: async (query: string, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().items.length > 0) {
      console.log("Using cached item data.");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/items?search=" + query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result?.data || [];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
    }
  },
  getSingleItem: async (id: string, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().items.length > 0) {
      console.log("Using cached item data.");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/items?id=" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      const data = result.data;
      if (data && data.length > 0) return data[0];
      return null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
    }
  },
}));
