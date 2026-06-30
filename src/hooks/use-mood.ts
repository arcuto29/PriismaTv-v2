"use client";
import { useState, useEffect, useCallback } from "react";

export type MoodTheme = 
  | "shadow-monarch"   // Default Jin-Woo dark blue/purple (Solo Leveling)
  | "midnight-galaxy"  // Deep space stars, nebula purples + blues
  | "crimson-abyss"    // Dark red/black, ember particles, hellish vibe
  | "neon-city"        // Cyberpunk neons, pink/cyan/purple gradient city
  | "arctic-frost"     // Ice blue/white, frozen crystal particles
  | "void-black"       // Pure minimal black, subtle white stars only
  | "sakura-dream"     // Soft pink/white petals, anime aesthetic
  | "dragon-fire"      // Orange/gold flames, dark embers, power vibe

export interface MoodConfig {
  id: MoodTheme;
  name: string;
  emoji: string;
  description: string;
  preview?: string;             // GIF preview URL for the selector
  // Visual config
  accentColor: string;          // Primary accent color (hex) applied to buttons/cards/glows
  bgGradient: string;          // CSS gradient for main background
  blobColors: string[];        // 3 blob accent colors (tailwind opacity classes)
  particleColor: string;       // rgba base for canvas particles
  starColor: string;           // rgba for stars
  lineColor: string;           // rgba for particle connections
  overlayOpacity: string;      // overlay darkness
  videoSrc?: string;           // optional video background
  videoOpacity?: string;       // video opacity class
}

export const MOOD_THEMES: MoodConfig[] = [
  {
    id: "shadow-monarch",
    name: "Shadow Monarch",
    emoji: "👑",
    description: "Solo Leveling dark energy",
    preview: "https://media1.tenor.com/m/GF-omrvd_ykAAAAC/solo-leveling.gif",
    accentColor: "#00d4ff",
    bgGradient: "from-[#0a0a1a] via-[#0d0d2b] to-[#000000]",
    blobColors: ["bg-primary/10", "bg-purple-600/10", "bg-cyan-500/5"],
    particleColor: "rgba(0,212,255,",
    starColor: "rgba(0, 212, 255,",
    lineColor: "rgba(0, 212, 255,",
    overlayOpacity: "from-background/60 via-background/50 to-background/80",
    videoSrc: "/jinwoo-bg.mp4",
    videoOpacity: "opacity-25",
  },
  {
    id: "midnight-galaxy",
    name: "Midnight Galaxy",
    emoji: "🌌",
    description: "Deep space nebula",
    preview: "https://media1.tenor.com/m/9_URHWOvOCIAAAAC/space-galaxy.gif",
    accentColor: "#a78bfa",
    bgGradient: "from-[#0a0015] via-[#1a0030] to-[#000010]",
    blobColors: ["bg-violet-600/15", "bg-blue-600/10", "bg-indigo-500/8"],
    particleColor: "rgba(167,139,250,",
    starColor: "rgba(200, 200, 255,",
    lineColor: "rgba(139, 92, 246,",
    overlayOpacity: "from-background/40 via-background/30 to-background/70",
  },
  {
    id: "crimson-abyss",
    name: "Crimson Abyss",
    emoji: "🔥",
    description: "Hellfire ember glow",
    preview: "https://media1.tenor.com/m/Ze9wQPXGMioAAAAC/glowing-embers.gif",
    accentColor: "#ef4444",
    bgGradient: "from-[#1a0000] via-[#200808] to-[#0a0000]",
    blobColors: ["bg-red-600/15", "bg-orange-600/8", "bg-red-900/10"],
    particleColor: "rgba(239,68,68,",
    starColor: "rgba(255, 150, 100,",
    lineColor: "rgba(239, 68, 68,",
    overlayOpacity: "from-background/50 via-background/40 to-background/70",
  },
  {
    id: "neon-city",
    name: "Neon City",
    emoji: "🌃",
    description: "Cyberpunk nightlife",
    preview: "https://media1.tenor.com/m/JK1ahHABmYcAAAAC/rain-aesthetic.gif",
    accentColor: "#ec4899",
    bgGradient: "from-[#0a0014] via-[#14001a] to-[#000a14]",
    blobColors: ["bg-pink-500/12", "bg-cyan-400/10", "bg-purple-500/8"],
    particleColor: "rgba(236,72,153,",
    starColor: "rgba(0, 255, 255,",
    lineColor: "rgba(168, 85, 247,",
    overlayOpacity: "from-background/50 via-background/40 to-background/60",
  },
  {
    id: "arctic-frost",
    name: "Arctic Frost",
    emoji: "❄️",
    description: "Frozen crystal ice",
    preview: "https://media1.tenor.com/m/KRMpJnN8qxIAAAAC/snow-day-snow.gif",
    accentColor: "#7dd3fc",
    bgGradient: "from-[#001020] via-[#001530] to-[#000818]",
    blobColors: ["bg-sky-400/12", "bg-blue-300/8", "bg-white/5"],
    particleColor: "rgba(186,230,253,",
    starColor: "rgba(200, 230, 255,",
    lineColor: "rgba(125, 211, 252,",
    overlayOpacity: "from-background/50 via-background/40 to-background/60",
  },
  {
    id: "void-black",
    name: "Void",
    emoji: "🕳️",
    description: "Pure minimal darkness",
    preview: "https://media1.tenor.com/m/EFtxSDVeHxkAAAAC/interstellar-blackhole.gif",
    accentColor: "#e2e8f0",
    bgGradient: "from-[#000000] via-[#050505] to-[#000000]",
    blobColors: ["bg-white/3", "bg-gray-800/5", "bg-white/2"],
    particleColor: "rgba(255,255,255,",
    starColor: "rgba(255, 255, 255,",
    lineColor: "rgba(255, 255, 255,",
    overlayOpacity: "from-background/30 via-background/20 to-background/50",
  },
  {
    id: "sakura-dream",
    name: "Sakura Dream",
    emoji: "🌸",
    description: "Anime cherry blossom",
    preview: "https://media1.tenor.com/m/AJi6wB_HSvcAAAAC/sakura-cherry-blossom.gif",
    accentColor: "#f472b6",
    bgGradient: "from-[#1a0010] via-[#200015] to-[#0a0008]",
    blobColors: ["bg-pink-400/12", "bg-rose-300/8", "bg-fuchsia-500/5"],
    particleColor: "rgba(244,114,182,",
    starColor: "rgba(255, 200, 220,",
    lineColor: "rgba(236, 72, 153,",
    overlayOpacity: "from-background/50 via-background/40 to-background/70",
  },
  {
    id: "dragon-fire",
    name: "Dragon Fire",
    emoji: "🐉",
    description: "Golden flame power",
    preview: "https://media1.tenor.com/m/FoBm9cS9dyAAAAAC/natsu-dragon.gif",
    accentColor: "#f59e0b",
    bgGradient: "from-[#1a0f00] via-[#1a0800] to-[#0a0500]",
    blobColors: ["bg-amber-500/12", "bg-orange-600/10", "bg-yellow-500/5"],
    particleColor: "rgba(245,158,11,",
    starColor: "rgba(255, 200, 50,",
    lineColor: "rgba(234, 179, 8,",
    overlayOpacity: "from-background/50 via-background/40 to-background/70",
  },
];

