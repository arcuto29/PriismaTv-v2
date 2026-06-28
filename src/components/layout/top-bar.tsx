"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Bell, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function TopBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsFocused(false);
    }
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
              onBlur={() => setIsFocused(false)}
              placeholder="Search movies, anime, TV shows..."
              className="w-full pl-10 pr-16 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-background/50 rounded border border-white/10">⌘K</kbd>
          </motion.div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1.5 ml-4">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <Bell className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </button>

          {/* Theme Toggle */}
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
