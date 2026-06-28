"use client";
import { useState } from "react";
import { Trophy, CheckCircle, Circle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/data/content";

interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: "c1", title: "Movie Marathon", description: "Watch 10 movies this month", goal: 10, progress: 0 },
  { id: "c2", title: "Anime Binge", description: "Complete 5 anime series", goal: 5, progress: 0 },
  { id: "c3", title: "Genre Explorer", description: "Watch content from 8 different genres", goal: 8, progress: 0 },
  { id: "c4", title: "Classics Lover", description: "Watch 5 movies rated 9+", goal: 5, progress: 0 },
  { id: "c5", title: "Binge King", description: "Watch 20 episodes in one day", goal: 20, progress: 0 },
  { id: "c6", title: "Night Owl", description: "Watch 3 horror movies at night", goal: 3, progress: 0 },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, DEFAULT_CHALLENGES);

  const incrementProgress = (id: string) => {
    setChallenges(challenges.map((c) =>
      c.id === id ? { ...c, progress: Math.min(c.progress + 1, c.goal) } : c
    ));
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold">Watch Challenges</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {challenges.map((challenge) => {
          const isComplete = challenge.progress >= challenge.goal;
          const percentage = (challenge.progress / challenge.goal) * 100;
          return (
            <div key={challenge.id} className={`p-5 rounded-xl border transition-all ${isComplete ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{challenge.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                </div>
                {isComplete ? (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>

              <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${percentage}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{challenge.progress}/{challenge.goal}</span>
                {!isComplete && (
                  <button onClick={() => incrementProgress(challenge.id)}
                    className="text-xs text-primary hover:underline font-medium">
                    +1 Progress
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
