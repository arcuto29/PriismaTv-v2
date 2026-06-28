"use client";
import { useState, useEffect, useCallback } from "react";

export type ThemeColor = "cyan" | "purple" | "red" | "green" | "gold" | "seasonal";

const THEME_COLORS: Record<string, Record<string, string>> = {
  cyan: { "--primary": "#00d4ff", "--accent": "#0ea5e9", "--ring": "#00d4ff", "--cyan-glow": "rgba(0, 212, 255, 0.15)" },
  purple: { "--primary": "#a855f7", "--accent": "#7c3aed", "--ring": "#a855f7", "--cyan-glow": "rgba(168, 85, 247, 0.15)" },
  red: { "--primary": "#ef4444", "--accent": "#dc2626", "--ring": "#ef4444", "--cyan-glow": "rgba(239, 68, 68, 0.15)" },
  green: { "--primary": "#22c55e", "--accent": "#16a34a", "--ring": "#22c55e", "--cyan-glow": "rgba(34, 197, 94, 0.15)" },
  gold: { "--primary": "#eab308", "--accent": "#ca8a04", "--ring": "#eab308", "--cyan-glow": "rgba(234, 179, 8, 0.15)" },
};

function getSeasonalColor(): string {
  const month = new Date().getMonth(); // 0-11
  if (month === 9) return "#f97316"; // October - Halloween orange
  if (month === 11) return "#ef4444"; // December - Christmas red
  if (month === 1) return "#ec4899"; // February - Valentine pink
  if (month >= 5 && month <= 7) return "#06b6d4"; // Summer - cyan
  return "#00d4ff"; // Default cyan
}

function getSeasonalName(): string {
  const month = new Date().getMonth();
  if (month === 9) return "🎃 Halloween";
  if (month === 11) return "🎄 Christmas";
  if (month === 1) return "💝 Valentine";
  if (month >= 5 && month <= 7) return "☀️ Summer";
  return "Default";
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeColor, setThemeColor] = useState<ThemeColor>("cyan");
  const [seasonalName, setSeasonalName] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("priismatv_theme") as "dark" | "light" | null;
    const storedColor = localStorage.getItem("priismatv_color") as ThemeColor | null;
    const initial = storedTheme || "dark";
    const initialColor = storedColor || "cyan";
    setTheme(initial);
    setThemeColor(initialColor);
    setSeasonalName(getSeasonalName());
    document.documentElement.classList.toggle("light", initial === "light");
    applyColor(initialColor);
  }, []);

  const applyColor = (color: ThemeColor) => {
    const root = document.documentElement;
    if (color === "seasonal") {
      const seasonColor = getSeasonalColor();
      root.style.setProperty("--primary", seasonColor);
      root.style.setProperty("--accent", seasonColor);
      root.style.setProperty("--ring", seasonColor);
      root.style.setProperty("--cyan-glow", `${seasonColor}26`);
    } else {
      const vars = THEME_COLORS[color];
      if (vars) {
        Object.entries(vars).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      }
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("priismatv_theme", next);
      document.documentElement.classList.toggle("light", next === "light");
      return next;
    });
  }, []);

  const changeColor = useCallback((color: ThemeColor) => {
    setThemeColor(color);
    localStorage.setItem("priismatv_color", color);
    applyColor(color);
  }, []);

  return { theme, toggleTheme, themeColor, changeColor, seasonalName };
}
