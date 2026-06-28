"use client";
import { useMemo } from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface AchievementsProps {
  historyCount: number;
  favoritesCount: number;
  watchlistCount: number;
  contentCount: number;
}

const ACHIEVEMENTS = [
  { id: "first_watch", title: "First Blood", desc: "Watch your first title", icon: "🎬", requirement: (p: AchievementsProps) => p.historyCount >= 1 },
  { id: "five_watches", title: "Getting Started", desc: "Watch 5 titles", icon: "🔥", requirement: (p: AchievementsProps) => p.historyCount >= 5 },
  { id: "ten_watches", title: "Binge Watcher", desc: "Watch 10 titles", icon: "📺", requirement: (p: AchievementsProps) => p.historyCount >= 10 },
  { id: "twenty_watches", title: "Addicted", desc: "Watch 20 titles", icon: "🎭", requirement: (p: AchievementsProps) => p.historyCount >= 20 },
  { id: "fifty_watches", title: "No Life", desc: "Watch 50 titles", icon: "💀", requirement: (p: AchievementsProps) => p.historyCount >= 50 },
  { id: "first_fav", title: "Heartfelt", desc: "Add first favorite", icon: "❤️", requirement: (p: AchievementsProps) => p.favoritesCount >= 1 },
  { id: "ten_favs", title: "Collector", desc: "10 favorites", icon: "💎", requirement: (p: AchievementsProps) => p.favoritesCount >= 10 },
  { id: "first_watchlist", title: "Planner", desc: "Add to watchlist", icon: "📋", requirement: (p: AchievementsProps) => p.watchlistCount >= 1 },
  { id: "ten_watchlist", title: "Organized", desc: "10 in watchlist", icon: "📚", requirement: (p: AchievementsProps) => p.watchlistCount >= 10 },
  { id: "explorer", title: "Explorer", desc: "Browse 100+ titles", icon: "🌍", requirement: (p: AchievementsProps) => p.contentCount >= 100 },
  { id: "shadow_monarch", title: "Shadow Monarch", desc: "Watch 100 titles", icon: "⚔️", requirement: (p: AchievementsProps) => p.historyCount >= 100 },
  { id: "arise", title: "ARISE", desc: "Unlock all achievements", icon: "👑", requirement: () => false },
];

export function Achievements({ historyCount, favoritesCount, watchlistCount, contentCount }: AchievementsProps) {
  const props = { historyCount, favoritesCount, watchlistCount, contentCount };

  const unlocked = useMemo(() => {
    const results = ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: a.id === "arise"
        ? ACHIEVEMENTS.filter((x) => x.id !== "arise").every((x) => x.requirement(props))
        : a.requirement(props),
    }));
    return results;
  }, [props]);

  const unlockedCount = unlocked.filter((a) => a.unlocked).length;

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{unlockedCount}/{unlocked.length} unlocked</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {unlocked.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border text-center transition-all ${
              a.unlocked
                ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
                : "bg-card border-border opacity-50"
            }`}
          >
            <div className="text-3xl mb-2">{a.icon}</div>
            <p className="text-xs font-bold">{a.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</p>
            {a.unlocked && <p className="text-[9px] text-primary mt-1 font-mono">✓ UNLOCKED</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
