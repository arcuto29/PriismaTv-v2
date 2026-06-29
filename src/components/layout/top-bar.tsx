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
    if (type === "anime") return <Sword className="w-3 h-3 text-purple-400/80" />;
    if (type === "tvshow") return <Tv className="w-3 h-3 text-blue-400/80" />;
    return <Film className="w-3 h-3 text-primary/80" />;
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#06060a]/70 border-b border-white/[0.03]">
      <div className="h-16 flex items-center justify-between px-4 lg:px-12">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
          <motion.div
            animate={{
              boxShadow: isFocused
                ? "0 0 0 1px rgba(232, 180, 104, 0.2), 0 8px 40px rgba(0, 0, 0, 0.4)"
                : "0 0 0 1px rgba(255, 255, 255, 0.04)",
            }}
            className="relative rounded-xl bg-white/[0.03] transition-colors duration-300"
          >
            <Search className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
              isFocused ? "text-primary/70" : "text-white/25"
            )} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search titles, genres, actors..."
              className="w-full pl-11 pr-16 py-3 bg-transparent text-sm text-white/90 placeholder:text-white/20 focus:outline-none font-light"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-mono text-white/20 bg-white/[0.03] rounded-md border border-white/[0.06]">
              ⌘K
            </kbd>
          </motion.div>

          {/* Dropdown results */}
          <AnimatePresence>
            {isFocused && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0c0c14]/95 backdrop-blur-2xl border border-white/[0.06] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
              >
                <div className="p-1.5">
                  {results.map((item, i) => (
                    <button
                      key={item.id}
                      onMouseDown={() => handleSelect(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] rounded-lg transition-colors text-left group"
                    >
                      {item.poster ? (
                        <img src={item.poster} alt="" className="w-9 h-13 rounded-lg object-cover flex-shrink-0 border border-white/[0.04]" />
                      ) : (
                        <div className="w-9 h-13 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0 border border-white/[0.04]">
                          <Play className="w-3 h-3 text-white/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                          <TypeIcon type={item.type} />
                          <span>{item.year}</span>
                          <span className="capitalize">{item.genre}</span>
                          {item.rating && (
                            <span className="flex items-center gap-0.5 text-primary/70">
                              <Star className="w-2.5 h-2.5 fill-primary/70" />{item.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-white/[0.04] bg-white/[0.01]">
                  <button
                    onMouseDown={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setQuery(""); setIsFocused(false); }}
                    className="text-[11px] text-primary/70 hover:text-primary font-medium transition-colors"
                  >
                    View all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-4">
          <button className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-300 group">
            <Bell className="w-[18px] h-[18px] text-white/30 group-hover:text-white/70 transition-colors duration-300" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_6px_rgba(232,180,104,0.5)]" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-300 group"
          >
            {theme === "dark" ? (
              <Sun className="w-[18px] h-[18px] text-white/30 group-hover:text-primary/80 transition-colors duration-300" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-white/30 group-hover:text-primary/80 transition-colors duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
