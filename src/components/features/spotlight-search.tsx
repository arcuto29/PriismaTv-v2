"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Play, Star, Film, Sword, Tv } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentItem } from "@/data/content";

export function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { content } = useContentStore();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return content.slice(0, 8);
    const q = query.toLowerCase();
    return content
      .filter((i) => i.title.toLowerCase().includes(q) || i.genre.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, content]);

  const goTo = (item: ContentItem) => {
    router.push(`/watch/${item.id}`);
    setOpen(false);
    setQuery("");
  };

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === "anime") return <Sword className="w-3.5 h-3.5 text-purple-400" />;
    if (type === "tvshow") return <Tv className="w-3.5 h-3.5 text-cyan-400" />;
    return <Film className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xl"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-primary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <kbd className="hidden sm:block px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => goTo(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                  >
                    {item.poster ? (
                      <img src={item.poster} alt="" className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <TypeIcon type={item.type} />
                        <span>{item.year}</span>
                        <span className="capitalize">{item.genre}</span>
                        {item.rating && (
                          <span className="flex items-center gap-0.5 text-yellow-400">
                            <Star className="w-3 h-3 fill-yellow-400" />{item.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                {query && results.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No results for &quot;{query}&quot;</p>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">{content.length} titles available</p>
                <p className="text-[10px] text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 font-mono bg-muted rounded border border-border mr-1">↵</kbd> to select
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
