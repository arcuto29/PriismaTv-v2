"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Moon, Sun, Star, Film, Sword, Tv, Play } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useContentStore } from "@/hooks/use-content-store";

export function TopBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { content } = useContentStore();

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return content
      .filter((i) => i.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, content]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsFocused(false);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/watch/${id}`);
    setQuery("");
    setIsFocused(false);
  };

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === "anime") return <Sword className="w-3 h-3 text-purple-400" />;
    if (type === "tvshow") return <Tv className="w-3 h-3 text-cyan-400" />;
    return <Film className="w-3 h-3 text-blue-400" />;
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-background/60 border-b border-white/[0.03]">
      <div className="h-16 flex items-center justify-between px-4 lg:px-12">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
          <motion.div
            animate={{ 
              boxShadow: isFocused ? "0 0 0 2px rgba(0,212,255,0.3), 0 8px 32px rgba(0,0,0,0.3)" : "none",
              borderColor: isFocused ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)"
            }}
            className="relative rounded-xl border bg-white/[0.03] backdrop-blur-sm transition-colors"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search movies, anime, TV shows..."
              className="w-full pl-10 pr-16 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-background/50 rounded border border-white/10">⌘K</kbd>
          </motion.div>

          {/* Dropdown results */}
          <AnimatePresence>
            {isFocused && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                {results.map((item) => (
                  <button
                    key={item.id}
                    onMouseDown={() => handleSelect(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    {item.poster ? (
                      <img src={item.poster} alt="" className="w-8 h-12 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <TypeIcon type={item.type} />
                        <span>{item.year}</span>
                        <span className="capitalize">{item.genre}</span>
                        {item.rating && (
                          <span className="flex items-center gap-0.5 text-yellow-400">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" />{item.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-4 py-2 border-t border-white/5">
                  <button
                    onMouseDown={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setQuery(""); setIsFocused(false); }}
                    className="text-xs text-primary hover:underline"
                  >
                    See all results for &quot;{query}&quot; →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1.5 ml-4">
          <button className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <Bell className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {theme === "dark" ? (
              <Sun className="w-[18px] h-[18px] text-muted-foreground group-hover:text-yellow-400 transition-colors" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-blue-400 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
