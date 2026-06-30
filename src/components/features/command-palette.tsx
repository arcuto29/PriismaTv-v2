"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Film, Sword, Tv, Star, Clock, Bookmark, Heart, Home, Settings, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";

const QUICK_ACTIONS = [
  { id: "home", label: "Go Home", icon: Home, href: "/home", category: "Navigation" },
  { id: "movies", label: "Browse Movies", icon: Film, href: "/movies", category: "Navigation" },
  { id: "anime", label: "Browse Anime", icon: Sword, href: "/anime", category: "Navigation" },
  { id: "tv", label: "Browse TV Shows", icon: Tv, href: "/tvshows", category: "Navigation" },
  { id: "watchlist", label: "My Watchlist", icon: Bookmark, href: "/watchlist", category: "Navigation" },
  { id: "favorites", label: "My Favorites", icon: Heart, href: "/favorites", category: "Navigation" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", category: "Navigation" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { content, trending } = useContentStore();

  // Listen for Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show trending + quick actions when empty
      return {
        content: trending.slice(0, 5).map((item) => ({ ...item, category: "Trending" })),
        actions: QUICK_ACTIONS,
      };
    }
    const q = query.toLowerCase();
    const contentResults = content
      .filter((i) => i.title.toLowerCase().includes(q) || i.genre.toLowerCase().includes(q))
      .slice(0, 8)
      .map((item) => ({ ...item, category: "Content" }));
    const actionResults = QUICK_ACTIONS.filter((a) => a.label.toLowerCase().includes(q));
    return { content: contentResults, actions: actionResults };
  }, [query, content, trending]);

  const allItems = [...results.actions, ...results.content];
  const totalItems = allItems.length;

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item) {
        if ("href" in item) router.push((item as { href: string }).href);
        else router.push(`/watch/${(item as { id: string }).id}`);
        setOpen(false);
      }
    }
  }, [allItems, selectedIndex, router, totalItems]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 command-palette-backdrop"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-[95%] max-w-[640px]"
          >
            <div className="bg-[#0c0c14]/95 backdrop-blur-3xl border border-white/[0.06] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
                <Search className="w-5 h-5 text-white/30 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search content, navigate, or type a command..."
                  className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/20 focus:outline-none font-light"
                />
                <kbd className="hidden sm:flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/30 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto py-2 px-2">
                {/* Quick Actions */}
                {results.actions.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-wider">
                      {query ? "Actions" : "Quick Actions"}
                    </p>
                    {results.actions.map((action, i) => {
                      const isSelected = selectedIndex === i;
                      return (
                        <button
                          key={action.id}
                          onClick={() => { router.push(action.href); setOpen(false); }}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                            isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/10" : "bg-white/[0.03]"}`}>
                            <action.icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-white/40"}`} />
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-white/60"}`}>
                            {action.label}
                          </span>
                          {isSelected && (
                            <span className="ml-auto text-[10px] text-white/20 font-mono">↵ Enter</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Content Results */}
                {results.content.length > 0 && (
                  <div>
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-wider flex items-center gap-1.5">
                      {query ? <Zap className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {query ? "Results" : "Trending Now"}
                    </p>
                    {results.content.map((item, idx) => {
                      const i = results.actions.length + idx;
                      const isSelected = selectedIndex === i;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { router.push(`/watch/${item.id}`); setOpen(false); }}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                            isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          {item.poster ? (
                            <img src={item.poster} alt="" className="w-10 h-14 rounded-lg object-cover flex-shrink-0 border border-white/[0.04]" />
                          ) : (
                            <div className="w-10 h-14 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                              <Play className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-white/70"}`}>{item.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-white/30">{item.year}</span>
                              <span className="text-[10px] text-white/30 capitalize">{item.genre}</span>
                              {item.rating && (
                                <span className="flex items-center gap-0.5 text-[10px] text-yellow-400/70">
                                  <Star className="w-2.5 h-2.5 fill-current" />{item.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold">PLAY</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {query && results.content.length === 0 && results.actions.length === 0 && (
                  <div className="py-12 text-center">
                    <Sparkles className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-sm text-white/30">No results found</p>
                    <p className="text-xs text-white/15 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.04] flex items-center gap-4 text-[10px] text-white/20">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono">↵</kbd> Select</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono">Esc</kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
