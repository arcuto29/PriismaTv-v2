"use client";
import { useState, useEffect, useCallback } from "react";
import { ContentItem, STORAGE_KEYS } from "@/data/content";
import { SAMPLE_CONTENT } from "@/data/sample-content";

export function useContentStore() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<{ id: string; date: string }[]>([]);
  const [continueWatching, setContinueWatching] = useState<
    { id: string; progress: number; timestamp: string }[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // NUCLEAR FIX: Always force fresh content on load
    // This guarantees poster images are loaded correctly
    const currentVersion = "v5.0-fixed-posters";
    const storedVersion = localStorage.getItem("priismatv_version");
    
    if (storedVersion !== currentVersion) {
      // Force complete refresh
      console.log("[PriismaTv] Loading fresh library with all posters...");
      localStorage.removeItem(STORAGE_KEYS.CONTENT);
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(SAMPLE_CONTENT));
      localStorage.setItem("priismatv_version", currentVersion);
      setContent(SAMPLE_CONTENT);
    } else {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTENT);
      if (stored) {
        setContent(JSON.parse(stored));
      } else {
        setContent(SAMPLE_CONTENT);
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(SAMPLE_CONTENT));
      }
    }
    setWatchlist(JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST) || "[]"));
    setFavorites(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]"));
    setHistory(JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]"));
    setContinueWatching(JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING) || "[]"));
    setIsLoaded(true);
  }, []);

  const saveContent = useCallback((items: ContentItem[]) => {
    setContent(items);
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(items));
  }, []);

  // Auto-fix broken poster URLs from TMDB
  useEffect(() => {
    if (!isLoaded || content.length === 0) return;
    
    let didFix = false;
    const fixPosters = async () => {
      const TMDB_KEY = "2dca580c2a14b55200e784d157207b4d";
      const updated = [...content];
      
      for (let i = 0; i < updated.length; i++) {
        const item = updated[i];
        // Skip if already verified or no poster needed
        if ((item as unknown as Record<string, boolean>).posterOk) continue;
        
        try {
          // Test if poster loads
          if (item.poster) {
            const test = await fetch(item.poster, { method: "HEAD" });
            if (test.ok) {
              (item as unknown as Record<string, boolean>).posterOk = true;
              continue;
            }
          }
          
          // Poster is broken or missing — fetch from TMDB
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
          // Rate limit - small delay
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          // Skip failures silently
        }
      }
      
      if (didFix) {
        setContent(updated);
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
        console.log("[PriismaTv] Fixed broken poster images from TMDB");
      }
    };
    
    fixPosters();
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const addContent = useCallback((item: ContentItem) => {
    setContent((prev) => {
      const updated = [item, ...prev];
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeContent = useCallback((id: string) => {
    setContent((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateContent = useCallback((id: string, data: Partial<ContentItem>) => {
    setContent((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, ...data } : i));
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
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

  const movies = content.filter((i) => i.type === "movie");
  const anime = content.filter((i) => i.type === "anime");
  const tvshows = content.filter((i) => i.type === "tvshow");
  const trending = content.filter((i) => i.tags.includes("trending"));
  const topRated = content.filter((i) => i.tags.includes("top-rated")).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const recentlyAdded = [...content].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 20);

  return {
    content, movies, anime, tvshows, trending, topRated, recentlyAdded,
    watchlist, favorites, history, continueWatching, isLoaded,
    saveContent, addContent, removeContent, updateContent,
    toggleWatchlist, toggleFavorite, addToHistory,
    getContentById, setContinueWatching,
  };
}
