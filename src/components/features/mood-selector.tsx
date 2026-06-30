"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Check } from "lucide-react";
import { useMood, MoodTheme, MOOD_THEMES } from "@/hooks/use-mood";
import { cn } from "@/lib/utils";

export function MoodSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { mood, changeMood } = useMood();

  return (
    <>
      {/* Trigger button — floating bottom-left */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 left-4 lg:left-20 z-40 p-3 rounded-full bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl hover:scale-110 hover:border-primary/50 transition-all group"
        title="Change Mood / Background"
      >
        <Palette className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 bottom-4 top-auto lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[600px] z-50 rounded-2xl bg-card/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" /> Mood & Background
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Choose your vibe — changes the entire look</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mood Grid */}
              <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
                {MOOD_THEMES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { changeMood(m.id as MoodTheme); }}
                    className={cn(
                      "relative p-4 rounded-xl text-center transition-all border-2 group overflow-hidden",
                      mood === m.id
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-white/5 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    {/* Mini preview gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${m.bgGradient} opacity-50 rounded-xl`} />

                    {/* Content */}
                    <div className="relative z-10">
                      <span className="text-2xl block mb-2">{m.emoji}</span>
                      <p className="text-xs font-bold">{m.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{m.description}</p>
                    </div>

                    {/* Selected check */}
                    {mood === m.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 text-center">
                <p className="text-[10px] text-muted-foreground">Your choice is saved automatically</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
