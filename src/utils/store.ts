import { create } from "zustand";
import { ProductData, Item, Comment } from "@/types/global";
// Define the structure of an Item based on your Mongoose schema/mock data

// Define the structure of the store's state
interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp to track when data was last loaded
}

interface ReviewState {
  reviews: Comment[];
  trendingReviews: Comment[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp to track when data was last loaded
}

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp to track when data was last loaded
}

interface postReviewsData {
  userid: string | undefined;
  category: string;
  itemId: string | undefined;
  content: string;
  title: string;
  rating: number;
}

interface postCommentsData {
  userid: string | null | undefined;
  itemId: string | undefined;
  content: string;
  parentid?: number | null;
  rating: number | null;
}

// Define the actions (functions to update the state)
interface ItemActions {
  fetchItems: (force?: boolean) => Promise<void>;
  searchItems: (query: string, force?: boolean) => Promise<Item[]>;
  getSingleItem: (
    id: string | null,
    justItem?: boolean,
    force?: boolean
  ) => Promise<ProductData | Item>;
  resetError: () => void;
}

interface ReviewActions {
  fetchReviews: (
    itemdid: string,
    force?: boolean
  ) => Promise<Comment[] | boolean>;
  fetchTrendingReviews: (force?: boolean) => Promise<Comment[] | boolean>;
  searchReviews: (query: string, force?: boolean) => Promise<void>;
  postReviews: (data: postReviewsData) => Promise<boolean>;
  getSingleReviews: (
    id: string | null,
    force?: boolean
  ) => Promise<ProductData>;
  resetError: () => void;
}

interface CommentsActions {
  fetchComments: (
    itemdid: string,
    force?: boolean
  ) => Promise<Comment[] | boolean>;
  postComments: (data: postCommentsData) => Promise<boolean>;
  getSingleComments: (
    id: string | null,
    force?: boolean
  ) => Promise<ProductData>;
  resetError: () => void;
}

interface LikeStore {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  postLike: (
    comment: string | null,
    review: string | null,
    force?: boolean
  ) => Promise<void>;
  resetError: () => void;
}

