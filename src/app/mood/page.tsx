"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentCard } from "@/components/content/content-card";

const MOODS = [
  { id: "happy", emoji: "😊", label: "Happy", genres: ["comedy", "romance", "animation", "adventure"], color: "from-yellow-500 to-orange-500" },
  { id: "intense", emoji: "🔥", label: "Intense", genres: ["action", "thriller", "crime"], color: "from-red-500 to-orange-600" },
  { id: "scary", emoji: "😱", label: "Scary", genres: ["horror"], color: "from-purple-900 to-red-900" },
  { id: "mind", emoji: "🧠", label: "Mind-Bending", genres: ["sci-fi", "thriller"], color: "from-cyan-500 to-blue-600" },
  { id: "epic", emoji: "⚔️", label: "Epic", genres: ["fantasy", "action", "adventure"], color: "from-amber-500 to-red-600" },
  { id: "emotional", emoji: "😢", label: "Emotional", genres: ["drama", "romance"], color: "from-blue-500 to-indigo-600" },
  { id: "chill", emoji: "😌", label: "Chill", genres: ["comedy", "slice-of-life", "documentary"], color: "from-green-500 to-teal-500" },
  { id: "dark", emoji: "🖤", label: "Dark & Gritty", genres: ["crime", "thriller", "horror", "drama"], color: "from-gray-700 to-gray-900" },
];

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { content, favorites, watchlist, toggleFavorite, toggleWatchlist } = useContentStore();

  const mood = MOODS.find((m) => m.id === selectedMood);
  const results = useMemo(() => {
    if (!mood) return [];
    return content
      .filter((i) => mood.genres.includes(i.genre))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);
  }, [content, mood]);

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-black mb-2">What&apos;s Your Mood?</h1>
        <p className="text-muted-foreground">Pick a vibe and we&apos;ll find the perfect watch for you</p>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
        {MOODS.map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(m.id)}
            className={cn(
              "p-5 rounded-2xl text-center transition-all border",
              selectedMood === m.id
                ? `bg-gradient-to-br ${m.color} border-white/20 shadow-lg text-white`
                : "bg-card border-border hover:border-white/20"
            )}
          >
            <div className="text-3xl mb-2">{m.emoji}</div>
            <p className="text-sm font-bold">{m.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Results */}
      {mood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">
            {mood.emoji} {mood.label} Picks ({results.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {results.map((item, i) => (
              <ContentCard
                key={item.id}
                item={item}
                index={i}
                onFavorite={toggleFavorite}
                onWatchlist={toggleWatchlist}
                isFavorite={favorites.includes(item.id)}
                isInWatchlist={watchlist.includes(item.id)}
              />
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No content matches this mood yet.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
