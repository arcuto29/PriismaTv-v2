"use client";
import { useState, useEffect, useCallback } from "react";
import { ContentItem, STORAGE_KEYS } from "@/data/content";
import { SAMPLE_CONTENT } from "@/data/sample-content";

// ====================================================================
//  PERSISTENCE MODEL (no more wiping!)
//  - priismatv_user_content : items YOU added/approved. NEVER wiped.
//  - priismatv_overrides    : edits to built-in items (posters, IDs, edits)
//  - priismatv_removed      : built-in items you deleted
//  The visible library = userContent + (SAMPLE_CONTENT - removed + overrides)
//  This means: new built-in titles always appear after an update, AND
//  your added/approved content survives forever (stored in your browser).
// ====================================================================

const SAMPLE_BY_ID = new Map(SAMPLE_CONTENT.map((i) => [i.id, i]));
const USER_KEY = "priismatv_user_content";
const OVERRIDE_KEY = "priismatv_overrides";
const REMOVED_KEY = "priismatv_removed";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Build the full visible library from the 3 buckets
function buildLibrary(): ContentItem[] {
  const userContent = readJSON<ContentItem[]>(USER_KEY, []);
  const overrides = readJSON<Record<string, ContentItem>>(OVERRIDE_KEY, {});
  const removed = new Set(readJSON<string[]>(REMOVED_KEY, []));
  const userIds = new Set(userContent.map((i) => i.id));

  const sampleMerged = SAMPLE_CONTENT
    .filter((i) => !removed.has(i.id) && !userIds.has(i.id))
    .map((i) => (overrides[i.id] ? overrides[i.id] : i));

  return [...userContent, ...sampleMerged];
}

// Split the visible library back into the 3 buckets and save
function persistFromContent(items: ContentItem[]) {
  const userContent: ContentItem[] = [];
  const overrides: Record<string, ContentItem> = {};
  const presentSampleIds = new Set<string>();

  for (const it of items) {
    const sample = SAMPLE_BY_ID.get(it.id);
    if (!sample) {
      userContent.push(it);
    } else {
      presentSampleIds.add(it.id);
      if (JSON.stringify(it) !== JSON.stringify(sample)) {
        overrides[it.id] = it;
      }
    }
  }
  const removed = [...SAMPLE_BY_ID.keys()].filter((id) => !presentSampleIds.has(id));

  localStorage.setItem(USER_KEY, JSON.stringify(userContent));
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
  localStorage.setItem(REMOVED_KEY, JSON.stringify(removed));
}

// One-time migration from the old single-blob storage so existing
// added/approved content is preserved when users get this update.
function migrateIfNeeded() {
  if (localStorage.getItem("priismatv_migrated_v7")) return;

  const oldStored = localStorage.getItem(STORAGE_KEYS.CONTENT);
  if (oldStored) {
    try {
      const old = JSON.parse(oldStored) as ContentItem[];
      persistFromContent(old); // splits old blob into the 3 buckets
    } catch {
      /* ignore corrupt old data */
    }
  }
  localStorage.setItem("priismatv_migrated_v7", "1");
  // Clean up the old version flag/blob (no longer used)
  localStorage.removeItem("priismatv_version");
}

export function useContentStore() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<{ id: string; date: string }[]>([]);
  const [continueWatching, setContinueWatching] = useState<
    { id: string; progress: number; timestamp: string }[]
  >([]);
  const [episodeProgress, setEpisodeProgress] = useState<
    Record<string, { season: number; episode: number; timestamp: string }>
  >({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    migrateIfNeeded();
    setContent(buildLibrary());
    setWatchlist(JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST) || "[]"));
    setFavorites(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]"));
    setHistory(JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]"));
    setContinueWatching(JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING) || "[]"));
    setEpisodeProgress(JSON.parse(localStorage.getItem("priismatv_episode_progress") || "{}"));
    setIsLoaded(true);
  }, []);

  const saveContent = useCallback((items: ContentItem[]) => {
    setContent(items);
    persistFromContent(items);
  }, []);

  // Auto-fix broken poster URLs from TMDB (writes go into the override bucket)
  useEffect(() => {
    if (!isLoaded || content.length === 0) return;

    let didFix = false;
    const fixPosters = async () => {
      const TMDB_KEY = "2dca580c2a14b55200e784d157207b4d";
      const updated = [...content];

      for (let i = 0; i < updated.length; i++) {
        const item = updated[i];
        if ((item as unknown as Record<string, boolean>).posterOk) continue;

        try {
          if (item.poster) {
            const test = await fetch(item.poster, { method: "HEAD" });
            if (test.ok) {
              (item as unknown as Record<string, boolean>).posterOk = true;
              continue;
            }
          }

          const searchType = item.type === "movie" ? "movie" : "tv";
          const res = await fetch(
            `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_KEY}&query=${encodeURIComponent(item.title)}&year=${item.year || ""}`
          );
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const r = data.results[0];
            if (r.poster_path) {
              item.poster = `https://image.tmdb.org/t/p/w500${r.poster_path}`;
              didFix = true;
            }
            if (r.backdrop_path) {
              item.backdrop = `https://image.tmdb.org/t/p/original${r.backdrop_path}`;
            }
            (item as unknown as Record<string, boolean>).posterOk = true;
          }
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          /* skip failures silently */
        }
      }

      if (didFix) {
        setContent(updated);
        persistFromContent(updated);
        console.log("[PriismaTv] Fixed broken poster images from TMDB");
      }
    };

    fixPosters();
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const addContent = useCallback((item: ContentItem) => {
    setContent((prev) => {
      // Avoid duplicates by id
      const without = prev.filter((i) => i.id !== item.id);
      const updated = [item, ...without];
      persistFromContent(updated);
      return updated;
    });
  }, []);

  const removeContent = useCallback((id: string) => {
    setContent((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      persistFromContent(updated);
      return updated;
    });
  }, []);

  const updateContent = useCallback((id: string, data: Partial<ContentItem>) => {
    setContent((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, ...data } : i));
      persistFromContent(updated);
      return updated;
    });
  }, []);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      const updated = [{ id, date: new Date().toISOString() }, ...filtered].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getContentById = useCallback(
    (id: string) => content.find((i) => i.id === id),
    [content]
  );

  // Track which episode was last watched for a show/anime
  const trackEpisodeProgress = useCallback((contentId: string, season: number, episode: number) => {
    setEpisodeProgress((prev) => {
      const updated = { ...prev, [contentId]: { season, episode, timestamp: new Date().toISOString() } };
      localStorage.setItem("priismatv_episode_progress", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get the last watched episode for a show/anime
  const getEpisodeProgress = useCallback((contentId: string) => {
    return episodeProgress[contentId] || null;
  }, [episodeProgress]);

  const movies = content.filter((i) => i.type === "movie");
  const anime = content.filter((i) => i.type === "anime");
  const tvshows = content.filter((i) => i.type === "tvshow");
  const trending = content.filter((i) => i.tags.includes("trending"));
  const topRated = content.filter((i) => i.tags.includes("top-rated")).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const recentlyAdded = [...content].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 20);

  return {
    content, movies, anime, tvshows, trending, topRated, recentlyAdded,
    watchlist, favorites, history, continueWatching, episodeProgress, isLoaded,
    saveContent, addContent, removeContent, updateContent,
    toggleWatchlist, toggleFavorite, addToHistory,
    getContentById, setContinueWatching, trackEpisodeProgress, getEpisodeProgress,
  };
}
