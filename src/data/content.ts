export interface ContentItem {
  id: string;
  title: string;
  type: "movie" | "anime" | "tvshow";
  year: number;
  rating: number | null;
  genre: string;
  description: string;
  poster: string | null;
  backdrop: string | null;
  trailer: string | null;
  video?: string | null;
  duration?: string | null;
  episodes?: number;
  seasons?: number;
  tags: string[];
  dateAdded: string;
  magnet?: string | null;
}

export const STORAGE_KEYS = {
  CONTENT: "priismatv_content",
  WATCHLIST: "priismatv_watchlist",
  FAVORITES: "priismatv_favorites",
  FRIENDS: "priismatv_friends",
  USER: "priismatv_user",
  HISTORY: "priismatv_history",
  CONTINUE_WATCHING: "priismatv_continue",
  COLLECTIONS: "priismatv_collections",
  CHALLENGES: "priismatv_challenges",
  REQUESTS: "priismatv_requests",
  COUNTDOWN: "priismatv_countdown",
};

export const OWNER_PASSWORD = "Jolterz2929$";
export const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";