// Combine state and actions into the full store type
type ItemStore = ItemState & ItemActions;
type ReviewsStore = ReviewState & ReviewActions;
type CommentsStore = CommentState & CommentsActions;

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
    const { isLoading, lastFetched } = get();
    console.log("in fetch items ", isLoading, lastFetched);

    // Prevent duplicate fetches if already loading
    if (isLoading) return;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().items.length > 0) {
      console.log("Using cached item data.", get().items);
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
      console.log("search items -", result);
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
  getSingleItem: async (id: string | null, justItem = false, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return null;

    // Check for stale data, skip fetch if recent data exists and not forced
    // const now = Date.now();
    // const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    // if (!force && !isStale && get().items.length > 0) {
    //   console.log("Using cached item data.");
    //   return;
    // }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/items?id=${id}&justItem=${justItem}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ isLoading: false });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      const data = result?.data;
      console.log("get single item -", data);
      return data;
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

export const useReviewStore = create<ReviewsStore>((set, get) => ({
  // --- Initial State ---
  reviews: [],
  trendingReviews: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // --- Actions ---
  resetError: () => set({ error: null }),

  fetchReviews: async (itemid, force = false) => {
    const { isLoading, lastFetched } = get();
    console.log("in fetch reviews store ---> ", isLoading, lastFetched);

    // Prevent duplicate fetches if already loading
    if (isLoading || !itemid) return false;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().reviews.length > 0) {
      console.log("Using cached reviews data.", get().reviews);
      return true;
    }

    set({ isLoading: true, error: null });
    console.log("in fetch items -4");

    try {
      const response = await fetch("/api/reviews?id=" + itemid, {
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
      console.log("fetch reviews -", result);

      set({
        reviews: result.data as Comment[],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result.data as Comment[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
      return false;
    }
  },

  fetchTrendingReviews: async (force = false) => {
    const { isLoading, lastFetched } = get();
    console.log(
      "in fetch trending reviews store ---> ",
      isLoading,
      lastFetched
    );

    // Prevent duplicate fetches if already loading
    if (isLoading) return false;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().reviews.length > 0) {
      console.log("Using cached reviews data.", get().reviews);
      return true;
    }

    set({ isLoading: true, error: null });
    console.log("in fetch items -4");

    try {
      const response = await fetch("/api/reviews?trending=1", {
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
      console.log("fetch reviews -", result);

      set({
        trendingReviews: result.data as Comment[],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result.data as Comment[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
      return false;
    }
  },

  postReviews: async (data) => {
    set({ isLoading: true, error: null });
    console.log("in post reviews -");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: data.userid,
          category: data.category,
          itemId: data.itemId,
          content: data.content,
          title: data.title,
          rating: data.rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      set({
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
      return false;
    }
  },
  searchReviews: async (query: string, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().reviews.length > 0) {
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
  getSingleReviews: async (id: string | null, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return null;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    // if (!force && !isStale && get().items.length > 0) {
    //   console.log("Using cached item data.");
    //   return;
    // }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/items?id=" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ isLoading: false });

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

export const useCommentStore = create<CommentsStore>((set, get) => ({
  // --- Initial State ---
  comments: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // --- Actions ---
  resetError: () => set({ error: null }),

  fetchComments: async (itemid, force = false) => {
    const { isLoading, lastFetched } = get();
    console.log("in fetch reviews store ---> ", isLoading, lastFetched);

    // Prevent duplicate fetches if already loading
    if (isLoading || !itemid) return false;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    if (!force && !isStale && get().comments.length > 0) {
      console.log("Using cached reviews data.", get().comments);
      return true;
    }

    set({ isLoading: true, error: null });
    console.log("in fetch items -4");

    try {
      const response = await fetch("/api/comments?itemid=" + itemid, {
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
      console.log("fetch comments -", result);

      set({
        comments: result.data as Comment[],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result.data as Comment[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
      return false;
    }
  },

  postComments: async (data) => {
    set({ isLoading: true, error: null });
    console.log("in post reviews -");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: data.userid,
          itemId: data.itemId,
          content: data.content,
          rating: data.rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      set({
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to fetch items:", err);
      return false;
    }
  },

  getSingleComments: async (id: string | null, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return null;

    // Check for stale data, skip fetch if recent data exists and not forced
    const now = Date.now();
    const isStale = !lastFetched || now - lastFetched > STALE_TIME;

    // if (!force && !isStale && get().items.length > 0) {
    //   console.log("Using cached item data.");
    //   return;
    // }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/comments?id=" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ isLoading: false });

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

  // getSingleReviews: async (id: string | null, force = false) => {
  //   const { isLoading, lastFetched } = get();

  //   // Prevent duplicate fetches if already loading
  //   if (isLoading) return null;

  //   // Check for stale data, skip fetch if recent data exists and not forced
  //   const now = Date.now();
  //   const isStale = !lastFetched || now - lastFetched > STALE_TIME;

  //   // if (!force && !isStale && get().items.length > 0) {
  //   //   console.log("Using cached item data.");
  //   //   return;
  //   // }

  //   set({ isLoading: true, error: null });

  //   try {
  //     const response = await fetch("/api/items?id=" + id, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     set({ isLoading: false });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || `HTTP error! status: ${response.status}`
  //       );
  //     }

  //     const result = await response.json();
  //     const data = result.data;
  //     if (data && data.length > 0) return data[0];
  //     return null;
  //   } catch (err) {
  //     const message =
  //       err instanceof Error ? err.message : "An unknown error occurred.";
  //     set({
  //       isLoading: false,
  //       error: message,
  //     });
  //     console.error("Failed to fetch items:", err);
  //   }
  // },
}));

export const useLikeStore = create<LikeStore>((set, get) => ({
  // --- Initial State ---
  isLoading: false,
  error: null,
  lastFetched: null,

  // --- Actions ---
  resetError: () => set({ error: null }),

  postLike: async (comment = null, review = null, force = false) => {
    const { isLoading, lastFetched } = get();

    // Prevent duplicate fetches if already loading
    if (isLoading) return null;

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
          review: review,
        }),
      });
      set({ isLoading: false });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      const data = result?.data;
      console.log("get single item -", data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      set({
        isLoading: false,
        error: message,
      });
      console.error("Failed to add like:", err);
    }
  },
}));