export function useMood() {
  const [mood, setMood] = useState<MoodTheme>("shadow-monarch");

  useEffect(() => {
    const stored = localStorage.getItem("priismatv_mood") as MoodTheme | null;
    if (stored && MOOD_THEMES.find((m) => m.id === stored)) {
      setMood(stored);
      // Apply accent color on load
      const moodConfig = MOOD_THEMES.find((m) => m.id === stored);
      if (moodConfig) {
        const root = document.documentElement;
        root.style.setProperty("--primary", moodConfig.accentColor);
        root.style.setProperty("--accent", moodConfig.accentColor);
        root.style.setProperty("--ring", moodConfig.accentColor);
        root.style.setProperty("--cyan-glow", `${moodConfig.accentColor}26`);
      }
    }
  }, []);

  const changeMood = useCallback((newMood: MoodTheme) => {
    setMood(newMood);
    localStorage.setItem("priismatv_mood", newMood);
    // Apply the mood's accent color to the site's CSS variables
    const moodConfig = MOOD_THEMES.find((m) => m.id === newMood);
    if (moodConfig) {
      const root = document.documentElement;
      root.style.setProperty("--primary", moodConfig.accentColor);
      root.style.setProperty("--accent", moodConfig.accentColor);
      root.style.setProperty("--ring", moodConfig.accentColor);
      root.style.setProperty("--cyan-glow", `${moodConfig.accentColor}26`);
      // Override the theme color setting so it stays in sync
      localStorage.setItem("priismatv_color", "mood");
    }
  }, []);

  const currentMood = MOOD_THEMES.find((m) => m.id === mood) || MOOD_THEMES[0];

  return { mood, changeMood, currentMood, allMoods: MOOD_THEMES };
}
